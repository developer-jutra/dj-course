import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Dock } from './dock.model';
import { MOCK_DOCKS, MOCK_DOCK_ACTIVITY } from '../../mock/docks.mock';

@Injectable({
  providedIn: 'root',
})
export class DockService {
  private mockDocks: Dock[] = MOCK_DOCKS;

  getDocks(): Observable<Dock[]> {
    return of(this.mockDocks).pipe(delay(300));
  }

  getDock(id: number): Observable<Dock | undefined> {
    const dock = this.mockDocks.find(d => d.id === id);
    return of(dock).pipe(delay(200));
  }

  getRecentDockActivity(): Observable<any[]> {
    const mockActivity = MOCK_DOCK_ACTIVITY;
    return of(mockActivity).pipe(delay(200));
  }
} 