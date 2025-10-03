// Bulk Data Management for Little Bird
import { supabase } from './supabase/client';
import type { Bill, Legislator, BulkSyncRun, OSINTEnrichment } from './supabase/types/database';

// Types for bulk data operations (using database types)
export type BillData = Omit<Bill, 'id' | 'created_at' | 'updated_at' | 'data_freshness_hours'> & {
  id?: string;
};

// Start a new bulk sync run
export async function startBulkSyncRun(sourceUrl: string, fileSizeMb?: number): Promise<string> {
  const { data, error } = await supabase
    .from('bulk_sync_runs')
    .insert({
      source_url: sourceUrl,
      file_size_mb: fileSizeMb,
      status: 'running',
      bills_processed: 0,
      bills_updated: 0,
      bills_created: 0,
      error: []
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

// Update bulk sync run status
export async function updateBulkSyncRun(
  syncRunId: string, 
  updates: Partial<BulkSyncRun>
): Promise<void> {
  const { error } = await supabase
    .from('bulk_sync_runs')
    .update(updates)
    .eq('id', syncRunId);

  if (error) throw error;
}

// Bulk insert/update bills
export async function bulkUpsertBills(
  bills: BillData[],
  syncRunId: string
): Promise<{ created: number; updated: number; errors: any[] }> {
  let created = 0;
  let updated = 0;
  const errors: any[] = [];

  for (const bill of bills) {
    try {
      // Check if bill already exists
      const { data: existing } = await supabase
        .from('bills')
        .select('id')
        .eq('openstates_id', bill.openstates_id)
        .single();

      if (existing) {
        // Update existing bill
        const { error } = await supabase
          .from('bills')
          .update({
            bill_number: bill.bill_number,
            title: bill.title,
            session: bill.session,
            chamber: bill.chamber,
            status: bill.status,
            classification: bill.classification || [],
            subject: bill.subject || [],
            sponsors: bill.sponsors || {},
            actions: bill.actions || {},
            votes: bill.votes || {},
            documents: bill.documents || {},
            versions: bill.versions || {},
            sources: bill.sources || {},
            openstates_updated_at: bill.openstates_updated_at || new Date().toISOString()
          })
          .eq('openstates_id', bill.openstates_id);

        if (error) throw error;
        updated++;
      } else {
        // Insert new bill
        const { error } = await supabase
          .from('bills')
          .insert({
            openstates_id: bill.openstates_id,
            bill_number: bill.bill_number,
            title: bill.title,
            session: bill.session,
            chamber: bill.chamber,
            status: bill.status,
            classification: bill.classification || [],
            subject: bill.subject || [],
            sponsors: bill.sponsors || {},
            actions: bill.actions || {},
            votes: bill.votes || {},
            documents: bill.documents || {},
            versions: bill.versions || {},
            sources: bill.sources || {},
            openstates_updated_at: bill.openstates_updated_at || new Date().toISOString()
          });

        if (error) throw error;
        created++;
      }
    } catch (error) {
      console.error(`Error processing bill ${bill.openstates_id}:`, error);
      errors.push({
        openstates_id: bill.openstates_id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update sync run with results
  await updateBulkSyncRun(syncRunId, {
    bills_processed: bills.length,
    bills_created: created,
    bills_updated: updated,
    error: errors
  });

  return { created, updated, errors };
}

// Get bills from database
export async function getBills(
  limit: number = 50,
  offset: number = 0,
  filters?: {
    session?: string;
    chamber?: string;
    status?: string;
    dataFreshnessHours?: number;
  }
): Promise<BillData[]> {
  let query = supabase
    .from('bills')
    .select('*')
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters?.session) {
    query = query.eq('session', filters.session);
  }
  if (filters?.chamber) {
    query = query.eq('chamber', filters.chamber);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.dataFreshnessHours) {
    query = query.lte('data_freshness_hours', filters.dataFreshnessHours);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

// Get bill count
export async function getBillCount(filters?: {
  session?: string;
  chamber?: string;
  status?: string;
}): Promise<number> {
  let query = supabase
    .from('bills')
    .select('*', { count: 'exact', head: true });

  if (filters?.session) {
    query = query.eq('session', filters.session);
  }
  if (filters?.chamber) {
    query = query.eq('chamber', filters.chamber);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { count, error } = await query;

  if (error) throw error;
  return count || 0;
}

// Get recent bulk sync runs
export async function getRecentBulkSyncRuns(limit: number = 10): Promise<BulkSyncRun[]> {
  const { data, error } = await supabase
    .from('bulk_sync_runs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// Add OSINT enrichment
export async function addOSINTEnrichment(enrichment: OSINTEnrichment): Promise<void> {
  const { error } = await supabase
    .from('osint_enrichments')
    .insert(enrichment);

  if (error) throw error;
}

// Get OSINT enrichments for a bill
export async function getOSINTEnrichments(billId: string): Promise<OSINTEnrichment[]> {
  const { data, error } = await supabase
    .from('osint_enrichments')
    .select('*')
    .eq('bill_id', billId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get data freshness statistics
export async function getDataFreshnessStats(): Promise<{
  total_bills: number;
  fresh_data: number;
  stale_data: number;
  average_freshness_hours: number;
}> {
  const { data, error } = await supabase
    .from('bills')
    .select('data_freshness_hours');

  if (error) throw error;

  const bills = data || [];
  const total = bills.length;
  const fresh = bills.filter(b => b.data_freshness_hours <= 24).length;
  const stale = bills.filter(b => b.data_freshness_hours > 24).length;
  const average = bills.reduce((sum, b) => sum + b.data_freshness_hours, 0) / total || 0;

  return {
    total_bills: total,
    fresh_data: fresh,
    stale_data: stale,
    average_freshness_hours: Math.round(average * 100) / 100
  };
}
