import { Injectable, signal, computed } from '@angular/core';

export interface BillingPaymentsFilters {
  search: string;
  status: string;
  contractor: string;
  dateFrom: string;
  dateTo: string;
}

@Injectable({
  providedIn: 'root'
})
export class BillingPaymentsFiltersService {
  #search = signal<string>('');
  #status = signal<string>('');
  #contractor = signal<string>('');
  #dateFrom = signal<string>('');
  #dateTo = signal<string>('');

  readonly search = this.#search.asReadonly();
  readonly status = this.#status.asReadonly();
  readonly contractor = this.#contractor.asReadonly();
  readonly dateFrom = this.#dateFrom.asReadonly();
  readonly dateTo = this.#dateTo.asReadonly();

  filters = computed<BillingPaymentsFilters>(() => ({
    search: this.#search(),
    status: this.#status(),
    contractor: this.#contractor(),
    dateFrom: this.#dateFrom(),
    dateTo: this.#dateTo()
  }));

  setSearch(search: string): void {
    this.#search.set(search);
  }

  setStatus(status: string): void {
    this.#status.set(status);
  }

  setContractor(contractor: string): void {
    this.#contractor.set(contractor);
  }

  setDateFrom(dateFrom: string): void {
    this.#dateFrom.set(dateFrom);
  }

  setDateTo(dateTo: string): void {
    this.#dateTo.set(dateTo);
  }

  resetFilters(): void {
    this.#search.set('');
    this.#status.set('');
    this.#contractor.set('');
    this.#dateFrom.set('');
    this.#dateTo.set('');
  }

  hasActiveFilters = computed<boolean>(() => {
    const filters = this.filters();
    return !!(filters.search || filters.status || filters.contractor || filters.dateFrom || filters.dateTo);
  });
}