import { StorageRecord } from '../../features/cargo-management/storage.model';

// Warehouse Structure
export interface Warehouse {
  id: number;
  name: string;
  description?: string;
  location: Location;
  zones: Zone[];
  capacity: Capacity;
  isActive: boolean;
}

export interface Location {
  id: number;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Zone {
  id: number;
  warehouseId: number;
  name: string;
  description?: string;
  zoneType: 'standard' | 'refrigerated' | 'frozen' | 'hazardous' | 'secure';
  temperature?: {
    min: number;
    max: number;
    unit: 'C' | 'F';
  };
  aisles: Aisle[];
  capacity: Capacity;
}

export interface Aisle {
  id: number;
  zoneId: number;
  label: string;
  width: number;
  widthUnit: string;
  racks: Rack[];
}

export interface Rack {
  id: number;
  aisleId: number;
  label: string;
  maxHeight: number;
  heightUnit: string;
  shelves: Shelf[];
}

export interface Shelf {
  id: number;
  rackId: number;
  level: string;
  maxWeight: number;
  maxVolume: number;
  currentWeight?: number;
  currentVolume?: number;
  isAvailable: boolean;
  storageRecords: StorageRecord[];
}

export interface Capacity {
  id: number;
  entityType: 'WAREHOUSE' | 'ZONE' | 'RACK' | 'SHELF';
  entityId: number;
  value: number;
  unit: string;
  description?: string;
  usedCapacity?: number;
  availableCapacity?: number;
  utilizationPercentage?: number;
} 