#!/usr/bin/env npx tsx
// Test script for bulk Colorado sync functionality
import { config } from 'dotenv';
import { syncColoradoBills, testColoradoBillsStructure } from '../src/lib/sync/bulk-colorado-sync';
import { processOpenStatesData, filterValidOpenStatesBills } from '../src/lib/sync/transform-bulk-data';
import { bulkUpsertColoradoBills } from '../src/lib/sync/supabase-bulk-upsert';

// Load environment variables
config({ path: '.env.local' });

// Test configuration
const TEST_BILL_COUNT = 5;
const TEST_TIMEOUT_MS = 30000; // 30 seconds

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function log(message: string, color: string = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message: string) {
  log(`✅ ${message}`, colors.green);
}

function logError(message: string) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message: string) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message: string) {
  log(`ℹ️  ${message}`, colors.blue);
}

function logStep(message: string) {
  log(`\n🚀 ${message}`, colors.cyan);
}

function logSubStep(message: string) {
  log(`   ${message}`, colors.white);
}

// Validate environment variables
function validateEnvironment(): boolean {
  logStep('Validating environment variables...');
  
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'BULK_DATA_URL',
    'CRON_SECRET'
  ];
  
  let allValid = true;
  
  for (const envVar of required) {
    if (!process.env[envVar]) {
      logError(`Missing environment variable: ${envVar}`);
      allValid = false;
    } else {
      logSubStep(`${envVar}: ${envVar.includes('KEY') || envVar.includes('SECRET') ? '***' : process.env[envVar]}`);
    }
  }
  
  if (allValid) {
    logSuccess('All environment variables are set');
  } else {
    logError('Environment validation failed');
  }
  
  return allValid;
}

