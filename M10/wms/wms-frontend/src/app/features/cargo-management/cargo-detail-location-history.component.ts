import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryItem } from '../inventory/inventory.model';
import { LucideAngularModule, MapPin } from 'lucide-angular';
import { CargoLocationHistory } from './cargo.model';
import { MOCK_CARGO_LOCATION_HISTORY } from '../../mock/cargo-location-history.mock';
import { Heading4Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-cargo-detail-location-history',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, Heading4Component],
  template: `
    <div class="p-6">
      <ui-heading4 class="mb-4">Location History</ui-heading4>
      <div class="space-y-4">
        @for (location of mockLocationHistory; track location.location) {
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <div class="flex items-center">
              <lucide-icon [img]="MapPinIcon" size="18" class="text-gray-400 mr-3"></lucide-icon>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ location.location }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ location.details }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-900 dark:text-white">{{ location.movedDate | date:'MMM d, y' }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ location.duration }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class CargoDetailLocationHistoryComponent {
  // Signal-based input
  cargoItem = input<InventoryItem | null>(null);

  // Lucide icons
  MapPinIcon = MapPin;

  mockLocationHistory: CargoLocationHistory[] = MOCK_CARGO_LOCATION_HISTORY;
}