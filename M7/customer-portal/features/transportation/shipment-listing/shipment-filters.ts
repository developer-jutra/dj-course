// Shipment Filter Types and Constants

export interface ShipmentFilters {
  status: string
  serviceType: string
  dateFrom: string
}

// Available filter options for shipments (approved shipments only)
export const SHIPMENT_STATUSES = [
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled' },
  { value: 'IN_TRANSIT', label: 'In Transit' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'AWAITING_PAYMENT', label: 'Awaiting Payment' },
  { value: 'PAID', label: 'Paid' }
] as const

export const SHIPMENT_SERVICE_TYPES = [
  { value: 'FULL_TRUCKLOAD', label: 'Full Truckload' },
  { value: 'LESS_THAN_TRUCKLOAD', label: 'Less Than Truckload' },
  { value: 'EXPRESS_DELIVERY', label: 'Express Delivery' },
  { value: 'OVERSIZED_CARGO', label: 'Oversized Cargo' },
  { value: 'HAZARDOUS_MATERIALS', label: 'Hazardous Materials' }
] as const

// Type unions for type safety
export type ShipmentStatus = typeof SHIPMENT_STATUSES[number]['value']
export type ShipmentServiceType = typeof SHIPMENT_SERVICE_TYPES[number]['value']

// Partial filters type for optional usage
export type PartialShipmentFilters = Partial<ShipmentFilters> 