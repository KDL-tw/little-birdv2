// API route for processing scraped Colorado legislative data
import { NextRequest, NextResponse } from 'next/server';
import { validateEnvironmentVariables } from '@/lib/config';
import { processOpenStatesData, filterValidOpenStatesBills } from '@/lib/sync/transform-bulk-data';
import { bulkUpsertColoradoBills } from '@/lib/sync/supabase-bulk-upsert';

// Types for scraped data processing
interface ScrapedDataRequest {
  source: string;
  data_type: 'scraped';
  bills_data?: Record<string, unknown>[];
  legislators_data?: Record<string, unknown>[];
}

interface ScrapedDataResponse {
  success: boolean;
  message: string;
  data?: {
    bills_processed: number;
    bills_created: number;
    bills_updated: number;
    legislators_processed: number;
    legislators_created: number;
    legislators_updated: number;
    duration_seconds: number;
    sync_run_id: string;
  };
  error?: string;
}

// Configuration
const AUTHORIZATION_HEADER = 'Authorization';

/**
 * Validates the authorization header
 */
function validateAuthorization(request: NextRequest): boolean {
  const authHeader = request.headers.get(AUTHORIZATION_HEADER);

  if (!authHeader) {
    return false;
  }

  const [scheme, token] = authHeader.split(' ');
  return scheme === 'Bearer' && token === process.env.CRON_SECRET;
}

/**
 * POST handler for processing scraped data
 */
export async function POST(request: NextRequest): Promise<NextResponse<ScrapedDataResponse>> {
  // Check authorization
  if (!validateAuthorization(request)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized', error: 'Invalid or missing authorization header' },
      { status: 401 }
    );
  }

  // Validate environment variables at runtime
  try {
    validateEnvironmentVariables();
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Configuration error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }

  const startTime = Date.now();
  console.log('🚀 Processing scraped Colorado legislative data...');

  try {
    const body: ScrapedDataRequest = await request.json();
    
    if (body.source !== 'github-actions' || body.data_type !== 'scraped') {
      return NextResponse.json({
        success: false,
        message: 'Invalid request format',
        error: 'Expected source: github-actions, data_type: scraped'
      }, { status: 400 });
    }

    let billsResult = { totalProcessed: 0, totalCreated: 0, totalUpdated: 0, syncRunId: '' };
    let legislatorsResult = { totalProcessed: 0, totalCreated: 0, totalUpdated: 0, syncRunId: '' };

    // Process bills data if provided
    if (body.bills_data && Array.isArray(body.bills_data)) {
      console.log(`📋 Processing ${body.bills_data.length} scraped bills...`);
      
      // Filter valid bills
      const validBills = filterValidOpenStatesBills(body.bills_data);
      console.log(`✅ Found ${validBills.length} valid bills`);
      
      if (validBills.length > 0) {
      // Transform data
      const { chunks } = processOpenStatesData(validBills);
      console.log(`🔄 Transformed into ${chunks.length} chunks`);
        
        if (chunks.length > 0) {
          // Upsert to Supabase
          billsResult = await bulkUpsertColoradoBills(chunks, {
            sourceUrl: 'github-actions-scraper',
            fileSizeMB: 0.1,
            description: 'Scraped data from GitHub Actions'
          });
          console.log(`✅ Bills processed: ${billsResult.totalProcessed} total, ${billsResult.totalCreated} created, ${billsResult.totalUpdated} updated`);
        }
      }
    }

    // Process legislators data if provided
    if (body.legislators_data && Array.isArray(body.legislators_data)) {
      console.log(`👥 Processing ${body.legislators_data.length} scraped legislators...`);
      
      // TODO: Implement legislators processing similar to bills
      // For now, just log the data
      console.log(`📊 Legislators data received: ${body.legislators_data.length} records`);
      
      legislatorsResult = {
        totalProcessed: body.legislators_data.length,
        totalCreated: 0,
        totalUpdated: 0,
        syncRunId: 'legislators-not-implemented'
      };
    }

    const durationSeconds = (Date.now() - startTime) / 1000;
    console.log('🎉 Scraped data processing completed successfully!');

    return NextResponse.json({
      success: true,
      message: 'Scraped data processed successfully',
      data: {
        bills_processed: billsResult.totalProcessed,
        bills_created: billsResult.totalCreated,
        bills_updated: billsResult.totalUpdated,
        legislators_processed: legislatorsResult.totalProcessed,
        legislators_created: legislatorsResult.totalCreated,
        legislators_updated: legislatorsResult.totalUpdated,
        duration_seconds: durationSeconds,
        sync_run_id: billsResult.syncRunId || legislatorsResult.syncRunId,
      },
    });

  } catch (error) {
    const durationSeconds = (Date.now() - startTime) / 1000;
    console.error('❌ Scraped data processing failed:', error);

    return NextResponse.json({
      success: false,
      message: 'Scraped data processing failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      data: {
        bills_processed: 0,
        bills_created: 0,
        bills_updated: 0,
        legislators_processed: 0,
        legislators_created: 0,
        legislators_updated: 0,
        duration_seconds: durationSeconds,
        sync_run_id: 'N/A',
      }
    }, { status: 500 });
  }
}

// Set max duration for Vercel serverless function (10 minutes)
export const maxDuration = 600;
