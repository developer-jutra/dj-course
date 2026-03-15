// Dashboard
export interface DashboardStats {
  totalCapacity: number;
  usedCapacity: number;
  pendingRequests: number;
  activeReservations: number;
  todayArrivals: number;
  todayDepartures: number;
  revenue: number;
  utilizationRate: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: number;
  assignedBy: number;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  type: 'storage' | 'retrieval' | 'maintenance' | 'inspection';
  relatedEntityId?: number;
  createdAt: Date;
  updatedAt: Date;
} 