import { DashboardStats, Task } from "../features/dashboard/dashboard.model";

export const MOCK_DASHBOARD_STATS: DashboardStats = {
    totalCapacity: 18000,
    usedCapacity: 12200,
    pendingRequests: 3,
    activeReservations: 12,
    todayArrivals: 5,
    todayDepartures: 3,
    revenue: 125000,
    utilizationRate: 68
};

export const MOCK_TASKS: Task[] = [
    {
      id: 1,
      title: 'Process Storage Request #1',
      description: 'Review electronics equipment storage request from ABC Corp',
      assignedTo: 1,
      assignedBy: 1,
      dueDate: new Date('2025-01-15'),
      priority: 'high',
      status: 'pending',
      type: 'storage',
      relatedEntityId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      title: 'Dock Maintenance',
      description: 'Perform scheduled maintenance on Dock 3',
      assignedTo: 3,
      assignedBy: 1,
      dueDate: new Date('2025-01-14'),
      priority: 'medium',
      status: 'in_progress',
      type: 'maintenance',
      createdAt: new Date(),
      updatedAt: new Date()
    }
]; 