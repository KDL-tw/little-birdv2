// Transform OpenStates data to Little Bird database schema
import type { BillInsert } from '@/lib/supabase/types/database';

// OpenStates API response types
export interface OpenStatesSponsor {
  name: string;
  chamber?: string;
  type?: string;
  district?: string;
  party?: string;
}

export interface OpenStatesAction {
  date: string;
  action: string;
  chamber?: string;
  description?: string;
  classification?: string[];
}

export interface OpenStatesVote {
  date: string;
  motion: string;
  result: string;
  chamber?: string;
  votes: Array<{
    legislator: string;
    vote: string;
  }>;
}

export interface OpenStatesDocument {
  name: string;
  url?: string;
  date?: string;
  type?: string;
}

export interface OpenStatesVersion {
  date: string;
  name: string;
  url?: string;
  html_url?: string;
  pdf_url?: string;
}

export interface OpenStatesSource {
  url: string;
  note?: string;
}

export interface OpenStatesBill {
  id: string;
  bill_id: string;
  title: string;
  session: string;
  chamber: string;
  state: string;
  status: string;
  subjects: string[];
  sponsorships: OpenStatesSponsor[];
  actions: OpenStatesAction[];
  votes?: OpenStatesVote[];
  documents?: OpenStatesDocument[];
  versions?: OpenStatesVersion[];
  sources?: OpenStatesSource[];
  classification?: string[];
  created_at: string;
  updated_at: string;
  abstract?: string;
  summary?: string;
  fiscal_note?: string;
}

// Transformation result types
export interface TransformResult {
  bills: BillInsert[];
  errors: Array<{
    openstates_id: string;
    error: string;
  }>;
  stats: {
    total: number;
    successful: number;
    failed: number;
    chunks: number;
  };
}

export interface BatchChunk {
  bills: BillInsert[];
  chunkNumber: number;
  size: number;
}

// Configuration
const BATCH_SIZE = 500;
const MAX_SPONSOR_NAMES = 50; // Limit sponsor names to prevent oversized arrays

/**
 * Safely extracts sponsor names from sponsorships array
 */
function extractSponsorNames(sponsorships: OpenStatesSponsor[]): string[] {
  if (!Array.isArray(sponsorships)) {
    return [];
  }

  const names = sponsorships
    .filter(sponsor => sponsor && typeof sponsor.name === 'string')
    .map(sponsor => sponsor.name.trim())
    .filter(name => name.length > 0)
    .slice(0, MAX_SPONSOR_NAMES); // Limit to prevent oversized arrays

  return [...new Set(names)]; // Remove duplicates
}

/**
 * Calculates data freshness hours from updated_at timestamp
 */
function calculateDataFreshness(updatedAt: string): number {
  try {
    const updateTime = new Date(updatedAt);
    const now = new Date();
    const diffMs = now.getTime() - updateTime.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60)); // Convert to hours
  } catch {
    console.warn(`Invalid date format: ${updatedAt}`);
    return 0;
  }
}

/**
 * Safely handles JSONB fields with null/undefined protection
 */
function createJsonbField(data: unknown): Record<string, unknown> {
  if (data === null || data === undefined) {
    return {};
  }
  
  if (typeof data === 'object') {
    return data;
  }
  
  // Try to parse if it's a string
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  
  return {};
}

/**
 * Transforms a single OpenStates bill to our database schema
 */
