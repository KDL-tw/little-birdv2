-- Bulk Data Migration Schema for Little Bird
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist to ensure a clean slate
DROP TABLE IF EXISTS public.osint_enrichments CASCADE;
DROP TABLE IF EXISTS public.bulk_sync_runs CASCADE;
DROP TABLE IF EXISTS public.legislators CASCADE;
DROP TABLE IF EXISTS public.bills CASCADE;

-- Create the 'bills' table (Bulk Data Storage)
CREATE TABLE public.bills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  openstates_id TEXT UNIQUE NOT NULL,
  bill_number TEXT NOT NULL,
  title TEXT NOT NULL,
  session TEXT NOT NULL,
  chamber TEXT NOT NULL,
  status TEXT,
  classification TEXT[] DEFAULT '{}',
  subject TEXT[] DEFAULT '{}',
  sponsors JSONB DEFAULT '{}',
  actions JSONB DEFAULT '{}',
  votes JSONB DEFAULT '{}',
  documents JSONB DEFAULT '{}',
  versions JSONB DEFAULT '{}',
  sources JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  openstates_updated_at TIMESTAMP WITH TIME ZONE,
  data_freshness_hours INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (NOW() - COALESCE(openstates_updated_at, created_at))) / 3600
  ) STORED
);

-- Create the 'legislators' table (Bulk Data Storage - for later)
CREATE TABLE public.legislators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  openstates_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  party TEXT,
  chamber TEXT,
  district TEXT,
  email TEXT,
  phone TEXT,
  office TEXT,
  committee_assignments JSONB DEFAULT '{}',
  bills_sponsored TEXT[] DEFAULT '{}',
  bills_co_sponsored TEXT[] DEFAULT '{}',
  voting_record JSONB DEFAULT '{}',
  profile_image TEXT,
  bio TEXT,
  website TEXT,
  social_media JSONB DEFAULT '{}',
  term_start DATE,
  term_end DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  openstates_updated_at TIMESTAMP WITH TIME ZONE,
  data_freshness_hours INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (NOW() - COALESCE(openstates_updated_at, created_at))) / 3600
  ) STORED
);

-- Create the 'bulk_sync_runs' table (Bulk Import Tracking)
CREATE TABLE public.bulk_sync_runs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  source_url TEXT NOT NULL,
  file_size_mb DECIMAL(10,2),
  bills_processed INTEGER DEFAULT 0,
  bills_updated INTEGER DEFAULT 0,
  bills_created INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'partial')),
  error JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the 'osint_enrichments' table (AI/OSINT Data)
CREATE TABLE public.osint_enrichments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bill_id UUID REFERENCES public.bills(id) ON DELETE CASCADE,
  enrichment_type TEXT NOT NULL CHECK (enrichment_type IN ('ai_summary', 'impact_analysis', 'stakeholder_map', 'news_mentions')),
  data JSONB NOT NULL DEFAULT '{}',
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_bills_openstates_id ON public.bills(openstates_id);
CREATE INDEX idx_bills_bill_number ON public.bills(bill_number);
CREATE INDEX idx_bills_session ON public.bills(session);
CREATE INDEX idx_bills_chamber ON public.bills(chamber);
CREATE INDEX idx_bills_status ON public.bills(status);
CREATE INDEX idx_bills_updated_at ON public.bills(updated_at);
CREATE INDEX idx_bills_openstates_updated_at ON public.bills(openstates_updated_at);
CREATE INDEX idx_bills_data_freshness_hours ON public.bills(data_freshness_hours);

CREATE INDEX idx_legislators_openstates_id ON public.legislators(openstates_id);
CREATE INDEX idx_legislators_full_name ON public.legislators(full_name);
CREATE INDEX idx_legislators_chamber ON public.legislators(chamber);
CREATE INDEX idx_legislators_party ON public.legislators(party);
CREATE INDEX idx_legislators_district ON public.legislators(district);
CREATE INDEX idx_legislators_is_active ON public.legislators(is_active);

CREATE INDEX idx_bulk_sync_runs_started_at ON public.bulk_sync_runs(started_at);
CREATE INDEX idx_bulk_sync_runs_status ON public.bulk_sync_runs(status);
CREATE INDEX idx_bulk_sync_runs_source_url ON public.bulk_sync_runs(source_url);

CREATE INDEX idx_osint_enrichments_bill_id ON public.osint_enrichments(bill_id);
CREATE INDEX idx_osint_enrichments_type ON public.osint_enrichments(enrichment_type);
CREATE INDEX idx_osint_enrichments_confidence ON public.osint_enrichments(confidence_score);
CREATE INDEX idx_osint_enrichments_created_at ON public.osint_enrichments(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legislators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_sync_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osint_enrichments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (permissive for initial setup)
CREATE POLICY "Allow all operations on bills" ON public.bills FOR ALL USING (true);
CREATE POLICY "Allow all operations on legislators" ON public.legislators FOR ALL USING (true);
CREATE POLICY "Allow all operations on bulk_sync_runs" ON public.bulk_sync_runs FOR ALL USING (true);
CREATE POLICY "Allow all operations on osint_enrichments" ON public.osint_enrichments FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON public.bills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legislators_updated_at BEFORE UPDATE ON public.legislators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bulk_sync_runs_updated_at BEFORE UPDATE ON public.bulk_sync_runs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_osint_enrichments_updated_at BEFORE UPDATE ON public.osint_enrichments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial bulk sync run record for tracking
INSERT INTO public.bulk_sync_runs (
  source_url,
  status,
  bills_processed,
  bills_updated,
  bills_created
) VALUES (
  'https://openstates.org/data/',
  'completed',
  0,
  0,
  0
);
