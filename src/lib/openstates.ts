// OpenStates API integration for Little Bird
import { supabase } from './supabase';

// OpenStates API configuration
const OPENSTATES_BASE_URL = 'https://openstates.org/api/v1';
const COLORADO_JURISDICTION = 'co';
const OPENSTATES_API_KEY = '7fffc14f-6f2d-4168-ac04-628867cec6b1';

// Types for OpenStates API responses
export interface OpenStatesBill {
  id: string;
  bill_id: string;
  title: string;
  session: string;
  chamber: string;
  state: string;
  status: string;
  subjects: string[];
  sponsors: Array<{
    name: string;
    chamber: string;
    type: string;
  }>;
  actions: Array<{
    date: string;
    action: string;
    chamber: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface SyncRun {
  id: string;
  started_at: string;
  completed_at?: string;
  status: 'running' | 'completed' | 'failed';
  entity_type: string;
  bills_fetched: number;
  errors: any[];
}

// Start a new sync run
export async function startSyncRun(entityType: string): Promise<string> {
  const { data, error } = await supabase
    .from('sync_runs')
    .insert({
      status: 'running',
      entity_type: entityType,
      bills_fetched: 0,
      errors: []
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

// Update sync run status
export async function updateSyncRun(
  syncRunId: string, 
  updates: Partial<SyncRun>
): Promise<void> {
  const { error } = await supabase
    .from('sync_runs')
    .update(updates)
    .eq('id', syncRunId);

  if (error) throw error;
}

// Fetch bills from OpenStates API
export async function fetchOpenStatesBills(
  session: string = '2025',
  page: number = 1,
  perPage: number = 50
): Promise<{ bills: OpenStatesBill[]; hasMore: boolean }> {
  const url = `${OPENSTATES_BASE_URL}/bills/?state=${COLORADO_JURISDICTION}&session=${session}&page=${page}&per_page=${perPage}`;
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'X-API-Key': OPENSTATES_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`OpenStates API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return {
    bills: data,
    hasMore: data.length === perPage
  };
}

// Store raw bill data
export async function storeRawBillData(
  bill: OpenStatesBill,
  syncRunId: string
): Promise<void> {
  const { error } = await supabase
    .from('raw_openstates_bills')
    .insert({
      openstates_id: bill.id,
      raw_json: bill,
      sync_run_id: syncRunId
    });

  if (error) throw error;
}

// Process and store normalized bill data
export async function storeNormalizedBill(bill: OpenStatesBill): Promise<void> {
  // Calculate data quality score (simple example)
  const qualityScore = calculateDataQuality(bill);

  const normalizedBill = {
    openstates_id: bill.id,
    bill_number: bill.bill_id,
    title: bill.title,
    session: bill.session,
    chamber: bill.chamber,
    status: bill.status,
    subject: bill.subjects || [],
    sponsor_names: bill.sponsors?.map(s => s.name) || [],
    data_quality_score: qualityScore,
    last_synced: new Date().toISOString()
  };

  const { error } = await supabase
    .from('bills')
    .upsert(normalizedBill, { onConflict: 'openstates_id' });

  if (error) throw error;
}

// Calculate data quality score (0-100)
function calculateDataQuality(bill: OpenStatesBill): number {
  let score = 0;
  
  // Basic completeness checks
  if (bill.title && bill.title.length > 10) score += 20;
  if (bill.subjects && bill.subjects.length > 0) score += 20;
  if (bill.sponsors && bill.sponsors.length > 0) score += 20;
  if (bill.actions && bill.actions.length > 0) score += 20;
  if (bill.status && bill.status !== '') score += 20;
  
  return Math.min(score, 100);
}

// Main sync function
export async function syncBillsFromOpenStates(): Promise<{
  success: boolean;
  billsProcessed: number;
  errors: any[];
}> {
  const syncRunId = await startSyncRun('bills');
  let billsProcessed = 0;
  const errors: any[] = [];
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      console.log(`Fetching page ${page} from OpenStates...`);
      
      const { bills, hasMore: morePages } = await fetchOpenStatesBills('2025', page, 50);
      hasMore = morePages;

      for (const bill of bills) {
        try {
          // Store raw data
          await storeRawBillData(bill, syncRunId);
          
          // Store normalized data
          await storeNormalizedBill(bill);
          
          billsProcessed++;
        } catch (error) {
          console.error(`Error processing bill ${bill.id}:`, error);
          errors.push({
            bill_id: bill.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      page++;
      
      // Add a small delay to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Mark sync as completed
    await updateSyncRun(syncRunId, {
      status: 'completed',
      completed_at: new Date().toISOString(),
      bills_fetched: billsProcessed,
      errors
    });

    return { success: true, billsProcessed, errors };

  } catch (error) {
    console.error('Sync failed:', error);
    
    // Mark sync as failed
    await updateSyncRun(syncRunId, {
      status: 'failed',
      completed_at: new Date().toISOString(),
      bills_fetched: billsProcessed,
      errors: [...errors, { error: error instanceof Error ? error.message : 'Unknown error' }]
    });

    return { success: false, billsProcessed, errors };
  }
}

// Get recent sync runs
export async function getRecentSyncRuns(limit: number = 10): Promise<SyncRun[]> {
  const { data, error } = await supabase
    .from('sync_runs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// Get bills from our database
export async function getBills(
  limit: number = 50,
  offset: number = 0
): Promise<any[]> {
  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .order('last_synced', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data || [];
}

// Get bill count
export async function getBillCount(): Promise<number> {
  const { count, error } = await supabase
    .from('bills')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
}
