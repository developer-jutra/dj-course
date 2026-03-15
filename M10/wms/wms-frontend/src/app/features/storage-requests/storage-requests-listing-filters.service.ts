import { Injectable, signal, computed } from '@angular/core';
import { StorageRequest } from './storage-request.model';

export interface StorageRequestFilters {
  status: string;
  contractor: string;
  dateFrom: string;
  dateTo: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageRequestsFiltersService {
  #status = signal<string>('');
  #contractor = signal<string>('');
  #dateFrom = signal<string>('');
  #dateTo = signal<string>('');
  #requests = signal<StorageRequest[]>([]);

  readonly status = this.#status.asReadonly();
  readonly contractor = this.#contractor.asReadonly();
  readonly dateFrom = this.#dateFrom.asReadonly();
  readonly dateTo = this.#dateTo.asReadonly();
  readonly requests = this.#requests.asReadonly();

  filters = computed<StorageRequestFilters>(() => ({
    status: this.#status(),
    contractor: this.#contractor(),
    dateFrom: this.#dateFrom(),
    dateTo: this.#dateTo()
  }));

  filteredRequests = computed(() => {
    const filters = this.filters();
    const requests = this.#requests();

    return requests.filter(request => {
      // Status filter
      if (filters.status && request.status !== filters.status) {
        return false;
      }

      // Contractor filter
      if (filters.contractor && !request.contractorName.toLowerCase().includes(filters.contractor.toLowerCase())) {
        return false;
      }

      // Date from filter
      if (filters.dateFrom) {
        const dateFrom = new Date(filters.dateFrom);
        if (new Date(request.requestedEntryDate) < dateFrom) {
          return false;
        }
      }

      // Date to filter
      if (filters.dateTo) {
        const dateTo = new Date(filters.dateTo);
        if (new Date(request.requestedEntryDate) > dateTo) {
          return false;
        }
      }

      return true;
    });
  });

  setRequests(requests: StorageRequest[]): void {
    this.#requests.set(requests);
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
    this.#status.set('');
    this.#contractor.set('');
    this.#dateFrom.set('');
    this.#dateTo.set('');
  }

  hasActiveFilters = computed<boolean>(() => {
    const filters = this.filters();
    return !!(filters.status || filters.contractor || filters.dateFrom || filters.dateTo);
  });
}