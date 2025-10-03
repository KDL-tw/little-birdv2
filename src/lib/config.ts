// Configuration constants for Little Bird

export const BULK_DATA_URL = process.env.BULK_DATA_URL || 'https://data.openstates.org/states/co/bills.json';

export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
} as const;

export const CRON_CONFIG = {
  secret: process.env.CRON_SECRET || '',
} as const;

// Validate required environment variables at runtime (not build time)
export function validateEnvironmentVariables(): void {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
  }

  if (!process.env.CRON_SECRET) {
    throw new Error('CRON_SECRET is required');
  }
}
