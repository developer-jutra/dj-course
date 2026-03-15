import { Component, input, output, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CargoListingFiltersService } from './cargo-listing-filters.service';
import { LucideAngularModule, Search, X } from 'lucide-angular';
import { DropdownComponent } from '../../ui-library/Dropdown.component';

@Component({
  selector: 'app-cargo-listing-filters',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, DropdownComponent],
  template: `
    <!-- Search and Filters -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Items</label>
        <div class="relative">
          <lucide-icon [img]="SearchIcon" size="18" class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></lucide-icon>
          <input type="text" 
                 [value]="filtersService.searchTerm()"
                 (input)="filtersService.setSearchTerm($any($event.target).value)"
                 placeholder="Search by SKU, name, or description..."
                 class="input pl-10">
        </div>
      </div>
      <div>
        <ui-dropdown label="Category" [options]="categoryOptions()" [value]="filtersService.category()" (valueChange)="filtersService.setCategory($event)" />
      </div>
      <div>
        <ui-dropdown label="Status" [options]="statusOptions" [value]="filtersService.status()" (valueChange)="filtersService.setStatus($event)" />
      </div>
      <div>
        <ui-dropdown label="Zone" [options]="zoneOptions()" [value]="filtersService.zone()" (valueChange)="filtersService.setZone($event)" />
      </div>
    </div>
    
    @if (filtersService.hasActiveFilters()) {
      <div class="mt-4 flex items-center justify-end">
        <button (click)="filtersService.resetFilters()" 
                class="text-sm text-primary-600 hover:text-primary-500 inline-flex items-center">
          <lucide-icon [img]="XIcon" size="16" class="mr-1"></lucide-icon>
          Clear all filters
        </button>
      </div>
    }
  `
})
export class CargoListingFiltersComponent {
  // Signal-based inputs
  categories = input<string[]>([]);
  zones = input<any[]>([]);

  // Lucide icons
  SearchIcon = Search;
  XIcon = X;

  public filtersService = inject(CargoListingFiltersService);

  categoryOptions = () => [
    { value: '', label: 'All Categories' },
    ...this.categories().map(c => ({ value: c, label: c }))
  ];
  statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'reserved', label: 'Reserved' },
    { value: 'damaged', label: 'Damaged' },
    { value: 'expired', label: 'Expired' }
  ];
  zoneOptions = () => [
    { value: '', label: 'All Zones' },
    ...this.zones().map(z => ({ value: z.id, label: z.name }))
  ];
}