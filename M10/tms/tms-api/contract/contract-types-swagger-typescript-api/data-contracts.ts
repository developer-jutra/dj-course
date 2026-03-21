/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Supported pallet types */
export type PalletType = "epal1" | "industrial" | "half" | "cp1" | "cp3" | "h1";

/** Type of cargo being transported */
export type CargoType = "FOOD" | "CHEMICAL" | "ELECTRONICS" | "ADR" | "GENERAL";

/** Current status of the load plan */
export type CargoLoadPlanStatus = "DRAFT" | "FINALIZED";

/**
 * Unit of weight measurement
 * @default "KG"
 */
export type WeightUnit = "KG" | "TONNE" | "LB";

/** Supported trailer types */
export type TrailerType = "standard-curtainside" | "mega" | "reefer";

/** Pagination metadata attached to list responses. */
export interface Pagination {
  /**
   * Current page number (1-based)
   * @example 1
   */
  page: number;
  /**
   * Number of items per page
   * @example 20
   */
  limit: number;
  /**
   * Total number of records across all pages
   * @example 50
   */
  total: number;
  /**
   * Total number of pages
   * @example 3
   */
  totalPages: number;
}

/** Standard error envelope returned on 4xx / 5xx responses. */
export interface ErrorResponse {
  /**
   * Human-readable error message.
   * @example "Vehicle not found"
   */
  error: string;
}

/** A single customer record as returned in list responses. */
export interface CustomerListItem {
  /**
   * Unique customer identifier
   * @example 1
   */
  id: number;
  /**
   * Customer first name
   * @maxLength 50
   * @example "Maida"
   */
  first_name?: string | null;
  /**
   * Customer last name
   * @maxLength 50
   * @example "Dach"
   */
  last_name?: string | null;
  /**
   * Customer email address
   * @maxLength 100
   * @example "forestraynor@bauch.io"
   */
  email?: string | null;
  /**
   * Customer phone number
   * @maxLength 20
   * @example "8082482608"
   */
  phone?: string | null;
  /**
   * Customer classification (e.g. BUSINESS, INDIVIDUAL)
   * @maxLength 20
   * @example "BUSINESS"
   */
  customer_type?: string | null;
  /** Hypermedia links for related resources */
  _links?: {
    /**
     * URL to fetch transportation orders for this customer
     * @example "http://localhost:3000/transportation-orders?customer_id=1"
     */
    orders?: string;
  };
}

/** Paginated list of customers. */
export interface CustomerListResponse {
  data: CustomerListItem[];
  /** Pagination metadata attached to list responses. */
  pagination: Pagination;
}

/** Brief summary of a transportation order linked to a customer. */
export interface CustomerOrderSummary {
  /**
   * Order identifier
   * @example 472
   */
  id: number;
  /**
   * Human-readable order number
   * @example "#00472"
   */
  order_number: string;
  /**
   * Order total amount
   * @format float
   * @example 43.19
   */
  amount: number;
  /**
   * Current order status
   * @example "DELIVERED"
   */
  status: string;
}

/** Full customer record including all fields and associated orders summary. */
export interface CustomerDetail {
  /**
   * Unique customer identifier
   * @example 1
   */
  id: number;
  /**
   * Customer first name
   * @maxLength 50
   * @example "Maida"
   */
  first_name?: string | null;
  /**
   * Customer last name
   * @maxLength 50
   * @example "Dach"
   */
  last_name?: string | null;
  /**
   * Customer email address
   * @maxLength 100
   * @example "forestraynor@bauch.io"
   */
  email?: string | null;
  /**
   * Customer phone number
   * @maxLength 20
   * @example "8082482608"
   */
  phone?: string | null;
  /**
   * Customer classification (e.g. BUSINESS, INDIVIDUAL)
   * @maxLength 20
   * @example "BUSINESS"
   */
  customer_type?: string | null;
  /**
   * Customer address
   * @maxLength 255
   * @example "75968 Villageshire, St. Louis, New Hampshire 86673"
   */
  address?: string | null;
  /**
   * Optimistic locking version counter – must be passed in PATCH requests
   * @example 1
   */
  version: number;
  /** Summary of transportation orders associated with this customer */
  orders: CustomerOrderSummary[];
}

