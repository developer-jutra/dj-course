import { Component, input } from '@angular/core';

import { Dock } from './dock.model';
import { LucideAngularModule, CheckCircle, Package, AlertTriangle, Calendar } from 'lucide-angular';

@Component({
  selector: 'app-dock-stats',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <!-- Dock Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-success-100 rounded-lg">
            <lucide-icon [img]="CheckCircleIcon" size="24" class="text-success-600"></lucide-icon>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Available Docks</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ getAvailableDocks() }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-primary-100 rounded-lg">
            <lucide-icon [img]="PackageIcon" size="24" class="text-primary-600"></lucide-icon>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Occupied Docks</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ getOccupiedDocks() }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-warning-100 rounded-lg">
            <lucide-icon [img]="AlertTriangleIcon" size="24" class="text-warning-600"></lucide-icon>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Under Maintenance</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ getMaintenanceDocks() }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-secondary-100 rounded-lg">
            <lucide-icon [img]="CalendarIcon" size="24" class="text-secondary-600"></lucide-icon>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Appointments</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ getTodayAppointments() }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DockStatsComponent {
  // Signal-based input
  docks = input<Dock[]>([]);

  // Lucide icons
  CheckCircleIcon = CheckCircle;
  PackageIcon = Package;
  AlertTriangleIcon = AlertTriangle;
  CalendarIcon = Calendar;

  getAvailableDocks(): number {
    return this.docks().filter(dock => dock.status === 'available').length;
  }

  getOccupiedDocks(): number {
    return this.docks().filter(dock => dock.status === 'occupied').length;
  }

  getMaintenanceDocks(): number {
    return this.docks().filter(dock => dock.status === 'maintenance').length;
  }

  getTodayAppointments(): number {
    // Mock data - in real app would calculate from actual appointments
    return 5;
  }
}