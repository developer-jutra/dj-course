export interface WarehousingRequestsFilters {
  status: string;
  dateFrom: string;
  dateTo: string;
  priority: string;
  storageType: string;
  securityLevel: string;
}

export interface WarehousingRequestItem {
  id: string;
  requestNumber: string;
  type: 'Warehousing';
  status: string;
  details: string;
  subDetails: string;
  date: Date;
  priority: string;
  trackingNumber?: string;
  storageType: string;
  securityLevel: string;
  volume: number;
}

export interface PaginatedWarehousingRequests {
  data: WarehousingRequestItem[];
  total: number;
  page: number;
  limit: number;
}

// Status filters for warehousing requests
export const WAREHOUSING_STATUSES = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'APPROVED',
  'PENDING_ARRIVAL',
  'RECEIVED',
  'STORED',
  'COMPLETED'
];

export const WAREHOUSING_PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'LOW', label: 'Low' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' }
];

export const WAREHOUSING_STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'PENDING_ARRIVAL', label: 'Pending Arrival' },
  { value: 'RECEIVED', label: 'Received' },
  { value: 'STORED', label: 'Stored' },
  { value: 'COMPLETED', label: 'Completed' }
];

export const WAREHOUSING_STORAGE_TYPE_OPTIONS = [
  { value: '', label: 'All Storage Types' },
  { value: 'AMBIENT', label: 'Ambient' },
  { value: 'PERISHABLE', label: 'Perishable' },
  { value: 'FROZEN', label: 'Frozen' },
  { value: 'DRY', label: 'Dry' },
  { value: 'HAZARDOUS', label: 'Hazardous' },
  { value: 'SECURE', label: 'Secure' }
];

export const WAREHOUSING_SECURITY_LEVEL_OPTIONS = [
  { value: '', label: 'All Security Levels' },
  { value: 'STANDARD', label: 'Standard' },
  { value: 'HIGH', label: 'High' },
  { value: 'MAXIMUM', label: 'Maximum' }
]; 