/** Payload for partially updating a customer's name. `version` (optimistic lock) is required. At least one of `first_name` or `last_name` must be provided. */
export interface CustomerPatchInput {
  /**
   * Current version of the customer record (used for optimistic locking)
   * @min 1
   * @example 1
   */
  version: number;
  /**
   * New first name (optional – provide to update)
   * @maxLength 50
   * @example "Maida"
   */
  first_name?: string;
  /**
   * New last name (optional – provide to update)
   * @maxLength 50
   * @example "Dach"
   */
  last_name?: string;
}

/** Updated customer data returned after a successful PATCH. */
export interface CustomerPatchResponse {
  /**
   * Unique customer identifier
   * @example 1
   */
  id: number;
  /**
   * Updated first name
   * @example "Maida Updated"
   */
  first_name?: string | null;
  /**
   * Updated last name
   * @example "Dach"
   */
  last_name?: string | null;
  /**
   * Incremented version number after the update
   * @example 2
   */
  version: number;
}

/** A single vehicle record as returned by the API. */
export interface Vehicle {
  /**
   * Unique vehicle identifier
   * @example 1
   */
  id: number;
  /**
   * Vehicle manufacturer / brand
   * @maxLength 50
   * @example "Suzuki"
   */
  make?: string | null;
  /**
   * Vehicle model name
   * @maxLength 50
   * @example "S4"
   */
  model: string;
  /**
   * Manufacturing year
   * @example 2021
   */
  year?: number | null;
  /**
   * Fuel tank capacity in litres. Returned as a decimal string (e.g. "51.1") because Postgres numeric/decimal is serialised as a string by the pg driver.
   * @example "51.1"
   */
  fuel_tank_capacity?: string | null;
}

/** Paginated list of vehicles. */
export interface VehicleListResponse {
  data: Vehicle[];
  /** Pagination metadata attached to list responses. */
  pagination: Pagination;
}

/** Payload for creating a new vehicle. Only `model` is required. */
export interface VehicleCreateInput {
  /**
   * Vehicle manufacturer / brand
   * @maxLength 50
   * @example "Toyota"
   */
  make?: string | null;
  /**
   * Vehicle model name
   * @maxLength 50
   * @example "Corolla"
   */
  model: string;
  /**
   * Manufacturing year
   * @example 2024
   */
  year?: number | null;
  /**
   * Fuel tank capacity in litres (positive number)
   * @format float
   * @min 0
   * @exclusiveMin true
   * @example 55
   */
  fuel_tank_capacity?: number | null;
}

/** Payload for updating an existing vehicle. All fields are optional (partial update). Provide only the fields you want to change. */
export interface VehicleUpdateInput {
  /**
   * Vehicle manufacturer / brand
   * @maxLength 50
   * @example "Toyota"
   */
  make?: string | null;
  /**
   * Vehicle model name
   * @maxLength 50
   * @example "Camry"
   */
  model?: string;
  /**
   * Manufacturing year
   * @example 2025
   */
  year?: number | null;
  /**
   * Fuel tank capacity in litres (positive number)
   * @format float
   * @min 0
   * @exclusiveMin true
   * @example 60
   */
  fuel_tank_capacity?: number | null;
}

