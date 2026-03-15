import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StorageRequest } from './storage-request.model';
import { LucideAngularModule, Eye, CheckCircle, XCircle, FileText } from 'lucide-angular';
import { Heading4Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-storage-requests-listing',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, Heading4Component],
  template: `
    <!-- Requests List -->
    <div class="overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
          <thead class="bg-gray-50 dark:bg-dark-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contractor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cargo Details
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Entry Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Exit Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
            @for (request of requests(); track request.id) {
              <tr class="hover:bg-gray-50 dark:hover:bg-dark-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  #{{ request.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ request.contractorName }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 dark:text-white">{{ request.cargoDetails.description }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ request.cargoDetails.weight }}kg • {{ request.cargoDetails.volume }}m³
                  </div>
                  <div class="flex mt-1 space-x-1">
                    @if (request.cargoDetails.requiresRefrigeration) {
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Refrigerated
                      </span>
                    }
                    @if (request.cargoDetails.requiresFreezing) {
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                        Frozen
                      </span>
                    }
                    @if (request.cargoDetails.isHazardous) {
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Hazardous
                      </span>
                    }
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ request.requestedEntryDate | date:'MMM d, y' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ request.requestedExitDate | date:'MMM d, y' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusClass(request.status)"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                    {{ request.status | titlecase }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm font-medium">
                  <div class="flex flex-col items-start space-y-2">
                    <button [routerLink]="['/storage-requests', request.id]"
                            class="text-primary-600 hover:text-primary-500 inline-flex items-center">
                      <lucide-icon [img]="EyeIcon" size="16" class="mr-1"></lucide-icon>
                      View
                    </button>
                    @if (request.status === 'pending' && canApprove()) {
                      <button (click)="onApproveRequest(request.id)"
                              class="text-success-600 hover:text-success-500 inline-flex items-center">
                        <lucide-icon [img]="CheckCircleIcon" size="16" class="mr-1"></lucide-icon>
                        Approve
                      </button>
                    }
                    @if (request.status === 'pending' && canApprove()) {
                      <button (click)="onRejectRequest(request.id)"
                              class="text-error-600 hover:text-error-500 inline-flex items-center">
                        <lucide-icon [img]="XCircleIcon" size="16" class="mr-1"></lucide-icon>
                        Reject
                      </button>
                    }
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (requests().length === 0) {
        <div class="text-center py-12">
          <lucide-icon [img]="FileTextIcon" size="48" class="mx-auto text-gray-400 mb-4"></lucide-icon>
          <ui-heading4 class="mt-2">No storage requests</ui-heading4>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ hasActiveFilters() ? 'No requests match your current filters.' : 'Get started by creating a new storage request.' }}
          </p>
        </div>
      }
    </div>
  `
})
export class StorageRequestsListingComponent {
  // Signal-based inputs
  requests = input<StorageRequest[]>([]);
  canApprove = input<boolean>(false);
  hasActiveFilters = input<boolean>(false);

  // Outputs
  approveRequest = output<number>();
  rejectRequest = output<number>();

  // Lucide icons
  EyeIcon = Eye;
  CheckCircleIcon = CheckCircle;
  XCircleIcon = XCircle;
  FileTextIcon = FileText;

  onApproveRequest(requestId: number): void {
    this.approveRequest.emit(requestId);
  }

  onRejectRequest(requestId: number): void {
    this.rejectRequest.emit(requestId);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'accepted': return 'bg-success-100 text-success-800';
      case 'rejected': return 'bg-error-100 text-error-800';
      default: return 'bg-warning-100 text-warning-800';
    }
  }
}