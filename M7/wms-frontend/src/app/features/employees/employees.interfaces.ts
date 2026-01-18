export interface Employee {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  hireDate: Date;
  lastLogin?: Date;
  warehouseAssignments: EmployeeWarehouseAssignment[];
  roles: EmployeeRole[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeWarehouseAssignment {
  warehouseId: number;
  warehouseName: string;
  assignedFrom: Date;
  assignedUntil?: Date;
  isActive: boolean;
}

export interface EmployeeRole {
  roleId: number;
  roleName: string;
  assignedDate: Date;
  assignedBy?: number;
  assignedByName?: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  assignedUsers: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: number;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'assign';
}

export interface RoleAssignment {
  id: number;
  roleId: number;
  userId: number;
  assignedBy: number;
  assignedDate: Date;
  removedBy?: number;
  removedDate?: Date;
  isActive: boolean;
}

export interface AuditLog {
  id: number;
  action: string;
  resourceType: string;
  resourceId: number;
  userId: number;
  userName: string;
  details: string;
  timestamp: Date;
}