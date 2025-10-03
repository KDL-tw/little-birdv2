// Supabase bulk upsert operations for Colorado bills
import { supabase } from '@/lib/supabase/client';
import type { BillInsert, BulkSyncRunInsert } from '@/lib/supabase/types/database';
import type { BatchChunk } from './transform-bulk-data';

// Types for sync operations
export interface UpsertResult {
  created: number;
  updated: number;
  failed: number;
  errors: Array<{
    openstates_id: string;
    error: string;
    chunkNumber: number;
  }>;
}

export interface SyncSummary {
  syncRunId: string;
  totalProcessed: number;
  totalCreated: number;
  totalUpdated: number;
  totalFailed: number;
  duration: number;
  errors: Array<{
    openstates_id: string;
    error: string;
    chunkNumber: number;
  }>;
  chunksProcessed: number;
  averageChunkTime: number;
}

export interface BulkSyncOptions {
  sourceUrl: string;
  fileSizeMB?: number;
  description?: string;
}

// Configuration
const UPSERT_BATCH_SIZE = 500;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

/**
 * Creates a new bulk sync run record
 */
async function createBulkSyncRun(options: BulkSyncOptions): Promise<string> {
  const syncRun: BulkSyncRunInsert = {
    source_url: options.sourceUrl,
    file_size_mb: options.fileSizeMB || null,
    status: 'running',
    bills_processed: 0,
    bills_created: 0,
    bills_updated: 0,
    error: []
  };

  const { data, error } = await supabase
    .from('bulk_sync_runs')
    .insert(syncRun)
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to create sync run: ${error.message}`);
  }

  return data.id;
}

/**
 * Updates bulk sync run with results
 */
async function updateBulkSyncRun(
  syncRunId: string,
  updates: Partial<BulkSyncRunInsert>
): Promise<void> {
  const { error } = await supabase
    .from('bulk_sync_runs')
    .update(updates)
    .eq('id', syncRunId);

  if (error) {
    console.error('Failed to update sync run:', error);
    // Don't throw - this shouldn't break the main operation
  }
}

/**
 * Upserts a single chunk of bills with retry logic
 */
async function upsertBillsChunk(
  chunk: BatchChunk,
  maxRetries: number = MAX_RETRIES
): Promise<UpsertResult> {
  let lastError: any = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📦 Processing chunk ${chunk.chunkNumber} (${chunk.size} bills) - Attempt ${attempt}`);
      
      const { data, error } = await supabase
        .from('bills')
        .upsert(chunk.bills, {
          onConflict: 'openstates_id',
          ignoreDuplicates: false
        })
        .select('openstates_id');

      if (error) {
        throw error;
      }

      // Analyze results to determine created vs updated
      const result = analyzeUpsertResults(chunk.bills, data);
      
      console.log(`✅ Chunk ${chunk.chunkNumber} complete: ${result.created} created, ${result.updated} updated`);
      
      return result;

    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Chunk ${chunk.chunkNumber} attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        const delay = RETRY_DELAY_MS * attempt; // Exponential backoff
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // If all retries failed, return error result
  console.error(`❌ Chunk ${chunk.chunkNumber} failed after ${maxRetries} attempts`);
  
  return {
    created: 0,
    updated: 0,
    failed: chunk.size,
    errors: [{
      openstates_id: `chunk_${chunk.chunkNumber}`,
      error: lastError?.message || 'Unknown error',
      chunkNumber: chunk.chunkNumber
    }]
  };
}

/**
 * Analyzes upsert results to determine created vs updated counts
 */
function analyzeUpsertResults(
  insertedBills: BillInsert[],
  returnedData: any[]
): UpsertResult {
  // Since Supabase doesn't tell us created vs updated directly,
  // we'll use a heuristic: check if the returned data matches our inserted data
  const returnedIds = new Set(returnedData?.map(item => item.openstates_id) || []);
  const insertedIds = new Set(insertedBills.map(bill => bill.openstates_id));
  
  // Bills that were returned are likely updates (they existed)
  const updatedCount = returnedData?.length || 0;
  
  // Bills that weren't returned are likely new (created)
  const createdCount = insertedBills.length - updatedCount;
  
  return {
    created: Math.max(0, createdCount),
    updated: Math.max(0, updatedCount),
    failed: 0,
    errors: []
  };
}

/**
 * Processes bills in smaller batches within chunks for better error handling
 */
