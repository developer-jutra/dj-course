import { Task } from "../features/warehouse-operations/warehouse-operations.model";

export const MOCK_WAREHOUSE_TASKS: Task[] = [
    {
      id: 1,
      title: 'Receive Electronics Shipment',
      description: 'Process incoming electronics from ABC Corp',
      assignedTo: 'Mike Worker',
      assignedToId: 3,
      priority: 'high',
      status: 'pending',
      dueDate: new Date('2025-01-15T10:00:00'),
      estimatedHours: 3,
      category: 'receiving',
      location: 'Dock 1'
    },
    {
      id: 2,
      title: 'Inventory Count - Zone A',
      description: 'Perform cycle count for Zone A electronics',
      assignedTo: 'Sarah Coordinator',
      assignedToId: 2,
      priority: 'medium',
      status: 'in_progress',
      dueDate: new Date('2025-01-15T16:00:00'),
      estimatedHours: 4,
      category: 'inventory',
      location: 'Zone A'
    },
    {
      id: 3,
      title: 'Forklift Maintenance',
      description: 'Scheduled maintenance for Forklift #3',
      assignedTo: 'John Operator',
      assignedToId: 4,
      priority: 'urgent',
      status: 'pending',
      dueDate: new Date('2025-01-15T08:00:00'),
      estimatedHours: 2,
      category: 'maintenance',
      location: 'Maintenance Bay'
    }
]; 