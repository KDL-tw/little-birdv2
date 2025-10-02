import { Client } from '../types';

// Sample client data for "TechCorp Colorado"
export const sampleClient: Client = {
  id: 'client-techcorp-colorado',
  name: 'TechCorp Colorado',
  type: 'corporation',
  description: 'Leading technology company specializing in software solutions for government and enterprise clients.',
  industry: 'Technology',
  contactInfo: {
    email: 'contact@techcorpco.com',
    phone: '(303) 555-0100',
    address: '1234 Tech Drive, Denver, CO 80202'
  },
  lobbyists: ['lobbyist-1', 'lobbyist-2'],
  billsLobbying: ['bill-hb00-000'],
  // Company details
  companySize: 'large',
  foundedYear: 2010,
  headquarters: 'Denver, Colorado',
  website: 'https://techcorpco.com',
  socialMedia: {
    linkedin: 'linkedin.com/company/techcorp-colorado',
    twitter: '@TechCorpCO'
  },
  // User-specific data (100% local)
  userNotes: [
    {
      id: 'note-1',
      clientId: 'client-techcorp-colorado',
      content: 'Very responsive to legislative updates. Prefers quarterly check-ins and detailed policy briefings.',
      author: 'System Admin',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z'
    },
    {
      id: 'note-2',
      clientId: 'client-techcorp-colorado',
      content: 'Interested in data privacy legislation and technology workforce development bills.',
      author: 'System Admin',
      createdAt: '2025-01-20T14:30:00Z',
      updatedAt: '2025-01-20T14:30:00Z'
    }
  ],
  userTags: ['technology', 'responsive', 'data-privacy', 'workforce'],
  userPriority: 'high',
  userStatus: 'active',
  userRelationship: 'strategic',
  userValue: 'high',
  createdAt: '2025-01-15T08:00:00Z',
  updatedAt: '2025-01-28T14:30:00Z'
};

export const sampleClients: Client[] = [sampleClient];
