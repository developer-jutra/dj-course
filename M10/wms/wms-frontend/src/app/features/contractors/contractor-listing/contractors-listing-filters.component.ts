import { Component, computed, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, X } from 'lucide-angular';
import { DropdownComponent } from '../../../ui-library/Dropdown.component';
import { TextInputComponent } from '../../../ui-library/TextInput.component';
import { ContractorsListingStore } from './contractors-listing.store';

@Component({
  selector: 'wms-contractors-listing-filters',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, DropdownComponent, TextInputComponent],
  template: `
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <ui-text-input label="Search Contractors" [value]="store.filters.searchTerm()" (valueChange)="updateSearchTerm($event)" placeholder="Search by contractor name...">
          <lucide-icon [img]="SearchIcon" size="18" class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></lucide-icon>
        </ui-text-input>
      </div>
      <div class="w-48">
        <ui-dropdown label="Status" [options]="statusOptions" [value]="store.filters.status()" (valueChange)="updateStatus($event)" />
      </div>
    </div>
    @if (hasActiveFilters()) {
      <div class="mt-4 flex items-center justify-end">
        <button (click)="resetFilters()" class="text-sm text-primary-600 hover:text-primary-500 inline-flex items-center">
          <lucide-icon [img]="XIcon" size="16" class="mr-1"></lucide-icon>
          Clear all filters
        </button>
      </div>
    }
  `
})
export class ContractorsListingFiltersComponent {
  SearchIcon = Search;
  XIcon = X;

  public store = inject(ContractorsListingStore);

  hasActiveFilters = computed(() => !!this.store.filters.status() || !!this.store.filters.searchTerm());

  statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' }
  ];

  updateSearchTerm(searchTerm: string): void {
    this.store.updateFilters({ searchTerm });
  }

  updateStatus(status: string): void {
    this.store.updateFilters({ status });
  }

  resetFilters(): void {
    this.store.updateFilters({ status: '', searchTerm: '' });
  }
} 