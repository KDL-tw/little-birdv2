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
  FileText,
  Building2,
  DollarSign,
  Target,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Users
} from "lucide-react";
import { Bill, LobbyingPosition } from "@/lib/types";

interface BillProfileModalProps {
  bill: Bill;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function BillProfileModal({ bill, open, onOpenChange, onPositionChange }: BillProfileModalProps) {
  const [selectedPosition, setSelectedPosition] = useState<LobbyingPosition | undefined>(bill.position);
  const [newNote, setNewNote] = useState("");
  const [showComplianceNotice, setShowComplianceNotice] = useState(false);

  const handlePositionChange = (position: LobbyingPosition) => {
    setSelectedPosition(position);
    setShowComplianceNotice(true);
    onPositionChange(bill.id, position);
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
          <DialogTitle className="text-xl font-bold text-gray-900">
            {bill.billNumber}: {bill.title}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {bill.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Compliance Notice */}
          {showComplianceNotice && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <div>
                    <h4 className="font-medium text-amber-900">Compliance Notice</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Position updated to &quot;{selectedPosition?.toUpperCase()}&quot;. 
                      Remember to update your public lobbying position online within 5 business days.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowComplianceNotice(false)}
                    className="ml-auto"
                  >
                    Dismiss
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bill Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Bill Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Chamber:</span>
                    <p className="font-medium">{chamberLabels[bill.chamber]}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <p className="font-medium">{billTypeLabels[bill.billType]}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Issue:</span>
                    <p className="font-medium">{bill.issue}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <Badge className={statusColors[bill.status]}>
                      {bill.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
                {bill.committee && (
                  <div>
                    <span className="text-gray-500 text-sm">Committee:</span>
                    <p className="font-medium">{bill.committee}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Sponsors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm">Primary Sponsor:</span>
                  <p className="font-medium">{bill.sponsor}</p>
                </div>
                {bill.coSponsors.length > 0 && (
                  <div>
                    <span className="text-gray-500 text-sm">Co-Sponsors:</span>
                    <div className="mt-1">
                      {bill.coSponsors.map((sponsor, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-1">
                          {sponsor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Fiscal Notes */}
          {bill.fiscalNoteHistory && bill.fiscalNoteHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Fiscal Note History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bill.fiscalNoteHistory.map((note) => (
                    <div key={note.id} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-amber-900">
                          {formatCurrency(note.amount || 0)}
                        </span>
                        <span className="text-sm text-amber-700">{note.agency}</span>
                      </div>
                      <p className="text-sm text-amber-800">{note.description}</p>
                      <p className="text-xs text-amber-600 mt-1">
                        Effective: {formatDate(note.effectiveDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bill Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Bill Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bill.progress.map((progress) => (
                  <div key={progress.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{progress.description}</span>
                        <span className="text-sm text-gray-500">{formatDate(progress.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {chamberLabels[progress.chamber]}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {progress.stage.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Client Attribution & Position */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Client Attribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No client assigned</SelectItem>
                    <SelectItem value="client-1">Tech Industry Coalition</SelectItem>
                    <SelectItem value="client-2">Healthcare Alliance</SelectItem>
                    <SelectItem value="client-3">Environmental Group</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Lobbying Position
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedPosition}
                  onValueChange={(value) => handlePositionChange(value as LobbyingPosition)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="oppose">Oppose</SelectItem>
                    <SelectItem value="monitor">Monitor</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="amend">Amend</SelectItem>
                  </SelectContent>
                </Select>
                {selectedPosition && (
                  <Badge className={`${positionColors[selectedPosition]} mt-2`}>
                    Current Position: {selectedPosition.toUpperCase()}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Notes Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Notes & History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Note */}
              <div>
                <Textarea
                  placeholder="Add a note about this bill..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button className="mt-2" disabled={!newNote.trim()}>
                  Add Note
                </Button>
              </div>

              {/* Existing Notes */}
              {bill.notes && bill.notes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Previous Notes</h4>
                  {bill.notes.map((note) => (
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
