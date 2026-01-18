import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StorageRequest } from './storage-request.model';
import { LucideAngularModule, ArrowLeft, Package, User, Calendar, MapPin, DollarSign, FileText, CheckCircle, XCircle, Clock } from 'lucide-angular';
import { StorageRequestService } from './storage-requests.service';
import { Heading1Component, SubtitleComponent, Heading3Component, Heading4Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-storage-request-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, Heading1Component, SubtitleComponent, Heading3Component, Heading4Component],
  template: `
    @if (storageRequest) {
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button routerLink="/storage-requests" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <lucide-icon [img]="ArrowLeftIcon" size="20"></lucide-icon>
            </button>
            <div>
              <ui-heading1>Storage Request #{{ storageRequest.id }}</ui-heading1>
              <ui-subtitle>Request Details</ui-subtitle>
            </div>
            <span [class]="getStatusClass(storageRequest.status)"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
              {{ storageRequest.status | titlecase }}
            </span>
          </div>
          <div class="flex space-x-3">
            @if (storageRequest.status === 'pending') {
              <button
                class="btn btn-success">
                <lucide-icon [img]="CheckCircleIcon" size="18" class="mr-2"></lucide-icon>
                Approve
              </button>
            }
            @if (storageRequest.status === 'pending') {
              <button
                class="btn btn-error">
                <lucide-icon [img]="XCircleIcon" size="18" class="mr-2"></lucide-icon>
                Reject
              </button>
            }
            <button class="btn btn-primary">
              <lucide-icon [img]="FileTextIcon" size="18" class="mr-2"></lucide-icon>
              Generate Report
            </button>
          </div>
        </div>
        <!-- Request Information Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Contractor Information -->
          <div class="card p-6">
                    <ui-heading3 class="mb-4">
          <lucide-icon [img]="UserIcon" size="20"></lucide-icon>
          Contractor Information
        </ui-heading3>
            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Contractor Name</label>
                <a [routerLink]="['/contractors', storageRequest.contractorId]"
                  class="block text-sm text-primary-600 hover:text-primary-500 font-medium mt-1">
                  {{ storageRequest.contractorName }}
                </a>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Contractor ID</label>
                <p class="text-sm text-gray-900 dark:text-white mt-1">#{{ storageRequest.contractorId }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Warehouse</label>
                <p class="text-sm text-gray-900 dark:text-white mt-1">Main Warehouse</p>
              </div>
            </div>
          </div>
          <!-- Request Timeline -->
          <div class="card p-6">
            <ui-heading3 class="mb-4">
              <lucide-icon [img]="CalendarIcon" size="20"></lucide-icon>
              Request Timeline
            </ui-heading3>
            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Requested Entry Date</label>
                <p class="text-sm text-gray-900 dark:text-white mt-1">{{ storageRequest.requestedEntryDate | date:'MMM d, y' }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Requested Exit Date</label>
                <p class="text-sm text-gray-900 dark:text-white mt-1">{{ storageRequest.requestedExitDate | date:'MMM d, y' }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Storage Duration</label>
                <p class="text-sm text-gray-900 dark:text-white mt-1">{{ getStorageDuration() }} days</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Request Created</label>
                <p class="text-sm text-gray-900 dark:text-white mt-1">{{ storageRequest.createdAt | date:'MMM d, y h:mm a' }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Cargo Details -->
        <div class="card p-6">
          <ui-heading3 class="mb-4">
            <lucide-icon [img]="PackageIcon" size="20"></lucide-icon>
            Cargo Details
          </ui-heading3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <p class="text-sm text-gray-900 dark:text-white mt-1">{{ storageRequest.cargoDetails.description }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Weight</label>
                <p class="text-sm text-gray-900 dark:text-white mt-1">{{ storageRequest.cargoDetails.weight }} kg</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Volume</label>
                <p class="text-sm text-gray-900 dark:text-white mt-1">{{ storageRequest.cargoDetails.volume }} m³</p>
              </div>
            </div>
            <div class="space-y-4">
              @if (storageRequest.cargoDetails.estimatedValue) {
                <div>
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Value</label>
                  <p class="text-sm text-gray-900 dark:text-white mt-1">
                    {{'$'}} {{ formatCurrency(storageRequest.cargoDetails.estimatedValue) }} {{ storageRequest.cargoDetails.currency }}
                  </p>
                </div>
              }
              @if (storageRequest.cargoDetails.hazardousClassification) {
                <div>
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Hazardous Classification</label>
                  <p class="text-sm text-gray-900 dark:text-white mt-1">{{ storageRequest.cargoDetails.hazardousClassification }}</p>
                </div>
              }
            </div>
            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Special Requirements</label>
                <div class="mt-2 space-y-2">
                  @if (storageRequest.cargoDetails.requiresRefrigeration) {
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Refrigeration Required
                    </span>
                  }
                  @if (storageRequest.cargoDetails.requiresFreezing) {
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                      Freezing Required
                    </span>
                  }
                  @if (storageRequest.cargoDetails.isHazardous) {
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Hazardous Materials
                    </span>
                  }
                  @if (storageRequest.cargoDetails.containsPerishables) {
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Perishable Goods
                    </span>
                  }
                  @if (!hasSpecialRequirements()) {
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      No special requirements
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
          @if (storageRequest.cargoDetails.specialHandlingInstructions) {
            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-dark-600">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Special Handling Instructions</label>
              <p class="text-sm text-gray-900 dark:text-white mt-1">{{ storageRequest.cargoDetails.specialHandlingInstructions }}</p>
            </div>
          }
        </div>
        <!-- Decision Information -->
        @if (storageRequest.status !== 'pending') {
          <div class="card p-6">
            <ui-heading3 class="mb-4">
              <lucide-icon [img]="getDecisionIcon()" size="20"></lucide-icon>
              Decision Information
            </ui-heading3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Decision</label>
                <span [class]="getStatusClass(storageRequest.status)"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1">
                  {{ storageRequest.status | titlecase }}
                </span>
              </div>
              @if (storageRequest.decisionEmployeeName) {
                <div>
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Decided By</label>
                  <p class="text-sm text-gray-900 dark:text-white mt-1">{{ storageRequest.decisionEmployeeName }}</p>
                </div>
              }
              @if (storageRequest.decisionDate) {
                <div>
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Decision Date</label>
                  <p class="text-sm text-gray-900 dark:text-white mt-1">{{ storageRequest.decisionDate | date:'MMM d, y h:mm a' }}</p>
                </div>
              }
            </div>
          </div>
        }
        <!-- Reservations -->
        @if (storageRequest.reservations.length > 0) {
          <div class="card p-6">
            <ui-heading3 class="mb-4">
              <lucide-icon [img]="MapPinIcon" size="20"></lucide-icon>
              Storage Reservations
            </ui-heading3>
            <div class="space-y-4">
              @for (reservation of storageRequest.reservations; track reservation) {
                <div
                  class="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">{{ reservation.shelfLocation }}</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Reserved Space</label>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ reservation.reservedWeight }}kg / {{ reservation.reservedVolume }}m³
                      </p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Period</label>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ reservation.reservedFrom | date:'MMM d' }} - {{ reservation.reservedUntil | date:'MMM d, y' }}
                      </p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                      <span [class]="getReservationStatusClass(reservation.status)"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1">
                        {{ reservation.status | titlecase }}
                      </span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    }
    
    @if (!storageRequest) {
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <lucide-icon [img]="FileTextIcon" size="48" class="mx-auto text-gray-400 mb-4"></lucide-icon>
          <ui-heading4 class="mt-2">Storage request not found</ui-heading4>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">The requested storage request could not be found.</p>
        </div>
      </div>
    }
    `
})
export class StorageRequestDetailComponent implements OnInit {
  storageRequest: StorageRequest | null = null;
  requestId: number = 0;

