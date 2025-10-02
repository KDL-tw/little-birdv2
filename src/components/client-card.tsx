"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Trash2,
  AlertTriangle,
  Globe,
  Calendar,
  Users
} from "lucide-react";
import { Client } from "@/lib/types";
import { ClientProfileModal } from "./client-profile-modal";

interface ClientCardProps {
  client: Client;
  onDelete: (clientId: string) => void;
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

export function ClientCard({ client, onDelete }: ClientCardProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(client.id);
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
              {/* Company Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-indigo-600" />
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => setShowProfile(true)}
                >
                  {client.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={clientTypeColors[client.type]}>
                    {client.type.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {client.companySize && (
                    <Badge variant="outline" className="text-xs">
                      {client.companySize.toUpperCase()}
                    </Badge>
                  )}
                  {client.industry && (
                    <span className="text-sm text-gray-600">{client.industry}</span>
                  )}
                </div>
                
                {/* User Tags */}
                {client.userTags && client.userTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {client.userTags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {client.userTags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{client.userTags.length - 3}
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
            {client.contactInfo?.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 truncate">{client.contactInfo.email}</span>
              </div>
            )}
            {client.contactInfo?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{client.contactInfo.phone}</span>
              </div>
            )}
            {client.headquarters && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{client.headquarters}</span>
              </div>
            )}
            {client.foundedYear && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Founded {client.foundedYear}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {client.description && (
            <div>
              <span className="text-sm text-gray-500">Description:</span>
              <p className="text-sm text-gray-700 mt-1 line-clamp-2">{client.description}</p>
            </div>
          )}

          {/* User Status & Priority */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              {client.userStatus && (
                <Badge className={statusColors[client.userStatus]}>
                  {client.userStatus.toUpperCase()}
                </Badge>
              )}
              {client.userPriority && (
                <Badge className={priorityColors[client.userPriority]}>
                  {client.userPriority.toUpperCase()} PRIORITY
                </Badge>
              )}
              {client.userRelationship && (
                <Badge className={relationshipColors[client.userRelationship]}>
                  {client.userRelationship.toUpperCase()}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {client.billsLobbying.length} bills tracked
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Profile Modal */}
      <ClientProfileModal
        client={client}
        open={showProfile}
        onOpenChange={setShowProfile}
      />

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Client</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{client.name}&quot; from your client roster? 
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
                Delete Client
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
