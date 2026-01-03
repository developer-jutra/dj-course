import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { InventoryItem, InventoryOverview } from '../inventory/inventory.model';
import {
  MOCK_INVENTORY_ITEMS,
  MOCK_INVENTORY_OVERVIEW,
} from '../../mock/inventory.mock';

@Injectable({
  providedIn: 'root',
})
export class CargoService {
  private mockInventoryItems: InventoryItem[] = MOCK_INVENTORY_ITEMS;

  getInventoryItems(): Observable<InventoryItem[]> {
    return of(this.mockInventoryItems).pipe(delay(300));
  }

  getInventoryOverview(): Observable<InventoryOverview> {
    return of(MOCK_INVENTORY_OVERVIEW).pipe(delay(300));
  }
} 