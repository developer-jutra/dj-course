import { Component, inject, input, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ReservationsListingFiltersService } from './reservations-listing-filters.service';
import { LucideAngularModule, Search, X } from 'lucide-angular';
import { DropdownComponent } from '../../ui-library/Dropdown.component';

interface Warehouse {
  id: number;
  name: string;
}

@Component({
  selector: 'app-reservations-listing-filters',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, DropdownComponent],
  template: `
    <!-- Filters -->
    <div>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <div class="relative">
            <lucide-icon [img]="SearchIcon" size="18" class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></lucide-icon>
            <input type="text" 
                   [value]="filtersService.search()"
                   (input)="filtersService.setSearch($any($event.target).value)"
                   placeholder="Search by contractor or location..."
                   class="input pl-10">
          </div>
        </div>
        <div>
          <ui-dropdown label="Status" [options]="statusOptions" [value]="filtersService.status()" (valueChange)="filtersService.setStatus($event)" />
        </div>
        <div>
          <ui-dropdown label="Warehouse" [options]="warehouseOptions()" [value]="filtersService.warehouse()" (valueChange)="filtersService.setWarehouse($event)" />
        </div>
        <div>
          <ui-dropdown label="Zone" [options]="zoneOptions" [value]="filtersService.zone()" (valueChange)="filtersService.setZone($event)" />
        </div>
        <div>
          <ui-dropdown label="Period" [options]="periodOptions" [value]="filtersService.period()" (valueChange)="filtersService.setPeriod($event)" />
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
    </div>
  `
})
export class ReservationsListingFiltersComponent {
  // Signal-based input
  warehouses = input<Warehouse[]>([]);

  // Lucide icons
  SearchIcon = Search;
  XIcon = X;

  public filtersService = inject(ReservationsListingFiltersService);

  statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'expired', label: 'Expired' },
    { value: 'cancelled', label: 'Cancelled' }
  ];
  warehouseOptions = () => [
    { value: '', label: 'All Warehouses' },
    ...this.warehouses().map(w => ({ value: w.id.toString(), label: w.name }))
  ];
  zoneOptions = [
    { value: '', label: 'All Zones' },
    { value: 'Zone A', label: 'Zone A' },
    { value: 'Zone B', label: 'Zone B' },
    { value: 'Zone C', label: 'Zone C' }
  ];
  periodOptions = [
    { value: '', label: 'All Periods' },
    { value: 'current', label: 'Current Month' },
    { value: 'next', label: 'Next Month' },
    { value: 'upcoming', label: 'Upcoming' }
  ];
}