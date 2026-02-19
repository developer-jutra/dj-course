import { Component, OnInit, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { EmployeesService } from '../employees/employees.service';
import { Role, Employee, AuditLog, Permission } from '../employees/employees.interfaces';
import { RoleManagementTabRolesListComponent } from './role-management-tab-roles-list.component';
import { RoleManagementTabUserAssignmentComponent } from './role-management-tab-user-assignment.component';
import { RoleManagementTabPermissionMatrixComponent } from './role-management-tab-permission-matrix.component';
import { RoleManagementTabAuditLogComponent } from './role-management-tab-audit-log.component';
import { LucideAngularModule, Shield, Users, Plus, Eye } from 'lucide-angular';
import { Heading1Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [
    FormsModule,
    LucideAngularModule,
    RoleManagementTabRolesListComponent,
    RoleManagementTabUserAssignmentComponent,
    RoleManagementTabPermissionMatrixComponent,
    RoleManagementTabAuditLogComponent,
    Heading1Component
],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center pb-4">
        <div>
          <ui-heading1>Role Management</ui-heading1>
          <p class="text-gray-600 dark:text-gray-400">Manage roles, permissions, and user assignments</p>
        </div>
        <button (click)="showCreateRoleModal = true" class="btn btn-primary">
          <lucide-icon [img]="PlusIcon" size="18" class="mr-2"></lucide-icon>
          Create Role
        </button>
      </div>

      <!-- Tab Navigation -->
      <div class="card !mt-2">
        <div class="border-b border-gray-200 dark:border-dark-700">
          <nav class="-mb-px flex space-x-8 px-6">
            @for (tab of tabs; track tab.id) {
              <button (click)="activeTab = tab.id"
                      [class]="getTabClass(tab.id)"
                      class="py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center">
                <lucide-icon [img]="tab.icon" size="18" class="mr-2"></lucide-icon>
                {{ tab.name }}
              </button>
            }
          </nav>
        </div>

        <!-- Roles List Tab -->
        @if (activeTab === 'roles') {
          <app-role-management-tab-roles-list
            [roles]="roles"
            [filteredRoles]="filteredRoles"
            [searchTerm]="searchTerm"
            (searchChange)="onSearchChange($event)"
            (editRole)="editRole($event)"
            (deleteRole)="deleteRole($event)"
            (viewRoleDetails)="viewRoleDetails($event)" />
        } @else if (activeTab === 'assignments') {
          <app-role-management-tab-user-assignment
            [employees]="employees"
            (showAssignRoleModal)="onShowAssignRoleModal()"
            (assignRole)="assignRole($event)"
            (removeRole)="removeRole($event)" />
        } @else if (activeTab === 'matrix') {
          <app-role-management-tab-permission-matrix
            [roles]="roles"
            [allPermissions]="allPermissions"
            (togglePermission)="togglePermission($event)" />
        } @else if (activeTab === 'audit') {
          <app-role-management-tab-audit-log
            [auditLogs]="auditLogs" />
        }
      </div>
    </div>
  `
})
export class RoleManagementComponent implements OnInit {
  activeTab = 'roles';
  roles: Role[] = [];
  filteredRoles: Role[] = [];
  employees: Employee[] = [];
  auditLogs: AuditLog[] = [];
  allPermissions: Permission[] = [];
  searchTerm = '';
  
  // Modal states
  showCreateRoleModal = false;
  showAssignRoleModal = false;

  // Lucide icons
  ShieldIcon = Shield;
  UsersIcon = Users;
  PlusIcon = Plus;
  EyeIcon = Eye;

  tabs = [
    { id: 'roles', name: 'Roles List', icon: Shield },
    { id: 'assignments', name: 'User Assignments', icon: Users },
    { id: 'matrix', name: 'Permission Matrix', icon: Shield },
    { id: 'audit', name: 'Audit Log', icon: Eye }
  ];

  private employeesService = inject(EmployeesService);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.employeesService.getRoles().subscribe(roles => {
      this.roles = roles;
      this.filteredRoles = roles;
      this.extractAllPermissions();
    });

    this.employeesService.getEmployees().subscribe(employees => {
      this.employees = employees;
    });

    this.employeesService.getAuditLogs().subscribe(logs => {
      this.auditLogs = logs;
    });
  }

  extractAllPermissions(): void {
    const permissionMap = new Map();
    this.roles.forEach(role => {
      role.permissions.forEach(permission => {
        permissionMap.set(permission.id, permission);
      });
    });
    this.allPermissions = Array.from(permissionMap.values());
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredRoles = this.roles.filter(role => {
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        return role.name.toLowerCase().includes(searchLower) ||
               role.description.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }

  getTabClass(tabId: string): string {
    return tabId === this.activeTab
      ? 'border-primary-500 text-primary-600'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  }

  editRole(role: Role): void {
    // Implementation for editing role
    console.log('Edit role:', role);
  }

  deleteRole(role: Role): void {
    if (role.assignedUsers.length > 0) {
      alert('Cannot delete role with assigned users');
      return;
    }
    // Implementation for deleting role
    console.log('Delete role:', role);
  }

  viewRoleDetails(role: Role): void {
    // Implementation for viewing role details
    console.log('View role details:', role);
  }

  onShowAssignRoleModal(): void {
    this.showAssignRoleModal = true;
  }

  assignRole(employee: Employee): void {
    // Implementation for assigning role to employee
    console.log('Assign role to employee:', employee);
  }

  removeRole(employee: Employee): void {
    // Implementation for removing role from employee
    console.log('Remove role from employee:', employee);
  }

  togglePermission(event: {role: Role, permission: Permission, checked: boolean}): void {
    // Implementation for toggling permission
    console.log('Toggle permission:', event.role, event.permission, event.checked);
  }
}