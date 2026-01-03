import { Component, input, inject, signal, computed } from '@angular/core';

import { Router } from '@angular/router';
import { InventoryOverview } from '../inventory/inventory.model';
import { LucideAngularModule, Package, DollarSign, AlertTriangle, Clock } from 'lucide-angular';
import { StatsComponent } from '../../ui-library/Stats.component';

@Component({
  selector: 'app-cargo-management-stats',
  standalone: true,
  imports: [LucideAngularModule, StatsComponent],
  template: `
    <ui-stats [tiles]="tiles()" />
  `
})
export class CargoManagementStatsComponent {
  overview = input<InventoryOverview | null>(null);

  private router = inject(Router);

  tiles = computed(() => [
    {
      label: 'Total Items',
      value: `${this.overview()?.totalItems || 0}`,
      icon: Package,
      iconColor: 'bg-primary-100 text-primary-600',
    },
    {
      label: 'Total Value',
      value: `$${this.formatCurrency(this.overview()?.totalValue)}`,
      icon: DollarSign,
      iconColor: 'bg-success-100 text-success-600',
    },
    {
      label: 'Low Stock',
      value: `${this.overview()?.lowStockItems || 0}`,
      icon: AlertTriangle,
      iconColor: 'bg-warning-100 text-warning-600',
    },
    {
      label: 'Expiring',
      value: `${this.overview()?.expiringSoonItems || 0}`,
      icon: Clock,
      iconColor: 'bg-error-100 text-error-600',
    },
  ]);

  navigateToCargoListing(): void {
    // Could implement specific navigation logic here
    console.log('Navigate to cargo listing');
  }

  formatCurrency(value: number | undefined): string {
    if (!value) return '0';
    return new Intl.NumberFormat('en-US').format(value);
  }
}