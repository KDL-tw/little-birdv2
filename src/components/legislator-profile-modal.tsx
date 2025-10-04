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
import Image from "next/image";
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
  Building2,
  MessageSquare,
  Brain,
  BarChart3,
  Users,
  Target,
  FileText,
  Globe
} from "lucide-react";
import { Legislator } from "@/lib/types";

interface LegislatorProfileModalProps {
  legislator: Legislator;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const partyColors = {
  democrat: "bg-blue-100 text-blue-800 border-blue-200",
  republican: "bg-red-100 text-red-800 border-red-200",
  independent: "bg-purple-100 text-purple-800 border-purple-200",
  unaffiliated: "bg-gray-100 text-gray-800 border-gray-200",
  swing: "bg-yellow-100 text-yellow-800 border-yellow-200"
};

const chamberLabels = {
  house: "House",
  senate: "Senate"
};

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200"
};

const relationshipColors = {
  ally: "bg-green-100 text-green-800 border-green-200",
  neutral: "bg-gray-100 text-gray-800 border-gray-200",
  opponent: "bg-red-100 text-red-800 border-red-200",
  unknown: "bg-blue-100 text-blue-800 border-blue-200"
};

export function LegislatorProfileModal({ legislator, open, onOpenChange }: LegislatorProfileModalProps) {
  const [newNote, setNewNote] = useState("");
  const [userPriority, setUserPriority] = useState(legislator.userPriority || 'medium');
  const [userRelationship, setUserRelationship] = useState(legislator.userRelationship || 'unknown');

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {legislator.profileImage ? (
                <Image 
                  src={legislator.profileImage} 
                  alt={legislator.fullName}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-gray-500" />
              )}
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {legislator.fullName}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {chamberLabels[legislator.chamber]} • {legislator.district} • {legislator.party.toUpperCase()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{legislator.email}</span>
                </div>
                {legislator.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">{legislator.phone}</span>
                  </div>
                )}
                {legislator.office && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">{legislator.office}</span>
                  </div>
                )}
                {legislator.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a href={legislator.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                      Official Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Legislative Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm">Term:</span>
                  <p className="font-medium">{formatDate(legislator.termStart)} - {legislator.termEnd ? formatDate(legislator.termEnd) : 'Present'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Committees:</span>
                  <div className="mt-1">
                    {legislator.committeeAssignments.map((committee) => (
                      <Badge key={committee} variant="outline" className="mr-2 mb-1">
                        {committee}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Bills Sponsored:</span>
                  <p className="font-medium">{legislator.billsSponsored.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Intelligence Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Psychographics */}
            {legislator.psychographics && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Psychographics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-gray-500 text-sm">Communication Style:</span>
                    <p className="font-medium">{legislator.psychographics.communicationStyle?.replace('-', ' ').toUpperCase()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Decision Making:</span>
                    <p className="font-medium">{legislator.psychographics.decisionMakingStyle?.replace('-', ' ').toUpperCase()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Key Issues:</span>
                    <div className="mt-1">
                      {legislator.psychographics.keyIssues?.map((issue) => (
                        <Badge key={issue} variant="secondary" className="mr-2 mb-1">
                          {issue}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Personality Traits:</span>
                    <div className="mt-1">
                      {legislator.psychographics.personalityTraits?.map((trait) => (
                        <Badge key={trait} variant="outline" className="mr-2 mb-1">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* District Data */}
            {legislator.districtData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    District Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Population:</span>
                      <p className="font-medium">{legislator.districtData.population.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Median Age:</span>
                      <p className="font-medium">{legislator.districtData.demographics.medianAge}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Median Income:</span>
                      <p className="font-medium">${legislator.districtData.demographics.medianIncome.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Area Type:</span>
                      <p className="font-medium">{legislator.districtData.demographics.urbanRural.toUpperCase()}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Key Industries:</span>
                    <div className="mt-1">
                      {legislator.districtData.keyIndustries.map((industry) => (
                        <Badge key={industry} variant="secondary" className="mr-2 mb-1">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Political Lean:</span>
                    <Badge className={partyColors[legislator.districtData.politicalLean]}>
                      {legislator.districtData.politicalLean.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* User Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  User Management
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
                  <label className="text-sm text-gray-500">Relationship</label>
                  <Select value={userRelationship} onValueChange={(value) => setUserRelationship(value as 'ally' | 'neutral' | 'opponent' | 'unknown')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ally">Ally</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="opponent">Opponent</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Badge className={priorityColors[userPriority as keyof typeof priorityColors]}>
                    {userPriority.toUpperCase()} PRIORITY
                  </Badge>
                  <Badge className={relationshipColors[userRelationship as keyof typeof relationshipColors]}>
                    {userRelationship.toUpperCase()}
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
                      {legislator.userTags?.map((tag) => (
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
                Notes & Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Note */}
              <div>
                <Textarea
                  placeholder="Add intelligence notes about this legislator..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button className="mt-2" disabled={!newNote.trim()}>
                  Add Note
                </Button>
              </div>

              {/* Existing Notes */}
              {legislator.userNotes && legislator.userNotes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Intelligence Notes</h4>
                  {legislator.userNotes.map((note) => (
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

          {/* Bio */}
          {legislator.bio && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Biography
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{legislator.bio}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
