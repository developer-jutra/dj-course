import { Permission } from './permissions.model';
import { WarehouseAssignment } from './warehouse-assignment.model';

// User Profile
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole[];
  warehouseAssignments: WarehouseAssignment[];
  lastLogin: Date;
  isActive: boolean;
}

export interface UserRole {
  roleId: number;
  roleName: string;
  description: string;
  permissions: Permission[];
  assignedDate: Date;
} 