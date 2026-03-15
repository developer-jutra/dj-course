import { z } from "zod";

const CustomerListItem = z
  .object({
    id: z.number().int(),
    first_name: z.string().max(50).nullish(),
    last_name: z.string().max(50).nullish(),
    email: z.string().max(100).nullish(),
    phone: z.string().max(20).nullish(),
    customer_type: z.string().max(20).nullish(),
    _links: z.object({ orders: z.string() }).partial().passthrough().optional(),
  })
  .passthrough();
const Pagination = z
  .object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  })
  .passthrough();
const CustomerListResponse = z
  .object({ data: z.array(CustomerListItem), pagination: Pagination })
  .passthrough();
const ErrorResponse = z.object({ error: z.string() }).passthrough();
const CustomerOrderSummary = z
  .object({
    id: z.number().int(),
    order_number: z.string(),
    amount: z.number(),
    status: z.string(),
  })
  .passthrough();
const CustomerDetail = z
  .object({
    id: z.number().int(),
    first_name: z.string().max(50).nullish(),
    last_name: z.string().max(50).nullish(),
    email: z.string().max(100).nullish(),
    phone: z.string().max(20).nullish(),
    customer_type: z.string().max(20).nullish(),
    address: z.string().max(255).nullish(),
    version: z.number().int(),
    orders: z.array(CustomerOrderSummary),
  })
  .passthrough();
const CustomerPatchInput = z
  .object({
    version: z.number().int().gte(1),
    first_name: z.string().max(50).optional(),
    last_name: z.string().max(50).optional(),
  })
  .passthrough();
const CustomerPatchResponse = z
  .object({
    id: z.number().int(),
    first_name: z.string().nullish(),
    last_name: z.string().nullish(),
    version: z.number().int(),
  })
  .passthrough();
const Vehicle = z
  .object({
    id: z.number().int(),
    make: z.string().max(50).nullish(),
    model: z.string().max(50),
    year: z.number().int().nullish(),
    fuel_tank_capacity: z.string().nullish(),
  })
  .passthrough();
const VehicleListResponse = z
  .object({ data: z.array(Vehicle), pagination: Pagination })
  .passthrough();
const VehicleCreateInput = z
  .object({
    make: z.string().max(50).nullish(),
    model: z.string().max(50),
    year: z.number().int().nullish(),
    fuel_tank_capacity: z.number().gt(0).nullish(),
  })
  .passthrough();
const VehicleUpdateInput = z
  .object({
    make: z.string().max(50).nullable(),
    model: z.string().max(50),
    year: z.number().int().nullable(),
    fuel_tank_capacity: z.number().gt(0).nullable(),
  })
  .partial()
  .passthrough();
const DriverListItem = z
  .object({
    id: z.number().int(),
    first_name: z.string().max(50).nullish(),
    last_name: z.string().max(50).nullish(),
    email: z.string().max(100).nullish(),
    phone: z.string().max(20).nullish(),
    contract_type: z.string().max(20).nullish(),
    status: z.string().max(20).nullish(),
  })
  .passthrough();
const DriverCreateInput = z
  .object({
    first_name: z.string().max(50).nullable(),
    last_name: z.string().max(50).nullable(),
    email: z.string().max(100).nullable(),
    phone: z.string().max(20).nullable(),
    contract_type: z.string().max(20).nullable(),
    status: z.string().max(20).nullable(),
  })
  .partial()
  .passthrough();
const DriverLicense = z
  .object({
    id: z.number().int(),
    document_number: z.string().nullable(),
    issue_date: z.string().nullable(),
    expiry_date: z.string().nullable(),
    status: z.string().nullable(),
    code: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
  })
  .partial()
  .passthrough();
const DriverDetail = z
  .object({
    id: z.number().int(),
    first_name: z.string().max(50).nullish(),
    last_name: z.string().max(50).nullish(),
    email: z.string().max(100).nullish(),
    phone: z.string().max(20).nullish(),
    contract_type: z.string().max(20).nullish(),
    status: z.string().max(20).nullish(),
    licenses: z.array(DriverLicense),
  })
  .passthrough();
