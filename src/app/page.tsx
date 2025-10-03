import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, TrendingUp, Building2, Target, BarChart3 } from "lucide-react";
import { Layout } from "@/components/layout";
import { AlertsCard } from "@/components/alerts-card";

export default function Home() {
  return (
    <Layout>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Here&apos;s what&apos;s happening with your legislative tracking today.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
              Awaiting Data Sync
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Clients</CardTitle>
              <Building2 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">0</div>
              <p className="text-sm text-gray-500">
                Client accounts
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Position Tracker</CardTitle>
              <Target className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">0</div>
              <p className="text-sm text-gray-500">
                Active positions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Industry Concentration</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">—</div>
              <p className="text-sm text-gray-500">
                No data available
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Bills Tracked</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">0</div>
              <p className="text-sm text-gray-500">
                Active tracking
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Alerts Card */}
          <div>
            <AlertsCard />
          </div>
          
          {/* Quick Actions */}
          <div>
            <Card className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow h-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
                <CardDescription className="text-gray-600">
                  Common tasks and shortcuts for lobbying intelligence
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4">
                <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200">
                  <Building2 className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-gray-600">Manage Clients</span>
                </div>
                <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200">
                  <Target className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-gray-600">Track Positions</span>
                </div>
                <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200">
                  <FileText className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-gray-600">Monitor Bills</span>
                </div>
                <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200">
                  <TrendingUp className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-gray-600">View Analytics</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </main>
    </div>
    </Layout>
  );
}
