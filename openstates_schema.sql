-- OpenStates Data Syncing Schema for Little Bird
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Raw OpenStates bills table - stores raw JSON from API
CREATE TABLE raw_openstates_bills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  openstates_id TEXT NOT NULL,
  raw_json JSONB NOT NULL,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sync_run_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bills table - clean normalized data from OpenStates
CREATE TABLE bills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  openstates_id TEXT UNIQUE NOT NULL,
  bill_number TEXT,
  title TEXT,
  session TEXT,
  chamber TEXT,
  status TEXT,
  subject TEXT[] DEFAULT '{}',
  sponsor_names TEXT[] DEFAULT '{}',
  data_quality_score INTEGER DEFAULT 0,
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sync runs table - tracks each sync operation
CREATE TABLE sync_runs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'running',
  entity_type TEXT NOT NULL,
  bills_fetched INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legislative sessions table - tracks Colorado sessions
CREATE TABLE legislative_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  year INTEGER NOT NULL,
  session_type TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(year, session_type)
);

-- Create indexes for better performance
CREATE INDEX idx_raw_openstates_bills_openstates_id ON raw_openstates_bills(openstates_id);
CREATE INDEX idx_raw_openstates_bills_fetched_at ON raw_openstates_bills(fetched_at);
CREATE INDEX idx_raw_openstates_bills_sync_run_id ON raw_openstates_bills(sync_run_id);

CREATE INDEX idx_bills_openstates_id ON bills(openstates_id);
CREATE INDEX idx_bills_bill_number ON bills(bill_number);
CREATE INDEX idx_bills_session ON bills(session);
CREATE INDEX idx_bills_chamber ON bills(chamber);
CREATE INDEX idx_bills_status ON bills(status);
CREATE INDEX idx_bills_last_synced ON bills(last_synced);

CREATE INDEX idx_sync_runs_started_at ON sync_runs(started_at);
CREATE INDEX idx_sync_runs_status ON sync_runs(status);
CREATE INDEX idx_sync_runs_entity_type ON sync_runs(entity_type);

CREATE INDEX idx_legislative_sessions_year ON legislative_sessions(year);
CREATE INDEX idx_legislative_sessions_is_active ON legislative_sessions(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE raw_openstates_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE legislative_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now - we'll tighten these later)
CREATE POLICY "Allow all operations on raw_openstates_bills" ON raw_openstates_bills FOR ALL USING (true);
CREATE POLICY "Allow all operations on bills" ON bills FOR ALL USING (true);
CREATE POLICY "Allow all operations on sync_runs" ON sync_runs FOR ALL USING (true);
CREATE POLICY "Allow all operations on legislative_sessions" ON legislative_sessions FOR ALL USING (true);

-- Insert initial Colorado legislative session data
INSERT INTO legislative_sessions (year, session_type, start_date, end_date, is_active) VALUES
(2025, 'regular', '2025-01-08', '2025-05-08', true),
(2024, 'regular', '2024-01-10', '2024-05-08', false),
(2023, 'regular', '2023-01-09', '2023-05-08', false);
