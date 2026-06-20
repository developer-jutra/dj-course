// Logowanie rozpoczęcia procesu
print('STARTING MONGO INITIALIZATION FOR CUSTOMER PORTAL');

// Przełączenie na bazę docelową (zgodną z MONGO_INITDB_DATABASE)
db = db.getSiblingDB('customer_portal');

// Tworzenie kolekcji
db.createCollection('dashboard_stats');
db.createCollection('quick_actions');
db.createCollection('recent_requests');
db.createCollection('metrics');
db.createCollection('route_performance');
db.createCollection('transportation_requests');
db.createCollection('warehousing_requests');
db.createCollection('tracking_data');
db.createCollection('companies');
db.createCollection('users');
db.createCollection('notifications');
db.createCollection('invoices');

// Wstawianie danych dla dashboard_stats
db.dashboard_stats.insertMany([
  {
    name: 'Active Shipments',
    value: '12',
    iconName: 'TruckIcon',
    color: 'text-blue-600',
    visible: true
  },
  {
    name: 'Stored Items',
    value: '45',
    iconName: 'BuildingStorefrontIcon',
    color: 'text-green-600',
    visible: true
  },
  {
    name: 'Pending Requests',
    value: '3',
    iconName: 'ClockIcon',
    color: 'text-yellow-600',
    visible: true
  },
  {
    name: 'Completed This Month',
    value: '28',
    iconName: 'CheckCircleIcon',
    color: 'text-purple-600',
    visible: true
  },
  {
    name: 'Internal KPI (Hidden)',
    value: '999',
    iconName: 'ClockIcon',
    color: 'text-red-600',
    visible: false
  },
  {
    name: 'QA Preview Stat (Hidden)',
    value: '17',
    iconName: 'BuildingStorefrontIcon',
    color: 'text-cyan-600',
    visible: false
  }
]);

// Wstawianie danych dla quick_actions
db.quick_actions.insertMany([
  {
    name: 'New Transportation Request',
    description: 'Book a new shipment',
    iconName: 'TruckIcon',
    href: '/dashboard/transportation/new'
  },
  {
    name: 'New Warehousing Request',
    description: 'Request storage space',
    iconName: 'BuildingStorefrontIcon',
    href: '/dashboard/warehousing/new'
  },
  {
    name: 'Track Shipment',
    description: 'Check shipment status',
    iconName: 'MapIcon',
    href: '/dashboard/tracking'
  }
]);

// Wstawianie danych dla recent_requests
db.recent_requests.insertMany([
  {
    id: 'TR-2024-001',
    type: 'Transportation',
    status: 'In Transit',
    route: 'Warsaw → Berlin',
    date: new Date('2024-01-15')
  },
  {
    id: 'WH-2024-002',
    type: 'Warehousing',
    status: 'Stored',
    route: 'Krakow Warehouse',
    date: new Date('2024-01-14')
  },
  {
    id: 'TR-2024-003',
    type: 'Transportation',
    status: 'Delivered',
    route: 'Gdansk → Hamburg',
    date: new Date('2024-01-13')
  }
]);

// Wstawianie danych dla metrics (pojedynczy dokument)
db.metrics.insertOne({
  totalShipments: 156,
  onTimeDelivery: 94.2,
  totalCost: 45750,
  storageVolume: 2340
});

// Wstawianie danych dla route_performance
db.route_performance.insertMany([
  {
    route: 'Warsaw → Berlin',
    shipments: 45,
    onTimePercentage: 96,
    avgCost: 850,
    totalRevenue: 38250
  },
  {
    route: 'Krakow → Vienna',
    shipments: 32,
    onTimePercentage: 91,
    avgCost: 720,
    totalRevenue: 23040
  },
  {
    route: 'Gdansk → Hamburg',
    shipments: 28,
    onTimePercentage: 98,
    avgCost: 950,
    totalRevenue: 26600
  },
  {
    route: 'Wroclaw → Prague',
    shipments: 22,
    onTimePercentage: 89,
    avgCost: 650,
    totalRevenue: 14300
  },
  {
    route: 'Poznan → Amsterdam',
    shipments: 29,
    onTimePercentage: 93,
    avgCost: 1200,
    totalRevenue: 34800
  }
]);

