// Bulk Colorado Bills Sync - Downloads and parses OpenStates JSON data
import { BULK_DATA_URL } from '@/lib/config';

// Types for the sync operation
export interface ColoradoBillsMetadata {
  fileSize: number;
  fileSizeMB: number;
  billCount: number;
  lastModified?: string;
  downloadTime: number;
  parseTime: number;
  totalTime: number;
}

export interface ColoradoBill {
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
  classification?: string[];
  votes?: unknown[];
  documents?: unknown[];
  versions?: unknown[];
  sources?: unknown[];
}

export interface ColoradoSyncResult {
  bills: ColoradoBill[];
  metadata: ColoradoBillsMetadata;
  errors: string[];
}

// Configuration
const MAX_FILE_SIZE_MB = 100; // 100MB limit
const STREAM_THRESHOLD_MB = 50; // Stream if over 50MB
const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const TEST_CHUNK_SIZE = 100 * 1024; // 100KB for testing

/**
 * Downloads Colorado bills JSON with streaming support for large files
 */
async function downloadColoradoBills(): Promise<{
  data: string;
  metadata: Pick<ColoradoBillsMetadata, 'fileSize' | 'fileSizeMB' | 'lastModified'>;
}> {
  console.log('🔄 Starting Colorado bills download...');
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(BULK_DATA_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LittleBird/1.0 (Political Intelligence Platform)',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentLength = response.headers.get('content-length');
    const lastModified = response.headers.get('last-modified');
    const fileSize = contentLength ? parseInt(contentLength, 10) : 0;
    const fileSizeMB = fileSize / (1024 * 1024);

    console.log(`📊 File size: ${fileSizeMB.toFixed(2)}MB`);

    // Check file size limit
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      throw new Error(`File too large: ${fileSizeMB.toFixed(2)}MB (max: ${MAX_FILE_SIZE_MB}MB)`);
    }

    let data: string;

    // Use streaming for large files
    if (fileSizeMB > STREAM_THRESHOLD_MB) {
      console.log('🌊 Using streaming for large file...');
      data = await streamResponse(response);
    } else {
      console.log('📥 Using direct download...');
      data = await response.text();
    }

    return {
      data,
      metadata: {
        fileSize,
        fileSizeMB,
        lastModified: lastModified || undefined,
      },
    };

  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Download timeout - file too large or connection slow');
    }
    throw error;
  }
}

/**
 * Stream response for large files to avoid memory issues
 */
async function streamResponse(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable');
  }

  const decoder = new TextDecoder();
  let result = '';
  let receivedBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      receivedBytes += value.length;
      result += decoder.decode(value, { stream: true });
      
      // Log progress every 10MB
      if (receivedBytes % (10 * 1024 * 1024) === 0) {
        const mbReceived = receivedBytes / (1024 * 1024);
        console.log(`📈 Downloaded: ${mbReceived.toFixed(1)}MB`);
      }
    }

    // Decode any remaining bytes
    result += decoder.decode();
    
    console.log(`✅ Download complete: ${(receivedBytes / (1024 * 1024)).toFixed(2)}MB`);
    return result;

  } finally {
    reader.releaseLock();
  }
}

/**
 * Safely parse JSON with comprehensive error handling
 */