/** A single driver record as returned in list and create responses. */
export interface DriverListItem {
  /**
   * Unique driver identifier
   * @example 1
   */
  id: number;
  /**
   * Driver first name
   * @maxLength 50
   * @example "Matt"
   */
  first_name?: string | null;
  /**
   * Driver last name
   * @maxLength 50
   * @example "Jerde"
   */
  last_name?: string | null;
  /**
   * Driver email address
   * @maxLength 100
   * @example "celiawalker@swift.net"
   */
  email?: string | null;
  /**
   * Driver phone number
   * @maxLength 20
   * @example "4111234962"
   */
  phone?: string | null;
  /**
   * Contract type (e.g. CONTRACTOR, FULL_TIME)
   * @maxLength 20
   * @example "CONTRACTOR"
   */
  contract_type?: string | null;
  /**
   * Driver status (e.g. ON_ROUTE, ACTIVE, RESTING)
   * @maxLength 20
   * @example "ON_ROUTE"
   */
  status?: string | null;
}

/** Payload for creating a new driver. All fields are optional. */
export interface DriverCreateInput {
  /**
   * Driver first name
   * @maxLength 50
   * @example "Jan"
   */
  first_name?: string | null;
  /**
   * Driver last name
   * @maxLength 50
   * @example "Kowalski"
   */
  last_name?: string | null;
  /**
   * Driver email address
   * @maxLength 100
   * @example "jan.kowalski@example.com"
   */
  email?: string | null;
  /**
   * Driver phone number
   * @maxLength 20
   * @example "1234567890"
   */
  phone?: string | null;
  /**
   * Contract type (e.g. FULL_TIME, CONTRACTOR)
   * @maxLength 20
   * @example "FULL_TIME"
   */
  contract_type?: string | null;
  /**
   * Driver status
   * @maxLength 20
   * @example "ACTIVE"
   */
  status?: string | null;
}

/** Driver license record with license type details (returned in driver detail). */
export interface DriverLicense {
  /**
   * License record identifier
   * @example 1
   */
  id?: number;
  /**
   * License document number
   * @example "CXX232105"
   */
  document_number?: string | null;
  /**
   * License issue date (YYYY-MM-DD)
   * @format date
   * @example "2020-08-30"
   */
  issue_date?: string | null;
  /**
   * License expiry date (YYYY-MM-DD)
   * @format date
   * @example "2027-09-21"
   */
  expiry_date?: string | null;
  /**
   * License status (e.g. active)
   * @example "active"
   */
  status?: string | null;
  /**
   * License type code
   * @example "C"
   */
  code?: string | null;
  /**
   * License type name
   * @example "Prawo jazdy kat. C"
   */
  name?: string | null;
  /**
   * License type description
   * @example "Pojazdy ciężarowe powyżej 3,5t"
   */
  description?: string | null;
}

/** Full driver record including associated licenses (returned by GET /drivers/{id}). */
export interface DriverDetail {
  /**
   * Unique driver identifier
   * @example 1
   */
  id: number;
  /**
   * Driver first name
   * @maxLength 50
   * @example "Matt"
   */
  first_name?: string | null;
  /**
   * Driver last name
   * @maxLength 50
   * @example "Jerde"
   */
  last_name?: string | null;
  /**
   * Driver email address
   * @maxLength 100
   * @example "celiawalker@swift.net"
   */
  email?: string | null;
  /**
   * Driver phone number
   * @maxLength 20
   * @example "4111234962"
   */
  phone?: string | null;
  /**
   * Contract type (e.g. CONTRACTOR, FULL_TIME)
   * @maxLength 20
   * @example "CONTRACTOR"
   */
  contract_type?: string | null;
  /**
   * Driver status
   * @maxLength 20
   * @example "ON_ROUTE"
   */
  status?: string | null;
  /** Associated driver licenses with type details */
  licenses: DriverLicense[];
}

