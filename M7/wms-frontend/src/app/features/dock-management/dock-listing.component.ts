import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Dock } from './dock.model';
import { LucideAngularModule, CheckCircle, Package, AlertTriangle, Lock } from 'lucide-angular';
import { Heading3Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-dock-listing',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, Heading3Component],
  template: `
    <!-- Dock Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      @for (dock of docks(); track dock.id) {
        <div class="card p-6 transition-all hover:shadow-md cursor-pointer"
            [class]="getDockCardClass(dock)"
            [routerLink]="['/dock-management', dock.id]">
          
          <!-- Dock Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div [class]="getDockIconClass(dock.status)" class="p-2 rounded-lg mr-3">
                <lucide-icon [img]="getDockIcon(dock.status)" size="24" class="text-current"></lucide-icon>
              </div>
              <div>
                <ui-heading3>{{ dock.name }}</ui-heading3>
                <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">{{ dock.type }} dock</p>
              </div>
            </div>
            <span [class]="getStatusBadgeClass(dock.status)" 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
              {{ dock.status | titlecase }}
            </span>
          </div>

          <!-- Current Status -->
          <div class="space-y-3">
            @if (dock.status === 'available') {
              <div class="p-3 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800">
                <div class="flex items-center">
                  <lucide-icon [img]="CheckCircleIcon" size="20" class="text-success-600 mr-2"></lucide-icon>
                  <span class="text-sm font-medium text-success-800 dark:text-success-200">Available for scheduling</span>
                </div>
              </div>
            }

            @if (dock.status === 'occupied' && dock.currentTruck) {
              <div class="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-primary-800 dark:text-primary-200">Currently Occupied</span>
                </div>
                <div class="space-y-1">
                  <div class="text-sm text-primary-700 dark:text-primary-300">
                    <strong>Truck:</strong> {{ dock.currentTruck.licensePlate }}
                  </div>
                  <div class="text-sm text-primary-700 dark:text-primary-300">
                    <strong>Carrier:</strong> {{ dock.currentTruck.carrierName }}
                  </div>
                  <div class="text-sm text-primary-700 dark:text-primary-300">
                    <strong>Driver:</strong> {{ dock.currentTruck.driverName }}
                  </div>
                </div>
              </div>
            }

            @if (dock.status === 'maintenance') {
              <div class="p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800">
                <div class="flex items-center">
                  <lucide-icon [img]="AlertTriangleIcon" size="20" class="text-warning-600 mr-2"></lucide-icon>
                  <span class="text-sm font-medium text-warning-800 dark:text-warning-200">Under maintenance</span>
                </div>
              </div>
            }

            @if (dock.status === 'reserved') {
              <div class="p-3 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg border border-secondary-200 dark:border-secondary-800">
                <div class="flex items-center">
                  <lucide-icon [img]="LockIcon" size="20" class="text-secondary-600 mr-2"></lucide-icon>
                  <span class="text-sm font-medium text-secondary-800 dark:text-secondary-200">Reserved</span>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class DockListingComponent {
  // Signal-based input
  docks = input<Dock[]>([]);

  // Outputs
  dockSelected = output<Dock>();

  // Lucide icons
  CheckCircleIcon = CheckCircle;
  PackageIcon = Package;
  AlertTriangleIcon = AlertTriangle;
  LockIcon = Lock;

  getDockIcon(status: string) {
    switch (status) {
      case 'available': return this.CheckCircleIcon;
      case 'occupied': return this.PackageIcon;
      case 'maintenance': return this.AlertTriangleIcon;
      case 'reserved': return this.LockIcon;
      default: return this.PackageIcon;
    }
  }

  getDockCardClass(dock: Dock): string {
    const baseClass = 'border-l-2';
    switch (dock.status) {
      case 'available': return `${baseClass} border-l-success-500`;
      case 'occupied': return `${baseClass} border-l-primary-500`;
      case 'maintenance': return `${baseClass} border-l-warning-500`;
      case 'reserved': return `${baseClass} border-l-secondary-500`;
      default: return `${baseClass} border-l-gray-500`;
    }
  }

  getDockIconClass(status: string): string {
    switch (status) {
      case 'available': return 'bg-success-100 text-success-600';
      case 'occupied': return 'bg-primary-100 text-primary-600';
      case 'maintenance': return 'bg-warning-100 text-warning-600';
      case 'reserved': return 'bg-secondary-100 text-secondary-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'available': return 'bg-success-100 text-success-800';
      case 'occupied': return 'bg-primary-100 text-primary-800';
      case 'maintenance': return 'bg-warning-100 text-warning-800';
      case 'reserved': return 'bg-secondary-100 text-secondary-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}