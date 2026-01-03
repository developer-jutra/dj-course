import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Users, Building } from 'lucide-angular';
import { ContractorsListingStore } from './contractors-listing.store';
import { LoaderComponent } from '../../../ui-library/Loader.component';

@Component({
  selector: 'wms-contractors-stats',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, LoaderComponent],
  template: `
    @if(store.isLoading()) {
      <wms-loader size="small" />
    } @else {
    <div class="flex flex-col md:flex-row gap-6">
      <div class="flex-1 flex items-center">
        <div class="p-2 bg-primary-100 rounded-lg">
          <lucide-icon [img]="UsersIcon" size="24" class="text-primary-600"></lucide-icon>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Contractors</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ store.contractors().length }}</p>
        </div>
      </div>
      <div class="flex-1 flex items-center">
        <div class="p-2 bg-success-100 rounded-lg">
          <lucide-icon [img]="BuildingIcon" size="24" class="text-success-600"></lucide-icon>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Contractors</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ activeContractors() }}</p>
          </div>
        </div>
      </div>
    }
  `
})
export class ContractorsStatsComponent {
  readonly store = inject(ContractorsListingStore);

  UsersIcon = Users;
  BuildingIcon = Building;

  activeContractors = computed(() => this.store.contractors().filter(c => c.status === 'ACTIVE').length);
} 