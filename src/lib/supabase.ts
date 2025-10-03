// Re-export the typed Supabase client
export { supabase, getCurrentUser, isAuthenticated } from './supabase/client';
export type { Database, Bill, Legislator, BulkSyncRun, OSINTEnrichment } from './supabase/types/database';
