'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Database, 
  FileText, 
  Users, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Activity
} from "lucide-react";
import { fetchBills, fetchLegislators } from "@/lib/data";
import { Layout } from "@/components/layout";
import { useState, useEffect } from "react";
import { getBillCount, getRecentBulkSyncRuns, getDataFreshnessStats } from "@/lib/bulkData";

export default function AdminPage() {
  // State for data counts
  const [billCount, setBillCount] = useState<number>(0);
  const [legislators, setLegislators] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string>('Never');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [dataStats, setDataStats] = useState<{
    total_bills: number;
    fresh_data: number;
    stale_data: number;
    average_freshness_hours: number;
  } | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get bill count from Supabase
        const count = await getBillCount();
        setBillCount(count);
        
        // Get data freshness stats
        const stats = await getDataFreshnessStats();
        setDataStats(stats);
        
        // Get last sync info
        const syncRuns = await getRecentBulkSyncRuns(1);
        if (syncRuns.length > 0) {
          const lastRun = syncRuns[0];
          setLastSync(new Date(lastRun.started_at).toLocaleString());
        }

        const legislatorsData = await fetchLegislators();
        setLegislators(legislatorsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handler functions for sync buttons
  const handleSyncBills = async () => {
    setSyncStatus('running');
    setSyncMessage('Bulk data import ready - upload OpenStates JSON file');
    
    // For now, just show the bulk import message
    setTimeout(() => {
      setSyncStatus('idle');
      setSyncMessage('Ready for bulk data import from OpenStates JSON files');
    }, 2000);
  };

  const handleSyncLegislators = () => {
    setSyncStatus('idle');
    setSyncMessage('Legislator sync not yet implemented - coming soon!');
    // TODO: Implement legislator sync when OpenStates legislator endpoints are ready
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading admin panel...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-amber-50/80 backdrop-blur-md border-b border-amber-200/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Settings className="h-8 w-8 text-indigo-600" />
              Admin Panel
            </h1>
            <p className="text-gray-600 mt-1">
              Manage data synchronization and platform settings
            </p>
          </div>
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
            System Status: Ready
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Data Sync Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Synchronization
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bills Sync */}
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Colorado Bills
                </CardTitle>
                <CardDescription>
                  Sync bill data from Colorado General Assembly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Current Records</p>
                    <p className="text-2xl font-bold">{billCount}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`gov-status-badge ${
                      billCount > 0 ? 'gov-status-active' : 'gov-status-inactive'
                    }`}
                  >
                    {billCount > 0 ? 'Synced' : 'Empty'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Last Sync: {lastSync}</p>
                  <p className="text-xs text-muted-foreground">
                    Status: {syncStatus === 'running' ? 'Syncing...' : syncStatus === 'success' ? 'Connected' : 'Ready'}
                  </p>
                  {dataStats && (
                    <>
                      <p className="text-xs text-muted-foreground">
                        Fresh Data: {dataStats.fresh_data} bills (&lt;24h old)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Avg Age: {dataStats.average_freshness_hours.toFixed(1)} hours
                      </p>
                    </>
                  )}
                </div>
                
                <Button 
                  className="w-full gov-button-primary"
                  onClick={handleSyncBills}
                  disabled={syncStatus === 'running'}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus === 'running' ? 'animate-spin' : ''}`} />
                  {syncStatus === 'running' ? 'Syncing...' : 'Sync Colorado Bills'}
                </Button>
                
                {syncMessage && (
                  <div className={`p-3 rounded text-sm ${
                    syncStatus === 'success' ? 'bg-green-100 text-green-800' :
                    syncStatus === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {syncMessage}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Legislators Sync */}
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Colorado Legislators
                </CardTitle>
                <CardDescription>
                  Sync legislator data from Colorado General Assembly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Current Records</p>
                    <p className="text-2xl font-bold">{legislators.length}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`gov-status-badge ${
                      legislators.length > 0 ? 'gov-status-active' : 'gov-status-inactive'
                    }`}
                  >
                    {legislators.length > 0 ? 'Synced' : 'Empty'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Last Sync: Never</p>
                  <p className="text-xs text-muted-foreground">Status: Ready for API connection</p>
                </div>
                
                <Button 
                  className="w-full gov-button-primary"
                  onClick={handleSyncLegislators}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Legislators
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Status */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Status
          </h2>
          
          <Card className="gov-card">
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
              <CardDescription>
                Current status of all system components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Data Layer</p>
                    <p className="text-sm text-muted-foreground">Ready for API connection</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-yellow-100">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">Colorado API</p>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Database</p>
                    <p className="text-sm text-muted-foreground">Ready for Supabase</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Setup */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="h-5 w-5" />
            Integration Setup
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="gov-card">
              <CardHeader>
                <CardTitle>Colorado General Assembly API</CardTitle>
                <CardDescription>
                  Connect to official Colorado legislative data sources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">API Endpoint</p>
                  <code className="block p-2 bg-muted rounded text-sm">
                    https://leg.colorado.gov/content/legislative-council-staff-api-documentation
                  </code>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant="outline" className="gov-status-inactive">
                    Not Configured
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Configure environment variables to connect to Colorado LCS API
                  </p>
                </div>
                
                <Button variant="outline" className="w-full gov-button-secondary" disabled>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure API
                </Button>
              </CardContent>
            </Card>

            <Card className="gov-card">
              <CardHeader>
                <CardTitle>Database Integration</CardTitle>
                <CardDescription>
                  Set up Supabase for data persistence and real-time updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Database</p>
                  <code className="block p-2 bg-muted rounded text-sm">
                    Supabase (PostgreSQL)
                  </code>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant="outline" className="gov-status-inactive">
                    Not Connected
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Database schema ready for relational data storage
                  </p>
                </div>
                
                <Button variant="outline" className="w-full gov-button-secondary" disabled>
                  <Database className="h-4 w-4 mr-2" />
                  Setup Database
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          
          <Card className="gov-card">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <Button className="gov-button-primary">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync All Data
                </Button>
                <Button variant="outline" className="gov-button-secondary">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Button>
                <Button variant="outline" className="gov-button-secondary">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  View Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    </Layout>
  );
}
