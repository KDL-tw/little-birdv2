import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Search, Filter, Calendar, User } from "lucide-react";
import { Layout } from "@/components/layout";

export default function BillsPage() {
  // For now, we'll use empty array - data will be fetched client-side when needed
  const bills: unknown[] = [];

  return (
    <Layout>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gov-header">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Colorado Bills
              </h1>
              <p className="text-primary-foreground/80 mt-1">
                Track and monitor Colorado General Assembly legislation
              </p>
            </div>
            <Badge variant="secondary" className="gov-status-inactive">
              {bills.length} bills loaded
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <Card className="gov-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filters
            </CardTitle>
            <CardDescription>
              Find bills by status, chamber, sponsor, or keywords
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search bills by title, number, or sponsor..."
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gov-button-secondary">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button className="gov-button-primary">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bills List - Empty State */}
        <Card className="gov-card">
          <CardContent className="gov-empty-state">
            <FileText className="gov-empty-state-icon" />
            <h3 className="gov-empty-state-title">No Bills Found</h3>
            <p className="gov-empty-state-description">
              Sync with Colorado General Assembly database to begin tracking bills. 
              Use the admin panel to import bill data from official sources.
            </p>
            <div className="mt-6 space-x-4">
              <Button className="gov-button-primary">
                <Calendar className="h-4 w-4 mr-2" />
                Go to Admin Panel
              </Button>
              <Button variant="outline" className="gov-button-secondary">
                <User className="h-4 w-4 mr-2" />
                View Legislators
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State Example (commented out since we have empty state) */}
        {false && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="gov-card">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-4 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
    </Layout>
  );
}
