// Core data types for Little Bird political intelligence platform

export interface Bill {
  id: string;
  title: string;
  description: string;
  billNumber: string;
  billType: BillType;
  status: BillStatus;
  sponsor: string;
  coSponsors: string[];
  introducedDate: string;
  lastActionDate: string;
  chamber: Chamber;
  committee?: string;
  fiscalNote?: FiscalNote;
  fiscalNoteHistory?: FiscalNote[];
  summary?: string;
  fullText?: string;
  tags: string[];
  issue: string;
  relatedBills?: string[];
  lobbyingActivity?: LobbyingActivity[];
  votes?: Vote[];
  progress: BillProgress[];
  clientId?: string;
  position?: LobbyingPosition;
  notes?: BillNote[];
  createdAt: string;
  updatedAt: string;
}

export interface FiscalNote {
  id: string;
  billId: string;
  amount?: number;
  description: string;
  effectiveDate: string;
  agency: string;
  createdAt: string;
}

export interface BillProgress {
  id: string;
  billId: string;
  stage: BillStatus;
  date: string;
  description: string;
  chamber: Chamber;
}

export interface BillNote {
  id: string;
  billId: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface Legislator {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  party: Party;
  chamber: Chamber;
  district: string;
  email: string;
  phone?: string;
  office?: string;
  committeeAssignments: string[];
  billsSponsored: string[];
  billsCoSponsored: string[];
  votingRecord: Vote[];
  profileImage?: string;
  bio?: string;
  website?: string;
  socialMedia?: SocialMedia;
  termStart: string;
  termEnd?: string;
  isActive: boolean;
  // User-specific data (not in central DB)
  userNotes?: LegislatorNote[];
  userTags?: string[];
  userPriority?: 'high' | 'medium' | 'low';
  userRelationship?: 'ally' | 'neutral' | 'opponent' | 'unknown';
  // Intelligence dashboard data
  psychographics?: Psychographics;
  districtData?: DistrictData;
  createdAt: string;
  updatedAt: string;
}

export interface LegislatorNote {
  id: string;
  legislatorId: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface Psychographics {
  id: string;
  legislatorId: string;
  communicationStyle?: 'direct' | 'diplomatic' | 'analytical' | 'relationship-focused';
  decisionMakingStyle?: 'data-driven' | 'consensus-based' | 'authoritative' | 'collaborative';
  keyIssues?: string[];
  personalityTraits?: string[];
  communicationPreferences?: string[];
  lastUpdated: string;
}

export interface DistrictData {
  id: string;
  legislatorId: string;
  districtNumber: string;
  population: number;
  demographics: {
    medianAge: number;
    medianIncome: number;
    educationLevel: string;
    urbanRural: 'urban' | 'suburban' | 'rural' | 'mixed';
  };
  keyIndustries: string[];
  majorEmployers: string[];
  politicalLean: 'democratic' | 'republican' | 'swing' | 'independent';
  lastUpdated: string;
}

export interface LobbyingActivity {
  id: string;
  billId: string;
  lobbyistId: string;
  clientId: string;
  activityType: LobbyingActivityType;
  description: string;
  amount?: number;
  date: string;
  createdAt: string;
}

export interface Vote {
  id: string;
  billId: string;
  legislatorId: string;
  vote: VoteType;
  date: string;
  chamber: Chamber;
  rollCallNumber?: string;
  createdAt: string;
}

export interface Lobbyist {
  id: string;
  name: string;
  firm?: string;
  clients: string[];
  registrationDate: string;
  isActive: boolean;
  contactInfo?: ContactInfo;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  description?: string;
  industry?: string;
  contactInfo?: ContactInfo;
  lobbyists: string[];
  billsLobbying: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
}

export interface SocialMedia {
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
}

// Enums
export type BillStatus = 
  | 'introduced'
  | 'in_committee'
  | 'passed_house'
  | 'passed_senate'
  | 'conference_committee'
  | 'passed_both'
  | 'signed_by_governor'
  | 'became_law'
  | 'vetoed'
  | 'failed'
  | 'withdrawn';

export type Chamber = 'house' | 'senate';

export type Party = 'democrat' | 'republican' | 'independent' | 'unaffiliated';

export type VoteType = 'yes' | 'no' | 'abstain' | 'absent' | 'excused';

export type LobbyingActivityType = 
  | 'meeting'
  | 'testimony'
  | 'written_communication'
  | 'phone_call'
  | 'email'
  | 'expenditure';

export type ClientType = 
  | 'corporation'
  | 'nonprofit'
  | 'trade_association'
  | 'union'
  | 'government_entity'
  | 'individual'
  | 'other';

export type BillType = 
  | 'house_bill'
  | 'senate_bill'
  | 'house_joint_resolution'
  | 'senate_joint_resolution'
  | 'house_concurrent_resolution'
  | 'senate_concurrent_resolution';

export type LobbyingPosition = 
  | 'support'
  | 'oppose'
  | 'monitor'
  | 'neutral'
  | 'amend';

// Filter and search types
export interface BillFilters {
  status?: BillStatus[];
  chamber?: Chamber[];
  sponsor?: string;
  committee?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
}

export interface LegislatorFilters {
  party?: Party[];
  chamber?: Chamber[];
  district?: string;
  committee?: string;
  isActive?: boolean;
}

export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

export interface SyncStatus {
  entity: 'bills' | 'legislators' | 'lobbyists' | 'clients';
  lastSync: string | null;
  status: 'idle' | 'syncing' | 'success' | 'error';
  error?: string;
  recordsCount: number;
}
