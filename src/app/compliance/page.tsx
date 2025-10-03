"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  FileText, 
  Clock, 
  Calendar as CalendarIcon,
  Users,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Layout } from "@/components/layout";
import { PositionTrackingCard } from "@/components/position-tracking-card";
import { ClientAgingCard } from "@/components/client-aging-card";
import { SimpleCalendar } from "@/components/simple-calendar";
import { ReportingDeadlinesCard } from "@/components/reporting-deadlines-card";
import { 
  samplePositionChanges, 
  sampleClientAging, 
  sampleReportingDeadlines,
  sampleCalendarEvents 
} from "@/lib/data/sampleCompliance";

export default function CompliancePage() {
  const [positionChanges] = useState(samplePositionChanges);
  const [clientAging] = useState(sampleClientAging);
  const [reportingDeadlines] = useState(sampleReportingDeadlines);
  const [calendarEvents] = useState(sampleCalendarEvents);

  // Calculate summary stats
  const pendingPositionChanges = positionChanges.filter(change => change.complianceStatus === 'pending').length;
  const overduePositionChanges = positionChanges.filter(change => change.complianceStatus === 'overdue').length;
  const newClients = clientAging.filter(client => client.status === 'new').length;
  const upcomingDeadlines = reportingDeadlines.filter(deadline => {
    const now = new Date();
    const deadlineDate = new Date(deadline.deadlineDate);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-amber-50/80 backdrop-blur-md border-b border-amber-200/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-8 w-8 text-indigo-600" />
              Compliance Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Track position changes, client follow-ups, and reporting deadlines
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              Frontend Storage
            </Badge>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <FileText className="h-4 w-4 mr-2" />
              Compliance Report
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Position Changes</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingPositionChanges}</p>
                  <p className="text-xs text-gray-500">Pending compliance</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              {overduePositionChanges > 0 && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  {overduePositionChanges} overdue
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{newClients}</p>
                  <p className="text-xs text-gray-500">≤48 hours old</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-3">
                <Button size="sm" variant="outline" className="w-full">
                  View Aging Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming Deadlines</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingDeadlines}</p>
                  <p className="text-xs text-gray-500">Next 7 days</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-3">
                <Button size="sm" variant="outline" className="w-full">
                  View Calendar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliance Status</p>
                  <p className="text-2xl font-bold text-green-900">
                    {pendingPositionChanges === 0 && overduePositionChanges === 0 ? '100%' : 'Partial'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {pendingPositionChanges === 0 && overduePositionChanges === 0 ? 'All caught up' : 'Action needed'}
                  </p>
                </div>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  pendingPositionChanges === 0 && overduePositionChanges === 0 ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {pendingPositionChanges === 0 && overduePositionChanges === 0 ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Position Tracking */}
          <div className="lg:col-span-1">
            <PositionTrackingCard positionChanges={positionChanges} />
          </div>

          {/* Client Aging */}
          <div className="lg:col-span-1">
            <ClientAgingCard clientAging={clientAging} />
          </div>
        </div>

        {/* Calendar and Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <SimpleCalendar events={calendarEvents} />
          </div>

          {/* Reporting Deadlines */}
          <div>
            <ReportingDeadlinesCard deadlines={reportingDeadlines} />
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Frontend Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 text-sm mb-3">
                All compliance data is stored locally in your browser using localStorage. 
                This ensures data persistence across sessions without requiring a backend database.
              </p>
              <div className="space-y-2 text-xs text-blue-700">
                <div>• Position changes persist across page reloads</div>
                <div>• Client aging reports maintain 48-hour tracking</div>
                <div>• Reporting deadlines are saved month-to-month</div>
                <div>• Calendar events sync with deadline data</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Compliance Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800 text-sm mb-3">
                Built-in compliance tracking helps ensure you meet all regulatory requirements 
                for lobbying activities and client management.
              </p>
              <div className="space-y-2 text-xs text-green-700">
                <div>• Position change deadlines with compliance status</div>
                <div>• 48-hour client follow-up tracking</div>
                <div>• Recurring reporting deadline management</div>
                <div>• Visual calendar for deadline visibility</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    </Layout>
  );
}
