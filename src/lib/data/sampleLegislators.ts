import { Legislator } from '../types';

// Sample legislator data for "John Doe"
export const sampleLegislator: Legislator = {
  id: 'legislator-john-doe',
  firstName: 'John',
  lastName: 'Doe',
  fullName: 'John Doe',
  party: 'democrat',
  chamber: 'house',
  district: 'District 42',
  email: 'john.doe@coleg.gov',
  phone: '(303) 555-0123',
  office: 'Room 271, State Capitol',
  committeeAssignments: [
    'House Finance Committee',
    'House Health & Insurance Committee',
    'Joint Technology Committee'
  ],
  billsSponsored: [
    'HB24-1001: Digital Privacy Act',
    'HB24-1002: Healthcare Access Bill',
    'HB24-1003: Education Technology Fund'
  ],
  billsCoSponsored: [
    'HB24-2001: Renewable Energy Incentives',
    'HB24-2002: Small Business Support Act'
  ],
  votingRecord: [],
  profileImage: '/api/placeholder/150/150', // Placeholder for headshot
  bio: 'Representative John Doe has served in the Colorado House of Representatives since 2020. He focuses on technology policy, healthcare access, and economic development. Prior to his legislative service, he worked in the technology sector for 15 years.',
  website: 'https://johndoe.coleg.gov',
  socialMedia: {
    twitter: '@RepJohnDoe',
    linkedin: 'linkedin.com/in/johndoe'
  },
  termStart: '2020-01-08',
  termEnd: '2024-12-31',
  isActive: true,
  // User-specific data
  userNotes: [
    {
      id: 'note-1',
      legislatorId: 'legislator-john-doe',
      content: 'Very responsive to constituent concerns. Prefers email communication over phone calls.',
      author: 'System Admin',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z'
    }
  ],
  userTags: ['technology', 'healthcare', 'responsive'],
  userPriority: 'high',
  userRelationship: 'ally',
  // Intelligence dashboard data
  psychographics: {
    id: 'psych-1',
    legislatorId: 'legislator-john-doe',
    communicationStyle: 'analytical',
    decisionMakingStyle: 'data-driven',
    keyIssues: ['Technology Policy', 'Healthcare Access', 'Economic Development'],
    personalityTraits: ['Detail-oriented', 'Collaborative', 'Tech-savvy'],
    communicationPreferences: ['Email', 'Data presentations', 'Committee meetings'],
    lastUpdated: '2025-01-15T10:00:00Z'
  },
  districtData: {
    id: 'district-1',
    legislatorId: 'legislator-john-doe',
    districtNumber: '42',
    population: 89000,
    demographics: {
      medianAge: 38,
      medianIncome: 75000,
      educationLevel: 'Bachelor\'s degree',
      urbanRural: 'suburban'
    },
    keyIndustries: ['Technology', 'Healthcare', 'Education', 'Manufacturing'],
    majorEmployers: ['TechCorp Colorado', 'Denver Health', 'University of Colorado'],
    politicalLean: 'democratic',
    lastUpdated: '2025-01-15T10:00:00Z'
  },
  createdAt: '2025-01-15T08:00:00Z',
  updatedAt: '2025-01-28T14:30:00Z'
};

export const sampleLegislators: Legislator[] = [sampleLegislator];
