import { Injectable, signal, computed } from '@angular/core';

export interface ReservationsListingFilters {
  search: string;
  status: string;
  warehouse: string;
  zone: string;
  period: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationsListingFiltersService {
  #search = signal<string>('');
  #status = signal<string>('');
  #warehouse = signal<string>('');
  #zone = signal<string>('');
  #period = signal<string>('');

  readonly search = this.#search.asReadonly();
  readonly status = this.#status.asReadonly();
  readonly warehouse = this.#warehouse.asReadonly();
  readonly zone = this.#zone.asReadonly();
  readonly period = this.#period.asReadonly();

  filters = computed<ReservationsListingFilters>(() => ({
    search: this.#search(),
    status: this.#status(),
    warehouse: this.#warehouse(),
    zone: this.#zone(),
    period: this.#period()
  }));

  setSearch(search: string): void {
    this.#search.set(search);
  }

  setStatus(status: string): void {
    this.#status.set(status);
  }

  setWarehouse(warehouse: string): void {
    this.#warehouse.set(warehouse);
  }

  setZone(zone: string): void {
    this.#zone.set(zone);
  }

  setPeriod(period: string): void {
    this.#period.set(period);
  }

  resetFilters(): void {
    this.#search.set('');
    this.#status.set('');
    this.#warehouse.set('');
    this.#zone.set('');
    this.#period.set('');
  }

  hasActiveFilters = computed<boolean>(() => {
    const filters = this.filters();
    return !!(filters.search || filters.status || filters.warehouse || filters.zone || filters.period);
  });
}