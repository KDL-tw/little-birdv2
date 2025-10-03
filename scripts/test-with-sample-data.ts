#!/usr/bin/env npx tsx
// Test script using sample data instead of OpenStates API
import { config } from 'dotenv';
import { processOpenStatesData, filterValidOpenStatesBills } from '../src/lib/sync/transform-bulk-data';
import { bulkUpsertColoradoBills } from '../src/lib/sync/supabase-bulk-upsert';

// Load environment variables
config({ path: '.env.local' });

// Sample Colorado bill data for testing
const sampleColoradoBills = [
  {
    id: "co-2025-hb1001",
    bill_id: "HB24-1001",
    title: "Concerning the regulation of artificial intelligence systems",
    session: "2025",
    chamber: "house",
    status: "passed_lower",
    classification: ["bill"],
    subject: ["Technology", "Government Regulation"],
    sponsorships: [
      {
        name: "Rep. Jane Smith",
        chamber: "house",
        type: "primary"
      },
      {
        name: "Rep. John Doe", 
        chamber: "house",
        type: "cosponsor"
      }
    ],
    actions: [
      {
        date: "2025-01-15",
        description: "Introduced in House",
        classification: ["introduction"],
        organization: {
          name: "Colorado House of Representatives"
        }
      },
      {
        date: "2025-02-01",
        description: "Passed House Committee on Technology",
        classification: ["committee-passage"],
        organization: {
          name: "House Committee on Technology"
        }
      }
    ],
    votes: [],
    documents: [],
    versions: [],
    sources: [],
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-02-01T00:00:00Z"
  },
  {
    id: "co-2025-sb2001",
    bill_id: "SB24-2001", 
    title: "Concerning renewable energy incentives",
    session: "2025",
    chamber: "senate",
    status: "passed_upper",
    classification: ["bill"],
    subject: ["Energy", "Environment"],
    sponsorships: [
      {
        name: "Sen. Maria Garcia",
        chamber: "senate",
        type: "primary"
      }
    ],
    actions: [
      {
        date: "2025-01-20",
        description: "Introduced in Senate",
        classification: ["introduction"],
        organization: {
          name: "Colorado Senate"
        }
      }
    ],
    votes: [],
    documents: [],
    versions: [],
    sources: [],
    created_at: "2025-01-20T00:00:00Z",
    updated_at: "2025-01-20T00:00:00Z"
  }
];

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

// Test data transformation
async function testTransformation(): Promise<any | null> {
  logStep('Testing data transformation with sample data...');
  
  try {
    logSubStep(`Transforming ${sampleColoradoBills.length} sample bills...`);
    
    // Filter valid bills first
    const validBills = filterValidOpenStatesBills(sampleColoradoBills);
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

// Test Supabase upsert
async function testUpsert(transformResult: any): Promise<boolean> {
  logStep('Testing Supabase upsert...');
  
  try {
    if (!transformResult || transformResult.chunks.length === 0) {
      logError('No transformed data to upsert');
      return false;
    }
    
    logSubStep(`Upserting ${transformResult.chunks.length} chunks...`);
    
    const summary = await bulkUpsertColoradoBills(transformResult.chunks, {
      sourceUrl: 'sample-data-test',
      fileSizeMB: 0.001,
      description: 'Test with sample data'
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
  log('🧪 Little Bird Sample Data Test Suite', colors.bright + colors.magenta);
  log('=====================================', colors.magenta);
  
  const startTime = Date.now();
  const results = {
    environment: false,
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
    
    // Test 2: Transformation
    const transformResult = await testTransformation();
    if (!transformResult) {
      logError('Data transformation failed.');
      return;
    }
    results.transform = true;
    
    // Test 3: Supabase upsert
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
    log('\n🎉 All tests passed! Your Little Bird system is working correctly.', colors.bright + colors.green);
    log('Note: OpenStates API is currently unavailable, but your system is ready for real data.', colors.yellow);
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
