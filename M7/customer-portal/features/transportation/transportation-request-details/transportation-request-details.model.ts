// import type { Address, CargoDetails, Priority, RequestStatus, ProgressUpdate } from '~/model/common'

export interface TransportationRequest {
  id: string;
  requestNumber: string;
  type: 'TRANSPORTATION';
  status: RequestStatus;
  priority: Priority;
  
  // Pickup and Delivery Information
  pickupLocation: LocationDetails;
  deliveryLocation: LocationDetails;
  
  // Cargo Information
  cargo: CargoDetails;
  
  // Service Requirements
  serviceType: TransportServiceType;
  vehicleRequirements: VehicleRequirements;
  
  // Timing
  requestedPickupDate: Date;
  requestedDeliveryDate: Date;
  
  // Special Requirements
  specialInstructions?: string;
  requiresInsurance: boolean;
  requiresCustomsClearance: boolean;
  
  // Pricing and Billing
  estimatedCost?: number;
  finalCost?: number;
  currency: string;
  
  // Tracking
  trackingNumber?: string;
  currentLocation?: string;
  progressUpdates: ProgressUpdate[];
  
  // Metadata
  createdBy: string;
  assignedTo?: string;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationDetails {
  address: Address;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  operatingHours: OperatingHours;
  accessInstructions?: string;
  loadingType: LoadingType;
  facilityType: FacilityType;
}

export interface OperatingHours {
  monday: { open: string; close: string; };
  tuesday: { open: string; close: string; };
  wednesday: { open: string; close: string; };
  thursday: { open: string; close: string; };
  friday: { open: string; close: string; };
  saturday: { open: string; close: string; };
  sunday: { open: string; close: string; };
}

export interface VehicleRequirements {
  vehicleType: VehicleType;
  capacity: number;
  specialEquipment: string[];
  driverRequirements: string[];
}

export enum TransportServiceType {
  FULL_TRUCKLOAD = 'FULL_TRUCKLOAD',
  LESS_THAN_TRUCKLOAD = 'LESS_THAN_TRUCKLOAD',
  EXPRESS_DELIVERY = 'EXPRESS_DELIVERY',
  OVERSIZED_CARGO = 'OVERSIZED_CARGO',
  HAZARDOUS_MATERIALS = 'HAZARDOUS_MATERIALS'
}

export enum VehicleType {
  VAN = 'VAN',
  TRUCK = 'TRUCK',
  TRAILER = 'TRAILER',
  REFRIGERATED = 'REFRIGERATED',
  FLATBED = 'FLATBED',
  TANKER = 'TANKER'
}

export enum LoadingType {
  DOCK = 'DOCK',
  GROUND = 'GROUND',
  CRANE = 'CRANE',
  FORKLIFT = 'FORKLIFT'
}

export enum FacilityType {
  WAREHOUSE = 'WAREHOUSE',
  FACTORY = 'FACTORY',
  PORT = 'PORT',
  DISTRIBUTION_CENTER = 'DISTRIBUTION_CENTER',
  RETAIL_STORE = 'RETAIL_STORE'
}

// Inlined from global common model:
export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

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