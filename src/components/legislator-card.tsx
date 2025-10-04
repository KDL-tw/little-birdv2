"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Trash2,
  AlertTriangle,
  Calendar
} from "lucide-react";
import Image from "next/image";
import { Legislator } from "@/lib/types";
import { LegislatorProfileModal } from "./legislator-profile-modal";

interface LegislatorCardProps {
  legislator: Legislator;
  onDelete: (legislatorId: string) => void;
}

const partyColors = {
  democrat: "bg-blue-100 text-blue-800 border-blue-200",
  republican: "bg-red-100 text-red-800 border-red-200",
  independent: "bg-purple-100 text-purple-800 border-purple-200",
  unaffiliated: "bg-gray-100 text-gray-800 border-gray-200"
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

export function LegislatorCard({ legislator, onDelete }: LegislatorCardProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(legislator.id);
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Headshot */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {legislator.profileImage ? (
                    <Image 
                      src={legislator.profileImage} 
                      alt={legislator.fullName}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => setShowProfile(true)}
                >
                  {legislator.fullName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={partyColors[legislator.party]}>
                    {legislator.party.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {chamberLabels[legislator.chamber]}
                  </Badge>
                  <span className="text-sm text-gray-600">{legislator.district}</span>
                </div>
                
                {/* User Tags */}
                {legislator.userTags && legislator.userTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {legislator.userTags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {legislator.userTags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{legislator.userTags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 truncate">{legislator.email}</span>
            </div>
            {legislator.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{legislator.phone}</span>
              </div>
            )}
            {legislator.office && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{legislator.office}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Since {formatDate(legislator.termStart)}</span>
            </div>
          </div>

          {/* Committees */}
          {legislator.committeeAssignments.length > 0 && (
            <div>
              <span className="text-sm text-gray-500">Committees:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {legislator.committeeAssignments.slice(0, 2).map((committee) => (
                  <Badge key={committee} variant="outline" className="text-xs">
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

          {/* User Priority & Relationship */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              {legislator.userPriority && (
                <div className="flex items-center gap-2">
                  <Badge className={priorityColors[legislator.userPriority]}>
                    {legislator.userPriority.toUpperCase()} PRIORITY
                  </Badge>
                </div>
              )}
              {legislator.userRelationship && (
                <Badge className={relationshipColors[legislator.userRelationship]}>
                  {legislator.userRelationship.toUpperCase()}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {legislator.billsSponsored.length} bills sponsored
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legislator Profile Modal */}
      <LegislatorProfileModal
        legislator={legislator}
        open={showProfile}
        onOpenChange={setShowProfile}
      />

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Legislator</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{legislator.fullName}&quot; from your roster? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Delete Legislator
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
