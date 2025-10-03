"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Building2,
  Users,
  Target,
  TrendingUp,
  Network
} from "lucide-react";
import { Contact } from "@/lib/types";

interface ContactProfileModalProps {
  contact: Contact;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const organizationTypeColors = {
  client: "bg-blue-100 text-blue-800 border-blue-200",
  legislator: "bg-green-100 text-green-800 border-green-200",
  government: "bg-purple-100 text-purple-800 border-purple-200",
  other: "bg-gray-100 text-gray-800 border-gray-200"
};

const relationshipTypeColors = {
  primary: "bg-emerald-100 text-emerald-800 border-emerald-200",
  secondary: "bg-blue-100 text-blue-800 border-blue-200",
  assistant: "bg-yellow-100 text-yellow-800 border-yellow-200",
  decision_maker: "bg-red-100 text-red-800 border-red-200",
  influencer: "bg-purple-100 text-purple-800 border-purple-200",
  gatekeeper: "bg-orange-100 text-orange-800 border-orange-200"
};

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200"
};

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
  former: "bg-red-100 text-red-800 border-red-200",
  prospect: "bg-blue-100 text-blue-800 border-blue-200"
};

const relationshipColors = {
  key_contact: "bg-purple-100 text-purple-800 border-purple-200",
  regular: "bg-blue-100 text-blue-800 border-blue-200",
  minimal: "bg-gray-100 text-gray-800 border-gray-200",
  problematic: "bg-red-100 text-red-800 border-red-200"
};

export function ContactProfileModal({ contact, open, onOpenChange }: ContactProfileModalProps) {
  const [newNote, setNewNote] = useState("");
  const [userPriority, setUserPriority] = useState(contact.userPriority || 'medium');
  const [userStatus, setUserStatus] = useState(contact.userStatus || 'prospect');
  const [userRelationship, setUserRelationship] = useState(contact.userRelationship || 'regular');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getOrganizationBadge = () => {
    if (contact.clientId) {
      return <Badge className={organizationTypeColors.client}>CLIENT</Badge>;
    } else if (contact.legislatorId) {
      return <Badge className={organizationTypeColors.legislator}>LEGISLATOR</Badge>;
    } else if (contact.organizationType === 'government') {
      return <Badge className={organizationTypeColors.government}>GOVERNMENT</Badge>;
    } else {
      return <Badge className={organizationTypeColors.other}>OTHER</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-indigo-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {contact.fullName}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {contact.role} • {contact.organizationName}
                <div className="mt-1">
                  {getOrganizationBadge()}
                  {contact.relationshipType && (
                    <Badge className={relationshipTypeColors[contact.relationshipType]} style={{ marginLeft: '8px' }}>
                      {contact.relationshipType.replace('_', ' ').toUpperCase()}
                    </Badge>
                  )}
                </div>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {contact.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">{contact.phone}</span>
                  </div>
                )}
                {contact.mobile && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">{contact.mobile} (Mobile)</span>
                  </div>
                )}
                {contact.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">{contact.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Organization Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm">Organization Type:</span>
                  <div className="mt-1">{getOrganizationBadge()}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Organization:</span>
                  <p className="font-medium">{contact.organizationName}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Role:</span>
                  <p className="font-medium">{contact.role}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Relationship Type:</span>
                  <div className="mt-1">
                    {contact.relationshipType && (
                      <Badge className={relationshipTypeColors[contact.relationshipType]}>
                        {contact.relationshipType.replace('_', ' ').toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Influence & Network Analysis */}
          {contact.influence && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Influence & Network Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-900">
                      {contact.influence.influenceLevel.toUpperCase()}
                    </div>
                    <div className="text-sm text-purple-700">Influence Level</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-900">
                      {contact.influence.decisionMakingPower.toUpperCase()}
                    </div>
                    <div className="text-sm text-blue-700">Decision Power</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-900">
                      {contact.influence.accessLevel.toUpperCase()}
                    </div>
                    <div className="text-sm text-green-700">Access Level</div>
                  </div>
                </div>
                {contact.influence.keyInfluenceAreas && contact.influence.keyInfluenceAreas.length > 0 && (
                  <div className="mt-4">
                    <span className="text-gray-500 text-sm">Key Influence Areas:</span>
                    <div className="mt-1">
                      {contact.influence.keyInfluenceAreas.map((area) => (
                        <Badge key={area} variant="secondary" className="mr-2 mb-1">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Connections Network */}
          {contact.connections && contact.connections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Network Connections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contact.connections.map((connection) => (
                    <div key={connection.id} className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900">
                            {connection.connectionType.replace('_', ' ').toUpperCase()}
                          </span>
                          <Badge 
                            className={`ml-2 ${
                              connection.relationshipStrength === 'strong' ? 'bg-green-100 text-green-800' :
                              connection.relationshipStrength === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {connection.relationshipStrength.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(connection.createdAt)}</span>
                      </div>
                      {connection.description && (
                        <p className="text-sm text-gray-600 mt-1">{connection.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* User Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Contact Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Priority Level</label>
                  <Select value={userPriority} onValueChange={(value) => setUserPriority(value as 'high' | 'medium' | 'low')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <Select value={userStatus} onValueChange={(value) => setUserStatus(value as 'active' | 'inactive' | 'former' | 'prospect')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="former">Former</SelectItem>
                      <SelectItem value="prospect">Prospect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Relationship</label>
                  <Select value={userRelationship} onValueChange={(value) => setUserRelationship(value as 'key_contact' | 'regular' | 'minimal' | 'problematic')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="key_contact">Key Contact</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="problematic">Problematic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge className={priorityColors[userPriority as keyof typeof priorityColors]}>
                    {userPriority.toUpperCase()} PRIORITY
                  </Badge>
                  <Badge className={statusColors[userStatus as keyof typeof statusColors]}>
                    {userStatus.toUpperCase()}
                  </Badge>
                  <Badge className={relationshipColors[userRelationship as keyof typeof relationshipColors]}>
                    {userRelationship.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contact Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Current Tags:</span>
                    <div className="mt-1">
                      {contact.userTags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="mr-2 mb-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add tag..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <Button size="sm">Add</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Contact Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Note */}
              <div>
                <Textarea
                  placeholder="Add notes about this contact..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button className="mt-2" disabled={!newNote.trim()}>
                  Add Note
                </Button>
              </div>

              {/* Existing Notes */}
              {contact.userNotes && contact.userNotes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Contact Notes</h4>
                  {contact.userNotes.map((note) => (
                    <div key={note.id} className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-900">{note.content}</p>
                      <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                        <span>By {note.author}</span>
                        <span>{formatDateTime(note.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
