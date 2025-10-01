import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Search, Filter, MapPin, Building, Mail, Phone } from "lucide-react";
import { fetchLegislators } from "@/lib/data/legislators";
import { Layout } from "@/components/layout";

export default async function LegislatorsPage() {
  // Fetch legislators data - will return empty array for now
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
                <Users className="h-6 w-6" />
                Colorado Legislators
              </h1>
              <p className="text-primary-foreground/80 mt-1">
                Monitor Colorado General Assembly members and voting records
              </p>
            </div>
            <Badge variant="secondary" className="gov-status-inactive">
              {legislators.length} legislators loaded
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
              Find legislators by party, chamber, district, or name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search legislators by name, district, or party..."
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

        {/* Legislators Grid */}
        {legislators.length === 0 ? (
          <Card className="gov-card">
            <CardContent className="gov-empty-state">
              <Users className="gov-empty-state-icon" />
              <h3 className="gov-empty-state-title">No Legislators Loaded</h3>
              <p className="gov-empty-state-description">
                Import data to start monitoring Colorado legislators. 
                Use the admin panel to sync legislator information from official sources.
              </p>
              <div className="mt-6 space-x-4">
                <Button className="gov-button-primary">
                  <Users className="h-4 w-4 mr-2" />
                  Go to Admin Panel
                </Button>
                <Button variant="outline" className="gov-button-secondary">
                  <Building className="h-4 w-4 mr-2" />
                  View Bills
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legislators.map((legislator) => (
              <Card key={legislator.id} className="gov-card hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{legislator.fullName}</CardTitle>
                      <CardDescription className="mt-1">
                        {legislator.party} • {legislator.chamber} District {legislator.district}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`gov-status-badge ${
                        legislator.isActive ? 'gov-status-active' : 'gov-status-inactive'
                      }`}
                    >
                      {legislator.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{legislator.chamber}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>District {legislator.district}</span>
                    </div>
                    
                    {legislator.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`mailto:${legislator.email}`}
                          className="text-primary hover:underline"
                        >
                          {legislator.email}
                        </a>
                      </div>
                    )}
                    
                    {legislator.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`tel:${legislator.phone}`}
                          className="text-primary hover:underline"
                        >
                          {legislator.phone}
                        </a>
                      </div>
                    )}
                    
                    {legislator.committeeAssignments.length > 0 && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-1">Committees:</p>
                        <div className="flex flex-wrap gap-1">
                          {legislator.committeeAssignments.slice(0, 2).map((committee, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {committee}
                            </Badge>
                          ))}
                          {legislator.committeeAssignments.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{legislator.committeeAssignments.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Loading State Example (commented out since we have empty state) */}
        {false && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="gov-card">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="pt-2 border-t border-border">
                      <Skeleton className="h-3 w-1/3 mb-2" />
                      <div className="flex gap-1">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                  </div>
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
