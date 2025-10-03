"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Database, 
  Shield,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layout } from "@/components/layout";

interface UserSettings {
  // User Profile
  name: string;
  email: string;
  organization: string;
  role: string;
  
  // Notification Settings
  emailNotifications: boolean;
  positionChangeAlerts: boolean;
  deadlineReminders: boolean;
  clientFollowUpAlerts: boolean;
  reminderFrequency: 'immediate' | 'daily' | 'weekly';
  
  // Display Settings
  theme: 'light' | 'dark' | 'auto';
  defaultView: 'dashboard' | 'bills' | 'legislators' | 'clients';
  itemsPerPage: number;
  showAdvancedFeatures: boolean;
  
  // Data Settings
  autoSave: boolean;
  dataRetention: number; // days
  exportFormat: 'csv' | 'json' | 'pdf';
  
  // Compliance Settings
  complianceDeadlineBuffer: number; // days
  autoArchiveCompleted: boolean;
  requirePositionJustification: boolean;
}

const defaultSettings: UserSettings = {
  // User Profile
  name: '',
  email: '',
  organization: '',
  role: '',
  
  // Notification Settings
  emailNotifications: true,
  positionChangeAlerts: true,
  deadlineReminders: true,
  clientFollowUpAlerts: true,
  reminderFrequency: 'daily',
  
  // Display Settings
  theme: 'light',
  defaultView: 'dashboard',
  itemsPerPage: 25,
  showAdvancedFeatures: false,
  
  // Data Settings
  autoSave: true,
  dataRetention: 365,
  exportFormat: 'csv',
  
  // Compliance Settings
  complianceDeadlineBuffer: 5,
  autoArchiveCompleted: true,
  requirePositionJustification: false,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch {
        console.error('Error parsing saved settings');
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (hasChanges) {
      localStorage.setItem('userSettings', JSON.stringify(settings));
      setHasChanges(false);
    }
  }, [settings, hasChanges]);

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('userSettings', JSON.stringify(settings));
      setSaveStatus('success');
      setHasChanges(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'littlebird-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-amber-50/80 backdrop-blur-md border-b border-amber-200/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Settings className="h-8 w-8 text-indigo-600" />
              Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your account preferences and application settings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              Frontend Storage
            </Badge>
            <Button 
              onClick={saveSettings}
              disabled={!hasChanges || isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Categories */}
          <div className="lg:col-span-1">
            <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>Settings Categories</CardTitle>
                <CardDescription>Navigate between different setting groups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Palette className="h-4 w-4 mr-2" />
                  Display
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Compliance
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Settings */}
            <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Your personal and organizational details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Full Name</label>
                    <input
                      type="text"
                      value={settings.name}
                      onChange={(e) => updateSetting('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mt-1"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email Address</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateSetting('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mt-1"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Organization</label>
                    <input
                      type="text"
                      value={settings.organization}
                      onChange={(e) => updateSetting('organization', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mt-1"
                      placeholder="Your organization name"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Role</label>
                    <input
                      type="text"
                      value={settings.role}
                      onChange={(e) => updateSetting('role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mt-1"
                      placeholder="Your role/title"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Configure how and when you receive alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Email Notifications</label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Position Change Alerts</label>
                      <p className="text-sm text-gray-500">Alert when bill positions are modified</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.positionChangeAlerts}
                      onChange={(e) => updateSetting('positionChangeAlerts', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Deadline Reminders</label>
                      <p className="text-sm text-gray-500">Remind about upcoming compliance deadlines</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.deadlineReminders}
                      onChange={(e) => updateSetting('deadlineReminders', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Client Follow-up Alerts</label>
                      <p className="text-sm text-gray-500">Alert for new client follow-up requirements</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.clientFollowUpAlerts}
                      onChange={(e) => updateSetting('clientFollowUpAlerts', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Reminder Frequency</label>
                  <Select value={settings.reminderFrequency} onValueChange={(value) => updateSetting('reminderFrequency', value as 'immediate' | 'daily' | 'weekly')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="daily">Daily Summary</SelectItem>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Display Settings */}
            <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Display Preferences
                </CardTitle>
                <CardDescription>Customize the appearance and behavior of the interface</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Theme</label>
                    <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value as 'light' | 'dark' | 'auto')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto (System)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Default View</label>
                    <Select value={settings.defaultView} onValueChange={(value) => updateSetting('defaultView', value as 'dashboard' | 'bills' | 'legislators' | 'clients')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dashboard">Dashboard</SelectItem>
                        <SelectItem value="bills">Bills</SelectItem>
                        <SelectItem value="legislators">Legislators</SelectItem>
                        <SelectItem value="clients">Clients</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Items Per Page</label>
                    <Select value={settings.itemsPerPage.toString()} onValueChange={(value) => updateSetting('itemsPerPage', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Show Advanced Features</label>
                      <p className="text-sm text-gray-500">Display additional technical options</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.showAdvancedFeatures}
                      onChange={(e) => updateSetting('showAdvancedFeatures', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Settings */}
            <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance Settings
                </CardTitle>
                <CardDescription>Configure compliance tracking and deadline management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Deadline Buffer (Days)</label>
                    <input
                      type="number"
                      value={settings.complianceDeadlineBuffer}
                      onChange={(e) => updateSetting('complianceDeadlineBuffer', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mt-1"
                      min="1"
                      max="30"
                    />
                    <p className="text-xs text-gray-500 mt-1">Days before deadline to send reminders</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Export Format</label>
                    <Select value={settings.exportFormat} onValueChange={(value) => updateSetting('exportFormat', value as 'csv' | 'json' | 'pdf')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Auto-Archive Completed</label>
                      <p className="text-sm text-gray-500">Automatically archive completed compliance items</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.autoArchiveCompleted}
                      onChange={(e) => updateSetting('autoArchiveCompleted', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Require Position Justification</label>
                      <p className="text-sm text-gray-500">Require notes when changing bill positions</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.requirePositionJustification}
                      onChange={(e) => updateSetting('requirePositionJustification', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={resetSettings} variant="outline">
                Reset to Defaults
              </Button>
              <Button onClick={exportSettings} variant="outline">
                Export Settings
              </Button>
            </div>

            {/* Save Status */}
            {saveStatus === 'success' && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
                <CheckCircle className="h-4 w-4" />
                Settings saved successfully!
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                <AlertTriangle className="h-4 w-4" />
                Error saving settings. Please try again.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </Layout>
  );
}
