import type { WarehousingRequest } from './warehousing-request-details.model'

export const mockWarehousingRequests: WarehousingRequest[] = [
  {
    id: 'WH-2024-001',
    requestNumber: 'WH-2024-001',
    type: 'WAREHOUSING',
    status: 'STORED' as any,
    priority: 'NORMAL' as any,
    storageType: 'AMBIENT' as any,
    estimatedVolume: 50,
    estimatedWeight: 1000,
    cargo: {
      description: 'Electronic components and spare parts for automotive industry',
      cargoType: 'GENERAL_CARGO' as any,
      weight: 1000,
      dimensions: { length: 200, width: 150, height: 100, unit: 'cm' },
      value: 45000,
      currency: 'EUR',
      packaging: 'PALLETS' as any,
      stackable: true,
      fragile: false,
      quantity: 20,
      unitType: 'pallets'
    },
    estimatedStorageDuration: { value: 3, unit: 'months' },
    plannedStartDate: new Date('2024-01-15'),
    handlingServices: ['LOADING', 'UNLOADING', 'SORTING'] as any,
    valueAddedServices: ['LABELING', 'QUALITY_CONTROL'] as any,
    securityLevel: 'STANDARD' as any,
    requiresTemperatureControl: false,
    requiresHumidityControl: false,
    requiresSpecialHandling: false,
    currency: 'EUR',
    billingType: 'MONTHLY' as any,
    storageLocation: 'Warehouse A-12',
    inventoryStatus: 'IN_STORAGE' as any,
    progressUpdates: [
      {
        id: '1',
        timestamp: new Date('2024-01-15T10:00:00'),
        status: 'SUBMITTED',
        location: 'System',
        description: 'Warehousing request submitted and under review',
        updatedBy: '1'
      },
      {
        id: '2',
        timestamp: new Date('2024-01-15T14:00:00'),
        status: 'APPROVED' as any,
        location: 'Krakow Facility',
        description: 'Request approved, storage space allocated',
        updatedBy: '1'
      },
      {
        id: '3',
        timestamp: new Date('2024-01-16T09:00:00'),
        status: 'RECEIVED' as any,
        location: 'Warehouse A-12',
        description: 'Cargo received and inspection completed',
        updatedBy: '1'
      },
      {
        id: '4',
        timestamp: new Date('2024-01-16T11:30:00'),
        status: 'STORED' as any,
        location: 'Warehouse A-12',
        description: 'Items successfully stored and inventory updated',
        updatedBy: '1'
      }
    ],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'WH-2024-002',
    requestNumber: 'WH-2024-002',
    type: 'WAREHOUSING',
    status: 'RECEIVED' as any,
    priority: 'HIGH' as any,
    storageType: 'REFRIGERATED' as any,
    estimatedVolume: 25,
    estimatedWeight: 800,
    cargo: {
      description: 'Fresh food products and beverages',
      cargoType: 'PERISHABLE' as any,
      weight: 800,
      dimensions: { length: 120, width: 80, height: 60, unit: 'cm' as any },
      value: 12000,
      currency: 'EUR',
      packaging: 'BOXES' as any,
      stackable: true,
      fragile: true,
      quantity: 40,
      unitType: 'boxes'
    },
    estimatedStorageDuration: { value: 2, unit: 'weeks' },
    plannedStartDate: new Date('2024-01-18'),
    handlingServices: ['LOADING', 'UNLOADING', 'PICKING'] as any,
    valueAddedServices: ['QUALITY_CONTROL'] as any,
    securityLevel: 'HIGH' as any,
    requiresTemperatureControl: true,
    requiresHumidityControl: true,
    requiresSpecialHandling: true,
    currency: 'EUR',
    billingType: 'DAILY' as any,
    storageLocation: 'Cold Storage B-5',
    inventoryStatus: 'RECEIVED' as any,
    progressUpdates: [
      {
        id: '1',
        timestamp: new Date('2024-01-18T09:00:00'),
        status: 'SUBMITTED' as any,
        location: 'System',
        description: 'Warehousing request submitted',
        updatedBy: '1'
      },
      {
        id: '2',
        timestamp: new Date('2024-01-18T11:00:00'),
        status: 'APPROVED' as any,
        location: 'System',
        description: 'Request approved',
        updatedBy: '1'
      },
      {
        id: '3',
        timestamp: new Date('2024-01-18T15:00:00'),
        status: 'RECEIVED' as any,
        location: 'Cold Storage B-5',
        description: 'Cargo received at cold storage facility',
        updatedBy: '1'
      }
    ],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'WH-2024-003',
    requestNumber: 'WH-2024-003',
    type: 'WAREHOUSING',
    status: 'APPROVED' as any,
    priority: 'NORMAL' as any,
    storageType: 'CLIMATE_CONTROLLED' as any,
    estimatedVolume: 75,
    estimatedWeight: 2500,
    cargo: {
      description: 'Pharmaceutical products and medical supplies',
      cargoType: 'VALUABLE' as any,
      weight: 2500,
      dimensions: { length: 180, width: 120, height: 80, unit: 'cm' as any },
      value: 250000,
      currency: 'EUR',
      packaging: 'CRATES' as any,
      stackable: false,
      fragile: true,
      quantity: 15,
      unitType: 'crates'
    },
    estimatedStorageDuration: { value: 6, unit: 'months' },
    plannedStartDate: new Date('2024-01-22'),
    handlingServices: ['LOADING', 'UNLOADING', 'SORTING', 'PICKING'] as any,
    valueAddedServices: ['LABELING', 'QUALITY_CONTROL', 'REPACKAGING'] as any,
    securityLevel: 'MAXIMUM' as any,
    requiresTemperatureControl: true,
    requiresHumidityControl: true,
    requiresSpecialHandling: true,
    currency: 'EUR',
    billingType: 'MONTHLY' as any,
    storageLocation: 'Secure Facility C-1',
    inventoryStatus: 'PENDING_ARRIVAL' as any,
    progressUpdates: [
      {
        id: '1',
        timestamp: new Date('2024-01-20T14:00:00'),
        status: 'SUBMITTED' as any,
        location: 'System',
        description: 'Warehousing request submitted',
        updatedBy: '1'
      },
      {
        id: '2',
        timestamp: new Date('2024-01-21T10:00:00'),
        status: 'APPROVED' as any,
        location: 'System',
        description: 'Request approved, awaiting cargo arrival',
        updatedBy: '1'
      }
    ],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'WH-2024-004',
    requestNumber: 'WH-2024-004',
    type: 'WAREHOUSING',
    status: 'STORED' as any,
    priority: 'LOW' as any,
    storageType: 'AMBIENT' as any,
    estimatedVolume: 120,
    estimatedWeight: 3500,
    cargo: {
      description: 'Textile materials and clothing',
      cargoType: 'GENERAL_CARGO' as any,
      weight: 3500,
      dimensions: { length: 250, width: 200, height: 150, unit: 'cm' as any },
      value: 35000,
      currency: 'EUR',
      packaging: 'PALLETS' as any,
      stackable: true,
      fragile: false,
      quantity: 35,
      unitType: 'pallets'
    },
    estimatedStorageDuration: { value: 1, unit: 'years' },
    plannedStartDate: new Date('2024-01-08'),
    handlingServices: ['LOADING', 'UNLOADING'] as any,
    valueAddedServices: ['LABELING'] as any,
    securityLevel: 'STANDARD' as any,
    requiresTemperatureControl: false,
    requiresHumidityControl: false,
    requiresSpecialHandling: false,
    currency: 'EUR',
    billingType: 'MONTHLY' as any,
    storageLocation: 'Warehouse D-8',
    inventoryStatus: 'IN_STORAGE' as any,
    progressUpdates: [
      {
        id: '1',
        timestamp: new Date('2024-01-07T09:00:00'),
        status: 'SUBMITTED' as any,
        location: 'System',
        description: 'Warehousing request submitted',
        updatedBy: '1'
      },
      {
        id: '2',
        timestamp: new Date('2024-01-07T14:00:00'),
        status: 'APPROVED' as any,
        location: 'System',
        description: 'Request approved',
        updatedBy: '1'
      },
      {
        id: '3',
        timestamp: new Date('2024-01-08T10:00:00'),
        status: 'RECEIVED' as any,
        location: 'Warehouse D-8',
        description: 'Cargo received at warehouse',
        updatedBy: '1'
      },
      {
        id: '4',
        timestamp: new Date('2024-01-08T15:00:00'),
        status: 'STORED' as any,
        location: 'Warehouse D-8',
        description: 'Items stored in designated area',
        updatedBy: '1'
      }
    ],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'WH-2024-005',
    requestNumber: 'WH-2024-005',
    type: 'WAREHOUSING',
    status: 'SUBMITTED' as any,
    priority: 'URGENT' as any,
    storageType: 'HAZARDOUS' as any,
    estimatedVolume: 30,
    estimatedWeight: 1200,
    cargo: {
      description: 'Chemical products and industrial materials',
      cargoType: 'HAZARDOUS' as any,
      weight: 1200,
      dimensions: { length: 100, width: 80, height: 60, unit: 'cm' as any },
      value: 75000,
      currency: 'EUR',
      packaging: 'CONTAINERS' as any,
      stackable: false,
      fragile: false,
      quantity: 8,
      unitType: 'containers'
    },
    estimatedStorageDuration: { value: 3, unit: 'months' },
    plannedStartDate: new Date('2024-01-25'),
    handlingServices: ['LOADING', 'UNLOADING'] as any,
    valueAddedServices: [],
    securityLevel: 'MAXIMUM' as any,
    requiresTemperatureControl: false,
    requiresHumidityControl: false,
    requiresSpecialHandling: true,
    currency: 'EUR',
    billingType: 'MONTHLY' as any,
    storageLocation: undefined,
    inventoryStatus: 'PENDING_ARRIVAL' as any,
    progressUpdates: [
      {
        id: '1',
        timestamp: new Date('2024-01-24T16:00:00'),
        status: 'SUBMITTED' as any,
        location: 'System',
        description: 'Urgent warehousing request submitted',
        updatedBy: '1'
      }
    ],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'WH-2024-006',
    requestNumber: 'WH-2024-006',
    type: 'WAREHOUSING',
    status: 'COMPLETED' as any,
    priority: 'NORMAL' as any,
    storageType: 'FROZEN' as any,
    estimatedVolume: 40,
    estimatedWeight: 1500,
    cargo: {
      description: 'Frozen food products',
      cargoType: 'PERISHABLE' as any,
      weight: 1500,
      dimensions: { length: 150, width: 100, height: 80, unit: 'cm' as any },
      value: 8000,
      currency: 'EUR',
      packaging: 'BOXES' as any,
      stackable: true,
      fragile: false,
      quantity: 60,
      unitType: 'boxes'
    },
    estimatedStorageDuration: { value: 1, unit: 'months' },
    plannedStartDate: new Date('2024-01-05'),
    handlingServices: ['LOADING', 'UNLOADING', 'PICKING'] as any,
    valueAddedServices: ['QUALITY_CONTROL'] as any,
    securityLevel: 'STANDARD' as any,
    requiresTemperatureControl: true,
    requiresHumidityControl: false,
    requiresSpecialHandling: false,
    currency: 'EUR',
    billingType: 'MONTHLY' as any,
    storageLocation: 'Freezer Unit E-3',
    inventoryStatus: 'DISPATCHED' as any,
    progressUpdates: [
      {
        id: '1',
        timestamp: new Date('2024-01-04T10:00:00'),
        status: 'SUBMITTED' as any,
        location: 'System',
        description: 'Warehousing request submitted',
        updatedBy: '1'
      },
      {
        id: '2',
        timestamp: new Date('2024-01-04T14:00:00'),
        status: 'APPROVED' as any,
        location: 'System',
        description: 'Request approved',
        updatedBy: '1'
      },
      {
        id: '3',
        timestamp: new Date('2024-01-05T09:00:00'),
        status: 'RECEIVED' as any,
        location: 'Freezer Unit E-3',
        description: 'Frozen goods received',
        updatedBy: '1'
      },
      {
        id: '4',
        timestamp: new Date('2024-01-05T11:00:00'),
        status: 'STORED' as any,
        location: 'Freezer Unit E-3',
        description: 'Items stored in freezer unit',
        updatedBy: '1'
      },
      {
        id: '5',
        timestamp: new Date('2024-01-10T15:00:00'),
        status: 'COMPLETED' as any,
        location: 'Freezer Unit E-3',
        description: 'Storage period completed, items dispatched',
        updatedBy: '1'
      }
    ],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const mockWarehousingRequestDetail = {
  id: 'WH-2024-001',
  requestNumber: 'WH-2024-001',
  status: 'STORED',
  storageType: 'AMBIENT',
  priority: 'NORMAL',
  storageLocation: 'Warehouse A-12',
  estimatedVolume: 50,
  estimatedWeight: 1000,
  estimatedStorageDuration: { value: 3, unit: 'months' },
  securityLevel: 'STANDARD',
  requiresTemperatureControl: false,
  requiresHumidityControl: false,
  requiresSpecialHandling: false,
  cargo: {
    description: 'Electronic components and spare parts for automotive industry',
    cargoType: 'GENERAL_CARGO',
    packaging: 'PALLETS',
    quantity: 20,
    unitType: 'pallets',
    value: 45000
  },
  handlingServices: ['LOADING', 'UNLOADING', 'SORTING'],
  valueAddedServices: ['LABELING', 'QUALITY_CONTROL'],
  estimatedCost: 1500,
  finalCost: null,
  billingType: 'MONTHLY',
  currency: 'EUR',
  progressUpdates: [
    {
      id: '1',
      timestamp: new Date('2024-01-15T10:00:00'),
      status: 'SUBMITTED',
      location: 'System',
      description: 'Warehousing request submitted and under review'
    },
    {
      id: '2',
      timestamp: new Date('2024-01-15T14:00:00'),
      status: 'APPROVED',
      location: 'Krakow Facility',
      description: 'Request approved, storage space allocated'
    },
    {
      id: '3',
      timestamp: new Date('2024-01-16T09:00:00'),
      status: 'RECEIVED',
      location: 'Warehouse A-12',
      description: 'Cargo received and inspection completed'
    },
    {
      id: '4',
      timestamp: new Date('2024-01-16T11:30:00'),
      status: 'STORED',
      location: 'Warehouse A-12',
      description: 'Items successfully stored and inventory updated'
    }
  ]
} 