// Wstawianie danych dla transportation_requests
db.transportation_requests.insertMany([
  {
    requestNumber: 'TR-2024-001',
    type: 'TRANSPORTATION',
    status: 'IN_TRANSIT',
    priority: 'NORMAL',
    pickupLocation: {
      address: { city: 'Warsaw', country: 'Poland', street: 'ul. Logistyczna 123', postalCode: '00-001' },
      contactPerson: 'John Doe',
      contactPhone: '+48123456789',
      contactEmail: 'john@example.com',
      operatingHours: {
        monday: { open: '08:00', close: '17:00' },
        tuesday: { open: '08:00', close: '17:00' },
        wednesday: { open: '08:00', close: '17:00' },
        thursday: { open: '08:00', close: '17:00' },
        friday: { open: '08:00', close: '17:00' },
        saturday: { open: '09:00', close: '13:00' },
        sunday: { open: 'closed', close: 'closed' }
      },
      loadingType: 'DOCK',
      facilityType: 'WAREHOUSE'
    },
    deliveryLocation: {
      address: { city: 'Berlin', country: 'Germany', street: 'Hauptstraße 456', postalCode: '10115' },
      contactPerson: 'Jane Smith',
      contactPhone: '+49123456789',
      contactEmail: 'jane@example.com',
      operatingHours: {
        monday: { open: '07:00', close: '18:00' },
        tuesday: { open: '07:00', close: '18:00' },
        wednesday: { open: '07:00', close: '18:00' },
        thursday: { open: '07:00', close: '18:00' },
        friday: { open: '07:00', close: '18:00' },
        saturday: { open: 'closed', close: 'closed' },
        sunday: { open: 'closed', close: 'closed' }
      },
      loadingType: 'DOCK',
      facilityType: 'WAREHOUSE'
    },
    cargo: {
      description: 'Electronics and components',
      cargoType: 'GENERAL_CARGO',
      weight: 1500,
      dimensions: { length: 200, width: 120, height: 100, unit: 'cm' },
      value: 25000,
      currency: 'EUR',
      packaging: 'PALLETS',
      stackable: true,
      fragile: false,
      quantity: 10,
      unitType: 'pallets'
    },
    serviceType: 'FULL_TRUCKLOAD',
    vehicleRequirements: {
      vehicleType: 'TRUCK',
      capacity: 2000,
      specialEquipment: [],
      driverRequirements: []
    },
    requestedPickupDate: new Date('2024-01-15'),
    requestedDeliveryDate: new Date('2024-01-17'),
    requiresInsurance: true,
    requiresCustomsClearance: false,
    currency: 'EUR',
    trackingNumber: 'TRK123456789',
    progressUpdates: [],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-15')
  },
  {
    requestNumber: 'TR-2024-002',
    type: 'TRANSPORTATION',
    status: 'DELIVERED',
    priority: 'HIGH',
    pickupLocation: {
      address: { city: 'Krakow', country: 'Poland', street: 'ul. Przemysłowa 789', postalCode: '30-001' },
      contactPerson: 'Anna Kowalski',
      contactPhone: '+48987654321',
      contactEmail: 'anna@example.com',
      operatingHours: {
        monday: { open: '06:00', close: '16:00' },
        tuesday: { open: '06:00', close: '16:00' },
        wednesday: { open: '06:00', close: '16:00' },
        thursday: { open: '06:00', close: '16:00' },
        friday: { open: '06:00', close: '16:00' },
        saturday: { open: 'closed', close: 'closed' },
        sunday: { open: 'closed', close: 'closed' }
      },
      loadingType: 'GROUND',
      facilityType: 'FACTORY'
    },
    deliveryLocation: {
      address: { city: 'Vienna', country: 'Austria', street: 'Industriestraße 321', postalCode: '1010' },
      contactPerson: 'Hans Mueller',
      contactPhone: '+43123456789',
      contactEmail: 'hans@example.com',
      operatingHours: {
        monday: { open: '08:00', close: '17:00' },
        tuesday: { open: '08:00', close: '17:00' },
        wednesday: { open: '08:00', close: '17:00' },
        thursday: { open: '08:00', close: '17:00' },
        friday: { open: '08:00', close: '17:00' },
        saturday: { open: 'closed', close: 'closed' },
        sunday: { open: 'closed', close: 'closed' }
      },
      loadingType: 'DOCK',
      facilityType: 'WAREHOUSE'
    },
    cargo: {
      description: 'Machinery parts',
      cargoType: 'GENERAL_CARGO',
      weight: 3000,
      dimensions: { length: 300, width: 150, height: 120, unit: 'cm' },
      value: 50000,
      currency: 'EUR',
      packaging: 'CRATES',
      stackable: false,
      fragile: true,
      quantity: 5,
      unitType: 'crates'
    },
    serviceType: 'EXPRESS_DELIVERY',
    vehicleRequirements: {
      vehicleType: 'TRUCK',
      capacity: 3500,
      specialEquipment: [],
      driverRequirements: []
    },
    requestedPickupDate: new Date('2024-01-12'),
    requestedDeliveryDate: new Date('2024-01-13'),
    requiresInsurance: true,
    requiresCustomsClearance: false,
    currency: 'EUR',
    trackingNumber: 'TRK987654321',
    progressUpdates: [],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-13')
  },
  {
    requestNumber: 'TR-2024-003',
    type: 'TRANSPORTATION',
    status: 'PICKUP_SCHEDULED',
    priority: 'NORMAL',
    pickupLocation: {
      address: { city: 'Prague', country: 'Czech Republic', street: 'Průmyslová 555', postalCode: '110 00' },
      contactPerson: 'Pavel Novák',
      contactPhone: '+420123456789',
      contactEmail: 'pavel@example.com',
      operatingHours: {
        monday: { open: '07:00', close: '15:00' },
        tuesday: { open: '07:00', close: '15:00' },
        wednesday: { open: '07:00', close: '15:00' },
        thursday: { open: '07:00', close: '15:00' },
        friday: { open: '07:00', close: '15:00' },
        saturday: { open: 'closed', close: 'closed' },
        sunday: { open: 'closed', close: 'closed' }
      },
      loadingType: 'CRANE',
      facilityType: 'WAREHOUSE'
    },
    deliveryLocation: {
      address: { city: 'Hamburg', country: 'Germany', street: 'Hafenstraße 888', postalCode: '20095' },
      contactPerson: 'Klaus Weber',
      contactPhone: '+49987654321',
      contactEmail: 'klaus@example.com',
      operatingHours: {
        monday: { open: '06:00', close: '22:00' },
        tuesday: { open: '06:00', close: '22:00' },
        wednesday: { open: '06:00', close: '22:00' },
        thursday: { open: '06:00', close: '22:00' },
        friday: { open: '06:00', close: '22:00' },
        saturday: { open: '08:00', close: '16:00' },
        sunday: { open: '08:00', close: '16:00' }
      },
      loadingType: 'DOCK',
      facilityType: 'PORT'
    },
    cargo: {
      description: 'Industrial equipment',
      cargoType: 'OVERSIZED',
      weight: 5000,
      dimensions: { length: 500, width: 250, height: 200, unit: 'cm' },
      value: 120000,
      currency: 'EUR',
      packaging: 'BULK',
      stackable: false,
      fragile: false,
      quantity: 1,
      unitType: 'unit'
    },
    serviceType: 'OVERSIZED_CARGO',
    vehicleRequirements: {
      vehicleType: 'FLATBED',
      capacity: 6000,
      specialEquipment: ['crane', 'straps'],
      driverRequirements: ['oversized_cargo_license']
    },
    requestedPickupDate: new Date('2024-01-18'),
    requestedDeliveryDate: new Date('2024-01-20'),
    requiresInsurance: true,
    requiresCustomsClearance: false,
    currency: 'EUR',
    trackingNumber: 'TRK456789123',
    progressUpdates: [],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-17')
  }
]);

