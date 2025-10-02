"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Search, Filter, Plus, Upload, Users } from "lucide-react";
import { Layout } from "@/components/layout";
import { ContactCard } from "@/components/contact-card";
import { Contact } from "@/lib/types";
import { sampleContacts } from "@/lib/data/sampleContacts";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const handleDeleteContact = (contactId: string) => {
    setContacts(contacts.filter(contact => contact.id !== contactId));
  };

  const handleImportContact = () => {
    setIsImporting(true);
    // Simulate import process
    setTimeout(() => {
      console.log('Import contact functionality - Ready for API connection');
      setIsImporting(false);
    }, 2000);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.userTags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-amber-50/80 backdrop-blur-md border-b border-amber-200/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="h-8 w-8 text-indigo-600" />
              Contact Rolodex
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your network of contacts from clients, legislators, and organizations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              {contacts.length} contacts loaded
            </Badge>
            <Button 
              onClick={handleImportContact}
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
                  Add Contact
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
              Find contacts by name, organization, role, or tags
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search contacts by name, organization, or role..."
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

        {/* Contacts Grid */}
        {filteredContacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onDelete={handleDeleteContact}
              />
            ))}
          </div>
        ) : contacts.length > 0 ? (
          // No search results
          <Card className="gov-card">
            <CardContent className="gov-empty-state">
              <Search className="gov-empty-state-icon" />
              <h3 className="gov-empty-state-title">No Contacts Match Your Search</h3>
              <p className="gov-empty-state-description">
                Try adjusting your search terms or clear the search to see all contacts.
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
          // No contacts at all
          <Card className="gov-card">
            <CardContent className="gov-empty-state">
              <Users className="gov-empty-state-icon" />
              <h3 className="gov-empty-state-title">No Contacts Added</h3>
              <p className="gov-empty-state-description">
                Start building your contact network by adding your first contact. 
                Track relationships with clients, legislators, and key stakeholders.
              </p>
              <div className="mt-6 space-x-4">
                <Button className="gov-button-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Contact
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
