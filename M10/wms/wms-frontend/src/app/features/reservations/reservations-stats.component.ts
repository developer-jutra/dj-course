import { Component, input } from '@angular/core';

import { Reservation } from './reservations.model';
import { LucideAngularModule, Calendar, MapPin, DollarSign, User } from 'lucide-angular';

@Component({
  selector: 'app-reservations-stats',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-primary-100 rounded-lg">
            <lucide-icon [img]="CalendarIcon" size="24" class="text-primary-600"></lucide-icon>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Reservations</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ getActiveReservations() }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-success-100 rounded-lg">
            <lucide-icon [img]="MapPinIcon" size="24" class="text-success-600"></lucide-icon>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Reserved Space</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ getTotalReservedSpace() }}m³</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-warning-100 rounded-lg">
            <lucide-icon [img]="DollarSignIcon" size="24" class="text-warning-600"></lucide-icon>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">\${{ formatCurrency(getMonthlyRevenue()) }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-secondary-100 rounded-lg">
            <lucide-icon [img]="UserIcon" size="24" class="text-secondary-600"></lucide-icon>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Contractors</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ getUniqueContractors() }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ReservationsStatsComponent {
  // Signal-based input
  reservations = input<Reservation[]>([]);

  // Lucide icons
  CalendarIcon = Calendar;
  MapPinIcon = MapPin;
  DollarSignIcon = DollarSign;
  UserIcon = User;

  getActiveReservations(): number {
    return this.reservations().filter(r => r.status === 'active').length;
  }

  getTotalReservedSpace(): number {
    return this.reservations()
      .filter(r => r.status === 'active')
      .reduce((total, r) => total + r.reservedVolume, 0);
  }

  getMonthlyRevenue(): number {
    const now = new Date();
    return this.reservations()
      .filter(r => {
        const reservationDate = new Date(r.reservedFrom);
        return reservationDate.getMonth() === now.getMonth() && 
               reservationDate.getFullYear() === now.getFullYear();
      })
      .reduce((total, r) => total + r.payment.amount, 0);
  }

  getUniqueContractors(): number {
    const uniqueContractors = new Set(this.reservations().map(r => r.contractorId));
    return uniqueContractors.size;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }
}