import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLog } from '../employees/employees.interfaces';
import { LucideAngularModule, Shield } from 'lucide-angular';
import { Heading3Component, Heading4Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-role-management-tab-audit-log',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, Heading4Component, Heading3Component],
  template: `
    <div class="p-6">
              <ui-heading3 class="mb-6">Role Assignment Audit Log</ui-heading3>
      
      <div class="space-y-4">
        @for (log of auditLogs(); track log.id) {
          <div class="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ log.action }}</span>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {{ log.resourceType }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ log.details }}</p>
                <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>By {{ log.userName }}</span>
                  <span>{{ log.timestamp | date:'MMM d, y h:mm a' }}</span>
                </div>
              </div>
            </div>
          </div>
        } @empty {
          <div class="text-center py-12">
            <lucide-icon [img]="ShieldIcon" size="48" class="mx-auto text-gray-400 mb-4"></lucide-icon>
            <ui-heading4 class="mt-2">No audit logs</ui-heading4>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Role assignment activities will appear here.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class RoleManagementTabAuditLogComponent {
  // Signal-based input
  auditLogs = input<AuditLog[]>([]);

  // Lucide icons
  ShieldIcon = Shield;
}