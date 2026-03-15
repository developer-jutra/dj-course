import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InventoryItem } from '../inventory/inventory.model';
import { LucideAngularModule, Eye, Edit, Package } from 'lucide-angular';
import { Heading4Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-cargo-listing',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, Heading4Component],
  template: `
    <!-- Cargo Table -->
    <div class="overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
          <thead class="bg-gray-50 dark:bg-dark-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cargo Item
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Location
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Quantity
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Value
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contractor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
            @for (item of items(); track item.id) {
              <tr class="hover:bg-gray-50 dark:hover:bg-dark-700">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">SKU: {{ item.sku }}</div>
                  <div class="text-xs text-gray-400 dark:text-gray-500">{{ item.category }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 dark:text-white">{{ item.zoneName }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ item.shelfLocation }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.quantity }} {{ item.unit }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.weight }}kg • {{ item.volume }}m³</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  \${{ formatCurrency(item.value * item.quantity) }}
                </td>
                <td class="px-6 py-4">
                  <span [class]="getStatusClass(item.status)" 
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                    {{ item.status | titlecase }}
                  </span>
                  @if (item.expiryDate) {
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Expires: {{ item.expiryDate | date:'MMM d, y' }}
                    </div>
                  }
                </td>
                <td class="px-6 py-4">
                  @if (item.contractorName && item.contractorId) {
                    <a [routerLink]="['/contractors', item.contractorId]"
                      class="text-sm text-primary-600 hover:text-primary-500">
                      {{ item.contractorName }}
                    </a>
                  }
                  @if (!item.contractorName) {
                    <div class="text-sm text-gray-500 dark:text-gray-400">-</div>
                  }
                </td>
                <td class="px-6 py-4 text-sm font-medium">
                  <div class="flex flex-col items-start space-y-2">
                    <button [routerLink]="['/cargo-management', item.id]"
                            class="text-primary-600 hover:text-primary-500 inline-flex items-center">
                      <lucide-icon [img]="EyeIcon" size="16" class="mr-1"></lucide-icon>
                      Details
                    </button>
                    <button (click)="onAdjustItem(item)" class="text-secondary-600 hover:text-secondary-500 inline-flex items-center">
                      <lucide-icon [img]="EditIcon" size="16" class="mr-1"></lucide-icon>
                      Adjust
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (items().length === 0) {
        <div class="text-center py-12">
          <lucide-icon [img]="PackageIcon" size="48" class="mx-auto text-gray-400 mb-4"></lucide-icon>
          <ui-heading4 class="mt-2">No cargo items found</ui-heading4>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search criteria.</p>
        </div>
      }
    </div>
  `
})
export class CargoListingComponent {
  // Signal-based inputs
  items = input<InventoryItem[]>([]);

  // Outputs
  adjustItem = output<InventoryItem>();

  // Lucide icons
  EyeIcon = Eye;
  EditIcon = Edit;
  PackageIcon = Package;

  onAdjustItem(item: InventoryItem): void {
    this.adjustItem.emit(item);
  }

  formatCurrency(value: number | undefined): string {
    if (!value) return '0';
    return new Intl.NumberFormat('en-US').format(value);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'available': return 'bg-success-100 text-success-800';
      case 'reserved': return 'bg-primary-100 text-primary-800';
      case 'damaged': return 'bg-error-100 text-error-800';
      case 'expired': return 'bg-warning-100 text-warning-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}