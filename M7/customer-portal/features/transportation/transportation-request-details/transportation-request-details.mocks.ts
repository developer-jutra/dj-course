import type { TransportationRequest } from './transportation-request-details.model'

export const mockTransportationRequestDetail = {
  id: 'TR-2024-001',
  requestNumber: 'TR-2024-001',
  status: 'IN_TRANSIT',
  serviceType: 'FULL_TRUCKLOAD',
  priority: 'NORMAL',
  trackingNumber: 'TRK123456789',
  pickupLocation: {
    address: {
      street: 'ul. Logistyczna 123',
      city: 'Warsaw',
      country: 'Poland'
    },
    contactPerson: 'John Doe',
    contactPhone: '+48123456789'
  },
  deliveryLocation: {
    address: {
      street: 'Hauptstraße 456',
      city: 'Berlin',
      country: 'Germany'
    },
    contactPerson: 'Jane Smith',
    contactPhone: '+49123456789'
  },
  cargo: {
    description: 'Electronic components',
    weight: 1500,
    packaging: 'PALLETS',
    quantity: 5,
    unitType: 'pallets',
    value: 25000,
    fragile: true
  },
  requiresInsurance: true,
  estimatedCost: 2500,
  finalCost: null,
  currency: 'EUR',
  progressUpdates: [
    {
      id: '1',
      timestamp: new Date('2024-01-15T08:00:00'),
      status: 'PICKUP_SCHEDULED',
      location: 'Warsaw, Poland',
      description: 'Pickup scheduled for 08:00'
    },
    {
      id: '2',
      timestamp: new Date('2024-01-15T09:30:00'),
      status: 'PICKED_UP',
      location: 'Warsaw, Poland',
      description: 'Cargo successfully picked up'
    },
    {
      id: '3',
      timestamp: new Date('2024-01-15T14:00:00'),
      status: 'IN_TRANSIT',
      location: 'Dresden, Germany',
      description: 'In transit to destination'
    }
  ]
} 