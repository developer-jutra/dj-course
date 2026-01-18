import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Reservation } from './reservations.model';
import { LucideAngularModule, Eye, Calendar } from 'lucide-angular';
import { Heading4Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-reservations-listing',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, Heading4Component],
  template: `
    <!-- Reservations Table -->
    <div class="overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
          <thead class="bg-gray-50 dark:bg-dark-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contractor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Location
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Period
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Space
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Payment
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
            @for (reservation of reservations(); track reservation.id) {
              <tr class="hover:bg-gray-50 dark:hover:bg-dark-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  #{{ reservation.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <a [routerLink]="['/contractors', reservation.contractorId]"
                     class="text-sm font-medium text-primary-600 hover:text-primary-500">
                    {{ reservation.contractorName }}
                  </a>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 dark:text-white">{{ reservation.location.zone }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ reservation.location.aisle }} • {{ reservation.location.rack }} • {{ reservation.location.shelf }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ reservation.reservedFrom | date:'MMM d' }} - {{ reservation.reservedUntil | date:'MMM d, y' }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ getDurationInDays(reservation.reservedFrom, reservation.reservedUntil) }} days
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ reservation.reservedVolume }}m³</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ reservation.reservedWeight }}kg</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button (click)="onPaymentClick(reservation.id)"
                          class="text-sm text-primary-600 hover:text-primary-500 cursor-pointer">
                    \${{ formatCurrency(reservation.payment.amount) }}
                  </button>
                  <div>
                  <span [class]="getPaymentStatusClass(reservation.payment.status)"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium block mt-1">
                      {{ reservation.payment.status | titlecase }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusClass(reservation.status)"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                    {{ reservation.status | titlecase }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm font-medium">
                  <div class="flex flex-col items-start space-y-2">
                    <button class="text-primary-600 hover:text-primary-500 inline-flex items-center">
                      <lucide-icon [img]="EyeIcon" size="16" class="mr-1"></lucide-icon>
                      View
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (reservations().length === 0) {
        <div class="text-center py-12">
          <lucide-icon [img]="CalendarIcon" size="48" class="mx-auto text-gray-400 mb-4"></lucide-icon>
          <ui-heading4 class="mt-2">No reservations found</ui-heading4>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search criteria.</p>
        </div>
      }
    </div>
  `
})
export class ReservationsListingComponent {
  // Signal-based input
  reservations = input<Reservation[]>([]);

  // Outputs
  paymentClick = output<number>();

  // Lucide icons
  EyeIcon = Eye;
  CalendarIcon = Calendar;

  onPaymentClick(reservationId: number): void {
    this.paymentClick.emit(reservationId);
  }

  getDurationInDays(from: Date, to: Date): number {
    const diffTime = Math.abs(new Date(to).getTime() - new Date(from).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-800';
      case 'pending': return 'bg-warning-100 text-warning-800';
      case 'expired': return 'bg-error-100 text-error-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'paid': return 'bg-success-100 text-success-800';
      case 'pending': return 'bg-warning-100 text-warning-800';
      case 'overdue': return 'bg-error-100 text-error-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }
}