#!/usr/bin/env tsx

// Test Supabase connection and check for sample data
import { getBills, getBillCount, getRecentBulkSyncRuns, getDataFreshnessStats } from '../src/lib/bulkData';

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection and checking for sample data...\n');

  try {
    // Test 1: Check bill count
    console.log('📊 Bill Count:');
    const billCount = await getBillCount();
    console.log(`   Total bills in database: ${billCount}\n`);

    // Test 2: Get recent bills
    console.log('📋 Recent Bills:');
    const bills = await getBills(10);
    console.log(`   Found ${bills.length} recent bills`);
    
    if (bills.length > 0) {
      console.log('   Sample bills:');
      bills.forEach((bill, index) => {
        console.log(`   ${index + 1}. ${bill.bill_number}: ${bill.title}`);
        console.log(`      Session: ${bill.session}, Chamber: ${bill.chamber}, Status: ${bill.status}`);
      });
    } else {
      console.log('   No bills found - sample data may not have been processed yet');
    }
    console.log('');

    // Test 3: Check recent bulk sync runs
    console.log('🔄 Recent Bulk Sync Runs:');
    const syncRuns = await getRecentBulkSyncRuns(5);
    console.log(`   Found ${syncRuns.length} recent sync runs`);
    
    if (syncRuns.length > 0) {
      syncRuns.forEach((run, index) => {
        console.log(`   ${index + 1}. ${run.status} - ${run.source_url}`);
        console.log(`      Bills processed: ${run.bills_processed}, Created: ${run.bills_created}, Updated: ${run.bills_updated}`);
        console.log(`      Started: ${run.started_at}`);
      });
    } else {
      console.log('   No sync runs found');
    }
    console.log('');

    // Test 4: Data freshness stats
    console.log('📈 Data Freshness Stats:');
    const stats = await getDataFreshnessStats();
    console.log(`   Total bills: ${stats.total_bills}`);
    console.log(`   Fresh data (≤24h): ${stats.fresh_data}`);
    console.log(`   Stale data (>24h): ${stats.stale_data}`);
    console.log(`   Average freshness: ${stats.average_freshness_hours} hours`);
    console.log('');

    // Summary
    if (billCount > 0) {
      console.log('✅ SUCCESS: Sample data is in Supabase!');
      console.log(`   The GitHub Actions workflow successfully processed ${billCount} bills.`);
    } else {
      console.log('⚠️  NO DATA: No bills found in Supabase.');
      console.log('   This could mean:');
      console.log('   1. The sample data wasn\'t processed by the API endpoint');
      console.log('   2. There was an error in the transformation/upsert process');
      console.log('   3. The Supabase connection is not working');
    }

  } catch (error) {
    console.error('❌ ERROR: Failed to connect to Supabase:', error);
    console.log('\nPossible issues:');
    console.log('1. Environment variables not set (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)');
    console.log('2. Supabase database not accessible');
    console.log('3. Database schema not set up correctly');
  }
}

// Run the test
testSupabaseConnection().catch(console.error);
