// import type { CargoDetails, Priority, RequestStatus, ProgressUpdate } from '~/model/common'

// Inlined from global common model:
export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum RequestStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PICKUP_SCHEDULED = 'PICKUP_SCHEDULED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  ARRIVED_AT_TERMINAL = 'ARRIVED_AT_TERMINAL',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  STORED = 'STORED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD'
}

export interface ProgressUpdate {
  id: string;
  timestamp: Date;
  status: RequestStatus;
  location?: string;
  description: string;
  updatedBy: string;
  attachments?: string[];
  estimatedTime?: Date | string;
  actualTime?: Date | string;
}

export enum CargoType {
  GENERAL_CARGO = 'GENERAL_CARGO',
  BULK_DRY = 'BULK_DRY',
  BULK_LIQUID = 'BULK_LIQUID',
  CONTAINERIZED = 'CONTAINERIZED',
  BREAK_BULK = 'BREAK_BULK',
  HAZARDOUS = 'HAZARDOUS',
  OVERSIZED = 'OVERSIZED',
  PERISHABLE = 'PERISHABLE',
  VALUABLE = 'VALUABLE'
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'm';
}

export enum PackagingType {
  PALLETS = 'PALLETS',
  BOXES = 'BOXES',
  CRATES = 'CRATES',
  BULK = 'BULK',
  CONTAINERS = 'CONTAINERS'
}

export enum HazardousClass {
  CLASS_1 = 'CLASS_1',
  CLASS_2 = 'CLASS_2',
  CLASS_3 = 'CLASS_3',
  CLASS_4 = 'CLASS_4',
  CLASS_5 = 'CLASS_5',
  CLASS_6 = 'CLASS_6',
  CLASS_7 = 'CLASS_7',
  CLASS_8 = 'CLASS_8',
  CLASS_9 = 'CLASS_9'
}

export interface TemperatureRange {
  min: number;
  max: number;
  unit: 'C' | 'F';
}

export interface CargoDetails {
  description: string;
  cargoType: CargoType;
  weight: number;
  dimensions: Dimensions;
  value: number;
  currency: string;
  packaging: PackagingType;
  hazardousClass?: HazardousClass;
  temperatureRequirements?: TemperatureRange;
  stackable: boolean;
  fragile: boolean;
  quantity: number;
  unitType: string;
}

export interface WarehousingRequest {
  id: string;
  requestNumber: string;
  type: 'WAREHOUSING';
  status: RequestStatus;
  priority: Priority;
  
  // Storage Information
  storageType: StorageType;
  estimatedVolume: number;
  estimatedWeight: number;
  
  // Cargo Information
  cargo: CargoDetails;
  
  // Duration
  estimatedStorageDuration: StorageDuration;
  plannedStartDate: Date;
  plannedEndDate?: Date;
  
  // Service Requirements
  handlingServices: HandlingService[];
  valueAddedServices: ValueAddedService[];
  
  // Special Requirements
  securityLevel: SecurityLevel;
  requiresTemperatureControl: boolean;
  requiresHumidityControl: boolean;
  requiresSpecialHandling: boolean;
  specialInstructions?: string;
  
  // Pricing
  estimatedCost?: number;
  finalCost?: number;
  currency: string;
  billingType: BillingType;
  
  // Tracking
  storageLocation?: string;
  inventoryStatus: InventoryStatus;
  progressUpdates: ProgressUpdate[];
  
  // Metadata
  createdBy: string;
  assignedTo?: string;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StorageDuration {
  value: number;
  unit: 'days' | 'weeks' | 'months' | 'years';
}

export enum StorageType {
  AMBIENT = 'AMBIENT',
  REFRIGERATED = 'REFRIGERATED',
  FROZEN = 'FROZEN',
  CLIMATE_CONTROLLED = 'CLIMATE_CONTROLLED',
  HAZARDOUS = 'HAZARDOUS',
  SECURE = 'SECURE'
}

export enum HandlingService {
  LOADING = 'LOADING',
  UNLOADING = 'UNLOADING',
  SORTING = 'SORTING',
  PICKING = 'PICKING',
  PACKING = 'PACKING'
}

export enum ValueAddedService {
  LABELING = 'LABELING',
  REPACKAGING = 'REPACKAGING',
  QUALITY_CONTROL = 'QUALITY_CONTROL',
  CROSS_DOCKING = 'CROSS_DOCKING',
  KITTING = 'KITTING'
}

export enum SecurityLevel {
  STANDARD = 'STANDARD',
  HIGH = 'HIGH',
  MAXIMUM = 'MAXIMUM'
}

export enum BillingType {
  MONTHLY = 'MONTHLY',
  DAILY = 'DAILY',
  PER_UNIT = 'PER_UNIT',
  PER_PALLET = 'PER_PALLET'
}

export enum InventoryStatus {
  PENDING_ARRIVAL = 'PENDING_ARRIVAL',
  RECEIVED = 'RECEIVED',
  IN_STORAGE = 'IN_STORAGE',
  PICKED = 'PICKED',
  DISPATCHED = 'DISPATCHED'
} 