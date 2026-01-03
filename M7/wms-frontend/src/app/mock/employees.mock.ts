import { AuditLog, Employee, Role } from "../features/employees/employees.interfaces";

export const MOCK_EMPLOYEES: Employee[] = [
    {
      id: 1,
      fullName: 'John Manager',
      email: 'john.manager@wms.com',
      phone: '+1-555-0101',
      isActive: true,
      hireDate: new Date('2023-01-15'),
      lastLogin: new Date('2025-01-13T14:30:00'),
      warehouseAssignments: [{
        warehouseId: 1,
        warehouseName: 'Main Warehouse',
        assignedFrom: new Date('2023-01-15'),
        isActive: true
      }],
      roles: [{
        roleId: 1,
        roleName: 'Warehouse Manager',
        assignedDate: new Date('2023-01-15'),
        assignedBy: 1,
        assignedByName: 'System Admin'
      }],
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2025-01-13')
    },
    {
      id: 2,
      fullName: 'Sarah Coordinator',
      email: 'sarah.coordinator@wms.com',
      phone: '+1-555-0102',
      isActive: true,
      hireDate: new Date('2023-03-20'),
      lastLogin: new Date('2025-01-13T13:45:00'),
      warehouseAssignments: [{
        warehouseId: 1,
        warehouseName: 'Main Warehouse',
        assignedFrom: new Date('2023-03-20'),
        isActive: true
      }],
      roles: [{
        roleId: 2,
        roleName: 'Logistics Coordinator',
        assignedDate: new Date('2023-03-20'),
        assignedBy: 1,
        assignedByName: 'John Manager'
      }],
      createdAt: new Date('2023-03-20'),
      updatedAt: new Date('2025-01-13')
    },
    {
      id: 3,
      fullName: 'Mike Worker',
      email: 'mike.worker@wms.com',
      phone: '+1-555-0103',
      isActive: true,
      hireDate: new Date('2023-06-10'),
      lastLogin: new Date('2025-01-13T12:15:00'),
      warehouseAssignments: [{
        warehouseId: 1,
        warehouseName: 'Main Warehouse',
        assignedFrom: new Date('2023-06-10'),
        isActive: true
      }],
      roles: [{
        roleId: 3,
        roleName: 'Warehouse Worker',
        assignedDate: new Date('2023-06-10'),
        assignedBy: 1,
        assignedByName: 'John Manager'
      }],
      createdAt: new Date('2023-06-10'),
      updatedAt: new Date('2025-01-13')
    },
    {
      id: 4,
      fullName: 'Emily Inspector',
      email: 'emily.inspector@wms.com',
      phone: '+1-555-0104',
      isActive: true,
      hireDate: new Date('2023-09-15'),
      lastLogin: new Date('2025-01-12T16:30:00'),
      warehouseAssignments: [{
        warehouseId: 1,
        warehouseName: 'Main Warehouse',
        assignedFrom: new Date('2023-09-15'),
        isActive: true
      }],
      roles: [{
        roleId: 4,
        roleName: 'Quality Inspector',
        assignedDate: new Date('2023-09-15'),
        assignedBy: 1,
        assignedByName: 'John Manager'
      }],
      createdAt: new Date('2023-09-15'),
      updatedAt: new Date('2025-01-12')
    },
    {
      id: 5,
      fullName: 'Robert Operator',
      email: 'robert.operator@wms.com',
      phone: '+1-555-0105',
      isActive: false,
      hireDate: new Date('2022-11-20'),
      lastLogin: new Date('2024-12-15T10:00:00'),
      warehouseAssignments: [{
        warehouseId: 1,
        warehouseName: 'Main Warehouse',
        assignedFrom: new Date('2022-11-20'),
        assignedUntil: new Date('2024-12-31'),
        isActive: false
      }],
      roles: [{
        roleId: 3,
        roleName: 'Warehouse Worker',
        assignedDate: new Date('2022-11-20'),
        assignedBy: 1,
        assignedByName: 'John Manager'
      }],
      createdAt: new Date('2022-11-20'),
      updatedAt: new Date('2024-12-31')
    }
];

export const MOCK_ROLES: Role[] = [
    {
      id: 1,
      name: 'Warehouse Manager',
      description: 'Full access to all warehouse operations and management functions',
      permissions: [
        { id: 1, name: 'Manage Users', description: 'Create, update, delete users', resource: 'users', action: 'create' },
        { id: 2, name: 'Manage Roles', description: 'Create, update, delete roles', resource: 'roles', action: 'create' },
        { id: 3, name: 'View Reports', description: 'Access all reports', resource: 'reports', action: 'read' },
        { id: 4, name: 'Approve Requests', description: 'Approve storage requests', resource: 'storage_requests', action: 'approve' }
      ],
      assignedUsers: [1],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: 2,
      name: 'Logistics Coordinator',
      description: 'Manages logistics operations and coordinates warehouse activities',
      permissions: [
        { id: 5, name: 'Manage Storage Requests', description: 'Create, update storage requests', resource: 'storage_requests', action: 'update' },
        { id: 6, name: 'Manage Dock Appointments', description: 'Schedule and manage dock appointments', resource: 'dock_appointments', action: 'create' },
        { id: 7, name: 'View Inventory', description: 'View inventory information', resource: 'inventory', action: 'read' }
      ],
      assignedUsers: [2],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: 3,
      name: 'Warehouse Worker',
      description: 'Performs day-to-day warehouse operations',
      permissions: [
        { id: 8, name: 'Update Inventory', description: 'Update inventory counts and status', resource: 'inventory', action: 'update' },
        { id: 9, name: 'View Tasks', description: 'View assigned tasks', resource: 'tasks', action: 'read' }
      ],
      assignedUsers: [3, 5],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: 4,
      name: 'Quality Inspector',
      description: 'Inspects and validates cargo quality and compliance',
      permissions: [
        { id: 10, name: 'Inspect Cargo', description: 'Perform cargo inspections', resource: 'cargo', action: 'update' },
        { id: 11, name: 'Create Inspection Reports', description: 'Create quality inspection reports', resource: 'inspection_reports', action: 'create' }
      ],
      assignedUsers: [4],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
    {
      id: 1,
      action: 'Role Assigned',
      resourceType: 'User',
      resourceId: 4,
      userId: 1,
      userName: 'John Manager',
      details: 'Assigned Quality Inspector role to Emily Inspector',
      timestamp: new Date('2023-09-15T10:00:00')
    },
    {
      id: 2,
      action: 'User Deactivated',
      resourceType: 'User',
      resourceId: 5,
      userId: 1,
      userName: 'John Manager',
      details: 'Deactivated Robert Operator due to end of contract',
      timestamp: new Date('2024-12-31T17:00:00')
    }
]; 