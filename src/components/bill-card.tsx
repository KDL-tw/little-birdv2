"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Calendar, 
  User, 
  Building2, 
  Trash2,
  Target,
  AlertTriangle
} from "lucide-react";
import { Bill, LobbyingPosition } from "@/lib/types";
import { BillProfileModal } from "./bill-profile-modal";

interface BillCardProps {
  bill: Bill;
  onDelete: (billId: string) => void;
  onPositionChange: (billId: string, position: LobbyingPosition) => void;
}

const statusColors = {
  introduced: "bg-blue-100 text-blue-800 border-blue-200",
  in_committee: "bg-yellow-100 text-yellow-800 border-yellow-200",
  passed_house: "bg-green-100 text-green-800 border-green-200",
  passed_senate: "bg-green-100 text-green-800 border-green-200",
  conference_committee: "bg-purple-100 text-purple-800 border-purple-200",
  passed_both: "bg-emerald-100 text-emerald-800 border-emerald-200",
  signed_by_governor: "bg-emerald-100 text-emerald-800 border-emerald-200",
  became_law: "bg-emerald-100 text-emerald-800 border-emerald-200",
  vetoed: "bg-red-100 text-red-800 border-red-200",
  failed: "bg-gray-100 text-gray-800 border-gray-200",
  withdrawn: "bg-gray-100 text-gray-800 border-gray-200"
};

const positionColors = {
  support: "bg-green-100 text-green-800 border-green-200",
  oppose: "bg-red-100 text-red-800 border-red-200",
  monitor: "bg-blue-100 text-blue-800 border-blue-200",
  neutral: "bg-gray-100 text-gray-800 border-gray-200",
  amend: "bg-yellow-100 text-yellow-800 border-yellow-200"
};

const chamberLabels = {
  house: "House",
  senate: "Senate"
};

const billTypeLabels = {
  house_bill: "House Bill",
  senate_bill: "Senate Bill",
  house_joint_resolution: "House Joint Resolution",
  senate_joint_resolution: "Senate Joint Resolution",
  house_concurrent_resolution: "House Concurrent Resolution",
  senate_concurrent_resolution: "Senate Concurrent Resolution"
};

export function BillCard({ bill, onDelete, onPositionChange }: BillCardProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(bill.id);
    setShowDeleteConfirm(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
            <div className="flex-1">
              <CardTitle 
                className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-indigo-600 transition-colors"
                onClick={() => setShowProfile(true)}
              >
                {bill.billNumber}: {bill.title}
              </CardTitle>
              <CardDescription 
                className="text-gray-600 line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors"
                onClick={() => setShowProfile(true)}
              >
                {bill.description}
              </CardDescription>
            </div>
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

        <CardContent className="space-y-4">
          {/* Bill Info Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{chamberLabels[bill.chamber]}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{billTypeLabels[bill.billType]}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{bill.sponsor}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{formatDate(bill.lastActionDate)}</span>
            </div>
          </div>

          {/* Issue and Status */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-500">Issue: </span>
              <span className="text-sm font-medium text-gray-900">{bill.issue}</span>
            </div>
            <Badge className={statusColors[bill.status]}>
              {bill.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>


          {/* Position and Client */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              {bill.position && (
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <Badge className={positionColors[bill.position]}>
                    {bill.position.toUpperCase()}
                  </Badge>
                </div>
              )}
              {bill.clientId && (
                <span className="text-sm text-gray-600">Client assigned</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {bill.progress.length} progress updates
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bill Profile Modal */}
      <BillProfileModal
        bill={bill}
        open={showProfile}
        onOpenChange={setShowProfile}
        onPositionChange={onPositionChange}
      />

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Bill</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{bill.billNumber}: {bill.title}&quot;? 
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
                Delete Bill
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