// Wstawianie danych dla warehousing_requests
db.warehousing_requests.insertMany([
  {
    requestNumber: 'WH-2024-001',
    type: 'WAREHOUSING',
    status: 'STORED',
    priority: 'NORMAL',
    storageType: 'AMBIENT',
    estimatedVolume: 50,
    estimatedWeight: 1000,
    cargo: {
      description: 'Electronic components and spare parts for automotive industry',
      cargoType: 'GENERAL_CARGO',
      weight: 1000,
      dimensions: { length: 200, width: 150, height: 100, unit: 'cm' },
      value: 45000,
      currency: 'EUR',
      packaging: 'PALLETS',
      stackable: true,
      fragile: false,
      quantity: 20,
      unitType: 'pallets'
    },
    estimatedStorageDuration: { value: 3, unit: 'months' },
    plannedStartDate: new Date('2024-01-15'),
    handlingServices: ['LOADING', 'UNLOADING', 'SORTING'],
    valueAddedServices: ['LABELING', 'QUALITY_CONTROL'],
    securityLevel: 'STANDARD',
    requiresTemperatureControl: false,
    requiresHumidityControl: false,
    requiresSpecialHandling: false,
    currency: 'EUR',
    billingType: 'MONTHLY',
    storageLocation: 'Warehouse A-12',
    inventoryStatus: 'IN_STORAGE',
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
        status: 'APPROVED',
        location: 'Krakow Facility',
        description: 'Request approved, storage space allocated',
        updatedBy: '1'
      },
      {
        id: '3',
        timestamp: new Date('2024-01-16T09:00:00'),
        status: 'RECEIVED',
        location: 'Warehouse A-12',
        description: 'Cargo received and inspection completed',
        updatedBy: '1'
      },
      {
        id: '4',
        timestamp: new Date('2024-01-16T11:30:00'),
        status: 'STORED',
        location: 'Warehouse A-12',
        description: 'Items successfully stored and inventory updated',
        updatedBy: '1'
      }
    ],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16')
  },
  {
    requestNumber: 'WH-2024-002',
    type: 'WAREHOUSING',
    status: 'RECEIVED',
    priority: 'HIGH',
    storageType: 'REFRIGERATED',
    estimatedVolume: 25,
    estimatedWeight: 800,
    cargo: {
      description: 'Fresh food products and beverages',
      cargoType: 'PERISHABLE',
      weight: 800,
      dimensions: { length: 120, width: 80, height: 60, unit: 'cm' },
      value: 12000,
      currency: 'EUR',
      packaging: 'BOXES',
      stackable: true,
      fragile: true,
      quantity: 40,
      unitType: 'boxes'
    },
    estimatedStorageDuration: { value: 2, unit: 'weeks' },
    plannedStartDate: new Date('2024-01-18'),
    handlingServices: ['LOADING', 'UNLOADING', 'PICKING'],
    valueAddedServices: ['QUALITY_CONTROL'],
    securityLevel: 'HIGH',
    requiresTemperatureControl: true,
    requiresHumidityControl: true,
    requiresSpecialHandling: true,
    currency: 'EUR',
    billingType: 'DAILY',
    storageLocation: 'Cold Storage B-5',
    inventoryStatus: 'RECEIVED',
    progressUpdates: [
      {
        id: '1',
        timestamp: new Date('2024-01-18T09:00:00'),
        status: 'SUBMITTED',
        location: 'System',
        description: 'Warehousing request submitted',
        updatedBy: '1'
      },
      {
        id: '2',
        timestamp: new Date('2024-01-18T11:00:00'),
        status: 'APPROVED',
        location: 'System',
        description: 'Request approved',
        updatedBy: '1'
      },
      {
        id: '3',
        timestamp: new Date('2024-01-18T15:00:00'),
        status: 'RECEIVED',
        location: 'Cold Storage B-5',
        description: 'Cargo received at cold storage facility',
        updatedBy: '1'
      }
    ],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-18')
  },
  {
    requestNumber: 'WH-2024-003',
    type: 'WAREHOUSING',
    status: 'APPROVED',
    priority: 'NORMAL',
    storageType: 'CLIMATE_CONTROLLED',
    estimatedVolume: 75,
    estimatedWeight: 2500,
    cargo: {
      description: 'Pharmaceutical products and medical supplies',
      cargoType: 'VALUABLE',
      weight: 2500,
      dimensions: { length: 180, width: 120, height: 80, unit: 'cm' },
      value: 250000,
      currency: 'EUR',
      packaging: 'CRATES',
      stackable: false,
      fragile: true,
      quantity: 15,
      unitType: 'crates'
    },
    estimatedStorageDuration: { value: 6, unit: 'months' },
    plannedStartDate: new Date('2024-01-22'),
    handlingServices: ['LOADING', 'UNLOADING', 'SORTING', 'PICKING'],
    valueAddedServices: ['LABELING', 'QUALITY_CONTROL', 'REPACKAGING'],
    securityLevel: 'MAXIMUM',
    requiresTemperatureControl: true,
    requiresHumidityControl: true,
    requiresSpecialHandling: true,
    currency: 'EUR',
    billingType: 'MONTHLY',
    storageLocation: 'Secure Facility C-1',
    inventoryStatus: 'PENDING_ARRIVAL',
    progressUpdates: [
      {
        id: '1',
        timestamp: new Date('2024-01-20T14:00:00'),
        status: 'SUBMITTED',
        location: 'System',
        description: 'Warehousing request submitted',
        updatedBy: '1'
      },
      {
        id: '2',
        timestamp: new Date('2024-01-21T10:00:00'),
        status: 'APPROVED',
        location: 'System',
        description: 'Request approved, awaiting cargo arrival',
        updatedBy: '1'
      }
    ],
    createdBy: '1',
    companyId: '1',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-21')
  }
]);

