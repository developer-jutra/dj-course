import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Reservation } from './reservations.model';
import { MOCK_RESERVATIONS } from '../../mock/reservations.mock';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  private mockReservations: Reservation[] = MOCK_RESERVATIONS;

  getReservations(): Observable<Reservation[]> {
    return of(this.mockReservations).pipe(delay(300));
  }

  getReservation(id: number): Observable<Reservation | undefined> {
    const reservation = this.mockReservations.find(r => r.id === id);
    return of(reservation).pipe(delay(200));
  }
}