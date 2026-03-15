import { Component, OnInit, effect, inject } from '@angular/core';

import { LucideAngularModule, Edit, ArrowUpDown } from 'lucide-angular';

import { InventoryItem, InventoryOverview } from '../inventory/inventory.model';
import { CargoListingFiltersService } from './cargo-listing-filters.service';
import { CargoManagementStatsComponent } from './cargo-management-stats.component';
import { CargoListingFiltersComponent } from './cargo-listing-filters.component';
import { CargoListingComponent } from './cargo-listing.component';
import { CargoService } from './cargo.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { SectionComponent } from '../../ui-library/Section.component';
import { Heading1Component, SubtitleComponent } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-cargo-management',
  standalone: true,
  imports: [
    LucideAngularModule,
    CargoManagementStatsComponent,
    CargoListingFiltersComponent,
    CargoListingComponent,
    SectionComponent,
    Heading1Component,
    SubtitleComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center pb-4">
        <div>
          <ui-heading1>Cargo Management</ui-heading1>
          <ui-subtitle>Track and manage warehouse cargo</ui-subtitle>
        </div>
        <div class="flex space-x-3">
          <button (click)="showAdjustmentModal = true" class="btn btn-secondary">
            <lucide-icon [img]="EditIcon" size="18" class="mr-2"></lucide-icon>
            Adjust Stock
          </button>
          <button (click)="showTransferModal = true" class="btn btn-primary">
            <lucide-icon [img]="ArrowUpDownIcon" size="18" class="mr-2"></lucide-icon>
            Transfer Stock
          </button>
        </div>
      </div>

      <!-- Stats Component -->
      <app-cargo-management-stats [overview]="overview" />

      <!-- Filters Component -->
      <ui-section>
         <app-cargo-listing-filters 
         [categories]="categories"
         [zones]="zones" />
      </ui-section>
      
      <!-- Listing Component -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <app-cargo-listing 
            [items]="filteredItems"
            (adjustItem)="adjustItem($event)" />
        </div>
      </div>
    </div>
  `
})
export class CargoManagementComponent implements OnInit {
  inventoryItems: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  overview: InventoryOverview | null = null;
  categories: string[] = [];
  zones: any[] = [];

  // Modals
  showAdjustmentModal = false;
  showTransferModal = false;

  // Lucide icons
  EditIcon = Edit;
  ArrowUpDownIcon = ArrowUpDown;

  private warehouseService = inject(WarehouseService);
  private cargoService = inject(CargoService);
  private filtersService = inject(CargoListingFiltersService);

  constructor() {
    // Effect to automatically filter items when filters change
    effect(() => {
      this.applyFilters();
    });
  }

  ngOnInit(): void {
    this.loadInventoryData();
  }

  loadInventoryData(): void {
    this.cargoService.getInventoryItems().subscribe(items => {
      this.inventoryItems = items;
      this.filteredItems = items;
      this.categories = [...new Set(items.map(item => item.category))];
    });

    this.cargoService.getInventoryOverview().subscribe(overview => {
      this.overview = overview;
    });

    this.warehouseService.getWarehouses().subscribe(warehouses => {
      if (warehouses.length > 0) {
        this.zones = warehouses[0].zones;
      }
    });
  }

  applyFilters(): void {
    const filters = this.filtersService.filters();
    
    this.filteredItems = this.inventoryItems.filter(item => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (!item.sku.toLowerCase().includes(searchLower) &&
            !item.name.toLowerCase().includes(searchLower) &&
            !item.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Category filter
      if (filters.category && item.category !== filters.category) {
        return false;
      }

      // Status filter
      if (filters.status && item.status !== filters.status) {
        return false;
      }

      // Zone filter
      if (filters.zone && item.zoneId.toString() !== filters.zone) {
        return false;
      }

      return true;
    });
  }

  adjustItem(item: InventoryItem): void {
    // Implementation for adjusting item
    console.log('Adjusting item:', item);
  }
}