// Wstawianie danych dla tracking_data (GeoJSON FeatureCollection, RFC 7946)
// Współrzędne w kolejności [lng, lat]
db.tracking_data.insertMany([
  {
    type: 'FeatureCollection',
    trackingNumber: 'TRK123456789',
    status: 'IN_TRANSIT',
    serviceType: 'FULL_TRUCKLOAD',
    origin: 'Warsaw, Poland',
    destination: 'Berlin, Germany',
    estimatedDelivery: '2024-01-17T16:00:00',
    updates: [
      { id: '1', timestamp: new Date('2024-01-15T08:00:00'), status: 'PICKUP_SCHEDULED', location: 'Warsaw, Poland', description: 'Pickup scheduled for 08:00', estimatedTime: '2024-01-15T08:00:00' },
      { id: '2', timestamp: new Date('2024-01-15T09:30:00'), status: 'PICKED_UP', location: 'Warsaw, Poland', description: 'Cargo successfully picked up', estimatedTime: '2024-01-15T09:00:00', actualTime: '2024-01-15T09:30:00' },
      { id: '3', timestamp: new Date('2024-01-15T14:00:00'), status: 'IN_TRANSIT', location: 'Łódź, Poland', description: 'In transit to destination', estimatedTime: '2024-01-15T13:30:00', actualTime: '2024-01-15T14:00:00' }
    ],
    features: [
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[21.0122, 52.2297], [19.4794, 52.0907], [19.4560, 51.7592], [16.9252, 52.4064], [13.4050, 52.5200]] }, properties: { kind: 'route', name: 'Warsaw, Poland → Berlin, Germany', waypoints: ['Warsaw, Poland', 'Łódź, Poland', 'Kutno, Poland', 'Poznań, Poland', 'Berlin, Germany'] } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [21.0122, 52.2297] }, properties: { kind: 'event', type: 'pickup', name: 'Warsaw Depot', description: 'Cargo picked up from distribution center', estimatedTime: '2024-01-15T09:00:00', actualTime: '2024-01-15T09:30:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [20.2000, 52.1500] }, properties: { kind: 'event', type: 'refuel', name: 'Gas Station A2', description: 'Scheduled refueling stop', estimatedTime: '2024-01-15T11:00:00', actualTime: '2024-01-15T11:15:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [19.4794, 52.0907] }, properties: { kind: 'event', type: 'current', name: 'Łódź Transit Hub', description: 'Current location - sorting facility', estimatedTime: '2024-01-15T13:30:00', actualTime: '2024-01-15T14:00:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [16.9252, 52.4064] }, properties: { kind: 'event', type: 'warehouse', name: 'Poznań Distribution Hub', description: 'Transit through regional hub', estimatedTime: '2024-01-16T08:00:00', isCompleted: false } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [15.0000, 52.3000] }, properties: { kind: 'event', type: 'rest', name: 'Highway Rest Area', description: 'Mandatory driver rest period', estimatedTime: '2024-01-16T14:00:00', isCompleted: false } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [13.4050, 52.5200] }, properties: { kind: 'event', type: 'delivery', name: 'Berlin Warehouse', description: 'Final destination delivery point', estimatedTime: '2024-01-17T16:00:00', isCompleted: false } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [19.4794, 52.0907] }, properties: { kind: 'vehicle', name: 'Current vehicle position' } }
    ]
  },
  {
    type: 'FeatureCollection',
    trackingNumber: 'TRK987654321',
    status: 'DELIVERED',
    serviceType: 'EXPRESS_DELIVERY',
    origin: 'Krakow, Poland',
    destination: 'Vienna, Austria',
    estimatedDelivery: '2024-01-13T10:00:00',
    actualDelivery: '2024-01-13T09:00:00',
    updates: [
      { id: '1', timestamp: new Date('2024-01-12T10:00:00'), status: 'PICKUP_SCHEDULED', location: 'Krakow, Poland', description: 'Express pickup scheduled', estimatedTime: '2024-01-12T11:00:00' },
      { id: '2', timestamp: new Date('2024-01-12T11:00:00'), status: 'PICKED_UP', location: 'Krakow, Poland', description: 'Express cargo picked up', estimatedTime: '2024-01-12T11:00:00', actualTime: '2024-01-12T11:00:00' },
      { id: '3', timestamp: new Date('2024-01-12T18:00:00'), status: 'IN_TRANSIT', location: 'Bratislava, Slovakia', description: 'Crossed border, in transit', estimatedTime: '2024-01-12T17:30:00', actualTime: '2024-01-12T18:00:00' },
      { id: '4', timestamp: new Date('2024-01-13T09:00:00'), status: 'DELIVERED', location: 'Vienna, Austria', description: 'Successfully delivered', estimatedTime: '2024-01-13T10:00:00', actualTime: '2024-01-13T09:00:00' }
    ],
    features: [
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[19.9450, 50.0647], [19.9494, 49.2951], [20.0688, 49.1951], [17.1077, 48.1486], [16.3738, 48.2082]] }, properties: { kind: 'route', name: 'Krakow, Poland → Vienna, Austria', waypoints: ['Krakow, Poland', 'Bielsko-Biała, Poland', 'Žilina, Slovakia', 'Bratislava, Slovakia', 'Vienna, Austria'] } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [19.9450, 50.0647] }, properties: { kind: 'event', type: 'pickup', name: 'Krakow Distribution Center', description: 'Express cargo picked up', estimatedTime: '2024-01-12T11:00:00', actualTime: '2024-01-12T11:00:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [19.8000, 49.5000] }, properties: { kind: 'event', type: 'refuel', name: 'Highway Service Station', description: 'Refueling stop', estimatedTime: '2024-01-12T13:30:00', actualTime: '2024-01-12T13:25:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [20.0688, 49.1951] }, properties: { kind: 'event', type: 'customs', name: 'Žilina Border Crossing', description: 'Customs clearance completed', estimatedTime: '2024-01-12T16:00:00', actualTime: '2024-01-12T15:45:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [17.5000, 48.5000] }, properties: { kind: 'event', type: 'rest', name: 'Driver Rest Area', description: 'Mandatory driver rest period', estimatedTime: '2024-01-12T20:00:00', actualTime: '2024-01-12T20:00:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [17.1077, 48.1486] }, properties: { kind: 'event', type: 'warehouse', name: 'Bratislava Hub', description: 'Transit through distribution hub', estimatedTime: '2024-01-13T06:00:00', actualTime: '2024-01-13T05:45:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [16.3738, 48.2082] }, properties: { kind: 'event', type: 'delivery', name: 'Vienna Delivery Point', description: 'Successfully delivered', estimatedTime: '2024-01-13T10:00:00', actualTime: '2024-01-13T09:00:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [16.3738, 48.2082] }, properties: { kind: 'vehicle', name: 'Current vehicle position' } }
    ]
  },
  {
    type: 'FeatureCollection',
    trackingNumber: 'TRK456789123',
    status: 'PICKUP_SCHEDULED',
    serviceType: 'OVERSIZED_CARGO',
    origin: 'Prague, Czech Republic',
    destination: 'Hamburg, Germany',
    estimatedDelivery: '2024-01-20T14:00:00',
    updates: [
      { id: '1', timestamp: new Date('2024-01-18T08:00:00'), status: 'PICKUP_SCHEDULED', location: 'Prague, Czech Republic', description: 'Oversized cargo pickup scheduled for tomorrow', estimatedTime: '2024-01-19T10:00:00' }
    ],
    features: [
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[14.4378, 50.0755], [13.3089, 50.7753], [11.9603, 50.1109], [9.7320, 52.3759], [9.9937, 53.5511]] }, properties: { kind: 'route', name: 'Prague, Czech Republic → Hamburg, Germany', waypoints: ['Prague, Czech Republic', 'Karlovy Vary, Czech Republic', 'Bayreuth, Germany', 'Hannover, Germany', 'Hamburg, Germany'] } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [14.4378, 50.0755] }, properties: { kind: 'event', type: 'current', name: 'Prague Depot', description: 'Awaiting pickup - oversized cargo preparation', estimatedTime: '2024-01-19T10:00:00', isCompleted: false } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [13.8000, 50.5000] }, properties: { kind: 'event', type: 'refuel', name: 'Highway Station', description: 'Planned refuel stop', estimatedTime: '2024-01-19T13:00:00', isCompleted: false } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [11.9603, 50.1109] }, properties: { kind: 'event', type: 'customs', name: 'German Border Checkpoint', description: 'Customs inspection for oversized cargo', estimatedTime: '2024-01-19T16:30:00', isCompleted: false } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [10.0000, 52.0000] }, properties: { kind: 'event', type: 'rest', name: 'Overnight Rest Area', description: 'Mandatory overnight rest', estimatedTime: '2024-01-19T22:00:00', isCompleted: false } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [9.9937, 53.5511] }, properties: { kind: 'event', type: 'delivery', name: 'Hamburg Port Terminal', description: 'Final destination - port facility', estimatedTime: '2024-01-20T14:00:00', isCompleted: false } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [14.4378, 50.0755] }, properties: { kind: 'vehicle', name: 'Current vehicle position' } }
    ]
  },
  {
    type: 'FeatureCollection',
    trackingNumber: 'TRK789123456',
    status: 'IN_TRANSIT',
    serviceType: 'EXPRESS_DELIVERY',
    origin: 'Budapest, Hungary',
    destination: 'Amsterdam, Netherlands',
    estimatedDelivery: '2024-01-18T15:00:00',
    updates: [
      { id: '1', timestamp: new Date('2024-01-16T09:00:00'), status: 'PICKUP_SCHEDULED', location: 'Budapest, Hungary', description: 'Express pickup scheduled', estimatedTime: '2024-01-16T10:30:00' },
      { id: '2', timestamp: new Date('2024-01-16T10:30:00'), status: 'PICKED_UP', location: 'Budapest, Hungary', description: 'Cargo picked up successfully', estimatedTime: '2024-01-16T10:30:00', actualTime: '2024-01-16T10:30:00' },
      { id: '3', timestamp: new Date('2024-01-17T08:00:00'), status: 'IN_TRANSIT', location: 'Munich, Germany', description: 'In transit, currently in Munich', estimatedTime: '2024-01-17T08:00:00', actualTime: '2024-01-17T07:45:00' }
    ],
    features: [
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[19.0402, 47.4979], [17.1077, 48.1486], [16.3738, 48.2082], [11.5820, 48.1351], [8.6821, 50.1109], [4.9041, 52.3676]] }, properties: { kind: 'route', name: 'Budapest, Hungary → Amsterdam, Netherlands', waypoints: ['Budapest, Hungary', 'Bratislava, Slovakia', 'Vienna, Austria', 'Munich, Germany', 'Frankfurt, Germany', 'Amsterdam, Netherlands'] } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [19.0402, 47.4979] }, properties: { kind: 'event', type: 'pickup', name: 'Budapest Central Hub', description: 'Express cargo collected', estimatedTime: '2024-01-16T10:30:00', actualTime: '2024-01-16T10:30:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [18.0000, 47.8000] }, properties: { kind: 'event', type: 'refuel', name: 'M1 Service Station', description: 'Refueling completed', estimatedTime: '2024-01-16T12:00:00', actualTime: '2024-01-16T12:10:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [17.1077, 48.1486] }, properties: { kind: 'event', type: 'warehouse', name: 'Bratislava Transit Hub', description: 'Quick transit through hub', estimatedTime: '2024-01-16T15:00:00', actualTime: '2024-01-16T14:45:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [14.0000, 48.0000] }, properties: { kind: 'event', type: 'rest', name: 'Austrian Rest Area', description: 'Driver rest period completed', estimatedTime: '2024-01-16T22:00:00', actualTime: '2024-01-16T22:00:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [11.5820, 48.1351] }, properties: { kind: 'event', type: 'current', name: 'Munich Distribution Center', description: 'Currently at distribution center', estimatedTime: '2024-01-17T08:00:00', actualTime: '2024-01-17T07:45:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [8.6821, 50.1109] }, properties: { kind: 'event', type: 'warehouse', name: 'Frankfurt Major Hub', description: 'Transit through main distribution hub', estimatedTime: '2024-01-17T14:00:00', isCompleted: false } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [4.9041, 52.3676] }, properties: { kind: 'event', type: 'delivery', name: 'Amsterdam Delivery Center', description: 'Final destination delivery', estimatedTime: '2024-01-18T15:00:00', isCompleted: false } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [11.5820, 48.1351] }, properties: { kind: 'vehicle', name: 'Current vehicle position' } }
    ]
  },
  {
    type: 'FeatureCollection',
    trackingNumber: 'TRK321654987',
    status: 'DELIVERED',
    serviceType: 'FULL_TRUCKLOAD',
    origin: 'Gdansk, Poland',
    destination: 'Stockholm, Sweden',
    estimatedDelivery: '2024-01-14T12:00:00',
    actualDelivery: '2024-01-14T11:00:00',
    updates: [
      { id: '1', timestamp: new Date('2024-01-10T08:00:00'), status: 'PICKUP_SCHEDULED', location: 'Gdansk, Poland', description: 'Pickup scheduled from port', estimatedTime: '2024-01-10T10:00:00' },
      { id: '2', timestamp: new Date('2024-01-10T10:00:00'), status: 'PICKED_UP', location: 'Gdansk, Poland', description: 'Cargo loaded and departed', estimatedTime: '2024-01-10T10:00:00', actualTime: '2024-01-10T10:00:00' },
      { id: '3', timestamp: new Date('2024-01-12T14:00:00'), status: 'IN_TRANSIT', location: 'Copenhagen, Denmark', description: 'Crossed border into Denmark', estimatedTime: '2024-01-12T15:00:00', actualTime: '2024-01-12T14:00:00' },
      { id: '4', timestamp: new Date('2024-01-14T11:00:00'), status: 'DELIVERED', location: 'Stockholm, Sweden', description: 'Successfully delivered to warehouse', estimatedTime: '2024-01-14T12:00:00', actualTime: '2024-01-14T11:00:00' }
    ],
    features: [
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[18.6466, 54.3520], [12.5683, 55.6761], [13.1910, 55.7047], [11.9746, 57.7089], [18.0686, 59.3293]] }, properties: { kind: 'route', name: 'Gdansk, Poland → Stockholm, Sweden', waypoints: ['Gdansk, Poland', 'Copenhagen, Denmark', 'Malmö, Sweden', 'Gothenburg, Sweden', 'Stockholm, Sweden'] } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [18.6466, 54.3520] }, properties: { kind: 'event', type: 'pickup', name: 'Gdansk Port Terminal', description: 'Cargo loaded from port facility', estimatedTime: '2024-01-10T10:00:00', actualTime: '2024-01-10T10:00:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [17.0000, 54.8000] }, properties: { kind: 'event', type: 'refuel', name: 'Polish Highway Station', description: 'Refueling stop completed', estimatedTime: '2024-01-10T13:00:00', actualTime: '2024-01-10T12:45:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [12.5683, 55.6761] }, properties: { kind: 'event', type: 'customs', name: 'Copenhagen Border Control', description: 'Border crossing completed', estimatedTime: '2024-01-12T10:00:00', actualTime: '2024-01-12T09:30:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [13.1910, 55.7047] }, properties: { kind: 'event', type: 'warehouse', name: 'Malmö Transit Terminal', description: 'Transit through terminal', estimatedTime: '2024-01-12T16:00:00', actualTime: '2024-01-12T15:45:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [12.8000, 56.5000] }, properties: { kind: 'event', type: 'rest', name: 'Swedish Rest Area', description: 'Mandatory rest stop completed', estimatedTime: '2024-01-13T20:00:00', actualTime: '2024-01-13T20:00:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [11.9746, 57.7089] }, properties: { kind: 'event', type: 'refuel', name: 'Gothenburg Service Station', description: 'Final refuel before destination', estimatedTime: '2024-01-14T08:00:00', actualTime: '2024-01-14T07:45:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [18.0686, 59.3293] }, properties: { kind: 'event', type: 'delivery', name: 'Stockholm Distribution Center', description: 'Delivered successfully', estimatedTime: '2024-01-14T12:00:00', actualTime: '2024-01-14T11:00:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [18.0686, 59.3293] }, properties: { kind: 'vehicle', name: 'Current vehicle position' } }
    ]
  },
  {
    type: 'FeatureCollection',
    trackingNumber: 'TRK654987321',
    status: 'IN_TRANSIT',
    serviceType: 'LESS_THAN_TRUCKLOAD',
    origin: 'Bratislava, Slovakia',
    destination: 'Milan, Italy',
    estimatedDelivery: '2024-01-16T18:00:00',
    updates: [
      { id: '1', timestamp: new Date('2024-01-14T09:00:00'), status: 'PICKUP_SCHEDULED', location: 'Bratislava, Slovakia', description: 'LTL pickup scheduled', estimatedTime: '2024-01-14T11:00:00' },
      { id: '2', timestamp: new Date('2024-01-14T11:00:00'), status: 'PICKED_UP', location: 'Bratislava, Slovakia', description: 'Cargo consolidated and loaded', estimatedTime: '2024-01-14T11:00:00', actualTime: '2024-01-14T11:15:00' },
      { id: '3', timestamp: new Date('2024-01-15T16:00:00'), status: 'IN_TRANSIT', location: 'Bolzano, Italy', description: 'Crossed Alps, entering Italy', estimatedTime: '2024-01-15T16:00:00', actualTime: '2024-01-15T15:45:00' }
    ],
    features: [
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[17.1077, 48.1486], [16.3738, 48.2082], [11.4041, 47.2692], [11.1217, 46.0748], [9.1900, 45.4642]] }, properties: { kind: 'route', name: 'Bratislava, Slovakia → Milan, Italy', waypoints: ['Bratislava, Slovakia', 'Vienna, Austria', 'Innsbruck, Austria', 'Bolzano, Italy', 'Milan, Italy'] } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [17.1077, 48.1486] }, properties: { kind: 'event', type: 'pickup', name: 'Bratislava Consolidation Hub', description: 'LTL cargo consolidated and loaded', estimatedTime: '2024-01-14T11:00:00', actualTime: '2024-01-14T11:15:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [16.3738, 48.2082] }, properties: { kind: 'event', type: 'warehouse', name: 'Vienna Sorting Terminal', description: 'Cargo sorted and processed', estimatedTime: '2024-01-14T14:00:00', actualTime: '2024-01-14T13:45:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [13.0000, 47.8000] }, properties: { kind: 'event', type: 'refuel', name: 'Alpine Service Station', description: 'Mountain route refuel completed', estimatedTime: '2024-01-15T10:00:00', actualTime: '2024-01-15T10:20:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [11.4041, 47.2692] }, properties: { kind: 'event', type: 'rest', name: 'Innsbruck Alpine Rest Stop', description: 'Alpine route rest area', estimatedTime: '2024-01-15T14:00:00', actualTime: '2024-01-15T14:00:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [11.1217, 46.0748] }, properties: { kind: 'event', type: 'current', name: 'Bolzano Border Crossing', description: 'Crossed into Italy - customs cleared', estimatedTime: '2024-01-15T16:00:00', actualTime: '2024-01-15T15:45:00', isCompleted: true } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [9.1900, 45.4642] }, properties: { kind: 'event', type: 'delivery', name: 'Milan Distribution Center', description: 'Final destination delivery', estimatedTime: '2024-01-16T18:00:00', isCompleted: false } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [11.1217, 46.0748] }, properties: { kind: 'vehicle', name: 'Current vehicle position' } }
    ]
  }
]);

