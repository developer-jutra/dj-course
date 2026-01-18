import { Injectable, signal, computed } from '@angular/core';

export interface CargoListingFilters {
  searchTerm: string;
  category: string;
  status: string;
  zone: string;
}

@Injectable({
  providedIn: 'root'
})
export class CargoListingFiltersService {
  #searchTerm = signal<string>('');
  #category = signal<string>('');
  #status = signal<string>('');
  #zone = signal<string>('');

  readonly searchTerm = this.#searchTerm.asReadonly();
  readonly category = this.#category.asReadonly();
  readonly status = this.#status.asReadonly();
  readonly zone = this.#zone.asReadonly();

  filters = computed<CargoListingFilters>(() => ({
    searchTerm: this.#searchTerm(),
    category: this.#category(),
    status: this.#status(),
    zone: this.#zone()
  }));

  setSearchTerm(searchTerm: string): void {
    this.#searchTerm.set(searchTerm);
  }

  setCategory(category: string): void {
    this.#category.set(category);
  }

  setStatus(status: string): void {
    this.#status.set(status);
  }

  setZone(zone: string): void {
    this.#zone.set(zone);
  }

  resetFilters(): void {
    this.#searchTerm.set('');
    this.#category.set('');
    this.#status.set('');
    this.#zone.set('');
  }

  hasActiveFilters = computed<boolean>(() => {
    const filters = this.filters();
    return !!(filters.searchTerm || filters.category || filters.status || filters.zone);
  });
}