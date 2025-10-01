// Data abstraction layer exports for Little Bird

// Bills
export {
  fetchBills,
  getBillById,
  searchBills,
  getBillsByStatus,
  getBillsByChamber,
  getBillsBySponsor,
  getRecentBills,
  getBillsWithLobbying,
} from './bills';

// Legislators
export {
  fetchLegislators,
  getLegislatorById,
  searchLegislators,
  getLegislatorsByParty,
  getLegislatorsByChamber,
  getLegislatorByDistrict,
  getLegislatorsByCommittee,
  getActiveLegislators,
  getLeadership,
  getLegislatorVotingRecord,
} from './legislators';

// Types
export type {
  Bill,
  Legislator,
  LobbyingActivity,
  Vote,
  Lobbyist,
  Client,
  BillFilters,
  LegislatorFilters,
  SearchParams,
  ApiResponse,
  SyncStatus,
} from '@/lib/types';