// Wstawianie danych dla companies (firmy korzystające z portalu)
db.companies.insertMany([
  {
    id: '1',
    name: 'Deliveroo Logistics Sp. z o.o.',
    taxId: 'PL1234567890',
    industry: 'AUTOMOTIVE',
    accountTier: 'ENTERPRISE',
    address: { city: 'Warsaw', country: 'Poland', street: 'ul. Logistyczna 123', postalCode: '00-001' },
    contactEmail: 'office@deliveroo-logistics.example',
    contactPhone: '+48123456789',
    isActive: true,
    createdAt: new Date('2023-06-01')
  },
  {
    id: '2',
    name: 'NordFresh Foods AB',
    taxId: 'SE556677889901',
    industry: 'FOOD_AND_BEVERAGE',
    accountTier: 'STANDARD',
    address: { city: 'Stockholm', country: 'Sweden', street: 'Hamngatan 12', postalCode: '111 47' },
    contactEmail: 'logistics@nordfresh.example',
    contactPhone: '+46812345678',
    isActive: true,
    createdAt: new Date('2023-09-15')
  },
  {
    id: '3',
    name: 'MediPharm GmbH',
    taxId: 'DE811569876',
    industry: 'PHARMACEUTICAL',
    accountTier: 'PREMIUM',
    address: { city: 'Berlin', country: 'Germany', street: 'Hauptstraße 456', postalCode: '10115' },
    contactEmail: 'supply@medipharm.example',
    contactPhone: '+49123456789',
    isActive: false,
    createdAt: new Date('2024-01-05')
  }
]);

