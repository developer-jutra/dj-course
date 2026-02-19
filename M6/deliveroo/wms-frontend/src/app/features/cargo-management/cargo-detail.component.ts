import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InventoryItem } from '../inventory/inventory.model';
import { CargoDetailsInformationComponent } from './cargo-details-information.component';
import { CargoDetailEventTimelineComponent } from './cargo-detail-event-timeline.component';
import { CargoDetailLocationHistoryComponent } from './cargo-detail-location-history.component';
import { CargoDetailDocumentationComponent } from './cargo-detail-documentation.component';
import { LucideAngularModule, ArrowLeft, Clock, MapPin, FileText, Package } from 'lucide-angular';
import { CargoCacheService } from './cargo-cache.service';
import { Heading1Component, Heading3Component } from '../../ui-library/Typography/Typography.component';
import { generateCargoReportPDF } from '../../lib/pdf/cargoReportPdfGenerator';

@Component({
  selector: 'app-cargo-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    LucideAngularModule,
    CargoDetailsInformationComponent,
    CargoDetailEventTimelineComponent,
    CargoDetailLocationHistoryComponent,
    CargoDetailDocumentationComponent,
    Heading1Component,
    Heading3Component
  ],
  template: `
    @if (cargoItem) {
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button routerLink="/cargo-management" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <lucide-icon [img]="ArrowLeftIcon" size="20"></lucide-icon>
            </button>
            <div>
              <ui-heading1>{{ cargoItem.name }}</ui-heading1>
              <p class="text-gray-600 dark:text-gray-400">SKU: {{ cargoItem.sku }}</p>
            </div>
            <span [class]="getStatusClass(cargoItem.status)" 
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
              {{ cargoItem.status | titlecase }}
            </span>
          </div>
          <div class="flex space-x-3">
            <button class="btn btn-secondary">Edit Details</button>
            <button (click)="generateReport()" class="btn btn-primary">Generate Report</button>
          </div>
        </div>

        <!-- Cargo Information Component -->
        <app-cargo-details-information [cargoItem]="cargoItem" />

        <!-- Sub-tabs -->
        <div class="card">
          <div class="border-b border-gray-200 dark:border-dark-700">
            <nav class="-mb-px flex space-x-8 px-6">
              @for (tab of detailTabs; track tab.id) {
                <button (click)="activeTab = tab.id"
                        [class]="getTabClass(tab.id)"
                        class="py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center">
                  <lucide-icon [img]="tab.icon" size="18" class="mr-2"></lucide-icon>
                  {{ tab.name }}
                </button>
              }
            </nav>
          </div>

          <!-- Event Timeline Tab -->
          @if (activeTab === 'timeline') {
            <app-cargo-detail-event-timeline [cargoItem]="cargoItem" />
          }

          <!-- Location History Tab -->
          @if (activeTab === 'location') {
            <app-cargo-detail-location-history [cargoItem]="cargoItem" />
          }

          <!-- Documentation Tab -->
          @if (activeTab === 'documentation') {
            <app-cargo-detail-documentation [cargoItem]="cargoItem" />
          }
        </div>
      </div>
    } @else {
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <lucide-icon [img]="PackageIcon" size="48" class="mx-auto text-gray-400 mb-4"></lucide-icon>
          <ui-heading3>Cargo item not found</ui-heading3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">The requested cargo item could not be found.</p>
        </div>
      </div>
    }
  `
})
export class CargoDetailComponent implements OnInit {
  cargoItem: InventoryItem | null = null;
  cargoId: number = 0;
  activeTab = 'timeline';

  // Lucide icons
  ArrowLeftIcon = ArrowLeft;
  ClockIcon = Clock;
  MapPinIcon = MapPin;
  FileTextIcon = FileText;
  PackageIcon = Package;

  detailTabs = [
    { id: 'timeline', name: 'Event Timeline', icon: Clock },
    { id: 'location', name: 'Location History', icon: MapPin },
    { id: 'documentation', name: 'Documentation', icon: FileText }
  ];

  private route = inject(ActivatedRoute);
  private cargoCache = inject(CargoCacheService);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.cargoId = parseInt(params['id'], 10);
      this.loadCargoDetails();
    });
  }

  loadCargoDetails(): void {
    this.cargoItem = this.cargoCache.getItemById(this.cargoId) ?? null;
  }

  getTabClass(tabId: string): string {
    return tabId === this.activeTab
      ? 'border-primary-500 text-primary-600'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'available': return 'bg-success-100 text-success-800';
      case 'reserved': return 'bg-primary-100 text-primary-800';
      case 'damaged': return 'bg-error-100 text-error-800';
      case 'expired': return 'bg-warning-100 text-warning-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  async generateReport(): Promise<void> {
    if (!this.cargoItem) return;

    await generateCargoReportPDF(this.cargoItem);
  }
}