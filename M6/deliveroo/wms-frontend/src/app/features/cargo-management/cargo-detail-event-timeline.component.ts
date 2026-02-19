import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryItem } from '../inventory/inventory.model';
import { LucideAngularModule, Package, Clock, MapPin } from 'lucide-angular';
import { CargoEvent } from './cargo.model';
import { MOCK_CARGO_EVENTS } from '../../mock/cargo-events.mock';
import { Heading4Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-cargo-detail-event-timeline',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, Heading4Component],
  template: `
    <div class="p-6">
      <ui-heading4 class="mb-4">Event Timeline</ui-heading4>
      <div class="space-y-6">
        @for (event of mockEvents; track event.title) {
          <div class="flex">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                <lucide-icon [img]="getEventIcon(event.type)" size="16" class="text-primary-600"></lucide-icon>
              </div>
            </div>
            <div class="ml-4 flex-1">
              <div class="flex items-center justify-between">
                <h5 class="text-sm font-medium text-gray-900 dark:text-white">{{ event.title }}</h5>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ event.timestamp | date:'MMM d, h:mm a' }}</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ event.description }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">By {{ event.employee }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class CargoDetailEventTimelineComponent {
  // Signal-based input
  cargoItem = input<InventoryItem | null>(null);

  // Lucide icons
  PackageIcon = Package;
  ClockIcon = Clock;
  MapPinIcon = MapPin;

  mockEvents: CargoEvent[] = MOCK_CARGO_EVENTS;

  getEventIcon(type: string) {
    switch (type) {
      case 'received': return this.PackageIcon;
      case 'inspection': return this.ClockIcon;
      case 'moved': return this.MapPinIcon;
      default: return this.ClockIcon;
    }
  }
}