// Wstawianie danych dla users (użytkownicy portalu powiązani z firmami)
db.users.insertMany([
  {
    id: '1',
    companyId: '1',
    email: 'john.doe@deliveroo-logistics.example',
    firstName: 'John',
    lastName: 'Doe',
    role: 'ADMIN',
    isActive: true,
    lastLoginAt: new Date('2024-01-18T07:45:00'),
    createdAt: new Date('2023-06-01')
  },
  {
    id: '2',
    companyId: '1',
    email: 'anna.kowalski@deliveroo-logistics.example',
    firstName: 'Anna',
    lastName: 'Kowalski',
    role: 'OPERATOR',
    isActive: true,
    lastLoginAt: new Date('2024-01-17T12:30:00'),
    createdAt: new Date('2023-07-12')
  },
  {
    id: '3',
    companyId: '2',
    email: 'erik.lindberg@nordfresh.example',
    firstName: 'Erik',
    lastName: 'Lindberg',
    role: 'VIEWER',
    isActive: true,
    lastLoginAt: new Date('2024-01-16T09:10:00'),
    createdAt: new Date('2023-09-15')
  }
]);

// Wstawianie danych dla notifications (powiadomienia o zmianach statusu zleceń)
db.notifications.insertMany([
  {
    userId: '1',
    type: 'STATUS_UPDATE',
    title: 'Shipment in transit',
    message: 'TR-2024-001 (Warsaw → Berlin) is now in transit.',
    relatedRequest: 'TR-2024-001',
    severity: 'INFO',
    isRead: false,
    createdAt: new Date('2024-01-15T14:00:00')
  },
  {
    userId: '1',
    type: 'STATUS_UPDATE',
    title: 'Shipment delivered',
    message: 'TR-2024-002 (Krakow → Vienna) was delivered ahead of schedule.',
    relatedRequest: 'TR-2024-002',
    severity: 'SUCCESS',
    isRead: true,
    createdAt: new Date('2024-01-13T09:05:00')
  },
  {
    userId: '2',
    type: 'WAREHOUSING',
    title: 'Cargo received',
    message: 'WH-2024-002 cargo received at Cold Storage B-5.',
    relatedRequest: 'WH-2024-002',
    severity: 'INFO',
    isRead: false,
    createdAt: new Date('2024-01-18T15:05:00')
  },
  {
    userId: '3',
    type: 'BILLING',
    title: 'New invoice issued',
    message: 'Invoice INV-2024-002 for WH-2024-002 has been issued.',
    relatedRequest: 'WH-2024-002',
    severity: 'WARNING',
    isRead: false,
    createdAt: new Date('2024-01-19T08:00:00')
  }
]);

