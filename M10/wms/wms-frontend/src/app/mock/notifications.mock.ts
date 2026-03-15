import { Notification } from "../notifications/notification.model";

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
      id: 1,
      userId: 1,
      title: 'New Storage Request',
      message: 'ABC Corp has submitted a new storage request',
      type: 'info',
      isRead: false,
      createdAt: new Date()
    },
    {
      id: 2,
      userId: 1,
      title: 'Dock Assignment Complete',
      message: 'Truck ABC-123 has been assigned to Dock 2',
      type: 'success',
      isRead: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: 3,
      userId: 1,
      title: 'Low Stock Alert',
      message: 'Electronics inventory is running low',
      type: 'warning',
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
]; 