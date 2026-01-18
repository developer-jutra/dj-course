import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DockAppointment, Task } from './warehouse-operations.model';
import { MOCK_DOCK_APPOINTMENTS } from '../../mock/dock-appointments.mock';
import { MOCK_WAREHOUSE_TASKS } from '../../mock/warehouse-tasks.mock';

@Injectable({
  providedIn: 'root'
})
export class WarehouseOperationsService {

  constructor() { }

  getDockAppointments(): Observable<DockAppointment[]> {
    return of(MOCK_DOCK_APPOINTMENTS);
  }

  getTasks(): Observable<Task[]> {
    return of(MOCK_WAREHOUSE_TASKS);
  }
} 