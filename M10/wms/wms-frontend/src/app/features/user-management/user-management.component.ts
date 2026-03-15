import { Component } from '@angular/core';
import { Heading1Component, Heading4Component } from '../../ui-library/Typography/Typography.component';


@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [Heading1Component, Heading4Component],
  template: `
    <div class="space-y-6">
      <div>
        <ui-heading1>User Management</ui-heading1>
        <p class="text-gray-600 dark:text-gray-400">Manage users, roles, and permissions</p>
      </div>
      
      <div class="card p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
                  <ui-heading4 class="mt-2">User Management</ui-heading4>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">This feature is under development.</p>
      </div>
    </div>
  `
})
export class UserManagementComponent {}