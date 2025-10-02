"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Search, Filter, Plus, Upload } from "lucide-react";
import { Layout } from "@/components/layout";
import { ClientCard } from "@/components/client-card";
import { Client } from "@/lib/types";
import { sampleClients } from "@/lib/data/sampleClients";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter(client => client.id !== clientId));
  };

  const handleImportClient = () => {
    setIsImporting(true);
    // Simulate import process
    setTimeout(() => {
      console.log('Import client functionality - Ready for API connection');
      setIsImporting(false);
    }, 2000);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.userTags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-amber-50/80 backdrop-blur-md border-b border-amber-200/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 className="h-8 w-8 text-indigo-600" />
              Client Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your lobbying clients and track their legislative interests
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              {clients.length} clients loaded
            </Badge>
            <Button 
              onClick={handleImportClient}
              disabled={isImporting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isImporting ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Filters and Search */}
        <Card className="gov-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filters
            </CardTitle>
            <CardDescription>
              Find clients by name, industry, type, or tags
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search clients by name, industry, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Clients Grid */}
        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onDelete={handleDeleteClient}
              />
            ))}
          </div>
        ) : clients.length > 0 ? (
          // No search results
          <Card className="gov-card">
            <CardContent className="gov-empty-state">
              <Search className="gov-empty-state-icon" />
              <h3 className="gov-empty-state-title">No Clients Match Your Search</h3>
              <p className="gov-empty-state-description">
                Try adjusting your search terms or clear the search to see all clients.
              </p>
              <Button 
                onClick={() => setSearchTerm("")}
                className="mt-4 gov-button-primary"
              >
                Clear Search
              </Button>
            </CardContent>
          </Card>
        ) : (
          // No clients at all
          <Card className="gov-card">
            <CardContent className="gov-empty-state">
              <Building2 className="gov-empty-state-icon" />
              <h3 className="gov-empty-state-title">No Clients Added</h3>
              <p className="gov-empty-state-description">
                Start building your client roster by adding your first client. 
                All client data is stored locally and managed by your organization.
              </p>
              <div className="mt-6 space-x-4">
                <Button className="gov-button-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Client
                </Button>
                <Button variant="outline" className="gov-button-secondary">
                  <Building2 className="h-4 w-4 mr-2" />
                  View Bills
                </Button>
              </div>
            </CardContent>
          </Card>
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
