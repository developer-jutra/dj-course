import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Warehouse } from './warehouse.model';
import { MOCK_WAREHOUSES } from '../../mock/warehouse.mock';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  private mockWarehouses: Warehouse[] = MOCK_WAREHOUSES;

  getWarehouses(): Observable<Warehouse[]> {
    return of(this.mockWarehouses).pipe(delay(300));
  }
} 