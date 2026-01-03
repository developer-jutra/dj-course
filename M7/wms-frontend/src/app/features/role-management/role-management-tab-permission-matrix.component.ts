import { Component, input, output } from '@angular/core';

import { Role, Permission } from '../employees/employees.interfaces';
import { LucideAngularModule } from 'lucide-angular';
import { Heading3Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-role-management-tab-permission-matrix',
  standalone: true,
  imports: [LucideAngularModule, Heading3Component],
  template: `
    <div class="p-6">
              <ui-heading3 class="mb-6">Permission Matrix</ui-heading3>
      
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-200 dark:border-dark-700">
          <thead class="bg-gray-50 dark:bg-dark-800">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-r border-gray-200 dark:border-dark-700">
                Role / Permission
              </th>
              @for (permission of allPermissions(); track permission.id) {
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-r border-gray-200 dark:border-dark-700">
                  {{ permission.name }}
                </th>
              }
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-dark-800">
            @for (role of roles(); track role.id) {
              <tr class="border-b border-gray-200 dark:border-dark-700">
                <td class="px-4 py-3 font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-dark-700">
                  {{ role.name }}
                </td>
                @for (permission of allPermissions(); track permission.id) {
                  <td class="px-4 py-3 text-center border-r border-gray-200 dark:border-dark-700">
                    <input type="checkbox"
                           [checked]="hasPermission(role, permission)"
                           (change)="onTogglePermission(role, permission, $event)"
                           class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class RoleManagementTabPermissionMatrixComponent {
  // Signal-based inputs
  roles = input<Role[]>([]);
  allPermissions = input<Permission[]>([]);

  // Outputs
  togglePermission = output<{role: Role, permission: Permission, checked: boolean}>();

  onTogglePermission(role: Role, permission: Permission, event: any): void {
    this.togglePermission.emit({
      role,
      permission,
      checked: event.target.checked
    });
  }

  hasPermission(role: Role, permission: Permission): boolean {
    return role.permissions.some(p => p.id === permission.id);
  }
}