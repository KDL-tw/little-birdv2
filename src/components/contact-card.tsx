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
  Users
} from "lucide-react";
import { Contact } from "@/lib/types";
import { ContactProfileModal } from "./contact-profile-modal";

interface ContactCardProps {
  contact: Contact;
  onDelete: (contactId: string) => void;
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

export function ContactCard({ contact, onDelete }: ContactCardProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(contact.id);
    setShowDeleteConfirm(false);
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
    <>
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Contact Avatar */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-indigo-600" />
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => setShowProfile(true)}
                >
                  {contact.fullName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {getOrganizationBadge()}
                  {contact.relationshipType && (
                    <Badge className={relationshipTypeColors[contact.relationshipType]}>
                      {contact.relationshipType.replace('_', ' ').toUpperCase()}
                    </Badge>
                  )}
                  {contact.role && (
                    <span className="text-sm text-gray-600">{contact.role}</span>
                  )}
                </div>
                
                {/* Organization Info */}
                <div className="mt-1">
                  {contact.organizationName && (
                    <span className="text-sm text-gray-500">
                      {contact.organizationType === 'client' && 'Client: '}
                      {contact.organizationType === 'legislator' && 'Office: '}
                      {contact.organizationName}
                    </span>
                  )}
                </div>
                
                {/* User Tags */}
                {contact.userTags && contact.userTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {contact.userTags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {contact.userTags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{contact.userTags.length - 3}
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
            {contact.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 truncate">{contact.email}</span>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{contact.phone}</span>
              </div>
            )}
            {contact.mobile && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{contact.mobile}</span>
              </div>
            )}
            {contact.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{contact.address}</span>
              </div>
            )}
          </div>

          {/* Influence Level */}
          {contact.influence && (
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
              <Users className="h-4 w-4 text-purple-600" />
              <div className="flex-1">
                <span className="text-sm font-medium text-purple-900">
                  {contact.influence.influenceLevel.toUpperCase()} INFLUENCE
                </span>
                <p className="text-xs text-purple-700">
                  {contact.influence.decisionMakingPower} decision power • {contact.influence.accessLevel} access
                </p>
              </div>
            </div>
          )}

          {/* User Status & Priority */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              {contact.userStatus && (
                <Badge className={statusColors[contact.userStatus]}>
                  {contact.userStatus.toUpperCase()}
                </Badge>
              )}
              {contact.userPriority && (
                <Badge className={priorityColors[contact.userPriority]}>
                  {contact.userPriority.toUpperCase()} PRIORITY
                </Badge>
              )}
              {contact.userRelationship && (
                <Badge className={relationshipColors[contact.userRelationship]}>
                  {contact.userRelationship.replace('_', ' ').toUpperCase()}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {contact.connections?.length || 0} connections
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Profile Modal */}
      <ContactProfileModal
        contact={contact}
        open={showProfile}
        onOpenChange={setShowProfile}
      />

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Contact</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{contact.fullName}&quot; from your contacts? 
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
                Delete Contact
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
