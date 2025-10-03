"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Clock,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReportingDeadline } from "@/lib/types";

interface ReportingDeadlinesCardProps {
  deadlines: ReportingDeadline[];
}

const typeColors = {
  quarterly: "bg-blue-100 text-blue-800 border-blue-200",
  monthly: "bg-green-100 text-green-800 border-green-200",
  annual: "bg-purple-100 text-purple-800 border-purple-200",
  custom: "bg-gray-100 text-gray-800 border-gray-200"
};

export function ReportingDeadlinesCard({ deadlines }: ReportingDeadlinesCardProps) {
  const [localDeadlines, setLocalDeadlines] = useState<ReportingDeadline[]>(deadlines);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<ReportingDeadline | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('reportingDeadlines');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLocalDeadlines(parsed);
      } catch (error) {
        console.error('Error parsing stored deadlines:', error);
      }
    }
  }, []);

  // Save to localStorage whenever changes
  useEffect(() => {
    localStorage.setItem('reportingDeadlines', JSON.stringify(localDeadlines));
  }, [localDeadlines]);

  const addDeadline = (deadline: Omit<ReportingDeadline, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDeadline: ReportingDeadline = {
      ...deadline,
      id: `deadline-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setLocalDeadlines(prev => [...prev, newDeadline]);
    setShowAddDialog(false);
  };

  const updateDeadline = (id: string, updates: Partial<ReportingDeadline>) => {
    setLocalDeadlines(prev => 
      prev.map(deadline => 
        deadline.id === id 
          ? { ...deadline, ...updates, updatedAt: new Date().toISOString() }
          : deadline
      )
    );
    setEditingDeadline(null);
  };

  const handleEditSubmit = (data: Omit<ReportingDeadline, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingDeadline) {
      updateDeadline(editingDeadline.id, data);
    }
  };

  const deleteDeadline = (id: string) => {
    setLocalDeadlines(prev => prev.filter(deadline => deadline.id !== id));
  };

  const toggleActive = (id: string) => {
    updateDeadline(id, { isActive: !localDeadlines.find(d => d.id === id)?.isActive });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusIcon = (deadline: ReportingDeadline) => {
    const daysUntil = getDaysUntilDeadline(deadline.deadlineDate);
    if (daysUntil < 0) return <AlertTriangle className="h-4 w-4 text-red-600" />;
    if (daysUntil <= 7) return <Clock className="h-4 w-4 text-yellow-600" />;
    return <CheckCircle className="h-4 w-4 text-green-600" />;
  };

  const activeDeadlines = localDeadlines.filter(d => d.isActive);
  const upcomingDeadlines = activeDeadlines.filter(d => {
    const daysUntil = getDaysUntilDeadline(d.deadlineDate);
    return daysUntil >= 0 && daysUntil <= 30;
  });

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Global Reporting Deadlines
            </CardTitle>
            <CardDescription>
              Manage recurring reporting deadlines that persist month to month
            </CardDescription>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Deadline
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Reporting Deadline</DialogTitle>
                <DialogDescription>
                  Create a new recurring reporting deadline
                </DialogDescription>
              </DialogHeader>
              <DeadlineForm 
                onSubmit={addDeadline}
                onCancel={() => setShowAddDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">{activeDeadlines.length}</div>
              <div className="text-sm text-blue-700">Active</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-900">{upcomingDeadlines.length}</div>
              <div className="text-sm text-yellow-700">Upcoming (30d)</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-900">
                {activeDeadlines.filter(d => getDaysUntilDeadline(d.deadlineDate) < 0).length}
              </div>
              <div className="text-sm text-red-700">Overdue</div>
            </div>
          </div>

          {/* Deadlines List */}
          {localDeadlines.length > 0 ? (
            <div className="space-y-3">
              {localDeadlines
                .sort((a, b) => new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime())
                .map((deadline) => {
                  const daysUntil = getDaysUntilDeadline(deadline.deadlineDate);
                  const isOverdue = daysUntil < 0;
                  
                  return (
                    <div key={deadline.id} className={`p-4 border rounded-lg ${
                      isOverdue ? 'border-red-200 bg-red-50' :
                      daysUntil <= 7 ? 'border-yellow-200 bg-yellow-50' :
                      'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{deadline.name}</h4>
                            {getStatusIcon(deadline)}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={typeColors[deadline.type]}>
                              {deadline.type.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {deadline.frequency.toUpperCase()}
                            </Badge>
                            <Badge variant={deadline.isActive ? "default" : "secondary"}>
                              {deadline.isActive ? "ACTIVE" : "INACTIVE"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            Due: {formatDate(deadline.deadlineDate)}
                          </p>
                          {deadline.description && (
                            <p className="text-sm text-gray-600">{deadline.description}</p>
                          )}
                          {isOverdue && (
                            <p className="text-sm text-red-600 font-medium">
                              {Math.abs(daysUntil)} days overdue
                            </p>
                          )}
                          {!isOverdue && daysUntil <= 7 && (
                            <p className="text-sm text-yellow-600 font-medium">
                              {daysUntil} days remaining
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingDeadline(deadline)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleActive(deadline.id)}
                        >
                          {deadline.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteDeadline(deadline.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No reporting deadlines set</p>
              <p className="text-sm">Add your first deadline to get started</p>
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        {editingDeadline && (
          <Dialog open={!!editingDeadline} onOpenChange={() => setEditingDeadline(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Reporting Deadline</DialogTitle>
                <DialogDescription>
                  Update the deadline information
                </DialogDescription>
              </DialogHeader>
              <DeadlineForm 
                deadline={editingDeadline}
                onSubmit={handleEditSubmit}
                onCancel={() => setEditingDeadline(null)}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}

// Deadline Form Component
function DeadlineForm({ 
  deadline, 
  onSubmit, 
  onCancel 
}: { 
  deadline?: ReportingDeadline;
  onSubmit: (data: Omit<ReportingDeadline, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: deadline?.name || '',
    type: deadline?.type || 'quarterly',
    deadlineDate: deadline?.deadlineDate ? deadline.deadlineDate.split('T')[0] : '',
    frequency: deadline?.frequency || 'quarterly',
    description: deadline?.description || '',
    isActive: deadline?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-gray-500">Deadline Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          placeholder="e.g., Quarterly Lobbying Report"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-500">Type</label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as 'quarterly' | 'monthly' | 'annual' | 'custom' }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-gray-500">Frequency</label>
          <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value as 'monthly' | 'quarterly' | 'annually' | 'custom' }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-500">Deadline Date</label>
        <input
          type="date"
          value={formData.deadlineDate}
          onChange={(e) => setFormData(prev => ({ ...prev, deadlineDate: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-500">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          placeholder="Optional description..."
          rows={3}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
          className="rounded"
        />
        <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
          {deadline ? 'Update' : 'Add'} Deadline
        </Button>
      </div>
    </form>
  );
}