function transformSingleBill(openstatesBill: OpenStatesBill): BillInsert {
  try {
    // Extract sponsor names
    const sponsorNames = extractSponsorNames(openstatesBill.sponsorships || []);
    
    // Create the transformed bill
    const bill: BillInsert = {
      openstates_id: openstatesBill.id,
      bill_number: openstatesBill.bill_id || openstatesBill.id,
      title: openstatesBill.title || 'Untitled Bill',
      session: openstatesBill.session || 'unknown',
      chamber: openstatesBill.chamber || 'unknown',
      status: openstatesBill.status || 'unknown',
      classification: Array.isArray(openstatesBill.classification) 
        ? openstatesBill.classification 
        : [],
      subject: Array.isArray(openstatesBill.subjects) 
        ? openstatesBill.subjects 
        : [],
      sponsors: {
        names: sponsorNames,
        count: sponsorNames.length,
        primary: sponsorNames[0] || null,
        details: openstatesBill.sponsorships || []
      },
      actions: createJsonbField(openstatesBill.actions),
      votes: createJsonbField(openstatesBill.votes),
      documents: createJsonbField(openstatesBill.documents),
      versions: createJsonbField(openstatesBill.versions),
      sources: createJsonbField(openstatesBill.sources),
      openstates_updated_at: openstatesBill.updated_at,
      data_freshness_hours: calculateDataFreshness(openstatesBill.updated_at)
    };

    return bill;

  } catch (error) {
    throw new Error(`Transform error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validates transformed bill data
 */
function validateTransformedBill(bill: BillInsert): string[] {
  const errors: string[] = [];

  // Check required fields
  if (!bill.openstates_id) {
    errors.push('Missing openstates_id');
  }
  
  if (!bill.bill_number) {
    errors.push('Missing bill_number');
  }
  
  if (!bill.title || bill.title === 'Untitled Bill') {
    errors.push('Missing or invalid title');
  }
  
  if (!bill.session || bill.session === 'unknown') {
    errors.push('Missing or invalid session');
  }
  
  if (!bill.chamber || bill.chamber === 'unknown') {
    errors.push('Missing or invalid chamber');
  }

  // Check data types
  if (!Array.isArray(bill.classification)) {
    errors.push('Classification must be array');
  }
  
  if (!Array.isArray(bill.subject)) {
    errors.push('Subject must be array');
  }

  // Check JSONB fields
  if (typeof bill.sponsors !== 'object') {
    errors.push('Sponsors must be object');
  }

  return errors;
}

/**
 * Transforms array of OpenStates bills to our database schema
 */
export function transformOpenStatesBills(openstatesBills: OpenStatesBill[]): TransformResult {
  console.log(`🔄 Transforming ${openstatesBills.length} OpenStates bills...`);
  
  const transformedBills: BillInsert[] = [];
  const errors: Array<{ openstates_id: string; error: string }> = [];
  
  for (let i = 0; i < openstatesBills.length; i++) {
    const openstatesBill = openstatesBills[i];
    
    try {
      // Transform the bill
      const transformedBill = transformSingleBill(openstatesBill);
      
      // Validate the transformed bill
      const validationErrors = validateTransformedBill(transformedBill);
      
      if (validationErrors.length > 0) {
        errors.push({
          openstates_id: openstatesBill.id || `bill_${i}`,
          error: `Validation failed: ${validationErrors.join(', ')}`
        });
        continue;
      }
      
      transformedBills.push(transformedBill);
      
    } catch (error) {
      errors.push({
        openstates_id: openstatesBill.id || `bill_${i}`,
        error: error instanceof Error ? error.message : 'Unknown transformation error'
      });
    }
  }
  
  const stats = {
    total: openstatesBills.length,
    successful: transformedBills.length,
    failed: errors.length,
    chunks: Math.ceil(transformedBills.length / BATCH_SIZE)
  };
  
  console.log(`✅ Transformation complete: ${stats.successful} successful, ${stats.failed} failed`);
  
  return {
    bills: transformedBills,
    errors,
    stats
  };
}

/**
 * Batches transformed bills into chunks for Supabase insertion
 */
export function batchBillsForInsertion(transformedBills: BillInsert[]): BatchChunk[] {
  console.log(`📦 Batching ${transformedBills.length} bills into chunks of ${BATCH_SIZE}...`);
  
  const chunks: BatchChunk[] = [];
  
  for (let i = 0; i < transformedBills.length; i += BATCH_SIZE) {
    const chunk = transformedBills.slice(i, i + BATCH_SIZE);
    
    chunks.push({
      bills: chunk,
      chunkNumber: Math.floor(i / BATCH_SIZE) + 1,
      size: chunk.length
    });
  }
  
  console.log(`📦 Created ${chunks.length} chunks for insertion`);
  
  return chunks;
}

/**
 * Processes and transforms OpenStates bills with batching
 */
export function processOpenStatesData(openstatesBills: OpenStatesBill[]): {
  chunks: BatchChunk[];
  errors: Array<{ openstates_id: string; error: string }>;
  stats: {
    total: number;
    successful: number;
    failed: number;
    chunks: number;
  };
} {
  console.log('🚀 Starting OpenStates data processing...');
  
  // Transform the bills
  const transformResult = transformOpenStatesBills(openstatesBills);
  
  // Batch for insertion
  const chunks = batchBillsForInsertion(transformResult.bills);
  
  console.log('🎉 OpenStates data processing complete');
  
  return {
    chunks,
    errors: transformResult.errors,
    stats: transformResult.stats
  };
}

/**
 * Validates OpenStates bill structure before transformation
 */
export function validateOpenStatesBill(bill: unknown): bill is OpenStatesBill {
  if (!bill || typeof bill !== 'object') {
    return false;
  }
  
  // Check required fields
  const requiredFields = ['id', 'bill_id', 'title', 'session', 'chamber'];
  for (const field of requiredFields) {
    if (!bill[field]) {
      return false;
    }
  }
  
  // Check field types
  if (typeof bill.id !== 'string') return false;
  if (typeof bill.bill_id !== 'string') return false;
  if (typeof bill.title !== 'string') return false;
  if (typeof bill.session !== 'string') return false;
  if (typeof bill.chamber !== 'string') return false;
  
  return true;
}

/**
 * Filters valid OpenStates bills from raw data
 */
export function filterValidOpenStatesBills(rawBills: unknown[]): OpenStatesBill[] {
  console.log(`🔍 Filtering ${rawBills.length} raw bills for valid structure...`);
  
  const validBills = rawBills.filter(validateOpenStatesBill);
  
  console.log(`✅ Found ${validBills.length} valid OpenStates bills`);
  
  return validBills as OpenStatesBill[];
}

// Export configuration
export const TRANSFORM_CONFIG = {
  BATCH_SIZE,
  MAX_SPONSOR_NAMES,
} as const;
