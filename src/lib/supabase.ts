import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://jvtqsirhabmocbeqqahu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2dHFzaXJoYWJtb2NiZXFxYWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxOTQ5NTMsImV4cCI6MjA3NDc3MDk1M30.cwZgb7XBJh47YQLNGMG_F2h-Nwaph0Rgn22-9yTdxSI'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (we'll define these as we create tables)
export type Database = {
  public: {
    Tables: {
      // We'll add table types here as we create them
    }
  }
}
