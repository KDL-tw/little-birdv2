import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, TrendingUp, Clock } from "lucide-react";
import { Layout } from "@/components/layout";

export default function Dashboard() {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="gov-header">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-primary-foreground/80 mt-1">
                  Political Intelligence Platform for Colorado Lobbying
                </p>
              </div>
              <Badge variant="secondary" className="gov-status-inactive">
                Awaiting Data Sync
              </Badge>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="gov-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Awaiting data sync
              </p>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Legislators</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Awaiting data sync
              </p>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lobbying Activities</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Awaiting data sync
              </p>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">
                Never synced
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="gov-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with your political intelligence platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="gov-empty-state">
                <FileText className="gov-empty-state-icon" />
                <h3 className="gov-empty-state-title">No Data Available</h3>
                <p className="gov-empty-state-description">
                  Sync with Colorado General Assembly database to begin tracking bills and legislators.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates from your political intelligence feeds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="gov-empty-state">
                <TrendingUp className="gov-empty-state-icon" />
                <h3 className="gov-empty-state-title">No Activity Yet</h3>
                <p className="gov-empty-state-description">
                  Activity will appear here once data is synchronized from Colorado sources.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="gov-card hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Bills
              </CardTitle>
              <CardDescription>
                Track Colorado legislation and bill progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <Badge variant="outline" className="gov-status-inactive">
                  0 bills loaded
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Legislators
              </CardTitle>
              <CardDescription>
                Monitor Colorado legislators and voting records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <Badge variant="outline" className="gov-status-inactive">
                  0 legislators loaded
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Analytics
              </CardTitle>
              <CardDescription>
                Analyze lobbying patterns and political trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <Badge variant="outline" className="gov-status-inactive">
                  No data available
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    </Layout>
  );
}
