import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Dock, DockAppointment } from './dock.model';
import { DockService } from './dock.service';
import { Heading1Component, Heading3Component, Heading4Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-dock-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, Heading1Component, Heading3Component, Heading4Component],
  template: `
    @if (dock) {
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button routerLink="/dock-management" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <ui-heading1>{{ dock.name }}</ui-heading1>
              <p class="text-gray-600 dark:text-gray-400 capitalize">{{ dock.type }} dock</p>
            </div>
            <span [class]="getStatusBadgeClass(dock.status)" 
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
              {{ dock.status | titlecase }}
            </span>
          </div>
          <button class="btn btn-primary">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Schedule Appointment
          </button>
        </div>

        <!-- Current Status Card -->
        <div class="card p-6">
          <ui-heading3 class="mb-4">Current Status</ui-heading3>
          
          @if (dock.status === 'available') {
            <div class="p-4 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800">
              <div class="flex items-center">
                <svg class="h-8 w-8 text-success-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <ui-heading4 class="text-success-800 dark:text-success-200">Available</ui-heading4>
                  <p class="text-success-700 dark:text-success-300">This dock is ready for scheduling</p>
                </div>
              </div>
            </div>
          }

          @if (dock.status === 'occupied' && dock.currentTruck) {
            <div class="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
              <div class="flex items-start">
                <svg class="h-8 w-8 text-primary-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m0 0V7a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9a2 2 0 012-2h0V7" />
                </svg>
                <div class="flex-1">
                  <ui-heading4 class="text-primary-800 dark:text-primary-200 mb-3">Currently Occupied</ui-heading4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm font-medium text-primary-700 dark:text-primary-300">Truck Information</p>
                      <div class="mt-1 space-y-1">
                        <p class="text-sm text-primary-600 dark:text-primary-400">License: {{ dock.currentTruck.licensePlate }}</p>
                        <p class="text-sm text-primary-600 dark:text-primary-400">Type: {{ dock.currentTruck.truckType }}</p>
                        <p class="text-sm text-primary-600 dark:text-primary-400">Capacity: {{ dock.currentTruck.capacity }} {{ dock.currentTruck.capacityUnit }}</p>
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-primary-700 dark:text-primary-300">Driver & Carrier</p>
                      <div class="mt-1 space-y-1">
                        <p class="text-sm text-primary-600 dark:text-primary-400">Driver: {{ dock.currentTruck.driverName }}</p>
                        <p class="text-sm text-primary-600 dark:text-primary-400">Phone: {{ dock.currentTruck.driverPhone }}</p>
                        <p class="text-sm text-primary-600 dark:text-primary-400">Carrier: {{ dock.currentTruck.carrierName }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          @if (dock.status === 'maintenance') {
            <div class="p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800">
              <div class="flex items-center">
                <svg class="h-8 w-8 text-warning-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <ui-heading4 class="text-warning-800 dark:text-warning-200">Under Maintenance</ui-heading4>
                  <p class="text-warning-700 dark:text-warning-300">This dock is temporarily unavailable for operations</p>
                </div>
              </div>
            </div>
          }

          @if (dock.status === 'reserved') {
            <div class="p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg border border-secondary-200 dark:border-secondary-800">
              <div class="flex items-center">
                <svg class="h-8 w-8 text-secondary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <ui-heading4 class="text-secondary-800 dark:text-secondary-200">Reserved</ui-heading4>
                  <p class="text-secondary-700 dark:text-secondary-300">This dock is reserved for upcoming appointments</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    } @else {
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <ui-heading4 class="mt-2">Dock not found</ui-heading4>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">The requested dock could not be found.</p>
        </div>
      </div>
    }
  `
})
export class DockDetailComponent implements OnInit {
  dock: Dock | null = null;
  dockId: number = 0;

  private route = inject(ActivatedRoute);
  private dockService = inject(DockService);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.dockId = parseInt(params['id']);
      this.loadDockDetails();
    });
  }

  loadDockDetails(): void {
    this.dockService.getDock(this.dockId).subscribe(dock => {
      this.dock = dock || null;
    });
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