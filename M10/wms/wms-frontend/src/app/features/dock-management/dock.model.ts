// Dock Management
export interface Dock {
  id: number;
  warehouseId: number;
  name: string;
  type: 'receiving' | 'shipping' | 'both';
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  currentTruck?: Truck;
  appointments: DockAppointment[];
}

export interface DockAppointment {
  id: number;
  dockId: number;
  truckId: number;
  carrierId: number;
  carrierName: string;
  appointmentType: 'receiving' | 'shipping';
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  relatedStorageRequestIds: number[];
  cargoDescription?: string;
}

export interface Truck {
  id: number;
  licensePlate: string;
  carrierId: number;
  carrierName: string;
  driverId: number;
  driverName: string;
  driverPhone: string;
  truckType: string;
  capacity: number;
  capacityUnit: string;
} 