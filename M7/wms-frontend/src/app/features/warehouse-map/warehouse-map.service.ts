import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Warehouse } from '../../features/warehouse/warehouse.model';
import { MOCK_WAREHOUSES } from '../../mock/warehouse.mock';

@Injectable({
  providedIn: 'root'
})
export class WarehouseMapService {
  getWarehouses(): Observable<Warehouse[]> {
    return of(MOCK_WAREHOUSES).pipe(delay(300));
  }

  getWarehouse(id: number): Observable<Warehouse | undefined> {
    const warehouse = MOCK_WAREHOUSES.find(w => w.id === id);
    return of(warehouse).pipe(delay(200));
  }
}