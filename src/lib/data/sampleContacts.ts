import { Contact } from '../types';

// Sample contacts with organization relationships
export const sampleContacts: Contact[] = [
  // Contact from TechCorp Colorado client
  {
    id: 'contact-sarah-johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    fullName: 'Sarah Johnson',
    title: 'Government Relations Director',
    email: 'sarah.johnson@techcorpco.com',
    phone: '(303) 555-0101',
    mobile: '(303) 555-0102',
    address: '1234 Tech Drive, Denver, CO 80202',
    // Organization relationships
    clientId: 'client-techcorp-colorado',
    organizationType: 'client',
    organizationName: 'TechCorp Colorado',
    role: 'Government Relations Director',
    relationshipType: 'decision_maker',
    // User-specific data
    userNotes: [
      {
        id: 'note-1',
        contactId: 'contact-sarah-johnson',
        content: 'Primary contact for all government relations. Very responsive and knowledgeable about technology policy.',
        author: 'System Admin',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z'
      }
    ],
    userTags: ['decision-maker', 'technology', 'responsive', 'policy-expert'],
    userPriority: 'high',
    userStatus: 'active',
    userRelationship: 'key_contact',
    // Social network data
    connections: [
      {
        id: 'conn-1',
        contactId: 'contact-sarah-johnson',
        connectedContactId: 'contact-mike-chen',
        connectionType: 'colleague',
        relationshipStrength: 'strong',
        description: 'Works closely with Mike on policy initiatives',
        createdAt: '2025-01-15T10:00:00Z'
      }
    ],
    influence: {
      id: 'inf-1',
      contactId: 'contact-sarah-johnson',
      influenceLevel: 'high',
      decisionMakingPower: 'high',
      accessLevel: 'direct',
      keyInfluenceAreas: ['Technology Policy', 'Government Relations', 'Legislative Strategy'],
      lastUpdated: '2025-01-15T10:00:00Z'
    },
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-28T14:30:00Z'
  },

  // Contact from John Doe legislator's office
  {
    id: 'contact-mike-chen',
    firstName: 'Mike',
    lastName: 'Chen',
    fullName: 'Mike Chen',
    title: 'Legislative Aide',
    email: 'mike.chen@coleg.gov',
    phone: '(303) 555-0124',
    mobile: '(303) 555-0125',
    address: 'Room 271, State Capitol, Denver, CO 80203',
    // Organization relationships
    legislatorId: 'legislator-john-doe',
    organizationType: 'legislator',
    organizationName: 'Rep. John Doe Office',
    role: 'Legislative Aide',
    relationshipType: 'primary',
    // User-specific data
    userNotes: [
      {
        id: 'note-2',
        contactId: 'contact-mike-chen',
        content: 'Very helpful with scheduling meetings and providing legislative updates. Good gatekeeper for Rep. Doe.',
        author: 'System Admin',
        createdAt: '2025-01-16T09:00:00Z',
        updatedAt: '2025-01-16T09:00:00Z'
      }
    ],
    userTags: ['legislative-aide', 'gatekeeper', 'helpful', 'scheduling'],
    userPriority: 'medium',
    userStatus: 'active',
    userRelationship: 'regular',
    // Social network data
    connections: [
      {
        id: 'conn-2',
        contactId: 'contact-mike-chen',
        connectedContactId: 'contact-sarah-johnson',
        connectionType: 'external',
        relationshipStrength: 'medium',
        description: 'Regular contact for policy discussions',
        createdAt: '2025-01-16T09:00:00Z'
      }
    ],
    influence: {
      id: 'inf-2',
      contactId: 'contact-mike-chen',
      influenceLevel: 'medium',
      decisionMakingPower: 'low',
      accessLevel: 'direct',
      keyInfluenceAreas: ['Scheduling', 'Information Flow', 'Legislative Process'],
      lastUpdated: '2025-01-16T09:00:00Z'
    },
    createdAt: '2025-01-16T08:00:00Z',
    updatedAt: '2025-01-28T14:30:00Z'
  },

  // Independent contact (not tied to client or legislator)
  {
    id: 'contact-jennifer-martinez',
    firstName: 'Jennifer',
    lastName: 'Martinez',
    fullName: 'Jennifer Martinez',
    title: 'Policy Analyst',
    email: 'j.martinez@coloradopolicy.org',
    phone: '(303) 555-0200',
    mobile: '(303) 555-0201',
    address: '456 Policy Street, Denver, CO 80204',
    // Organization relationships
    organizationType: 'other',
    organizationName: 'Colorado Policy Institute',
    role: 'Senior Policy Analyst',
    relationshipType: 'influencer',
    // User-specific data
    userNotes: [
      {
        id: 'note-3',
        contactId: 'contact-jennifer-martinez',
        content: 'Expert on healthcare policy. Often consulted by legislators on complex policy issues.',
        author: 'System Admin',
        createdAt: '2025-01-17T11:00:00Z',
        updatedAt: '2025-01-17T11:00:00Z'
      }
    ],
    userTags: ['policy-expert', 'healthcare', 'think-tank', 'influencer'],
    userPriority: 'high',
    userStatus: 'active',
    userRelationship: 'key_contact',
    // Social network data
    connections: [],
    influence: {
      id: 'inf-3',
      contactId: 'contact-jennifer-martinez',
      influenceLevel: 'high',
      decisionMakingPower: 'medium',
      accessLevel: 'indirect',
      keyInfluenceAreas: ['Healthcare Policy', 'Policy Analysis', 'Legislative Research'],
      lastUpdated: '2025-01-17T11:00:00Z'
    },
    createdAt: '2025-01-17T08:00:00Z',
    updatedAt: '2025-01-28T14:30:00Z'
  }
];
