import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../employees/employees.interfaces';
import { LucideAngularModule, UserPlus, UserMinus } from 'lucide-angular';
import { Heading3Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-role-management-tab-user-assignment',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, Heading3Component],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center pb-4">
        <ui-heading3>User Role Assignments</ui-heading3>
        <button (click)="onShowAssignRoleModal()" class="btn btn-primary">
          <lucide-icon [img]="UserPlusIcon" size="18" class="mr-2"></lucide-icon>
          Assign Role
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
          <thead class="bg-gray-50 dark:bg-dark-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Employee
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Assigned Roles
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Assignment
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
            @for (employee of employees(); track employee.id) {
              <tr class="hover:bg-gray-50 dark:hover:bg-dark-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-primary-600">{{ employee.fullName.charAt(0) }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ employee.fullName }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ employee.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    @for (role of employee.roles; track role.roleName) {
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {{ role.roleName }}
                      </span>
                    }
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ getLastAssignmentDate(employee) | date:'MMM d, y' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button (click)="onAssignRole(employee)" class="text-primary-600 hover:text-primary-500 inline-flex items-center">
                    <lucide-icon [img]="UserPlusIcon" size="16" class="mr-1"></lucide-icon>
                    Assign
                  </button>
                  <button (click)="onRemoveRole(employee)" class="text-error-600 hover:text-error-500 inline-flex items-center">
                    <lucide-icon [img]="UserMinusIcon" size="16" class="mr-1"></lucide-icon>
                    Remove
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class RoleManagementTabUserAssignmentComponent {
  // Signal-based inputs
  employees = input<Employee[]>([]);

  // Outputs
  showAssignRoleModal = output<void>();
  assignRole = output<Employee>();
  removeRole = output<Employee>();

  // Lucide icons
  UserPlusIcon = UserPlus;
  UserMinusIcon = UserMinus;

  onShowAssignRoleModal(): void {
    this.showAssignRoleModal.emit();
  }

  onAssignRole(employee: Employee): void {
    this.assignRole.emit(employee);
  }

  onRemoveRole(employee: Employee): void {
    this.removeRole.emit(employee);
  }

  getLastAssignmentDate(employee: Employee): Date {
    if (employee.roles.length === 0) return new Date();
    return employee.roles.reduce((latest, role) => 
      role.assignedDate > latest ? role.assignedDate : latest, employee.roles[0].assignedDate);
  }
}