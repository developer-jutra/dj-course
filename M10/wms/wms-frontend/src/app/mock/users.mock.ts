import { UserProfile } from '../features/user-management/user.model';

export const MOCK_USERS: { [key: string]: UserProfile } = {
  'manager': {
    id: 1,
    name: 'John Manager',
    email: 'manager@wms.com',
    phone: '+1-555-0101',
    role: [{
      roleId: 1,
      roleName: 'Warehouse Manager',
      description: 'Full access to all warehouse operations',
      permissions: [],
      assignedDate: new Date()
    }],
    warehouseAssignments: [{
      warehouseId: 1,
      warehouseName: 'Main Warehouse',
      assignedFrom: new Date(),
      isActive: true
    }],
    lastLogin: new Date(),
    isActive: true
  },
  'coordinator': {
    id: 2,
    name: 'Sarah Coordinator',
    email: 'coordinator@wms.com',
    phone: '+1-555-0102',
    role: [{
      roleId: 2,
      roleName: 'Logistics Coordinator',
      description: 'Manages logistics and coordination',
      permissions: [],
      assignedDate: new Date()
    }],
    warehouseAssignments: [{
      warehouseId: 1,
      warehouseName: 'Main Warehouse',
      assignedFrom: new Date(),
      isActive: true
    }],
    lastLogin: new Date(),
    isActive: true
  },
  'worker': {
    id: 3,
    name: 'Mike Worker',
    email: 'worker@wms.com',
    phone: '+1-555-0103',
    role: [{
      roleId: 3,
      roleName: 'Warehouse Worker',
      description: 'Performs warehouse operations',
      permissions: [],
      assignedDate: new Date()
    }],
    warehouseAssignments: [{
      warehouseId: 1,
      warehouseName: 'Main Warehouse',
      assignedFrom: new Date(),
      isActive: true
    }],
    lastLogin: new Date(),
    isActive: true
  }
};