/** A single transportation order as returned by the API. */
export interface TransportationOrder {
  /**
   * Unique order identifier
   * @example 472
   */
  id: number;
  /**
   * Human-readable order number (e.g.
   * @maxLength 20
   * @example "#00472"
   */
  order_number: string;
  /**
   * ID of the customer who placed the order
   * @example 1
   */
  customer_id: number;
  /**
   * ID of the driver assigned to this order. Null when no driver has been assigned yet.
   * @example 7
   */
  driver_id?: number | null;
  /**
   * Order status (e.g. DELIVERED, PENDING)
   * @maxLength 20
   * @example "DELIVERED"
   */
  status: string;
  /**
   * Order total amount. Returned as a decimal string (e.g. "43.19") because Postgres numeric is serialised as a string by the pg driver.
   * @example "43.19"
   */
  amount: string;
  /**
   * When the order was placed (ISO 8601)
   * @format date-time
   * @example "2025-11-25T22:31:47.000Z"
   */
  order_date: string;
  /**
   * Expected delivery date (ISO 8601; Postgres date may be serialised with time component)
   * @format date-time
   * @example "2025-12-02T00:00:00.000Z"
   */
  expected_delivery?: string | null;
  /**
   * Delivery street address
   * @maxLength 255
   * @example "6806 East Landchester, Plano, Utah 10652"
   */
  shipping_address?: string | null;
  /**
   * Delivery city
   * @maxLength 100
   * @example "Plano"
   */
  shipping_city?: string | null;
  /**
   * Delivery state or region
   * @maxLength 50
   * @example "Utah"
   */
  shipping_state?: string | null;
  /**
   * Delivery postal code
   * @maxLength 20
   * @example "10652"
   */
  shipping_zip_code?: string | null;
  /**
   * Shipping method name
   * @maxLength 50
   * @example "Standard Delivery"
   */
  shipping_method?: string | null;
  /**
   * Carrier tracking number
   * @maxLength 50
   * @example "SR0472"
   */
  tracking_number?: string | null;
}

/** Payload for assigning a driver to a transportation order. */
export interface AssignDriverInput {
  /**
   * ID of the driver to assign to the order.
   * @example 7
   */
  driver_id: number;
}

/** A single notification as returned by the API. */
export interface Notification {
  /**
   * Unique notification identifier
   * @example 115
   */
  id: number;
  /**
   * ID of the user who receives the notification
   * @example 1
   */
  user_id: number;
  /**
   * Notification type (e.g. warning, success)
   * @maxLength 20
   * @example "warning"
   */
  type: string;
  /**
   * Notification message content
   * @example "Low fuel alert for assigned truck"
   */
  message: string;
  /**
   * When the notification was created (ISO 8601)
   * @format date-time
   * @example "2026-03-13T19:10:40.000Z"
   */
  created_at: string;
  /**
   * Whether the notification has been read
   * @example false
   */
  is_read: boolean;
}

/** Paginated list of notifications. */
export interface NotificationListResponse {
  data: Notification[];
  /** Pagination metadata attached to list responses. */
  pagination: Pagination;
}

/** Payload for creating a new load plan. */
export interface CreateLoadPlanInput {
  /** Supported trailer types */
  trailerType: TrailerType;
}

/** Identifier of the newly created load plan. */
export interface CreateLoadPlanResponse {
  /**
   * UUID of the created load plan
   * @format uuid
   * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   */
  id: string;
}

/** Capabilities of the assigned trailer. */
export interface TrailerCapabilities {
  /**
   * Trailer has temperature/climate control
   * @example false
   */
  hasClimateControl: boolean;
  /**
   * Trailer supports side loading
   * @example true
   */
  supportsSideLoading: boolean;
  /**
   * Trailer has high-security locking
   * @example false
   */
  hasHighSecurityLock: boolean;
  /**
   * Trailer supports bulk cargo
   * @example false
   */
  isBulkReady: boolean;
}

