export interface StorageItem {
  id: string;
  cargoType: string;
  quantity: number;
  unitType: string;
  storageLocation: string;
  status: string;
  arrivalDate: Date;
  departureDate?: Date;
}

export const STORAGE_STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_STORAGE', label: 'In Storage' },
  { value: 'DISPATCHED', label: 'Dispatched' },
  { value: 'REMOVED', label: 'Removed' }
];

export const CARGO_TYPE_OPTIONS = [
  { value: '', label: 'All Cargo Types' },
  { value: 'GENERAL_CARGO', label: 'General Cargo' },
  { value: 'PERISHABLE', label: 'Perishable' },
  { value: 'HAZARDOUS', label: 'Hazardous' },
  { value: 'OVERSIZED', label: 'Oversized' }
]; 