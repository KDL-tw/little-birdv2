// API route for bulk Colorado bills synchronization
import { NextRequest, NextResponse } from 'next/server';
import { CRON_CONFIG, BULK_DATA_URL } from '@/lib/config';
import { syncColoradoBills, testColoradoBillsStructure } from '@/lib/sync/bulk-colorado-sync';
import { processOpenStatesData, filterValidOpenStatesBills } from '@/lib/sync/transform-bulk-data';
import { bulkUpsertColoradoBills } from '@/lib/sync/supabase-bulk-upsert';

// Types for API responses
interface SyncApiResponse {
  success: boolean;
  message: string;
  data?: {
    bills_processed: number;
    bills_created: number;
    bills_updated: number;
    duration_seconds: number;
    file_size_mb: number;
    sync_run_id: string;
    errors?: Array<{
      openstates_id: string;
      error: string;
    }>;
  };
  error?: string;
}

interface TestApiResponse {
  success: boolean;
  message: string;
  data?: {
    structure_valid: boolean;
    sample_size_bytes: number;
    estimated_bill_count?: number;
    file_size_mb: number;
    sample_preview?: unknown;
  };
  error?: string;
}

// Configuration
const MAX_DURATION_MS = 10 * 60 * 1000; // 10 minutes for Vercel
const AUTHORIZATION_HEADER = 'Authorization';

/**
 * Validates the authorization header
 */
function validateAuthorization(request: NextRequest): boolean {
  const authHeader = request.headers.get(AUTHORIZATION_HEADER);
  
  if (!authHeader) {
    return false;
  }
  
  // Check for Bearer token format
  if (!authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  return token === CRON_CONFIG.secret;
}

/**
 * Main sync function that orchestrates the entire process
 */
async function performBulkSync(): Promise<SyncApiResponse> {
  const startTime = Date.now();
  console.log('🚀 Starting bulk Colorado bills sync via API...');
  
  try {
    // Step 1: Fetch bulk data from OpenStates
    console.log('📥 Step 1: Fetching bulk data...');
    const syncResult = await syncColoradoBills();
    
    if (syncResult.bills.length === 0) {
      throw new Error('No bills found in OpenStates data');
    }
    
    console.log(`✅ Fetched ${syncResult.bills.length} bills (${syncResult.metadata.fileSizeMB.toFixed(2)}MB)`);
    
    // Step 2: Filter and validate OpenStates bills
    console.log('🔍 Step 2: Validating OpenStates data...');
    const validBills = filterValidOpenStatesBills(syncResult.bills);
    
    if (validBills.length === 0) {
      throw new Error('No valid bills found after validation');
    }
    
    console.log(`✅ Validated ${validBills.length} bills`);
    
    // Step 3: Transform data to our schema
    console.log('🔄 Step 3: Transforming data...');
    const { chunks } = processOpenStatesData(validBills);
    
    if (chunks.length === 0) {
      throw new Error('No valid chunks created after transformation');
    }
    
    console.log(`✅ Created ${chunks.length} chunks for insertion`);
    
    // Step 4: Upsert to Supabase
    console.log('💾 Step 4: Upserting to Supabase...');
    const upsertSummary = await bulkUpsertColoradoBills(chunks, {
      sourceUrl: BULK_DATA_URL,
      fileSizeMB: syncResult.metadata.fileSizeMB,
      description: 'API bulk sync'
    });
    
    const duration = Date.now() - startTime;
    
    console.log(`🎉 Bulk sync complete in ${duration}ms`);
    
    return {
      success: true,
      message: 'Bulk sync completed successfully',
      data: {
        bills_processed: upsertSummary.totalProcessed,
        bills_created: upsertSummary.totalCreated,
        bills_updated: upsertSummary.totalUpdated,
        duration_seconds: Math.round(duration / 1000),
        file_size_mb: syncResult.metadata.fileSizeMB,
        sync_run_id: upsertSummary.syncRunId,
        errors: upsertSummary.errors.map(err => ({
          openstates_id: err.openstates_id,
          error: err.error
        }))
      }
    };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('❌ Bulk sync failed:', error);
    
    return {
      success: false,
      message: 'Bulk sync failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      data: {
        bills_processed: 0,
        bills_created: 0,
        bills_updated: 0,
        duration_seconds: Math.round(duration / 1000),
        file_size_mb: 0,
        sync_run_id: '',
        errors: []
      }
    };
  }
}

/**
 * Test function to validate OpenStates structure
 */
async function performStructureTest(): Promise<TestApiResponse> {
  const startTime = Date.now();
  console.log('🧪 Starting OpenStates structure test...');
  
  try {
    const testResult = await testColoradoBillsStructure();
    
    // Try to estimate bill count from structure
    let estimatedBillCount: number | undefined;
    if (Array.isArray(testResult.structure)) {
      estimatedBillCount = testResult.structure.length;
    } else if (testResult.structure && typeof testResult.structure === 'object') {
      // Look for common array properties
      const possibleArrays = ['bills', 'results', 'data'];
      for (const prop of possibleArrays) {
        if (Array.isArray(testResult.structure[prop])) {
          estimatedBillCount = testResult.structure[prop].length;
          break;
        }
      }
    }
    
    console.log(`✅ Structure test complete`);
    
    return {
      success: true,
      message: 'Structure test completed successfully',
      data: {
        structure_valid: !!testResult.structure,
        sample_size_bytes: testResult.sample.length,
        estimated_bill_count: estimatedBillCount,
        file_size_mb: testResult.metadata.fileSize / (1024 * 1024),
        sample_preview: testResult.structure
      }
    };
    
  } catch (error) {
    console.error('❌ Structure test failed:', error);
    
    return {
      success: false,
      message: 'Structure test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      data: {
        structure_valid: false,
        sample_size_bytes: 0,
        file_size_mb: 0
      }
    };
  }
}

/**
 * GET handler for testing structure
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  // Check authorization for GET requests too
  if (!validateAuthorization(request)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized', error: 'Invalid or missing authorization header' },
      { status: 401 }
    );
  }
  
  console.log('🧪 GET request: Testing OpenStates structure...');
  
  try {
    const result = await performStructureTest();
    
    const status = result.success ? 200 : 500;
    return NextResponse.json(result, { status });
    
  } catch (error) {
    console.error('❌ GET request failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Structure test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler for full bulk sync
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Check authorization
  if (!validateAuthorization(request)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized', error: 'Invalid or missing authorization header' },
      { status: 401 }
    );
  }
  
  console.log('🚀 POST request: Starting bulk Colorado sync...');
  
  try {
    // Set up timeout for Vercel
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout - operation took longer than 10 minutes'));
      }, MAX_DURATION_MS);
    });
    
    // Race between sync operation and timeout
    const result = await Promise.race([
      performBulkSync(),
      timeoutPromise
    ]);
    
    const status = result.success ? 200 : 500;
    return NextResponse.json(result, { status });
    
  } catch (error) {
    console.error('❌ POST request failed:', error);
    
    const isTimeout = error instanceof Error && error.message.includes('timeout');
    const status = isTimeout ? 408 : 500;
    
    return NextResponse.json(
      {
        success: false,
        message: isTimeout ? 'Request timeout' : 'Bulk sync failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: {
          bills_processed: 0,
          bills_created: 0,
          bills_updated: 0,
          duration_seconds: 0,
          file_size_mb: 0,
          sync_run_id: '',
          errors: []
        }
      },
      { status }
    );
  }
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
