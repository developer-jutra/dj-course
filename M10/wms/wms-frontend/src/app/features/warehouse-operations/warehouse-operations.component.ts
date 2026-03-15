import { Component, OnInit } from '@angular/core';

import { WarehouseOperationsZoneManagementComponent } from './warehouse-operations-zone-management.component';
import { WarehouseOperationsDockSchedulingComponent } from './warehouse-operations-dock-scheduling.component';
import { WarehouseOperationsTaskAssignmentComponent } from './warehouse-operations-task-assignment.component';
import { LucideAngularModule, Cog, MapPin, Calendar, Users } from 'lucide-angular';
import { Heading1Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-warehouse-operations',
  standalone: true,
  imports: [
    LucideAngularModule,
    WarehouseOperationsZoneManagementComponent,
    WarehouseOperationsDockSchedulingComponent,
    WarehouseOperationsTaskAssignmentComponent,
    Heading1Component
],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <ui-heading1>Warehouse Operations</ui-heading1>
        <p class="text-gray-600 dark:text-gray-400">Configure and monitor warehouse zones, dock scheduling, and task assignments</p>
      </div>

      <!-- Tab Navigation -->
      <div class="card">
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

        <!-- Zone Management Tab -->
        @if (activeTab === 'zones') {
          <app-warehouse-operations-zone-management />
        }

        <!-- Dock Scheduling Tab -->
        @if (activeTab === 'scheduling') {
          <app-warehouse-operations-dock-scheduling />
        }

        <!-- Task Assignment Tab -->
        @if (activeTab === 'tasks') {
          <app-warehouse-operations-task-assignment />
        }
      </div>
    </div>
  `
})
export class WarehouseOperationsComponent implements OnInit {
  activeTab = 'zones';

  tabs = [
    { id: 'zones', name: 'Zone Management', icon: MapPin },
    { id: 'scheduling', name: 'Dock Scheduling', icon: Calendar },
    { id: 'tasks', name: 'Task Assignment', icon: Users }
  ];

  constructor() {}

  ngOnInit(): void {}

  getTabClass(tabId: string): string {
    return tabId === this.activeTab
      ? 'border-primary-500 text-primary-600'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  }
}