// Test 1: Structure validation
async function testStructure(): Promise<boolean> {
  logStep('Test 1: Testing OpenStates structure...');
  
  try {
    const result = await Promise.race([
      testColoradoBillsStructure(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Structure test timeout')), TEST_TIMEOUT_MS)
      )
    ]);
    
    logSubStep(`Sample size: ${result.sample.length} bytes`);
    logSubStep(`File size: ${(result.metadata.fileSize / (1024 * 1024)).toFixed(2)} MB`);
    
    if (result.structure) {
      logSubStep('Structure preview:');
      console.log(JSON.stringify(result.structure, null, 2).substring(0, 500) + '...');
      logSuccess('Structure test passed');
      return true;
    } else {
      logWarning('No structure data returned');
      return false;
    }
    
  } catch (error) {
    logError(`Structure test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
}

// Test 2: Limited data fetch
async function testLimitedFetch(): Promise<any[] | null> {
  logStep('Test 2: Fetching limited Colorado bills...');
  
  try {
    const result = await Promise.race([
      syncColoradoBills(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Data fetch timeout')), TEST_TIMEOUT_MS)
      )
    ]);
    
    logSubStep(`Fetched ${result.bills.length} bills`);
    logSubStep(`File size: ${result.metadata.fileSizeMB.toFixed(2)} MB`);
    logSubStep(`Download time: ${result.metadata.downloadTime}ms`);
    logSubStep(`Parse time: ${result.metadata.parseTime}ms`);
    
    if (result.errors.length > 0) {
      logWarning(`${result.errors.length} errors during fetch:`);
      result.errors.slice(0, 3).forEach(error => {
        logSubStep(`  - ${error.openstates_id || error.bill_id || 'unknown'}: ${error.error}`);
      });
    }
    
    // Limit to test count
    const testBills = result.bills.slice(0, TEST_BILL_COUNT);
    logSubStep(`Using first ${testBills.length} bills for testing`);
    
    logSuccess('Limited fetch test passed');
    return testBills;
    
  } catch (error) {
    logError(`Limited fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

// Test 3: Data transformation
async function testTransformation(bills: any[]): Promise<any | null> {
  logStep('Test 3: Testing data transformation...');
  
  try {
    logSubStep(`Transforming ${bills.length} bills...`);
    
    // Filter valid bills first
    const validBills = filterValidOpenStatesBills(bills);
    logSubStep(`Valid bills after filtering: ${validBills.length}`);
    
    if (validBills.length === 0) {
      logError('No valid bills found for transformation');
      return null;
    }
    
    // Process the data
    const result = processOpenStatesData(validBills);
    
    logSubStep(`Created ${result.chunks.length} chunks`);
    logSubStep(`Total successful: ${result.stats.successful}`);
    logSubStep(`Total failed: ${result.stats.failed}`);
    
    if (result.errors.length > 0) {
      logWarning(`${result.errors.length} transformation errors:`);
      result.errors.slice(0, 3).forEach(error => {
        logSubStep(`  - ${error.openstates_id}: ${error.error}`);
      });
    }
    
    // Show sample transformed bill
    if (result.chunks.length > 0 && result.chunks[0].bills.length > 0) {
      logSubStep('Sample transformed bill:');
      const sampleBill = result.chunks[0].bills[0];
      console.log(JSON.stringify(sampleBill, null, 2));
    }
    
    logSuccess('Transformation test passed');
    return result;
    
  } catch (error) {
    logError(`Transformation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

// Test 4: Supabase upsert
async function testUpsert(transformResult: any): Promise<boolean> {
  logStep('Test 4: Testing Supabase upsert...');
  
  try {
    if (!transformResult || transformResult.chunks.length === 0) {
      logError('No transformed data to upsert');
      return false;
    }
    
    logSubStep(`Upserting ${transformResult.chunks.length} chunks...`);
    
    const summary = await bulkUpsertColoradoBills(transformResult.chunks, {
      sourceUrl: process.env.BULK_DATA_URL || '',
      fileSizeMB: 0.1, // Small test file
      description: 'Test bulk sync'
    });
    
    logSubStep(`Sync run ID: ${summary.syncRunId}`);
    logSubStep(`Total processed: ${summary.totalProcessed}`);
    logSubStep(`Created: ${summary.totalCreated}`);
    logSubStep(`Updated: ${summary.totalUpdated}`);
    logSubStep(`Failed: ${summary.totalFailed}`);
    logSubStep(`Duration: ${summary.duration}ms`);
    
    if (summary.errors.length > 0) {
      logWarning(`${summary.errors.length} upsert errors:`);
      summary.errors.slice(0, 3).forEach(error => {
        logSubStep(`  - ${error.openstates_id}: ${error.error}`);
      });
    }
    
    if (summary.totalProcessed > 0) {
      logSuccess('Supabase upsert test passed');
      return true;
    } else {
      logError('No bills were processed');
      return false;
    }
    
  } catch (error) {
    logError(`Supabase upsert failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
}

// Main test runner
async function runTests(): Promise<void> {
  log('🧪 Little Bird Bulk Sync Test Suite', colors.bright + colors.magenta);
  log('=====================================', colors.magenta);
  
  const startTime = Date.now();
  const results = {
    environment: false,
    structure: false,
    fetch: false,
    transform: false,
    upsert: false
  };
  
  try {
    // Test 1: Environment validation
    results.environment = validateEnvironment();
    if (!results.environment) {
      logError('Environment validation failed. Please check your .env.local file.');
      return;
    }
    
    // Test 2: Structure test
    results.structure = await testStructure();
    if (!results.structure) {
      logError('Structure test failed. Check OpenStates API availability.');
      return;
    }
    
    // Test 3: Limited data fetch
    const testBills = await testLimitedFetch();
    if (!testBills) {
      logError('Data fetch failed.');
      return;
    }
    results.fetch = true;
    
    // Test 4: Transformation
    const transformResult = await testTransformation(testBills);
    if (!transformResult) {
      logError('Data transformation failed.');
      return;
    }
    results.transform = true;
    
    // Test 5: Supabase upsert
    results.upsert = await testUpsert(transformResult);
    
  } catch (error) {
    logError(`Test suite failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  // Summary
  const duration = Date.now() - startTime;
  log('\n📊 Test Results Summary', colors.bright + colors.cyan);
  log('========================', colors.cyan);
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const color = passed ? colors.green : colors.red;
    log(`${test.padEnd(12)}: ${status}`, color);
  });
  
  log(`\nTotal duration: ${duration}ms`, colors.white);
  
  const allPassed = Object.values(results).every(result => result);
  if (allPassed) {
    log('\n🎉 All tests passed! Bulk sync is ready for production.', colors.bright + colors.green);
  } else {
    log('\n⚠️  Some tests failed. Please review the errors above.', colors.bright + colors.yellow);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logError(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

// Run the tests
runTests().catch(error => {
  logError(`Test suite crashed: ${error.message}`);
  process.exit(1);
});