function parseColoradoBills(jsonData: string): ColoradoBill[] {
  console.log('🔍 Parsing JSON data...');
  
  try {
    const data = JSON.parse(jsonData);
    
    // Handle different possible structures
    if (Array.isArray(data)) {
      console.log(`📋 Found ${data.length} bills in array format`);
      return data as ColoradoBill[];
    }
    
    if (data && typeof data === 'object') {
      // Check for common wrapper structures
      if (data.bills && Array.isArray(data.bills)) {
        console.log(`📋 Found ${data.bills.length} bills in wrapper format`);
        return data.bills as ColoradoBill[];
      }
      
      if (data.results && Array.isArray(data.results)) {
        console.log(`📋 Found ${data.results.length} bills in results format`);
        return data.results as ColoradoBill[];
      }
      
      if (data.data && Array.isArray(data.data)) {
        console.log(`📋 Found ${data.data.length} bills in data format`);
        return data.data as ColoradoBill[];
      }
      
      // Single object case
      if (data.id || data.bill_id) {
        console.log('📋 Found single bill object');
        return [data as ColoradoBill];
      }
    }
    
    throw new Error('Unexpected JSON structure - no bills array found');
    
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Validates bill structure and filters out invalid entries
 */
function validateBills(bills: ColoradoBill[]): { validBills: ColoradoBill[]; errors: string[] } {
  console.log('✅ Validating bill data...');
  
  const validBills: ColoradoBill[] = [];
  const errors: string[] = [];
  
  for (let i = 0; i < bills.length; i++) {
    const bill = bills[i];
    
    try {
      // Check required fields
      if (!bill.id && !bill.bill_id) {
        errors.push(`Bill ${i}: Missing ID field`);
        continue;
      }
      
      if (!bill.title) {
        errors.push(`Bill ${i}: Missing title`);
        continue;
      }
      
      if (!bill.session) {
        errors.push(`Bill ${i}: Missing session`);
        continue;
      }
      
      if (!bill.chamber) {
        errors.push(`Bill ${i}: Missing chamber`);
        continue;
      }
      
      // Ensure arrays are properly initialized
      if (!Array.isArray(bill.subjects)) bill.subjects = [];
      if (!Array.isArray(bill.sponsors)) bill.sponsors = [];
      if (!Array.isArray(bill.actions)) bill.actions = [];
      if (!Array.isArray(bill.classification)) bill.classification = [];
      if (!bill.votes) bill.votes = [];
      if (!bill.documents) bill.documents = [];
      if (!bill.versions) bill.versions = [];
      if (!bill.sources) bill.sources = [];
      
      validBills.push(bill);
      
    } catch (error) {
      errors.push(`Bill ${i}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  console.log(`✅ Validated ${validBills.length} bills, ${errors.length} errors`);
  return { validBills, errors };
}

/**
 * Main function to sync Colorado bills
 */
export async function syncColoradoBills(): Promise<ColoradoSyncResult> {
  const startTime = Date.now();
  console.log('🚀 Starting Colorado bills sync...');
  
  try {
    // Download data
    const downloadStart = Date.now();
    const { data, metadata } = await downloadColoradoBills();
    const downloadTime = Date.now() - downloadStart;
    
    // Parse data
    const parseStart = Date.now();
    const rawBills = parseColoradoBills(data);
    const parseTime = Date.now() - parseStart;
    
    // Validate bills
    const { validBills, errors } = validateBills(rawBills);
    
    const totalTime = Date.now() - startTime;
    
    const result: ColoradoSyncResult = {
      bills: validBills,
      metadata: {
        ...metadata,
        billCount: validBills.length,
        downloadTime,
        parseTime,
        totalTime,
      },
      errors,
    };
    
    console.log(`🎉 Sync complete in ${totalTime}ms`);
    console.log(`📊 Stats: ${validBills.length} bills, ${errors.length} errors`);
    
    return result;
    
  } catch (error) {
    console.error('❌ Colorado bills sync failed:', error);
    throw error;
  }
}

/**
 * Test function to fetch first 100KB and check structure
 */
export async function testColoradoBillsStructure(): Promise<{
  sample: string;
  structure: unknown;
  metadata: Pick<ColoradoBillsMetadata, 'fileSize' | 'lastModified'>;
}> {
  console.log('🧪 Testing Colorado bills structure...');
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for test
  
  try {
    const response = await fetch(BULK_DATA_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LittleBird/1.0 (Political Intelligence Platform)',
        'Range': `bytes=0-${TEST_CHUNK_SIZE - 1}`, // Request first 100KB
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const lastModified = response.headers.get('last-modified');
    const contentRange = response.headers.get('content-range');
    const fileSize = contentRange ? parseInt(contentRange.split('/')[1], 10) : 0;

    const sample = await response.text();
    
    // Try to parse what we can of the sample
    let structure: unknown = null;
    try {
      structure = JSON.parse(sample);
    } catch {
      // If we can't parse the full sample, try to find array boundaries
      const firstBracket = sample.indexOf('[');
      const lastBracket = sample.lastIndexOf(']');
      
      if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
        try {
          const partial = sample.substring(firstBracket, lastBracket + 1);
          structure = JSON.parse(partial);
        } catch {
          // Still can't parse, that's okay for testing
        }
      }
    }

    console.log(`✅ Test complete - File size: ${(fileSize / (1024 * 1024)).toFixed(2)}MB`);
    
    return {
      sample,
      structure,
      metadata: {
        fileSize,
        lastModified: lastModified || undefined,
      },
    };

  } catch (error) {
    clearTimeout(timeoutId);
    console.error('❌ Colorado bills structure test failed:', error);
    throw error;
  }
}

// Export configuration for external use
export const COLORADO_SYNC_CONFIG = {
  MAX_FILE_SIZE_MB,
  STREAM_THRESHOLD_MB,
  TIMEOUT_MS,
  TEST_CHUNK_SIZE,
  URL: BULK_DATA_URL,
} as const;