const TransportationOrder = z
  .object({
    id: z.number().int(),
    order_number: z.string().max(20),
    customer_id: z.number().int(),
    driver_id: z.number().int().nullish(),
    status: z.string().max(20),
    amount: z.string(),
    order_date: z.string().datetime({ offset: true }),
    expected_delivery: z.string().datetime({ offset: true }).nullish(),
    shipping_address: z.string().max(255).nullish(),
    shipping_city: z.string().max(100).nullish(),
    shipping_state: z.string().max(50).nullish(),
    shipping_zip_code: z.string().max(20).nullish(),
    shipping_method: z.string().max(50).nullish(),
    tracking_number: z.string().max(50).nullish(),
  })
  .passthrough();
const AssignDriverInput = z
  .object({ driver_id: z.number().int() })
  .passthrough();
const Notification = z
  .object({
    id: z.number().int(),
    user_id: z.number().int(),
    type: z.string().max(20),
    message: z.string(),
    created_at: z.string().datetime({ offset: true }),
    is_read: z.boolean(),
  })
  .passthrough();
const NotificationListResponse = z
  .object({ data: z.array(Notification), pagination: Pagination })
  .passthrough();
const HealthResponse = z
  .object({ status: z.string(), service: z.string() })
  .passthrough();

export const schemas = {
  CustomerListItem,
  Pagination,
  CustomerListResponse,
  ErrorResponse,
  CustomerOrderSummary,
  CustomerDetail,
  CustomerPatchInput,
  CustomerPatchResponse,
  Vehicle,
  VehicleListResponse,
  VehicleCreateInput,
  VehicleUpdateInput,
  DriverListItem,
  DriverCreateInput,
  DriverLicense,
  DriverDetail,
  TransportationOrder,
  AssignDriverInput,
  Notification,
  NotificationListResponse,
  HealthResponse,
};

export const endpointParams = {
  getCustomers: {
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("20"),
    search: z.string().optional(),
  },
  getCustomerById: {
    id: z.number().int(),
  },
  patchCustomer: {
    body: CustomerPatchInput,
    id: z.number().int(),
  },
  deleteCustomer: {
    id: z.number().int(),
  },
  createDriver: {
    body: DriverCreateInput,
  },
  getDriverById: {
    id: z.number().int(),
  },
  getNotificationsByUserId: {
    userId: z.string().regex(/^[1-9]\d*$/),
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("20"),
  },
  getTransportationOrders: {
    customer_id: z.string().optional(),
  },
  assignDriverToOrder: {
    body: z.object({ driver_id: z.number().int() }).passthrough(),
    id: z.number().int(),
  },
  getVehicles: {
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("20"),
  },
  createVehicle: {
    body: VehicleCreateInput,
  },
  getVehicleById: {
    id: z.number().int(),
  },
  updateVehicle: {
    body: VehicleUpdateInput,
    id: z.number().int(),
  },
  deleteVehicle: {
    id: z.number().int(),
  },
};

export const queryParams = {
  getServerStatus: z.object({}).strict(),
  getCustomers: z
    .object({
      page: z.string().optional().default("1"),
      limit: z.string().optional().default("20"),
      search: z.string().optional(),
    })
    .strict(),
  getCustomerById: z.object({}).strict(),
  patchCustomer: z.object({}).strict(),
  deleteCustomer: z.object({}).strict(),
  getDrivers: z.object({}).strict(),
  createDriver: z.object({}).strict(),
  getDriverById: z.object({}).strict(),
  getHealth: z.object({}).strict(),
  getNotificationsByUserId: z
    .object({
      userId: z.string().regex(/^[1-9]\d*$/),
      page: z.string().optional().default("1"),
      limit: z.string().optional().default("20"),
    })
    .strict(),
  getTransportationOrders: z
    .object({
      customer_id: z.string().optional(),
    })
    .strict(),
  assignDriverToOrder: z.object({}).strict(),
  getVehicles: z
    .object({
      page: z.string().optional().default("1"),
      limit: z.string().optional().default("20"),
    })
    .strict(),
  createVehicle: z.object({}).strict(),
  getVehicleById: z.object({}).strict(),
  updateVehicle: z.object({}).strict(),
  deleteVehicle: z.object({}).strict(),
};