/** Details of the trailer assigned to the load plan. */
export interface TrailerReadModel {
  /** Supported trailer types */
  type: TrailerType;
  /** @example true */
  canCarryPallets: boolean;
  /**
   * Maximum weight capacity in kilograms
   * @example 24000
   */
  maxWeightCapacityKg: number;
  /**
   * Internal trailer width in millimetres
   * @example 2400
   */
  widthMm: number;
  /**
   * Internal trailer height in millimetres
   * @example 2700
   */
  heightMm: number;
  /**
   * Maximum loading metres (LDM)
   * @example 13.6
   */
  maxLdm: number;
  /** Capabilities of the assigned trailer. */
  capabilities: TrailerCapabilities;
}

/** Special handling requirements for a cargo unit. */
export interface CargoRequirementsInput {
  /**
   * Cargo requires a refrigerated trailer
   * @example false
   */
  isTemperatureControlled: boolean;
  /**
   * Cargo must be loaded from the side
   * @example false
   */
  requiresSideLoading: boolean;
  /**
   * Cargo is bulk (requires bulk-ready trailer)
   * @example false
   */
  isBulk: boolean;
  /**
   * Cargo requires high-security locking
   * @example false
   */
  highSecurityRequired: boolean;
}

/** A single pallet unit assigned to a load plan. */
export interface CargoUnitResponse {
  /**
   * Unique identifier of the pallet unit
   * @format uuid
   * @example "b2c3d4e5-f6a7-8901-bcde-f12345678901"
   */
  id: string;
  /**
   * Human-readable label of the pallet spec (e.g. "EPAL 1")
   * @example "EPAL 1"
   */
  palletLabel: string;
  /** Type of cargo being transported */
  cargoType: CargoType;
  /**
   * Weight of the cargo on this pallet, expressed in the unit specified by the weightUnit field on the parent LoadPlanResponse
   * @min 0
   * @exclusiveMin true
   * @example 600
   */
  weight: number;
  /**
   * Total height of pallet + cargo in millimetres
   * @min 0
   * @exclusiveMin true
   * @example 1400
   */
  totalHeightMm: number;
  /** Human-readable product description (e.g. "FOOD – warzywa") */
  description?: string | null;
  /** Special handling requirements for a cargo unit. */
  requirements: CargoRequirementsInput;
}

/** Full state of a cargo load plan. */
export interface LoadPlanResponse {
  /**
   * Unique identifier of the load plan
   * @format uuid
   * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   */
  id: string;
  /** Current status of the load plan */
  status: CargoLoadPlanStatus;
  /**
   * Optimistic concurrency version of the load plan
   * @min 0
   * @example 3
   */
  version: number;
  /** Unit of weight measurement */
  weightUnit: WeightUnit;
  /** Details of the trailer assigned to the load plan. */
  trailer: TrailerReadModel;
  /**
   * Currently used loading metres
   * @min 0
   * @example 2.4
   */
  currentLdm: number;
  /**
   * Total weight of all assigned cargo units, expressed in the unit given by weightUnit
   * @min 0
   * @example 600
   */
  plannedWeight: number;
  /** Cargo units assigned to this plan */
  units: CargoUnitResponse[];
}

/** Payload for adding a cargo unit to a load plan. */
export interface AddCargoInput {
  /** Supported pallet types */
  palletType: PalletType;
  /** Type of cargo being transported */
  cargoType: CargoType;
  /**
   * Weight of the cargo in kilograms
   * @min 0
   * @exclusiveMin true
   * @example 600
   */
  weightKg: number;
  /**
   * Height of the cargo (without pallet) in millimetres
   * @min 0
   * @exclusiveMin true
   * @example 1200
   */
  cargoHeightMm: number;
}

/** Payload for changing the trailer type on a load plan. */
export interface ChangeTrailerInput {
  /** Supported trailer types */
  trailerType: TrailerType;
}

/** Health check response body. */
export interface HealthResponse {
  /**
   * Health status (always "ok" when the service is running)
   * @example "ok"
   */
  status: string;
  /**
   * Service name (from SERVICE_NAME env or default tms-api)
   * @example "tms-api"
   */
  service: string;
}
