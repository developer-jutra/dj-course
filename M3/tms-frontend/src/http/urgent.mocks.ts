import { UrgentItem, AvailableEmployee } from "./urgent.model";

export const mockUrgentItems: UrgentItem[] = [
  {
    id: 1,
    type: 'delay',
    priority: 'high',
    message: 'Shipment SH001 delayed by 3 hours',
    action: 'Contact customer',
    assignee: 'Mike Johnson'
  },
  {
    id: 2,
    type: 'maintenance',
    priority: 'medium',
    message: 'Truck TR003 requires urgent maintenance',
    action: 'Schedule service',
    assignee: 'Sarah Lee'
  },
  {
    id: 3,
    type: 'payment',
    priority: 'high',
    message: 'Payment PAY002 overdue by 5 days',
    action: 'Follow up with client',
    assignee: 'David Chen'
  },
  {
    id: 4,
    type: 'driver',
    priority: 'low',
    message: 'Driver license expires in 30 days',
    action: 'Renewal reminder',
    assignee: 'Mike Johnson'
  }
];

export const mockAvailableEmployees: AvailableEmployee[] = [
  { id: '1', name: 'Mike Johnson' },
  { id: '2', name: 'Sarah Lee' },
  { id: '3', name: 'David Chen' },
  { id: '4', name: 'Lisa Park' },
  { id: '5', name: 'Alex Rodriguez' },
  { id: '6', name: 'Emma Wilson' },
  { id: '7', name: 'Tom Anderson' },
];
