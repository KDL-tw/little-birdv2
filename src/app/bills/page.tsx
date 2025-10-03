"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Search, Filter, Calendar, User, Plus, Upload } from "lucide-react";
import { Layout } from "@/components/layout";
import { BillCard } from "@/components/bill-card";
import { Bill, LobbyingPosition } from "@/lib/types";
import { sampleBills } from "@/lib/data/sampleData";
import { getBills } from "@/lib/bulkData";

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>(sampleBills);
  const [searchTerm, setSearchTerm] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load bills from Supabase on component mount
  useEffect(() => {
    const loadBills = async () => {
      try {
        const supabaseBills = await getBills(50, 0);
        
        // Convert Supabase bills to our Bill type
        const convertedBills = supabaseBills.map((sb: any) => ({
          id: sb.id,
          billNumber: sb.bill_number,
          title: sb.title,
          description: sb.description || '',
          status: sb.status,
          chamber: sb.chamber,
          sponsor: sb.sponsor_names?.[0] || 'Unknown',
          coSponsors: sb.sponsor_names?.slice(1) || [],
          introducedDate: sb.created_at,
          lastActionDate: sb.updated_at,
          fiscalNote: sb.fiscal_note || '',
          position: 'neutral' as LobbyingPosition,
          clientId: null,
          notes: [],
          tags: sb.subject || [],
          issue: sb.subject?.[0] || 'General',
          progress: {
            currentStage: sb.status,
            stages: [
              { name: 'Introduced', completed: true, date: sb.created_at },
              { name: 'Committee', completed: false },
              { name: 'Floor Vote', completed: false },
              { name: 'Governor', completed: false }
            ]
          }
        }));

        // Combine with sample bills if no real data yet
        if (convertedBills.length > 0) {
          setBills(convertedBills);
        } else {
          setBills(sampleBills);
        }
      } catch (error) {
        console.error('Error loading bills:', error);
        // Fall back to sample bills
        setBills(sampleBills);
      } finally {
        setIsLoading(false);
      }
    };

    loadBills();
  }, []);

  const handleDeleteBill = (billId: string) => {
    setBills(bills.filter(bill => bill.id !== billId));
  };

  const handlePositionChange = (billId: string, position: LobbyingPosition) => {
    setBills(bills.map(bill => 
      bill.id === billId ? { ...bill, position } : bill
    ));
  };

  const handleImportBill = () => {
    setIsImporting(true);
    // Simulate import process
    setTimeout(() => {
      console.log('Import bill functionality - Ready for API connection');
      setIsImporting(false);
    }, 2000);
  };

  const filteredBills = bills.filter(bill =>
    bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.sponsor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-amber-50/80 backdrop-blur-md border-b border-amber-200/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="h-8 w-8 text-indigo-600" />
              Colorado Bills
            </h1>
            <p className="text-gray-600 mt-1">
              Track and monitor Colorado General Assembly legislation
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              {bills.length} bills loaded
            </Badge>
            <Button 
              onClick={handleImportBill}
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
                  Import Bill
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

        {/* Bills List */}
        {filteredBills.length > 0 ? (
          <div className="space-y-4">
            {filteredBills.map((bill) => (
              <BillCard
                key={bill.id}
                bill={bill}
                onDelete={handleDeleteBill}
                onPositionChange={handlePositionChange}
              />
            ))}
          </div>
        ) : bills.length > 0 ? (
          // No search results
          <Card className="gov-card">
            <CardContent className="gov-empty-state">
              <Search className="gov-empty-state-icon" />
              <h3 className="gov-empty-state-title">No Bills Match Your Search</h3>
              <p className="gov-empty-state-description">
                Try adjusting your search terms or clear the search to see all bills.
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
          // No bills at all
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
        )}

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
