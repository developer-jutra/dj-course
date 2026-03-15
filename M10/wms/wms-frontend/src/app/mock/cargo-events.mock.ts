import { CargoEvent } from '../features/cargo-management/cargo.model';

export const MOCK_CARGO_EVENTS: CargoEvent[] = [
  {
    type: 'received',
    title: 'Cargo Received',
    description: 'Cargo received at Dock 2 from Swift Transport',
    employee: 'Mike Worker',
    timestamp: new Date('2025-01-10T09:30:00')
  },
  {
    type: 'inspection',
    title: 'Inspection Completed',
    description: 'All items in good condition, no damage detected',
    employee: 'Sarah Inspector',
    timestamp: new Date('2025-01-10T10:15:00')
  },
  {
    type: 'moved',
    title: 'Moved to Storage',
    description: 'Moved to Zone A-1-R1-S3 for long-term storage',
    employee: 'John Operator',
    timestamp: new Date('2025-01-10T11:00:00')
  }
]; 