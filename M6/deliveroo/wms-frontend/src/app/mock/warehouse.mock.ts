import { Warehouse } from '../features/warehouse/warehouse.model';

export const MOCK_WAREHOUSES: Warehouse[] = [
  {
    id: 1,
    name: 'Main Warehouse',
    description: 'Primary distribution center',
    location: {
      id: 1,
      address: '123 Industrial Blvd',
      city: 'Chicago',
      postalCode: '60601',
      country: 'USA',
      coordinates: { latitude: 41.8781, longitude: -87.6298 }
    },
    zones: [
      {
        id: 1,
        warehouseId: 1,
        name: 'Zone A - Standard',
        zoneType: 'standard',
        aisles: [],
        capacity: {
          id: 1,
          entityType: 'ZONE',
          entityId: 1,
          value: 10000,
          unit: 'cubic_meters',
          usedCapacity: 7500,
          availableCapacity: 2500,
          utilizationPercentage: 75
        }
      },
      {
        id: 2,
        warehouseId: 1,
        name: 'Zone B - Refrigerated',
        zoneType: 'refrigerated',
        temperature: { min: 2, max: 8, unit: 'C' },
        aisles: [],
        capacity: {
          id: 2,
          entityType: 'ZONE',
          entityId: 2,
          value: 5000,
          unit: 'cubic_meters',
          usedCapacity: 3200,
          availableCapacity: 1800,
          utilizationPercentage: 64
        }
      },
      {
        id: 3,
        warehouseId: 1,
        name: 'Zone C - Frozen',
        zoneType: 'frozen',
        temperature: { min: -20, max: -18, unit: 'C' },
        aisles: [],
        capacity: {
          id: 3,
          entityType: 'ZONE',
          entityId: 3,
          value: 3000,
          unit: 'cubic_meters',
          usedCapacity: 1500,
          availableCapacity: 1500,
          utilizationPercentage: 50
        }
      }
    ],
    capacity: {
      id: 1,
      entityType: 'WAREHOUSE',
      entityId: 1,
      value: 18000,
      unit: 'cubic_meters',
      usedCapacity: 12200,
      availableCapacity: 5800,
      utilizationPercentage: 68
    },
    isActive: true
  }
];