// Wstawianie danych dla invoices (faktury za zlecenia transportowe i magazynowe)
db.invoices.insertMany([
  {
    invoiceNumber: 'INV-2024-001',
    companyId: '1',
    relatedRequest: 'TR-2024-002',
    type: 'TRANSPORTATION',
    status: 'PAID',
    currency: 'EUR',
    lineItems: [
      { description: 'Express delivery Krakow → Vienna', quantity: 1, unitPrice: 720, amount: 720 },
      { description: 'Cargo insurance', quantity: 1, unitPrice: 95, amount: 95 }
    ],
    subtotal: 815,
    taxRate: 0.23,
    taxAmount: 187.45,
    total: 1002.45,
    issueDate: new Date('2024-01-13'),
    dueDate: new Date('2024-01-27'),
    paidAt: new Date('2024-01-20')
  },
  {
    invoiceNumber: 'INV-2024-002',
    companyId: '1',
    relatedRequest: 'WH-2024-002',
    type: 'WAREHOUSING',
    status: 'ISSUED',
    currency: 'EUR',
    lineItems: [
      { description: 'Refrigerated storage (14 days)', quantity: 14, unitPrice: 35, amount: 490 },
      { description: 'Quality control service', quantity: 1, unitPrice: 120, amount: 120 }
    ],
    subtotal: 610,
    taxRate: 0.23,
    taxAmount: 140.3,
    total: 750.3,
    issueDate: new Date('2024-01-19'),
    dueDate: new Date('2024-02-02'),
    paidAt: null
  },
  {
    invoiceNumber: 'INV-2024-003',
    companyId: '3',
    relatedRequest: 'WH-2024-003',
    type: 'WAREHOUSING',
    status: 'OVERDUE',
    currency: 'EUR',
    lineItems: [
      { description: 'Climate-controlled storage (1 month)', quantity: 1, unitPrice: 1850, amount: 1850 },
      { description: 'Maximum security surcharge', quantity: 1, unitPrice: 400, amount: 400 }
    ],
    subtotal: 2250,
    taxRate: 0.19,
    taxAmount: 427.5,
    total: 2677.5,
    issueDate: new Date('2024-01-22'),
    dueDate: new Date('2024-02-05'),
    paidAt: null
  }
]);

