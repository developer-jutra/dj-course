import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { AuthService } from '../../auth/auth.service';
import { DashboardStats, Task } from './dashboard.model';
import { UserProfile } from '../user-management/user.model';
import { StorageRequestsFiltersService } from '../storage-requests/storage-requests-listing-filters.service';
import { Heading1Component, SectionHeadingComponent } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, Heading1Component, SectionHeadingComponent],
  template: `
    <div class="space-y-6">
      <!-- Welcome Section -->
      <div class="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-6 text-white">
        <ui-heading1>Welcome back, {{ currentUser?.name }}!</ui-heading1>
        <p class="text-primary-100">{{ currentUser?.role?.[0]?.roleName || 'N/A' }} • {{ currentUser?.warehouseAssignments?.[0]?.warehouseName || 'N/A' }}</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="card p-6 cursor-pointer hover:shadow-md transition-shadow" 
             (click)="navigateToCargoManagement()">
          <div class="flex items-center">
            <div class="p-2 bg-primary-100 rounded-lg">
              <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Capacity Utilization</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats?.utilizationRate }}%</p>
            </div>
          </div>
          <div class="mt-4">
            <div class="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
              <div class="bg-primary-600 h-2 rounded-full" 
                   [style.width.%]="stats?.utilizationRate"></div>
            </div>
          </div>
        </div>

        <div class="card p-6 cursor-pointer hover:shadow-md transition-shadow" 
             (click)="navigateToPendingRequests()">
          <div class="flex items-center">
            <div class="p-2 bg-warning-100 rounded-lg">
              <svg class="h-6 w-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Requests</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats?.pendingRequests }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6 cursor-pointer hover:shadow-md transition-shadow" 
             (click)="navigateToBillingPayments()">
          <div class="flex items-center">
            <div class="p-2 bg-success-100 rounded-lg">
              <svg class="h-6 w-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">\${{ formatCurrency(stats?.revenue) }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6 cursor-pointer hover:shadow-md transition-shadow" 
             (click)="navigateToReservations()">
          <div class="flex items-center">
            <div class="p-2 bg-secondary-100 rounded-lg">
              <svg class="h-6 w-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m0 0V7a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9a2 2 0 012-2h0V7" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Reservations</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats?.activeReservations }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Today's Activity & Tasks -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Today's Activity -->
        <div class="card p-6">
          <ui-section-heading>Today's Activity</ui-section-heading>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <div class="flex items-center">
                <div class="p-2 bg-success-100 rounded-lg mr-3">
                  <svg class="h-4 w-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">Arrivals</span>
              </div>
              <span class="text-lg font-semibold text-success-600">{{ stats?.todayArrivals }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <div class="flex items-center">
                <div class="p-2 bg-primary-100 rounded-lg mr-3">
                  <svg class="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">Departures</span>
              </div>
              <span class="text-lg font-semibold text-primary-600">{{ stats?.todayDepartures }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <div class="flex items-center">
                <div class="p-2 bg-warning-100 rounded-lg mr-3">
                  <svg class="h-4 w-4 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">Used Space</span>
              </div>
              <span class="text-lg font-semibold text-warning-600">{{ formatCurrency(stats?.usedCapacity) }}m³</span>
            </div>
          </div>
        </div>

        <!-- My Tasks -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <ui-section-heading>My Tasks</ui-section-heading>
            <a routerLink="/tasks" class="text-sm text-primary-600 hover:text-primary-500">View all</a>
          </div>
          <div class="space-y-3">
            @for (task of tasks.slice(0, 4); track task.id) {
              <div class="flex items-center justify-between p-3 border border-gray-200 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ task.title }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ task.description }}</p>
                  <div class="flex items-center mt-2">
                    <span [class]="getPriorityClass(task.priority)"
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                      {{ task.priority | titlecase }}
                    </span>
                    <span class="ml-2 text-xs text-gray-400">Due: {{ task.dueDate | date:'MMM d' }}</span>
                  </div>
                </div>
                <div class="ml-4">
                  <span [class]="getStatusClass(task.status)"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                    {{ task.status | titlecase | titlecase }}
                  </span>
                </div>
              </div>
            } @empty {
              <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p class="mt-2 text-sm">No tasks assigned</p>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card p-6">
        <ui-section-heading>Quick Actions</ui-section-heading>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a routerLink="/storage-requests/new" 
             class="flex items-center p-4 border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
            <div class="p-2 bg-primary-100 rounded-lg mr-3">
              <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">New Storage Request</span>
          </a>

          <a routerLink="/cargo-management" 
             class="flex items-center p-4 border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg hover:border-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors">
            <div class="p-2 bg-secondary-100 rounded-lg mr-3">
              <svg class="h-5 w-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">Search Cargo</span>
          </a>

          <a routerLink="/dock-management/schedule" 
             class="flex items-center p-4 border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg hover:border-warning-500 hover:bg-warning-50 dark:hover:bg-warning-900/20 transition-colors">
            <div class="p-2 bg-warning-100 rounded-lg mr-3">
              <svg class="h-5 w-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m0 0V7a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9a2 2 0 012-2h0V7" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">Schedule Dock</span>
          </a>

          <a routerLink="/reports" 
             class="flex items-center p-4 border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg hover:border-success-500 hover:bg-success-50 dark:hover:bg-success-900/20 transition-colors">
            <div class="p-2 bg-success-100 rounded-lg mr-3">
              <svg class="h-5 w-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">View Reports</span>
          </a>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentUser: UserProfile | null = null;
  stats: DashboardStats | null = null;
  tasks: Task[] = [];

  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private storageFiltersService = inject(StorageRequestsFiltersService);

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.dashboardService.getDashboardStats().subscribe(stats => {
      this.stats = stats;
    });

    if (this.currentUser) {
      this.dashboardService.getTasks(this.currentUser.id).subscribe(tasks => {
        this.tasks = tasks;
      });
    }
  }

  navigateToCargoManagement(): void {
    this.router.navigate(['/cargo-management']);
  }

  navigateToPendingRequests(): void {
    // Set the status filter to 'pending' and navigate
    this.storageFiltersService.setStatus('pending');
    this.router.navigate(['/storage-requests']);
  }

  navigateToBillingPayments(): void {
    this.router.navigate(['/billing-payments']);
  }

  navigateToReservations(): void {
    this.router.navigate(['/reservations']);
  }

  formatCurrency(value: number | undefined): string {
    if (!value) return '0';
    return new Intl.NumberFormat('en-US').format(value);
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'urgent': return 'bg-error-100 text-error-800';
      case 'high': return 'bg-warning-100 text-warning-800';
      case 'medium': return 'bg-primary-100 text-primary-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'bg-success-100 text-success-800';
      case 'in_progress': return 'bg-primary-100 text-primary-800';
      case 'cancelled': return 'bg-error-100 text-error-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}