async function processBillsInMicroBatches(
  chunk: BatchChunk
): Promise<UpsertResult> {
  const microBatchSize = 100; // Process in smaller batches
  const microBatches: BillInsert[][] = [];
  
  // Split chunk into micro-batches
  for (let i = 0; i < chunk.bills.length; i += microBatchSize) {
    microBatches.push(chunk.bills.slice(i, i + microBatchSize));
  }
  
  let totalCreated = 0;
  let totalUpdated = 0;
  let totalFailed = 0;
  const errors: Array<{ openstates_id: string; error: string; chunkNumber: number }> = [];
  
  for (let i = 0; i < microBatches.length; i++) {
    const microBatch = microBatches[i];
    
    try {
      console.log(`🔧 Processing micro-batch ${i + 1}/${microBatches.length} in chunk ${chunk.chunkNumber}`);
      
      const { data, error } = await supabase
        .from('bills')
        .upsert(microBatch, {
          onConflict: 'openstates_id',
          ignoreDuplicates: false
        })
        .select('openstates_id');

      if (error) {
        throw error;
      }

      const result = analyzeUpsertResults(microBatch, data);
      totalCreated += result.created;
      totalUpdated += result.updated;
      totalFailed += result.failed;
      errors.push(...result.errors);

    } catch (error) {
      console.error(`❌ Micro-batch ${i + 1} failed:`, error);
      
      // Mark all bills in this micro-batch as failed
      totalFailed += microBatch.length;
      errors.push({
        openstates_id: `microbatch_${i + 1}`,
        error: error instanceof Error ? error.message : 'Unknown error',
        chunkNumber: chunk.chunkNumber
      });
    }
  }
  
  return {
    created: totalCreated,
    updated: totalUpdated,
    failed: totalFailed,
    errors
  };
}

/**
 * Main function to bulk upsert Colorado bills
 */
export async function bulkUpsertColoradoBills(
  chunks: BatchChunk[],
  options: BulkSyncOptions
): Promise<SyncSummary> {
  const startTime = Date.now();
  console.log(`🚀 Starting bulk upsert of ${chunks.length} chunks...`);
  
  // Create sync run record
  const syncRunId = await createBulkSyncRun(options);
  console.log(`📝 Created sync run: ${syncRunId}`);
  
  let totalCreated = 0;
  let totalUpdated = 0;
  let totalFailed = 0;
  let totalProcessed = 0;
  const allErrors: Array<{ openstates_id: string; error: string; chunkNumber: number }> = [];
  const chunkTimes: number[] = [];
  
  try {
    // Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkStartTime = Date.now();
      
      console.log(`📦 Processing chunk ${chunk.chunkNumber}/${chunks.length} (${chunk.size} bills)`);
      
      // Use micro-batching for better error handling
      const result = await processBillsInMicroBatches(chunk);
      
      const chunkTime = Date.now() - chunkStartTime;
      chunkTimes.push(chunkTime);
      
      // Accumulate results
      totalCreated += result.created;
      totalUpdated += result.updated;
      totalFailed += result.failed;
      totalProcessed += chunk.size;
      allErrors.push(...result.errors);
      
      // Update sync run progress
      await updateBulkSyncRun(syncRunId, {
        bills_processed: totalProcessed,
        bills_created: totalCreated,
        bills_updated: totalUpdated,
        error: allErrors
      });
      
      console.log(`✅ Chunk ${chunk.chunkNumber} complete in ${chunkTime}ms`);
      
      // Add small delay between chunks to avoid overwhelming Supabase
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Mark sync as completed
    await updateBulkSyncRun(syncRunId, {
      status: 'completed',
      completed_at: new Date().toISOString(),
      bills_processed: totalProcessed,
      bills_created: totalCreated,
      bills_updated: totalUpdated,
      error: allErrors
    });
    
    const duration = Date.now() - startTime;
    const averageChunkTime = chunkTimes.length > 0 
      ? chunkTimes.reduce((sum, time) => sum + time, 0) / chunkTimes.length 
      : 0;
    
    const summary: SyncSummary = {
      syncRunId,
      totalProcessed,
      totalCreated,
      totalUpdated,
      totalFailed,
      duration,
      errors: allErrors,
      chunksProcessed: chunks.length,
      averageChunkTime: Math.round(averageChunkTime)
    };
    
    console.log(`🎉 Bulk upsert complete in ${duration}ms`);
    console.log(`📊 Results: ${totalCreated} created, ${totalUpdated} updated, ${totalFailed} failed`);
    
    return summary;
    
  } catch (error) {
    // Mark sync as failed
    await updateBulkSyncRun(syncRunId, {
      status: 'failed',
      completed_at: new Date().toISOString(),
      bills_processed: totalProcessed,
      bills_created: totalCreated,
      bills_updated: totalUpdated,
      error: [...allErrors, { openstates_id: 'sync_failure', error: error instanceof Error ? error.message : 'Unknown error', chunkNumber: 0 }]
    });
    
    throw error;
  }
}

/**
 * Gets recent bulk sync runs for monitoring
 */
export async function getRecentBulkSyncRuns(limit: number = 10): Promise<any[]> {
  const { data, error } = await supabase
    .from('bulk_sync_runs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch sync runs: ${error.message}`);
  }

  return data || [];
}

/**
 * Gets sync run details by ID
 */
export async function getBulkSyncRun(syncRunId: string): Promise<any> {
  const { data, error } = await supabase
    .from('bulk_sync_runs')
    .select('*')
    .eq('id', syncRunId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch sync run: ${error.message}`);
  }

  return data;
}

// Export configuration
export const UPSERT_CONFIG = {
  UPSERT_BATCH_SIZE,
  MAX_RETRIES,
  RETRY_DELAY_MS,
} as const;
