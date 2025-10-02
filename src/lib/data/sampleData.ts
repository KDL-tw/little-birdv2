import { Bill } from '../types';

// Sample bill data for HB00-000 "Littlebird Users Bill"
export const sampleBill: Bill = {
  id: 'bill-hb00-000',
  title: 'Littlebird Users Bill',
  description: 'A comprehensive bill to establish standards for political intelligence platforms and lobbying transparency in Colorado.',
  billNumber: 'HB00-000',
  billType: 'house_bill',
  status: 'in_committee',
  sponsor: 'Rep. Jane Smith',
  coSponsors: ['Rep. John Doe', 'Rep. Sarah Johnson'],
  introducedDate: '2025-01-15',
  lastActionDate: '2025-01-28',
  chamber: 'house',
  committee: 'House State, Veterans, & Military Affairs',
  issue: 'Government Transparency & Technology',
  tags: ['transparency', 'technology', 'lobbying', 'government'],
  progress: [
    {
      id: 'progress-1',
      billId: 'bill-hb00-000',
      stage: 'introduced',
      date: '2025-01-15',
      description: 'Bill introduced in House',
      chamber: 'house'
    },
    {
      id: 'progress-2',
      billId: 'bill-hb00-000',
      stage: 'in_committee',
      date: '2025-01-22',
      description: 'Referred to House State, Veterans, & Military Affairs Committee',
      chamber: 'house'
    }
  ],
  fiscalNote: {
    id: 'fiscal-1',
    billId: 'bill-hb00-000',
    amount: 250000,
    description: 'Implementation of digital transparency platform and staff training',
    effectiveDate: '2025-07-01',
    agency: 'Department of State',
    createdAt: '2025-01-20T10:00:00Z'
  },
  fiscalNoteHistory: [
    {
      id: 'fiscal-1',
      billId: 'bill-hb00-000',
      amount: 250000,
      description: 'Implementation of digital transparency platform and staff training',
      effectiveDate: '2025-07-01',
      agency: 'Department of State',
      createdAt: '2025-01-20T10:00:00Z'
    }
  ],
  summary: 'This bill establishes requirements for political intelligence platforms to maintain transparency standards and provides guidelines for lobbying activity reporting.',
  position: 'monitor',
  clientId: undefined,
  notes: [
    {
      id: 'note-1',
      billId: 'bill-hb00-000',
      content: 'Initial review completed. Bill aligns with industry best practices for transparency.',
      author: 'System Admin',
      createdAt: '2025-01-16T09:00:00Z',
      updatedAt: '2025-01-16T09:00:00Z'
    }
  ],
  createdAt: '2025-01-15T08:00:00Z',
  updatedAt: '2025-01-28T14:30:00Z'
};

export const sampleBills: Bill[] = [sampleBill];