  // Lucide icons
  ArrowLeftIcon = ArrowLeft;
  PackageIcon = Package;
  UserIcon = User;
  CalendarIcon = Calendar;
  MapPinIcon = MapPin;
  DollarSignIcon = DollarSign;
  FileTextIcon = FileText;
  CheckCircleIcon = CheckCircle;
  XCircleIcon = XCircle;
  ClockIcon = Clock;

  private route = inject(ActivatedRoute);
  private storageRequestService = inject(StorageRequestService);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.requestId = parseInt(params['id']);
      this.loadStorageRequestDetails();
    });
  }

  loadStorageRequestDetails(): void {
    this.storageRequestService.getStorageRequests().subscribe(requests => {
      this.storageRequest = requests.find(request => request.id === this.requestId) || null;
    });
  }

  getStorageDuration(): number {
    if (!this.storageRequest) return 0;
    const entryDate = new Date(this.storageRequest.requestedEntryDate);
    const exitDate = new Date(this.storageRequest.requestedExitDate);
    const diffTime = Math.abs(exitDate.getTime() - entryDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  hasSpecialRequirements(): boolean {
    if (!this.storageRequest) return false;
    const cargo = this.storageRequest.cargoDetails;
    return cargo.requiresRefrigeration || cargo.requiresFreezing || 
           cargo.isHazardous || cargo.containsPerishables;
  }

  getDecisionIcon() {
    if (!this.storageRequest) return this.ClockIcon;
    switch (this.storageRequest.status) {
      case 'accepted': return this.CheckCircleIcon;
      case 'rejected': return this.XCircleIcon;
      default: return this.ClockIcon;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'accepted': return 'bg-success-100 text-success-800';
      case 'rejected': return 'bg-error-100 text-error-800';
      default: return 'bg-warning-100 text-warning-800';
    }
  }

  getReservationStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-800';
      case 'expired': return 'bg-error-100 text-error-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-warning-100 text-warning-800';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }
}
