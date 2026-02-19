import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Reservation } from './reservations.model';
import {
  StorageApiService,
  StorageReservationApi,
} from '../storage/storage-api.service';

function mapApiReservationToReservation(
  api: StorageReservationApi
): Reservation {
  return {
    id: api.reservation_id,
    contractorId: String(api.customer_id),
    contractorName: `Contractor #${api.customer_id}`,
    storageRequestId: api.request_id,
    location: {
      zone: 'Shelf',
      aisle: '-',
      rack: '-',
      shelf: String(api.shelf_id),
      fullLocation: `Shelf #${api.shelf_id}`,
    },
    reservedFrom: new Date(api.reserved_from),
    reservedUntil: new Date(api.reserved_until),
    reservedWeight: Number(api.reserved_weight),
    reservedVolume: Number(api.reserved_volume),
    status: api.status as Reservation['status'],
    payment: {
      amount: 0,
      currency: 'USD',
      status: 'pending',
      dueDate: new Date(api.reserved_until),
    },
    createdAt: new Date(api.reserved_from),
    updatedAt: new Date(),
  };
}

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  private storageApi = inject(StorageApiService);

  getReservations(): Observable<Reservation[]> {
    return this.storageApi
      .getActiveReservations()
      .pipe(map((items) => items.map(mapApiReservationToReservation)));
  }

  getReservation(id: number): Observable<Reservation | undefined> {
    return this.getReservations().pipe(
      map((reservations) => reservations.find((r) => r.id === id))
    );
  }
}