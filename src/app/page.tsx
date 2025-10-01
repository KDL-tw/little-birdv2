import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Users, TrendingUp, Clock, Star, Bell, User } from "lucide-react";
import { Layout } from "@/components/layout";

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
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Star className="h-4 w-4 mr-2" />
                Platform Overview
              </Button>
              <Button variant="outline" className="border-gray-300">
                <FileText className="h-4 w-4 mr-2" />
                Quick Add
              </Button>
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </div>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Bills Tracked</CardTitle>
                <FileText className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">0</div>
                <p className="text-sm text-gray-500">
                  Active tracking
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Legislators</CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">0</div>
                <p className="text-sm text-gray-500">
                  In your network
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Compliance Deadlines</CardTitle>
                <Clock className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">0</div>
                <p className="text-sm text-gray-500">
                  Due this week
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Upcoming Hearings</CardTitle>
                <Clock className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">0</div>
                <p className="text-sm text-gray-500">
                  Next 7 days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
                <CardDescription className="text-gray-600">
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">My Bills</span>
                </div>
                <div className="flex items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer">
                  <Users className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Search Legislators</span>
                </div>
                <div className="flex items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Manage Clients</span>
                </div>
                <div className="flex items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer">
                  <TrendingUp className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Data Sync</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
                <CardDescription className="text-gray-600">
                  Latest updates and changes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center p-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">No bills tracked yet</p>
                    <p className="text-xs text-gray-500">Awaiting data sync</p>
                  </div>
                </div>
                <div className="flex items-center p-3">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">No legislators loaded</p>
                    <p className="text-xs text-gray-500">Import data to start</p>
                  </div>
                </div>
                <div className="flex items-center p-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">System ready for sync</p>
                    <p className="text-xs text-gray-500">Connect to Colorado database</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </Layout>
  );
}
