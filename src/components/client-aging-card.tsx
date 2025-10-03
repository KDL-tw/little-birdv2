"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Users, 
  AlertCircle, 
  Phone, 
  Mail,
  Calendar
} from "lucide-react";
import { ClientAging } from "@/lib/types";

interface ClientAgingCardProps {
  clientAging: ClientAging[];
}

const statusColors = {
  new: "bg-green-100 text-green-800 border-green-200",
  recent: "bg-yellow-100 text-yellow-800 border-yellow-200",
  established: "bg-blue-100 text-blue-800 border-blue-200"
};

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200"
};

export function ClientAgingCard({ clientAging }: ClientAgingCardProps) {
  const [localAging, setLocalAging] = useState<ClientAging[]>(clientAging);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('clientAging');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLocalAging(parsed);
      } catch (error) {
        console.error('Error parsing stored client aging:', error);
      }
    }
  }, []);

  // Save to localStorage whenever changes
  useEffect(() => {
    localStorage.setItem('clientAging', JSON.stringify(localAging));
  }, [localAging]);

  const updateLastContact = (clientId: string) => {
    setLocalAging(prev => 
      prev.map(client => 
        client.clientId === clientId 
          ? { 
              ...client, 
              lastContact: new Date().toISOString(),
              status: client.daysSinceAdded <= 48 ? 'new' : 'recent'
            }
          : client
      )
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getAgingStatus = (daysSinceAdded: number) => {
    if (daysSinceAdded <= 2) return 'new';
    if (daysSinceAdded <= 7) return 'recent';
    return 'established';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="h-4 w-4 text-green-600" />;
      case 'recent':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'established':
        return <Users className="h-4 w-4 text-blue-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const newClients = localAging.filter(client => getAgingStatus(client.daysSinceAdded) === 'new');
  const needsContact = localAging.filter(client => !client.lastContact && client.daysSinceAdded >= 1);

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Client Aging Report (48-Hour Tracking)
        </CardTitle>
        <CardDescription>
          Monitor new clients and ensure timely follow-up
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">{newClients.length}</div>
              <div className="text-sm text-green-700">New (≤48h)</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-900">
                {localAging.filter(c => getAgingStatus(c.daysSinceAdded) === 'recent').length}
              </div>
              <div className="text-sm text-yellow-700">Recent (3-7d)</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-900">{needsContact.length}</div>
              <div className="text-sm text-orange-700">Needs Contact</div>
            </div>
          </div>

          {/* Client List */}
          {localAging.length > 0 ? (
            <div className="space-y-3">
              {localAging
                .sort((a, b) => a.daysSinceAdded - b.daysSinceAdded)
                .map((client) => {
                  const status = getAgingStatus(client.daysSinceAdded);
                  const isNew = status === 'new';
                  const needsFollowUp = !client.lastContact && client.daysSinceAdded >= 1;
                  
                  return (
                    <div key={client.id} className={`p-4 border rounded-lg ${
                      isNew ? 'border-green-200 bg-green-50' : 
                      needsFollowUp ? 'border-orange-200 bg-orange-50' :
                      'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{client.clientName}</h4>
                            {getStatusIcon(status)}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={statusColors[status]}>
                              {status.toUpperCase()}
                            </Badge>
                            <Badge className={priorityColors[client.priority]}>
                              {client.priority.toUpperCase()} PRIORITY
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {client.daysSinceAdded} days old
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Added: {formatDate(client.addedAt)}
                          </p>
                          {client.lastContact && (
                            <p className="text-sm text-gray-600">
                              Last Contact: {formatDate(client.lastContact)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateLastContact(client.clientId)}
                          className="flex-1"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Mark Contacted
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
                      </div>

                      {/* Follow-up Alert */}
                      {needsFollowUp && (
                        <div className="mt-3 p-2 bg-orange-100 border border-orange-200 rounded text-sm text-orange-800">
                          <AlertCircle className="h-4 w-4 inline mr-2" />
                          Follow-up needed - no contact since addition
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No recent client additions</p>
              <p className="text-sm">New clients will appear here for 48-hour tracking</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <Button variant="outline" className="flex-1">
              <Users className="h-4 w-4 mr-2" />
              View All Clients
            </Button>
            <Button variant="outline" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Follow-up Schedule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
