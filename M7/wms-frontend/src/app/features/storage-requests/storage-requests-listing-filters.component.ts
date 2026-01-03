import { Component, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { StorageRequestsFiltersService } from './storage-requests-listing-filters.service';
import { LucideAngularModule, Search, X } from 'lucide-angular';
import { DropdownComponent } from '../../ui-library/Dropdown.component';

@Component({
  selector: 'app-storage-requests-listing-filters',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, DropdownComponent],
  template: `
    <!-- Filters -->
    <div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <ui-dropdown label="Status" [options]="statusOptions" [value]="filtersService.status()" (valueChange)="filtersService.setStatus($event)" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contractor</label>
          <div class="relative">
            <lucide-icon [img]="SearchIcon" size="18" class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></lucide-icon>
            <input type="text" 
                   [value]="filtersService.contractor()"
                   (input)="filtersService.setContractor($any($event.target).value)"
                   placeholder="Search contractor..."
                   class="input pl-10">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date From</label>
          <input type="date" 
                 [value]="filtersService.dateFrom()"
                 (change)="filtersService.setDateFrom($any($event.target).value)"
                 class="input">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date To</label>
          <input type="date" 
                 [value]="filtersService.dateTo()"
                 (change)="filtersService.setDateTo($any($event.target).value)"
                 class="input">
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
export class StorageRequestsListingFiltersComponent {
  // Lucide icons
  SearchIcon = Search;
  XIcon = X;

  public filtersService = inject(StorageRequestsFiltersService);

  statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' }
  ];
}