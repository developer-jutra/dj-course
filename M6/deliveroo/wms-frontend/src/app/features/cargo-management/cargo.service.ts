import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InventoryItem, InventoryOverview } from '../inventory/inventory.model';
import {
  StorageApiService,
  StorageRecordApi,
} from '../storage/storage-api.service';

function mapApiRecordToInventoryItem(api: StorageRecordApi): InventoryItem {
  const isInStorage = !api.actual_exit_date;
  return {
    id: api.storage_record_id,
    sku: `SR-${api.storage_record_id}`,
    name: api.cargo_description.length > 50
      ? api.cargo_description.slice(0, 50) + '…'
      : api.cargo_description,
    description: api.cargo_description,
    category: 'Storage',
    quantity: 1,
    unit: 'unit',
    location: `Shelf #${api.shelf_id}`,
    zoneId: api.shelf_id,
    zoneName: `Shelf ${api.shelf_id}`,
    shelfId: api.shelf_id,
    shelfLocation: `Shelf #${api.shelf_id}`,
    weight: Number(api.cargo_weight),
    volume: Number(api.cargo_volume),
    value: 0,
    currency: 'USD',
    status: isInStorage ? 'reserved' : 'available',
    lastUpdated: new Date(api.actual_entry_date),
    contractorId: String(api.customer_id),
    contractorName: `Contractor #${api.customer_id}`,
  };
}

@Injectable({
  providedIn: 'root',
})
export class CargoService {
  private storageApi = inject(StorageApiService);

  getCargoByDescription(description: string): Observable<InventoryItem[]> {
    return this.storageApi
      .getCargoByDescription(description)
      .pipe(map((items) => items.map(mapApiRecordToInventoryItem)));
  }

  getInventoryOverview(items: InventoryItem[]): InventoryOverview {
    const totalItems = items.length;
    const totalValue = items.reduce((sum, i) => sum + i.value * i.quantity, 0);
    const lowStockItems = items.filter((i) => i.quantity < 5).length;
    const expiringSoonItems = 0;
    const damagedItems = 0;
    const categoryBreakdown = [
      { category: 'Storage', count: totalItems, value: totalValue },
    ];
    const zoneUtilization = [
      {
        zoneId: 0,
        zoneName: 'All',
        utilization: totalItems > 0 ? 100 : 0,
        itemCount: totalItems,
      },
    ];
    return {
      totalItems,
      totalValue,
      lowStockItems,
      expiringSoonItems,
      damagedItems,
      categoryBreakdown,
      zoneUtilization,
    };
  }
} 