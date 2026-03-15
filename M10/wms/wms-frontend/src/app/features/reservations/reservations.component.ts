import { Component, OnInit, effect, inject } from '@angular/core';

import { LucideAngularModule, Calendar } from 'lucide-angular';

import { ReservationsService } from './reservations.service';
import { ReservationsListingFiltersService } from './reservations-listing-filters.service';
import { WarehouseMapService } from '../warehouse-map/warehouse-map.service';
import { Reservation } from './reservations.model';
import { Warehouse } from '../warehouse/warehouse.model';
import { StatsComponent } from '../../ui-library/Stats.component';
import { ReservationsListingFiltersComponent } from './reservations-listing-filters.component';
import { ReservationsListingComponent } from './reservations-listing.component';
import { ReservationsFormNewReservationComponent } from './reservations-form-new-reservation.component';
import { SectionComponent } from '../../ui-library/Section.component';
import { Heading1Component, SubtitleComponent } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    LucideAngularModule,
    StatsComponent,
    ReservationsListingFiltersComponent,
    ReservationsListingComponent,
    ReservationsFormNewReservationComponent,
    SectionComponent,
    Heading1Component,
    SubtitleComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center pb-4">
        <div>
          <ui-heading1>Reservations</ui-heading1>
          <ui-subtitle>Manage warehouse space reservations</ui-subtitle>
        </div>
        <button (click)="showNewReservationModal = true" class="btn btn-primary">
          <lucide-icon [img]="CalendarIcon" size="18" class="mr-2"></lucide-icon>
          New Reservation
        </button>
      </div>

      <!-- Stats Component -->
      <ui-stats [tiles]="statsTiles" />

      <!-- Filters Component -->
      <ui-section>
        <app-reservations-listing-filters [warehouses]="warehouses" />
      </ui-section>

      <!-- Listing Component -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <app-reservations-listing 
            [reservations]="filteredReservations"
            (paymentClick)="navigateToPaymentDetails($event)" />
        </div>
      </div>

      <!-- New Reservation Modal -->
      <app-reservations-form-new-reservation
        [showModal]="showNewReservationModal"
        (modalClosed)="showNewReservationModal = false"
        (reservationCreated)="onReservationCreated($event)" />
    </div>
  `
})
export class ReservationsComponent implements OnInit {
  private reservationsService = inject(ReservationsService);
  private filtersService = inject(ReservationsListingFiltersService);
  private warehouseMapService = inject(WarehouseMapService);

  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  warehouses: Warehouse[] = [];
  showNewReservationModal = false;

  // Lucide icons
  CalendarIcon = Calendar;

  constructor() {
    // Effect to automatically filter reservations when filters change
    effect(() => {
      this.applyFilters();
    });
  }

  ngOnInit(): void {
    this.loadReservations();
    this.loadWarehouses();
  }

  loadReservations(): void {
    this.reservationsService.getReservations().subscribe(reservations => {
      this.reservations = reservations;
      this.filteredReservations = reservations;
    });
  }

  loadWarehouses(): void {
    this.warehouseMapService.getWarehouses().subscribe(warehouses => {
      this.warehouses = warehouses;
    });
  }

  applyFilters(): void {
    const filters = this.filtersService.filters();
    
    this.filteredReservations = this.reservations.filter(reservation => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!reservation.contractorName.toLowerCase().includes(searchLower) &&
            !reservation.location.zone.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Status filter
      if (filters.status && reservation.status !== filters.status) {
        return false;
      }

      // Warehouse filter (simplified - in real app would match actual warehouse data)
      if (filters.warehouse && filters.warehouse !== '1') {
        return false; // For demo, all reservations are in warehouse 1
      }

      // Zone filter
      if (filters.zone && reservation.location.zone !== filters.zone) {
        return false;
      }

      // Period filter
      if (filters.period) {
        const now = new Date();
        const reservationStart = new Date(reservation.reservedFrom);
        const reservationEnd = new Date(reservation.reservedUntil);

        switch (filters.period) {
          case 'current':
            if (!(reservationStart <= now && reservationEnd >= now)) {
              return false;
            }
            break;
          case 'next':
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0);
            if (!(reservationStart <= nextMonthEnd && reservationEnd >= nextMonth)) {
              return false;
            }
            break;
          case 'upcoming':
            if (reservationStart <= now) {
              return false;
            }
            break;
        }
      }

      return true;
    });
  }

  navigateToPaymentDetails(reservationId: number): void {
    // Navigate to billing payments with specific payment details
    // For demo purposes, we'll navigate to billing payments
    window.location.href = '/billing-payments';
  }

  onReservationCreated(reservationData: any): void {
    // Add the new reservation to the list
    this.reservations.unshift(reservationData);
    this.applyFilters();
  }

  get statsTiles() {
    // You can customize these stats as needed
    return [
      { label: 'All', value: this.reservations.length.toString(), icon: this.CalendarIcon, iconColor: 'text-primary-500' },
      { label: 'Active', value: this.reservations.filter(r => r.status === 'active').length.toString(), icon: this.CalendarIcon, iconColor: 'text-success-500' },
      { label: 'Pending', value: this.reservations.filter(r => r.status === 'pending').length.toString(), icon: this.CalendarIcon, iconColor: 'text-warning-500' },
      { label: 'Expired', value: this.reservations.filter(r => r.status === 'expired').length.toString(), icon: this.CalendarIcon, iconColor: 'text-error-500' },
    ];
  }
}