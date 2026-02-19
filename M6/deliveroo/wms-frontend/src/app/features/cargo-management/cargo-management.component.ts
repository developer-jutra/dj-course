import { Component, OnInit, effect, inject, signal } from '@angular/core';

import { LucideAngularModule, Edit, ArrowUpDown } from 'lucide-angular';

import { InventoryItem, InventoryOverview } from '../inventory/inventory.model';
import { CargoListingFiltersService } from './cargo-listing-filters.service';
import { CargoManagementStatsComponent } from './cargo-management-stats.component';
import { CargoListingFiltersComponent } from './cargo-listing-filters.component';
import { CargoListingComponent } from './cargo-listing.component';
import { CargoService } from './cargo.service';
import { CargoCacheService } from './cargo-cache.service';
import { SectionComponent } from '../../ui-library/Section.component';
import { Heading1Component, SubtitleComponent } from '../../ui-library/Typography/Typography.component';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

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
          <ui-subtitle>Search warehouse cargo by description (WMS API)</ui-subtitle>
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
      <app-cargo-management-stats [overview]="overview()" />

      <!-- Filters Component -->
      <ui-section>
         <app-cargo-listing-filters 
         [categories]="categories()"
         [zones]="zones()" />
      </ui-section>
      
      <!-- Listing Component -->
      <div class="card overflow-hidden">
        @if (isLoading()) {
          <div class="p-8 text-center text-gray-500 dark:text-gray-400">Loading cargo...</div>
        } @else if (!hasSearched()) {
          <div class="p-8 text-center">
            <p class="text-gray-600 dark:text-gray-400">Enter a search term above to find cargo by description.</p>
            <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">Try searching for "electronics", "machinery", or partial words.</p>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <app-cargo-listing 
              [items]="filteredItems()"
              (adjustItem)="adjustItem($event)" />
          </div>
        }
      </div>
    </div>
  `
})
export class CargoManagementComponent implements OnInit {
  inventoryItems = signal<InventoryItem[]>([]);
  filteredItems = signal<InventoryItem[]>([]);
  overview = signal<InventoryOverview | null>(null);
  categories = signal<string[]>([]);
  zones = signal<any[]>([]);
  isLoading = signal(false);
  hasSearched = signal(false);

  // Modals
  showAdjustmentModal = false;
  showTransferModal = false;

  // Lucide icons
  EditIcon = Edit;
  ArrowUpDownIcon = ArrowUpDown;

  private searchTrigger$ = new Subject<string>();
  private cargoService = inject(CargoService);
  private cargoCache = inject(CargoCacheService);
  private filtersService = inject(CargoListingFiltersService);

  constructor() {
    this.searchTrigger$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((term) => {
          this.isLoading.set(true);
          return this.cargoService.getCargoByDescription(term);
        })
      )
      .subscribe({
        next: (items) => {
          this.cargoCache.setItems(items);
          this.inventoryItems.set(items);
          this.hasSearched.set(true);
          this.categories.set([...new Set(items.map((i) => i.category))]);
          const uniqueZones = Array.from(
            new Map(items.map((i) => [i.zoneId, { id: String(i.zoneId), name: i.zoneName }])).values()
          );
          this.zones.set(uniqueZones);
          this.overview.set(this.cargoService.getInventoryOverview(items));
          this.applyFilters();
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.inventoryItems.set([]);
          this.applyFilters();
        },
      });

    effect(() => {
      this.searchTrigger$.next(this.filtersService.searchTerm());
    });

    effect(() => {
      this.applyFilters();
    });
  }

  ngOnInit(): void {}

  applyFilters(): void {
    const filters = this.filtersService.filters();
    const items = this.inventoryItems();

    const filtered = items.filter((item) => {
      if (filters.category && item.category !== filters.category) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.zone && item.zoneId.toString() !== filters.zone) return false;
      return true;
    });

    this.filteredItems.set(filtered);
  }

  adjustItem(item: InventoryItem): void {
    console.log('Adjusting item:', item);
  }
}