import type { TransportationRequest } from './transportation-request.model'

// Initial mock data
const initialMockData: TransportationRequest[] = [
  {
    id: 'TR-2024-001',
    requestNumber: 'TR-2024-001',
    type: 'TRANSPORTATION',
    status: 'IN_TRANSIT' as any,
    priority: 'NORMAL' as any,
    pickupLocation: {
      address: { city: 'Warsaw', country: 'Poland', street: 'ul. Logistyczna 123', postalCode: '00-001' },
      contactPerson: 'John Doe',
      contactPhone: '+48123456789',
      contactEmail: 'john@example.com',
      operatingHours: {} as any,
      loadingType: 'DOCK' as any,
      facilityType: 'WAREHOUSE' as any
    },
    deliveryLocation: {
      address: { city: 'Berlin', country: 'Germany', street: 'Hauptstraße 456', postalCode: '10115' },
      contactPerson: 'Jane Smith',
      contactPhone: '+49123456789',
      contactEmail: 'jane@example.com',
      operatingHours: {} as any,
      loadingType: 'DOCK' as any,
      facilityType: 'WAREHOUSE' as any
    },
    cargo: {} as any,
    serviceType: 'FULL_TRUCKLOAD' as any,
    vehicleRequirements: {} as any,
    requestedPickupDate: new Date('2024-01-15'),
    requestedDeliveryDate: new Date('2024-01-17'),
    requiresInsurance: true,
    requiresCustomsClearance: false,
    currency: 'EUR',
    trackingNumber: 'TRK123456789',
    progressUpdates: [],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'TR-2024-002',
    requestNumber: 'TR-2024-002',
    type: 'TRANSPORTATION',
    status: 'DELIVERED' as any,
    priority: 'HIGH' as any,
    pickupLocation: {
      address: { city: 'Krakow', country: 'Poland', street: 'ul. Przemysłowa 789', postalCode: '30-001' },
      contactPerson: 'Anna Kowalski',
      contactPhone: '+48987654321',
      contactEmail: 'anna@example.com',
      operatingHours: {} as any,
      loadingType: 'GROUND' as any,
      facilityType: 'FACTORY' as any
    },
    deliveryLocation: {
      address: { city: 'Vienna', country: 'Austria', street: 'Industriestraße 321', postalCode: '1010' },
      contactPerson: 'Hans Mueller',
      contactPhone: '+43123456789',
      contactEmail: 'hans@example.com',
      operatingHours: {} as any,
      loadingType: 'DOCK' as any,
      facilityType: 'WAREHOUSE' as any
    },
    cargo: {} as any,
    serviceType: 'EXPRESS_DELIVERY' as any,
    vehicleRequirements: {} as any,
    requestedPickupDate: new Date('2024-01-12'),
    requestedDeliveryDate: new Date('2024-01-13'),
    requiresInsurance: true,
    requiresCustomsClearance: false,
    currency: 'EUR',
    trackingNumber: 'TRK987654321',
    progressUpdates: [],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'TR-2024-003',
    requestNumber: 'TR-2024-003',
    type: 'TRANSPORTATION',
    status: 'PICKUP_SCHEDULED' as any,
    priority: 'NORMAL' as any,
    pickupLocation: {
      address: { city: 'Prague', country: 'Czech Republic', street: 'Průmyslová 555', postalCode: '110 00' },
      contactPerson: 'Pavel Novák',
      contactPhone: '+420123456789',
      contactEmail: 'pavel@example.com',
      operatingHours: {} as any,
      loadingType: 'CRANE' as any,
      facilityType: 'WAREHOUSE' as any
    },
    deliveryLocation: {
      address: { city: 'Hamburg', country: 'Germany', street: 'Hafenstraße 888', postalCode: '20095' },
      contactPerson: 'Klaus Weber',
      contactPhone: '+49987654321',
      contactEmail: 'klaus@example.com',
      operatingHours: {} as any,
      loadingType: 'DOCK' as any,
      facilityType: 'PORT' as any
    },
    cargo: {} as any,
    serviceType: 'OVERSIZED_CARGO' as any,
    vehicleRequirements: {} as any,
    requestedPickupDate: new Date('2024-01-18'),
    requestedDeliveryDate: new Date('2024-01-20'),
    requiresInsurance: true,
    requiresCustomsClearance: false,
    currency: 'EUR',
    trackingNumber: 'TRK456789123',
    progressUpdates: [],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'TR-2024-004',
    requestNumber: 'TR-2024-004',
    type: 'TRANSPORTATION',
    status: 'IN_TRANSIT' as any,
    priority: 'URGENT' as any,
    pickupLocation: {
      address: { city: 'Budapest', country: 'Hungary', street: 'Ipari út 222', postalCode: '1117' },
      contactPerson: 'László Kovács',
      contactPhone: '+36123456789',
      contactEmail: 'laszlo@example.com',
      operatingHours: {} as any,
      loadingType: 'FORKLIFT' as any,
      facilityType: 'WAREHOUSE' as any
    },
    deliveryLocation: {
      address: { city: 'Amsterdam', country: 'Netherlands', street: 'Industrieweg 777', postalCode: '1043 AP' },
      contactPerson: 'Jan van der Berg',
      contactPhone: '+31123456789',
      contactEmail: 'jan@example.com',
      operatingHours: {} as any,
      loadingType: 'DOCK' as any,
      facilityType: 'DISTRIBUTION_CENTER' as any
    },
    cargo: {} as any,
    serviceType: 'EXPRESS_DELIVERY' as any,
    vehicleRequirements: {} as any,
    requestedPickupDate: new Date('2024-01-16'),
    requestedDeliveryDate: new Date('2024-01-17'),
    requiresInsurance: true,
    requiresCustomsClearance: false,
    currency: 'EUR',
    trackingNumber: 'TRK789123456',
    progressUpdates: [],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'TR-2024-005',
    requestNumber: 'TR-2024-005',
    type: 'TRANSPORTATION',
    status: 'DELIVERED' as any,
    priority: 'NORMAL' as any,
    pickupLocation: {
      address: { city: 'Gdansk', country: 'Poland', street: 'ul. Portowa 111', postalCode: '80-001' },
      contactPerson: 'Marek Wiśniewski',
      contactPhone: '+48555666777',
      contactEmail: 'marek@example.com',
      operatingHours: {} as any,
      loadingType: 'DOCK' as any,
      facilityType: 'PORT' as any
    },
    deliveryLocation: {
      address: { city: 'Stockholm', country: 'Sweden', street: 'Industrivägen 999', postalCode: '111 60' },
      contactPerson: 'Erik Andersson',
      contactPhone: '+46123456789',
      contactEmail: 'erik@example.com',
      operatingHours: {} as any,
      loadingType: 'GROUND' as any,
      facilityType: 'WAREHOUSE' as any
    },
    cargo: {} as any,
    serviceType: 'FULL_TRUCKLOAD' as any,
    vehicleRequirements: {} as any,
    requestedPickupDate: new Date('2024-01-10'),
    requestedDeliveryDate: new Date('2024-01-14'),
    requiresInsurance: false,
    requiresCustomsClearance: true,
    currency: 'EUR',
    trackingNumber: 'TRK321654987',
    progressUpdates: [],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'TR-2024-006',
    requestNumber: 'TR-2024-006',
    type: 'TRANSPORTATION',
    status: 'IN_TRANSIT' as any,
    priority: 'HIGH' as any,
    pickupLocation: {
      address: { city: 'Bratislava', country: 'Slovakia', street: 'Priemyselná 333', postalCode: '821 09' },
      contactPerson: 'Michal Horváth',
      contactPhone: '+421123456789',
      contactEmail: 'michal@example.com',
      operatingHours: {} as any,
      loadingType: 'DOCK' as any,
      facilityType: 'FACTORY' as any
    },
    deliveryLocation: {
      address: { city: 'Milan', country: 'Italy', street: 'Via Industriale 444', postalCode: '20100' },
      contactPerson: 'Marco Rossi',
      contactPhone: '+39123456789',
      contactEmail: 'marco@example.com',
      operatingHours: {} as any,
      loadingType: 'FORKLIFT' as any,
      facilityType: 'WAREHOUSE' as any
    },
    cargo: {} as any,
    serviceType: 'LESS_THAN_TRUCKLOAD' as any,
    vehicleRequirements: {} as any,
    requestedPickupDate: new Date('2024-01-14'),
    requestedDeliveryDate: new Date('2024-01-16'),
    requiresInsurance: true,
    requiresCustomsClearance: false,
    currency: 'EUR',
    trackingNumber: 'TRK654987321',
    progressUpdates: [],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Persistent storage for mock data that survives module reloads
// Using a global variable pattern to persist across HMR/navigation
function getPersistentMockData(): TransportationRequest[] {
  // Check if we have persistent data (survives module reloads in browser)
  if (typeof window !== 'undefined') {
    const storageKey = '__mockTransportationRequests__'
    const stored = (window as any)[storageKey]
    if (stored && Array.isArray(stored)) {
      // Restore from persistent storage - return the same reference
      return stored
    }
  }
  
  // Initialize with initial data
  const persistentMockData = [...initialMockData]
  
  // Store in global for persistence across module reloads
  if (typeof window !== 'undefined') {
    (window as any)['__mockTransportationRequests__'] = persistentMockData
  }
  
  return persistentMockData
}

// Export the persistent array - this will always return the same reference
// stored in window, ensuring data persists across module reloads
export const mockTransportationRequests = getPersistentMockData() 