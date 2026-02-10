import mongoose, { Schema } from 'mongoose';

// Enums
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

// Interfaces
export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'm';
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

export interface StorageDuration {
  value: number;
  unit: 'days' | 'weeks' | 'months' | 'years';
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

export interface IWarehousingRequest {
  requestNumber: string;
  type: 'WAREHOUSING';
  status: RequestStatus;
  priority: Priority;
  
  storageType: StorageType;
  estimatedVolume: number;
  estimatedWeight: number;
  
  cargo: CargoDetails;
  
  estimatedStorageDuration: StorageDuration;
  plannedStartDate: Date;
  plannedEndDate?: Date;
  
  handlingServices: HandlingService[];
  valueAddedServices: ValueAddedService[];
  
  securityLevel: SecurityLevel;
  requiresTemperatureControl: boolean;
  requiresHumidityControl: boolean;
  requiresSpecialHandling: boolean;
  specialInstructions?: string;
  
  estimatedCost?: number;
  finalCost?: number;
  currency: string;
  billingType: BillingType;
  
  storageLocation?: string;
  inventoryStatus: InventoryStatus;
  progressUpdates: ProgressUpdate[];
  
  createdBy: string;
  assignedTo?: string;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schemas
const DimensionsSchema = new Schema({
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  unit: { type: String, enum: ['cm', 'm'], required: true }
}, { _id: false });

const TemperatureRangeSchema = new Schema({
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  unit: { type: String, enum: ['C', 'F'], required: true }
}, { _id: false });

const CargoDetailsSchema = new Schema({
  description: { type: String, required: true },
  cargoType: { type: String, enum: Object.values(CargoType), required: true },
  weight: { type: Number, required: true },
  dimensions: { type: DimensionsSchema, required: true },
  value: { type: Number, required: true },
  currency: { type: String, required: true },
  packaging: { type: String, enum: Object.values(PackagingType), required: true },
  hazardousClass: { type: String, enum: Object.values(HazardousClass) },
  temperatureRequirements: TemperatureRangeSchema,
  stackable: { type: Boolean, required: true },
  fragile: { type: Boolean, required: true },
  quantity: { type: Number, required: true },
  unitType: { type: String, required: true }
}, { _id: false });

const StorageDurationSchema = new Schema({
  value: { type: Number, required: true },
  unit: { type: String, enum: ['days', 'weeks', 'months', 'years'], required: true }
}, { _id: false });

const ProgressUpdateSchema = new Schema({
  id: { type: String, required: true },
  timestamp: { type: Date, required: true },
  status: { type: String, enum: Object.values(RequestStatus), required: true },
  location: String,
  description: { type: String, required: true },
  updatedBy: { type: String, required: true },
  attachments: [String],
  estimatedTime: Schema.Types.Mixed,
  actualTime: Schema.Types.Mixed
}, { _id: false });

const schema = new Schema<IWarehousingRequest>({
  requestNumber: { type: String, required: true, unique: true },
  type: { type: String, default: 'WAREHOUSING' },
  status: { type: String, enum: Object.values(RequestStatus), required: true },
  priority: { type: String, enum: Object.values(Priority), required: true },
  
  storageType: { type: String, enum: Object.values(StorageType), required: true },
  estimatedVolume: { type: Number, required: true },
  estimatedWeight: { type: Number, required: true },
  
  cargo: { type: CargoDetailsSchema, required: true },
  
  estimatedStorageDuration: { type: StorageDurationSchema, required: true },
  plannedStartDate: { type: Date, required: true },
  plannedEndDate: Date,
  
  handlingServices: [{ type: String, enum: Object.values(HandlingService) }],
  valueAddedServices: [{ type: String, enum: Object.values(ValueAddedService) }],
  
  securityLevel: { type: String, enum: Object.values(SecurityLevel), required: true },
  requiresTemperatureControl: { type: Boolean, required: true },
  requiresHumidityControl: { type: Boolean, required: true },
  requiresSpecialHandling: { type: Boolean, required: true },
  specialInstructions: String,
  
  estimatedCost: Number,
  finalCost: Number,
  currency: { type: String, required: true },
  billingType: { type: String, enum: Object.values(BillingType), required: true },
  
  storageLocation: String,
  inventoryStatus: { type: String, enum: Object.values(InventoryStatus), required: true },
  progressUpdates: [ProgressUpdateSchema],
  
  createdBy: { type: String, required: true },
  assignedTo: String,
  companyId: String
}, { timestamps: true });

export const WarehousingRequest: mongoose.Model<IWarehousingRequest> = 
  mongoose.models.WarehousingRequest || 
  mongoose.model<IWarehousingRequest>('WarehousingRequest', schema, 'warehousing_requests');
