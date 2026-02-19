import { Injectable, signal } from '@angular/core';
import { InventoryItem } from '../inventory/inventory.model';

/** Caches the last loaded cargo items so the detail page can resolve by id. */
@Injectable({
  providedIn: 'root',
})
export class CargoCacheService {
  private items = signal<InventoryItem[]>([]);

  setItems(items: InventoryItem[]): void {
    this.items.set(items);
  }

  getItemById(id: number): InventoryItem | undefined {
    return this.items().find((i) => i.id === id);
  }
}
