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

export default async function AdminPage() {
  // Get current data counts
  const bills = await fetchBills();
  const legislators = await fetchLegislators();

  return (
    <Layout>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gov-header">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Settings className="h-6 w-6" />
                Admin Panel
              </h1>
              <p className="text-primary-foreground/80 mt-1">
                Manage data synchronization and platform settings
              </p>
            </div>
            <Badge variant="secondary" className="gov-status-inactive">
              System Status: Ready
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
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
                    <p className="text-2xl font-bold">{bills.length}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`gov-status-badge ${
                      bills.length > 0 ? 'gov-status-active' : 'gov-status-inactive'
                    }`}
                  >
                    {bills.length > 0 ? 'Synced' : 'Empty'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Last Sync: Never</p>
                  <p className="text-xs text-muted-foreground">Status: Ready for API connection</p>
                </div>
                
                <Button 
                  className="w-full gov-button-primary"
                  onClick={() => {
                    console.log('Ready for API connection - Colorado General Assembly integration');
                    console.log('fetchBills() called from admin panel');
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Colorado Bills
                </Button>
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
                  onClick={() => {
                    console.log('Ready for API connection - Colorado General Assembly integration');
                    console.log('fetchLegislators() called from admin panel');
                  }}
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
