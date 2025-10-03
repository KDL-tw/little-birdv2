// Database types for Little Bird Supabase schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bills: {
        Row: {
          id: string
          openstates_id: string
          bill_number: string
          title: string
          session: string
          chamber: string
          status: string | null
          classification: string[]
          subject: string[]
          sponsors: Json
          actions: Json
          votes: Json
          documents: Json
          versions: Json
          sources: Json
          created_at: string
          updated_at: string
          openstates_updated_at: string | null
          data_freshness_hours: number
        }
        Insert: {
          id?: string
          openstates_id: string
          bill_number: string
          title: string
          session: string
          chamber: string
          status?: string | null
          classification?: string[]
          subject?: string[]
          sponsors?: Json
          actions?: Json
          votes?: Json
          documents?: Json
          versions?: Json
          sources?: Json
          created_at?: string
          updated_at?: string
          openstates_updated_at?: string | null
          data_freshness_hours?: never // Generated column
        }
        Update: {
          id?: string
          openstates_id?: string
          bill_number?: string
          title?: string
          session?: string
          chamber?: string
          status?: string | null
          classification?: string[]
          subject?: string[]
          sponsors?: Json
          actions?: Json
          votes?: Json
          documents?: Json
          versions?: Json
          sources?: Json
          created_at?: string
          updated_at?: string
          openstates_updated_at?: string | null
          data_freshness_hours?: never // Generated column
        }
        Relationships: []
      }
      legislators: {
        Row: {
          id: string
          openstates_id: string
          first_name: string
          last_name: string
          full_name: string
          party: string | null
          chamber: string | null
          district: string | null
          email: string | null
          phone: string | null
          office: string | null
          committee_assignments: Json
          bills_sponsored: string[]
          bills_co_sponsored: string[]
          voting_record: Json
          profile_image: string | null
          bio: string | null
          website: string | null
          social_media: Json
          term_start: string | null
          term_end: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          openstates_updated_at: string | null
          data_freshness_hours: number
        }
        Insert: {
          id?: string
          openstates_id: string
          first_name: string
          last_name: string
          full_name: string
          party?: string | null
          chamber?: string | null
          district?: string | null
          email?: string | null
          phone?: string | null
          office?: string | null
          committee_assignments?: Json
          bills_sponsored?: string[]
          bills_co_sponsored?: string[]
          voting_record?: Json
          profile_image?: string | null
          bio?: string | null
          website?: string | null
          social_media?: Json
          term_start?: string | null
          term_end?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          openstates_updated_at?: string | null
          data_freshness_hours?: never // Generated column
        }
        Update: {
          id?: string
          openstates_id?: string
          first_name?: string
          last_name?: string
          full_name?: string
          party?: string | null
          chamber?: string | null
          district?: string | null
          email?: string | null
          phone?: string | null
          office?: string | null
          committee_assignments?: Json
          bills_sponsored?: string[]
          bills_co_sponsored?: string[]
          voting_record?: Json
          profile_image?: string | null
          bio?: string | null
          website?: string | null
          social_media?: Json
          term_start?: string | null
          term_end?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          openstates_updated_at?: string | null
          data_freshness_hours?: never // Generated column
        }
        Relationships: []
      }
      bulk_sync_runs: {
        Row: {
          id: string
          started_at: string
          completed_at: string | null
          source_url: string
          file_size_mb: number | null
          bills_processed: number
          bills_updated: number
          bills_created: number
          status: 'running' | 'completed' | 'failed' | 'partial'
          error: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          started_at?: string
          completed_at?: string | null
          source_url: string
          file_size_mb?: number | null
          bills_processed?: number
          bills_updated?: number
          bills_created?: number
          status?: 'running' | 'completed' | 'failed' | 'partial'
          error?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          started_at?: string
          completed_at?: string | null
          source_url?: string
          file_size_mb?: number | null
          bills_processed?: number
          bills_updated?: number
          bills_created?: number
          status?: 'running' | 'completed' | 'failed' | 'partial'
          error?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      osint_enrichments: {
        Row: {
          id: string
          bill_id: string
          enrichment_type: 'ai_summary' | 'impact_analysis' | 'stakeholder_map' | 'news_mentions'
          data: Json
          confidence_score: number | null
          source: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          bill_id: string
          enrichment_type: 'ai_summary' | 'impact_analysis' | 'stakeholder_map' | 'news_mentions'
          data?: Json
          confidence_score?: number | null
          source?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bill_id?: string
          enrichment_type?: 'ai_summary' | 'impact_analysis' | 'stakeholder_map' | 'news_mentions'
          data?: Json
          confidence_score?: number | null
          source?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "osint_enrichments_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Specific table types
export type Bill = Database['public']['Tables']['bills']['Row']
export type BillInsert = Database['public']['Tables']['bills']['Insert']
export type BillUpdate = Database['public']['Tables']['bills']['Update']

export type Legislator = Database['public']['Tables']['legislators']['Row']
export type LegislatorInsert = Database['public']['Tables']['legislators']['Insert']
export type LegislatorUpdate = Database['public']['Tables']['legislators']['Update']

export type BulkSyncRun = Database['public']['Tables']['bulk_sync_runs']['Row']
export type BulkSyncRunInsert = Database['public']['Tables']['bulk_sync_runs']['Insert']
export type BulkSyncRunUpdate = Database['public']['Tables']['bulk_sync_runs']['Update']

export type OSINTEnrichment = Database['public']['Tables']['osint_enrichments']['Row']
export type OSINTEnrichmentInsert = Database['public']['Tables']['osint_enrichments']['Insert']
export type OSINTEnrichmentUpdate = Database['public']['Tables']['osint_enrichments']['Update']
