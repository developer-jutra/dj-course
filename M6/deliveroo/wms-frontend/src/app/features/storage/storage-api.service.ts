import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/** Raw API response for storage reservation (GET /storage/reservations/active) */
export interface StorageReservationApi {
  reservation_id: number;
  request_id: number;
  customer_id: number;
  shelf_id: number;
  reserved_weight: number;
  reserved_volume: number;
  reserved_from: string;
  reserved_until: string;
  status: string;
}

/** Raw API response for storage record (GET /storage/cargo?description=) */
export interface StorageRecordApi {
  storage_record_id: number;
  request_id: number;
  customer_id: number;
  shelf_id: number;
  actual_entry_date: string;
  actual_exit_date: string | null;
  cargo_description: string;
  cargo_weight: number;
  cargo_volume: number;
}

@Injectable({
  providedIn: 'root',
})
export class StorageApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.API_URL}/storage`;

  getActiveReservations(): Observable<StorageReservationApi[]> {
    return this.http.get<StorageReservationApi[]>(
      `${this.baseUrl}/reservations/active`
    );
  }

  getCargoByDescription(description: string): Observable<StorageRecordApi[]> {
    if (!description?.trim()) {
      return new Observable((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
    return this.http.get<StorageRecordApi[]>(`${this.baseUrl}/cargo`, {
      params: { description: description.trim() },
    });
  }
}
