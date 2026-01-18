import { CargoLocationHistory } from '../features/cargo-management/cargo.model';

export const MOCK_CARGO_LOCATION_HISTORY: CargoLocationHistory[] = [
  {
    location: 'Zone A-1-R1-S3',
    details: 'Aisle 1, Rack 1, Shelf 3',
    movedDate: new Date('2025-01-10'),
    duration: '3 days (current)'
  },
  {
    location: 'Dock 2',
    details: 'Receiving dock for inspection',
    movedDate: new Date('2025-01-10'),
    duration: '30 minutes'
  }
]; 