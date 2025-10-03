import { PositionChange, ClientAging, ReportingDeadline, CalendarEvent } from '../types';

// Sample position changes (frontend stored)
export const samplePositionChanges: PositionChange[] = [
  {
    id: 'pos-change-1',
    billId: 'bill-hb00-000',
    billNumber: 'HB00-000',
    billTitle: 'Littlebird Users Bill',
    previousPosition: 'monitor',
    newPosition: 'support',
    changedBy: 'System Admin',
    changedAt: '2025-01-28T10:30:00Z',
    clientId: 'client-techcorp-colorado',
    clientName: 'TechCorp Colorado',
    complianceDeadline: '2025-02-02T23:59:59Z', // 5 business days
    complianceStatus: 'pending',
    notes: 'Client requested position change after reviewing bill details'
  },
  {
    id: 'pos-change-2',
    billId: 'bill-hb00-000',
    billNumber: 'HB00-000',
    billTitle: 'Littlebird Users Bill',
    previousPosition: undefined,
    newPosition: 'oppose',
    changedBy: 'System Admin',
    changedAt: '2025-01-27T14:15:00Z',
    clientId: undefined,
    clientName: undefined,
    complianceDeadline: '2025-02-01T23:59:59Z',
    complianceStatus: 'completed',
    notes: 'Position updated online within compliance window'
  }
];

// Sample client aging data (48-hour tracking)
export const sampleClientAging: ClientAging[] = [
  {
    id: 'aging-1',
    clientId: 'client-techcorp-colorado',
    clientName: 'TechCorp Colorado',
    addedAt: '2025-01-26T09:00:00Z',
    daysSinceAdded: 2,
    status: 'new',
    lastContact: '2025-01-28T14:30:00Z',
    priority: 'high'
  },
  {
    id: 'aging-2',
    clientId: 'client-new-startup',
    clientName: 'Denver Tech Startup',
    addedAt: '2025-01-27T11:30:00Z',
    daysSinceAdded: 1,
    status: 'new',
    lastContact: undefined,
    priority: 'medium'
  }
];

// Sample reporting deadlines (global, persistent)
export const sampleReportingDeadlines: ReportingDeadline[] = [
  {
    id: 'deadline-1',
    name: 'Quarterly Lobbying Report',
    type: 'quarterly',
    deadlineDate: '2025-03-31T23:59:59Z',
    frequency: 'quarterly',
    description: 'Colorado Secretary of State quarterly lobbying disclosure report',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'deadline-2',
    name: 'Monthly Client Billing',
    type: 'monthly',
    deadlineDate: '2025-02-28T23:59:59Z',
    frequency: 'monthly',
    description: 'Monthly client billing and activity reports',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'deadline-3',
    name: 'Annual Registration Renewal',
    type: 'annual',
    deadlineDate: '2025-12-31T23:59:59Z',
    frequency: 'annually',
    description: 'Annual lobbying registration renewal with state',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
];

// Sample calendar events
export const sampleCalendarEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'HB00-000 Position Deadline',
    date: '2025-02-02',
    type: 'position_change',
    description: 'Deadline to update position on Littlebird Users Bill online',
    priority: 'high',
    isCompleted: false
  },
  {
    id: 'event-2',
    title: 'TechCorp Colorado Check-in',
    date: '2025-02-05',
    type: 'client_reminder',
    description: 'Follow up with new client after 48-hour period',
    priority: 'medium',
    isCompleted: false
  },
  {
    id: 'event-3',
    title: 'Quarterly Lobbying Report Due',
    date: '2025-03-31',
    type: 'deadline',
    description: 'Colorado Secretary of State quarterly report deadline',
    priority: 'high',
    isCompleted: false
  }
];
