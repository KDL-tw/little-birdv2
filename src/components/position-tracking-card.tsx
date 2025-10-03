"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  ExternalLink,
  Calendar
} from "lucide-react";
import { PositionChange } from "@/lib/types";

interface PositionTrackingCardProps {
  positionChanges: PositionChange[];
}

const complianceStatusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  overdue: "bg-red-100 text-red-800 border-red-200"
};

const positionColors = {
  support: "bg-green-100 text-green-800 border-green-200",
  oppose: "bg-red-100 text-red-800 border-red-200",
  monitor: "bg-blue-100 text-blue-800 border-blue-200",
  neutral: "bg-gray-100 text-gray-800 border-gray-200",
  amend: "bg-yellow-100 text-yellow-800 border-yellow-200"
};

export function PositionTrackingCard({ positionChanges }: PositionTrackingCardProps) {
  const [localChanges, setLocalChanges] = useState<PositionChange[]>(positionChanges);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('positionChanges');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLocalChanges(parsed);
      } catch (error) {
        console.error('Error parsing stored position changes:', error);
      }
    }
  }, []);

  // Save to localStorage whenever changes
  useEffect(() => {
    localStorage.setItem('positionChanges', JSON.stringify(localChanges));
  }, [localChanges]);

  const markAsCompleted = (changeId: string) => {
    setLocalChanges(prev => 
      prev.map(change => 
        change.id === changeId 
          ? { ...change, complianceStatus: 'completed' as const }
          : change
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

  const getDaysUntilDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const pendingChanges = localChanges.filter(change => change.complianceStatus === 'pending');
  const overdueChanges = localChanges.filter(change => change.complianceStatus === 'overdue');

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Position Change Compliance
        </CardTitle>
        <CardDescription>
          Track recent position changes that require online updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-900">{pendingChanges.length}</div>
              <div className="text-sm text-yellow-700">Pending</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-900">{overdueChanges.length}</div>
              <div className="text-sm text-red-700">Overdue</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">
                {localChanges.filter(c => c.complianceStatus === 'completed').length}
              </div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
          </div>

          {/* Position Changes List */}
          {localChanges.length > 0 ? (
            <div className="space-y-3">
              {localChanges.map((change) => {
                const daysUntilDeadline = change.complianceDeadline ? getDaysUntilDeadline(change.complianceDeadline) : 0;
                const isOverdue = daysUntilDeadline < 0;
                
                return (
                  <div key={change.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{change.billNumber}: {change.billTitle}</h4>
                          {getStatusIcon(change.complianceStatus)}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          {change.previousPosition && (
                            <Badge variant="outline" className="text-xs">
                              From: {change.previousPosition.toUpperCase()}
                            </Badge>
                          )}
                          <Badge className={positionColors[change.newPosition]}>
                            To: {change.newPosition.toUpperCase()}
                          </Badge>
                          <Badge className={complianceStatusColors[change.complianceStatus]}>
                            {change.complianceStatus.toUpperCase()}
                          </Badge>
                        </div>
                        {change.clientName && (
                          <p className="text-sm text-gray-600 mb-1">
                            Client: {change.clientName}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          Changed by {change.changedBy} • {formatDate(change.changedAt)}
                        </p>
                      </div>
                    </div>

                    {/* Compliance Deadline */}
                    {change.complianceDeadline && (
                      <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-900">
                            Compliance Deadline: {formatDate(change.complianceDeadline)}
                          </span>
                          {isOverdue && (
                            <Badge className="bg-red-100 text-red-800 border-red-200">
                              {Math.abs(daysUntilDeadline)} days overdue
                            </Badge>
                          )}
                          {!isOverdue && daysUntilDeadline <= 2 && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              {daysUntilDeadline} days left
                            </Badge>
                          )}
                        </div>
                        {change.complianceStatus === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => markAsCompleted(change.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    {change.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        {change.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No recent position changes</p>
              <p className="text-sm">Position changes from bills will appear here</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <Button variant="outline" className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              View All Bills
            </Button>
            <Button variant="outline" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Compliance Guide
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
