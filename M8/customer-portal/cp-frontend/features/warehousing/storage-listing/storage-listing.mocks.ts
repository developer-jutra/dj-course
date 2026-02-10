import type { StorageItem } from './storage-listing.model'

export const mockStorageItems: StorageItem[] = [
  {
    id: 'ST-001',
    cargoType: 'GENERAL_CARGO',
    quantity: 100,
    unitType: 'pcs',
    storageLocation: 'Warehouse A-1',
    status: 'IN_STORAGE',
    arrivalDate: new Date('2024-01-15')
  },
  {
    id: 'ST-002',
    cargoType: 'PERISHABLE',
    quantity: 20,
    unitType: 'boxes',
    storageLocation: 'Cold Storage B-2',
    status: 'PENDING',
    arrivalDate: new Date('2024-02-01')
  },
  {
    id: 'ST-003',
    cargoType: 'HAZARDOUS',
    quantity: 5,
    unitType: 'drums',
    storageLocation: 'Hazmat Zone C-3',
    status: 'DISPATCHED',
    arrivalDate: new Date('2024-01-10'),
    departureDate: new Date('2024-01-20')
  }
] 