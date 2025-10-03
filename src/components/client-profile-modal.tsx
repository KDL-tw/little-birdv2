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
  Building2,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Users,
  Target,
  FileText,
  TrendingUp
} from "lucide-react";
import { Client } from "@/lib/types";

interface ClientProfileModalProps {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const clientTypeColors = {
  corporation: "bg-blue-100 text-blue-800 border-blue-200",
  nonprofit: "bg-green-100 text-green-800 border-green-200",
  trade_association: "bg-purple-100 text-purple-800 border-purple-200",
  union: "bg-orange-100 text-orange-800 border-orange-200",
  government_entity: "bg-gray-100 text-gray-800 border-gray-200",
  individual: "bg-pink-100 text-pink-800 border-pink-200",
  other: "bg-slate-100 text-slate-800 border-slate-200"
};

const companySizeColors = {
  startup: "bg-emerald-100 text-emerald-800 border-emerald-200",
  small: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  large: "bg-orange-100 text-orange-800 border-orange-200",
  enterprise: "bg-red-100 text-red-800 border-red-200"
};

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200"
};

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
  prospect: "bg-blue-100 text-blue-800 border-blue-200",
  former: "bg-red-100 text-red-800 border-red-200"
};

const relationshipColors = {
  strategic: "bg-purple-100 text-purple-800 border-purple-200",
  standard: "bg-blue-100 text-blue-800 border-blue-200",
  minimal: "bg-gray-100 text-gray-800 border-gray-200",
  problematic: "bg-red-100 text-red-800 border-red-200"
};

const valueColors = {
  high: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-gray-100 text-gray-800 border-gray-200"
};

export function ClientProfileModal({ client, open, onOpenChange }: ClientProfileModalProps) {
  const [newNote, setNewNote] = useState("");
  const [userPriority, setUserPriority] = useState(client.userPriority || 'medium');
  const [userStatus, setUserStatus] = useState(client.userStatus || 'prospect');
  const [userRelationship, setUserRelationship] = useState(client.userRelationship || 'standard');
  const [userValue, setUserValue] = useState(client.userValue || 'medium');

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
              <Building2 className="h-10 w-10 text-indigo-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {client.name}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {client.type.replace('_', ' ').toUpperCase()} • {client.industry}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <Badge className={clientTypeColors[client.type]}>
                      {client.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-500">Size:</span>
                    {client.companySize && (
                      <Badge className={companySizeColors[client.companySize]}>
                        {client.companySize.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-500">Industry:</span>
                    <p className="font-medium">{client.industry}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Founded:</span>
                    <p className="font-medium">{client.foundedYear}</p>
                  </div>
                </div>
                {client.headquarters && (
                  <div>
                    <span className="text-gray-500 text-sm">Headquarters:</span>
                    <p className="font-medium">{client.headquarters}</p>
                  </div>
                )}
                {client.website && (
                  <div>
                    <span className="text-gray-500 text-sm">Website:</span>
                    <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 ml-2">
                      {client.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {client.contactInfo?.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">{client.contactInfo.email}</span>
                  </div>
                )}
                {client.contactInfo?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">{client.contactInfo.phone}</span>
                  </div>
                )}
                {client.contactInfo?.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">{client.contactInfo.address}</span>
                  </div>
                )}
                {client.socialMedia && (
                  <div>
                    <span className="text-gray-500 text-sm">Social Media:</span>
                    <div className="mt-1">
                      {client.socialMedia.linkedin && (
                        <a href={client.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 mr-3">
                          LinkedIn
                        </a>
                      )}
                      {client.socialMedia.twitter && (
                        <a href={`https://twitter.com/${client.socialMedia.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                          Twitter
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* User Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Client Management
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
                  <Select value={userStatus} onValueChange={(value) => setUserStatus(value as 'active' | 'inactive' | 'prospect' | 'former')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="former">Former</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Relationship</label>
                  <Select value={userRelationship} onValueChange={(value) => setUserRelationship(value as 'strategic' | 'standard' | 'minimal' | 'problematic')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strategic">Strategic</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="problematic">Problematic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Client Value</label>
                  <Select value={userValue} onValueChange={(value) => setUserValue(value as 'high' | 'medium' | 'low')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Value</SelectItem>
                      <SelectItem value="medium">Medium Value</SelectItem>
                      <SelectItem value="low">Low Value</SelectItem>
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
                    {userRelationship.toUpperCase()}
                  </Badge>
                  <Badge className={valueColors[userValue as keyof typeof valueColors]}>
                    {userValue.toUpperCase()} VALUE
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Current Tags:</span>
                    <div className="mt-1">
                      {client.userTags?.map((tag) => (
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

          {/* Lobbying Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Lobbying Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">{client.billsLobbying.length}</div>
                  <div className="text-sm text-blue-700">Bills Tracked</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">{client.lobbyists.length}</div>
                  <div className="text-sm text-green-700">Assigned Lobbyists</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-900">{client.userNotes?.length || 0}</div>
                  <div className="text-sm text-purple-700">Notes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Client Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Note */}
              <div>
                <Textarea
                  placeholder="Add notes about this client..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button className="mt-2" disabled={!newNote.trim()}>
                  Add Note
                </Button>
              </div>

              {/* Existing Notes */}
              {client.userNotes && client.userNotes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Client Notes</h4>
                  {client.userNotes.map((note) => (
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

          {/* Description */}
          {client.description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Company Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{client.description}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
