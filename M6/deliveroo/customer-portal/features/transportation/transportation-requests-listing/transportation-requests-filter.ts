// Transportation Request Filter Types and Constants

export interface TransportationRequestFilters {
  status: string
  serviceType: string
  dateFrom: string
}

// Available filter options (extracted from the hardcoded values in components)
export const TRANSPORTATION_REQUEST_STATUSES = [
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled' },
  { value: 'PICKED_UP', label: 'Picked Up' },
  { value: 'IN_TRANSIT', label: 'In Transit' },
  { value: 'DELIVERED', label: 'Delivered' }
] as const

export const TRANSPORTATION_SERVICE_TYPES = [
  { value: 'FULL_TRUCKLOAD', label: 'Full Truckload' },
  { value: 'LESS_THAN_TRUCKLOAD', label: 'Less Than Truckload' },
  { value: 'EXPRESS_DELIVERY', label: 'Express Delivery' },
  { value: 'OVERSIZED_CARGO', label: 'Oversized Cargo' }
] as const

// Type unions for type safety
export type TransportationRequestStatus = typeof TRANSPORTATION_REQUEST_STATUSES[number]['value']
export type TransportationServiceType = typeof TRANSPORTATION_SERVICE_TYPES[number]['value']

// Partial filters type for optional usage
export type PartialTransportationRequestFilters = Partial<TransportationRequestFilters>