// Tworzenie indeksów
db.recent_requests.createIndex({ "date": -1 });
db.recent_requests.createIndex({ "id": 1 }, { unique: true });
db.route_performance.createIndex({ "route": 1 });
db.dashboard_stats.createIndex({ "visible": 1 });

// Indeksy dla transportation_requests
db.transportation_requests.createIndex({ "requestNumber": 1 }, { unique: true });
db.transportation_requests.createIndex({ "status": 1 });
db.transportation_requests.createIndex({ "priority": 1 });
db.transportation_requests.createIndex({ "createdAt": -1 });
db.transportation_requests.createIndex({ "serviceType": 1 });
db.transportation_requests.createIndex({ "companyId": 1, "status": 1, "createdAt": -1 });

// Indeksy dla warehousing_requests
db.warehousing_requests.createIndex({ "requestNumber": 1 }, { unique: true });
db.warehousing_requests.createIndex({ "status": 1 });
db.warehousing_requests.createIndex({ "priority": 1 });
db.warehousing_requests.createIndex({ "createdAt": -1 });
db.warehousing_requests.createIndex({ "storageType": 1 });
db.warehousing_requests.createIndex({ "companyId": 1, "status": 1, "createdAt": -1 });

// Indeksy dla tracking_data (GeoJSON)
db.tracking_data.createIndex({ "trackingNumber": 1 }, { unique: true });
db.tracking_data.createIndex({ "features.geometry": "2dsphere" });

// Indeksy dla companies
db.companies.createIndex({ "id": 1 }, { unique: true });
db.companies.createIndex({ "taxId": 1 }, { unique: true });
db.companies.createIndex({ "accountTier": 1 });

// Indeksy dla users
db.users.createIndex({ "id": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "companyId": 1 });

// Indeksy dla notifications
db.notifications.createIndex({ "userId": 1, "createdAt": -1 });
db.notifications.createIndex({ "isRead": 1 });
db.notifications.createIndex({ "relatedRequest": 1 });

// Indeksy dla invoices
db.invoices.createIndex({ "invoiceNumber": 1 }, { unique: true });
db.invoices.createIndex({ "companyId": 1 });
db.invoices.createIndex({ "status": 1 });
db.invoices.createIndex({ "dueDate": 1 });

print('MONGO INITIALIZATION FINISHED - All data seeded successfully');
