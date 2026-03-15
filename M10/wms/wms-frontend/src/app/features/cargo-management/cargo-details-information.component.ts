import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InventoryItem } from '../inventory/inventory.model';
import { LucideAngularModule, Package, MapPin, Calendar, DollarSign, Weight, Ruler, User } from 'lucide-angular';
import { Heading3Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-cargo-details-information',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, Heading3Component],
  template: `
    <!-- Main Information Card -->
    @if (cargoItem()) {
      <div class="card p-6">
        <ui-heading3 class="mb-6">Cargo Information</ui-heading3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="space-y-4">
            <div>
              <div class="flex items-center mb-2">
                <lucide-icon [img]="PackageIcon" size="18" class="text-gray-400 mr-2"></lucide-icon>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Description</span>
              </div>
              <p class="text-sm text-gray-900 dark:text-white">{{ cargoItem()?.description }}</p>
            </div>
            
            <div>
              <div class="flex items-center mb-2">
                <lucide-icon [img]="WeightIcon" size="18" class="text-gray-400 mr-2"></lucide-icon>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Weight</span>
              </div>
              <p class="text-sm text-gray-900 dark:text-white">{{ cargoItem()?.weight }} kg</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <div class="flex items-center mb-2">
                <lucide-icon [img]="RulerIcon" size="18" class="text-gray-400 mr-2"></lucide-icon>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Volume</span>
              </div>
              <p class="text-sm text-gray-900 dark:text-white">{{ cargoItem()?.volume }} m³</p>
            </div>
            
            <div>
              <div class="flex items-center mb-2">
                <lucide-icon [img]="CalendarIcon" size="18" class="text-gray-400 mr-2"></lucide-icon>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Entry Date</span>
              </div>
              <p class="text-sm text-gray-900 dark:text-white">{{ cargoItem()?.lastUpdated | date:'MMM d, y' }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <div class="flex items-center mb-2">
                <lucide-icon [img]="MapPinIcon" size="18" class="text-gray-400 mr-2"></lucide-icon>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Current Location</span>
              </div>
              <p class="text-sm text-gray-900 dark:text-white">{{ cargoItem()?.zoneName }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ cargoItem()?.shelfLocation }}</p>
            </div>
            
            <div>
              <div class="flex items-center mb-2">
                <lucide-icon [img]="DollarSignIcon" size="18" class="text-gray-400 mr-2"></lucide-icon>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Value</span>
              </div>
              <p class="text-sm text-gray-900 dark:text-white">\${{ formatCurrency((cargoItem()?.value || 0) * (cargoItem()?.quantity || 0)) }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <div class="flex items-center mb-2">
                <lucide-icon [img]="UserIcon" size="18" class="text-gray-400 mr-2"></lucide-icon>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Contractor</span>
              </div>
              @if (cargoItem()?.contractorName && cargoItem()?.contractorId) {
                <a [routerLink]="['/contractors', cargoItem()?.contractorId]"
                  class="text-sm text-primary-600 hover:text-primary-500">
                  {{ cargoItem()?.contractorName }}
                </a>
              }
              @if (!cargoItem()?.contractorName) {
                <p class="text-sm text-gray-500 dark:text-gray-400">N/A</p>
              }
            </div>
            
            <div>
              <div class="flex items-center mb-2">
                <lucide-icon [img]="PackageIcon" size="18" class="text-gray-400 mr-2"></lucide-icon>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</span>
              </div>
              <p class="text-sm text-gray-900 dark:text-white">{{ cargoItem()?.quantity }} {{ cargoItem()?.unit }}</p>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class CargoDetailsInformationComponent {
  // Signal-based input
  cargoItem = input<InventoryItem | null>(null);

  // Lucide icons
  PackageIcon = Package;
  MapPinIcon = MapPin;
  CalendarIcon = Calendar;
  DollarSignIcon = DollarSign;
  WeightIcon = Weight;
  RulerIcon = Ruler;
  UserIcon = User;

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }
}