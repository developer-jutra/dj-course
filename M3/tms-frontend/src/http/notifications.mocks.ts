import { Notification } from "./notifications.model";

export const mockNotifications: Notification[] = [
  { id: 1, type: 'success', message: 'Payment received', time: '2h', icon: '✅' },
  { id: 2, type: 'info', message: 'Order #12345 has been shipped', time: '5h', icon: '📦' },
  { id: 3, type: 'message', message: 'New message from Sarah Wilson', time: '8h', icon: '💬' },
  { id: 4, type: 'warning', message: '3 orders have delayed', time: '1d', icon: '⚠️' },
  { id: 5, type: 'success', message: 'Driver completed delivery', time: '3h', icon: '✅' },
  { id: 6, type: 'info', message: 'Truck TR005 maintenance scheduled', time: '6h', icon: '🔧' },
  { id: 7, type: 'message', message: 'Customer inquiry from John Doe', time: '12h', icon: '💬' },
  { id: 8, type: 'warning', message: 'Low fuel alert for truck TR002', time: '2d', icon: '⛽' },
  { id: 9, type: 'success', message: 'Route optimization completed', time: '4h', icon: '🗺️' },
  { id: 10, type: 'info', message: 'Weather alert for route I-95', time: '7h', icon: '🌧️' },
  { id: 11, type: 'message', message: 'Driver availability request', time: '1d', icon: '👤' },
  { id: 12, type: 'warning', message: 'Traffic delay on Route 101', time: '15h', icon: '🚗' },
];
