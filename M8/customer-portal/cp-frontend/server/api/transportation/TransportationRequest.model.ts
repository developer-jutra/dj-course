import mongoose, { Schema, InferSchemaType } from 'mongoose';

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

// Schemas - single source of truth
// All types will be inferred from schemas using InferSchemaType
const AddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: false }, // Optional - not always available
  country: { type: String, required: true },
  coordinates: {
    lat: Number,
    lng: Number
  }
}, { _id: false });

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

const OperatingHoursSchema = new Schema({
  monday: { open: String, close: String },
  tuesday: { open: String, close: String },
  wednesday: { open: String, close: String },
  thursday: { open: String, close: String },
  friday: { open: String, close: String },
  saturday: { open: String, close: String },
  sunday: { open: String, close: String }
}, { _id: false });

const LocationDetailsSchema = new Schema({
  address: { type: AddressSchema, required: true },
  contactPerson: { type: String, required: true },
  contactPhone: { type: String, required: true },
  contactEmail: { type: String, required: false }, // Optional - not always provided
  operatingHours: { type: OperatingHoursSchema, required: false }, // Optional
  accessInstructions: String,
  loadingType: { type: String, enum: Object.values(LoadingType), required: true },
  facilityType: { type: String, enum: Object.values(FacilityType), required: true }
}, { _id: false });

const VehicleRequirementsSchema = new Schema({
  vehicleType: { type: String, enum: Object.values(VehicleType), required: true },
  capacity: { type: Number, required: true },
  specialEquipment: [String],
  driverRequirements: [String]
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

const schema = new Schema({
  requestNumber: { type: String, required: true, unique: true },
  type: { type: String, default: 'TRANSPORTATION' },
  status: { type: String, enum: Object.values(RequestStatus), required: true },
  priority: { type: String, enum: Object.values(Priority), required: true },
  
  pickupLocation: { type: LocationDetailsSchema, required: true },
  deliveryLocation: { type: LocationDetailsSchema, required: true },
  
  cargo: { type: CargoDetailsSchema, required: true },
  
  serviceType: { type: String, enum: Object.values(TransportServiceType), required: true },
  vehicleRequirements: { type: VehicleRequirementsSchema, required: true },
  
  requestedPickupDate: { type: Date, required: true },
  requestedDeliveryDate: { type: Date, required: true },
  
  specialInstructions: String,
  requiresInsurance: { type: Boolean, required: true },
  requiresCustomsClearance: { type: Boolean, required: true },
  
  estimatedCost: Number,
  finalCost: Number,
  currency: { type: String, required: true },
  
  trackingNumber: String,
  currentLocation: String,
  progressUpdates: [ProgressUpdateSchema],
  
  createdBy: { type: String, required: true },
  assignedTo: String,
  companyId: String
}, { timestamps: true });

// Infer all types from schemas - single source of truth
export type Address = InferSchemaType<typeof AddressSchema>;
export type Dimensions = InferSchemaType<typeof DimensionsSchema>;
export type TemperatureRange = InferSchemaType<typeof TemperatureRangeSchema>;
export type CargoDetails = InferSchemaType<typeof CargoDetailsSchema>;
export type OperatingHours = InferSchemaType<typeof OperatingHoursSchema>;
export type LocationDetails = InferSchemaType<typeof LocationDetailsSchema>;
export type VehicleRequirements = InferSchemaType<typeof VehicleRequirementsSchema>;
export type ProgressUpdate = InferSchemaType<typeof ProgressUpdateSchema>;

// Main type inferred from main schema
// Mongoose automatically validates based on this schema during save()
// No need for manual validation - schema defines:
// - required fields
// - enum values
// - data types
// - min/max values
export type ITransportationRequest = InferSchemaType<typeof schema>;

export const TransportationRequest: mongoose.Model<ITransportationRequest> = 
    mongoose.models.TransportationRequest || // check if model 'TransportationRequest' is already registered
    mongoose.model<ITransportationRequest>('TransportationRequest', schema, 'transportation_requests'); // if not, create it and register it
