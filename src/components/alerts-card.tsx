"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  FileText,
  Users,
  Shield,
  X,
  RefreshCw
} from "lucide-react";

interface Alert {
  id: string;
  type: 'position_change' | 'deadline' | 'client_followup' | 'system' | 'compliance';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  isRead: boolean;
  actionRequired?: boolean;
  relatedId?: string; // ID of related bill, client, etc.
}

const alertTypeColors = {
  position_change: "bg-blue-100 text-blue-800 border-blue-200",
  deadline: "bg-red-100 text-red-800 border-red-200",
  client_followup: "bg-yellow-100 text-yellow-800 border-yellow-200",
  system: "bg-gray-100 text-gray-800 border-gray-200",
  compliance: "bg-purple-100 text-purple-800 border-purple-200"
};

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200"
};

export function AlertsCard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load alerts from localStorage on mount
  useEffect(() => {
    const storedAlerts = localStorage.getItem('dashboardAlerts');
    if (storedAlerts) {
      try {
        const parsed = JSON.parse(storedAlerts);
        setAlerts(parsed);
      } catch (error) {
        console.error('Error parsing stored alerts:', error);
        // Initialize with sample alerts if none exist
        initializeSampleAlerts();
      }
    } else {
      initializeSampleAlerts();
    }
  }, []);

  // Save alerts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dashboardAlerts', JSON.stringify(alerts));
  }, [alerts]);

  const initializeSampleAlerts = () => {
    const sampleAlerts: Alert[] = [
      {
        id: 'alert-1',
        type: 'position_change',
        title: 'Position Change Required',
        message: 'HB00-000 (Littlebird Users Bill) position needs compliance update',
        priority: 'high',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        isRead: false,
        actionRequired: true,
        relatedId: 'bill-hb00-000'
      },
      {
        id: 'alert-2',
        type: 'client_followup',
        title: 'Client Follow-up Needed',
        message: 'TechCorp Colorado requires follow-up within 48 hours',
        priority: 'medium',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        isRead: false,
        actionRequired: true,
        relatedId: 'client-techcorp-colorado'
      },
      {
        id: 'alert-3',
        type: 'deadline',
        title: 'Compliance Deadline Approaching',
        message: 'Quarterly lobbying report due in 3 days',
        priority: 'high',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        isRead: false,
        actionRequired: true,
        relatedId: 'deadline-quarterly-report'
      },
      {
        id: 'alert-4',
        type: 'system',
        title: 'Data Sync Available',
        message: 'New Colorado legislative data is available for import',
        priority: 'low',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        isRead: true,
        actionRequired: false
      }
    ];
    setAlerts(sampleAlerts);
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, isRead: true }
          : alert
      )
    );
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
  };

  const refreshAlerts = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, this would fetch new alerts from the backend
      console.log('Refreshing alerts...');
    }, 1000);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'position_change':
        return <FileText className="h-4 w-4" />;
      case 'deadline':
        return <Clock className="h-4 w-4" />;
      case 'client_followup':
        return <Users className="h-4 w-4" />;
      case 'compliance':
        return <Shield className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now.getTime() - alertTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const highPriorityCount = alerts.filter(alert => alert.priority === 'high' && !alert.isRead).length;

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alerts & Notifications
            </CardTitle>
            <CardDescription>
              Recent activity and important updates
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge className="bg-red-100 text-red-800 border-red-200">
                {unreadCount} unread
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={refreshAlerts}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Alert Summary */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-900">{highPriorityCount}</div>
              <div className="text-sm text-red-700">High Priority</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">{unreadCount}</div>
              <div className="text-sm text-blue-700">Unread</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{alerts.length}</div>
              <div className="text-sm text-gray-700">Total</div>
            </div>
          </div>

          {/* Action Buttons */}
          {unreadCount > 0 && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={markAllAsRead}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          )}

          {/* Alerts List */}
          {alerts.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 border rounded-lg transition-all ${
                      alert.isRead 
                        ? 'bg-gray-50 border-gray-200' 
                        : alert.priority === 'high'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getAlertIcon(alert.type)}
                          <h4 className={`font-medium ${alert.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                            {alert.title}
                          </h4>
                          {!alert.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={alertTypeColors[alert.type]}>
                            {alert.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={priorityColors[alert.priority]}>
                            {alert.priority.toUpperCase()}
                          </Badge>
                          {alert.actionRequired && (
                            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                              ACTION REQUIRED
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm ${alert.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimestamp(alert.timestamp)}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-3">
                        {!alert.isRead && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(alert.id)}
                            className="h-8 w-8 p-0"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => dismissAlert(alert.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No alerts at this time</p>
              <p className="text-sm">You&apos;re all caught up!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
