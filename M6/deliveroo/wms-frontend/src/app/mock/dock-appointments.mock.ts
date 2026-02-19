import { DockAppointment } from "../features/warehouse-operations/warehouse-operations.model";

export const MOCK_DOCK_APPOINTMENTS: DockAppointment[] = [
    {
      id: 1,
      dockId: 1,
      dockName: 'Dock 1',
      carrierName: 'Swift Transport',
      truckLicense: 'ABC-123',
      appointmentType: 'receiving',
      scheduledStart: new Date('2025-01-15T09:00:00'),
      scheduledEnd: new Date('2025-01-15T11:00:00'),
      status: 'scheduled',
      cargoDescription: 'Electronics shipment'
    },
    {
      id: 2,
      dockId: 2,
      dockName: 'Dock 2',
      carrierName: 'Global Logistics',
      truckLicense: 'XYZ-789',
      appointmentType: 'shipping',
      scheduledStart: new Date('2025-01-15T14:00:00'),
      scheduledEnd: new Date('2025-01-15T16:00:00'),
      status: 'in_progress',
      cargoDescription: 'Food products'
    }
]; 