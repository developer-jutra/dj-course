import { Dock } from '../features/dock-management/dock.model';

export const MOCK_DOCKS: Dock[] = [
  {
    id: 1,
    warehouseId: 1,
    name: 'Dock 1',
    type: 'receiving',
    status: 'available',
    appointments: [],
  },
  {
    id: 2,
    warehouseId: 1,
    name: 'Dock 2',
    type: 'shipping',
    status: 'occupied',
    currentTruck: {
      id: 1,
      licensePlate: 'ABC-123',
      carrierId: 1,
      carrierName: 'Swift Transport',
      driverId: 1,
      driverName: 'John Driver',
      driverPhone: '+1-555-0123',
      truckType: 'Semi-trailer',
      capacity: 40,
      capacityUnit: 'tons',
    },
    appointments: [],
  },
];

export const MOCK_DOCK_ACTIVITY = [
  {
    type: 'arrival',
    description: 'Truck ABC-123 arrived at Dock 2',
    timestamp: new Date(),
    dock: 'Dock 2',
    carrier: 'Swift Transport',
  },
]; 