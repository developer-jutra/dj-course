import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardStats, Task } from './dashboard.model';
import { MOCK_DASHBOARD_STATS, MOCK_TASKS } from '../../mock/dashboard.mock';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private mockDashboardStats: DashboardStats = MOCK_DASHBOARD_STATS;

  private mockTasks: Task[] = MOCK_TASKS;

  getDashboardStats(): Observable<DashboardStats> {
    return of(this.mockDashboardStats).pipe(delay(200));
  }

  getTasks(userId?: number): Observable<Task[]> {
    let tasks = this.mockTasks;
    if (userId) {
      tasks = tasks.filter(t => t.assignedTo === userId);
    }
    return of(tasks).pipe(delay(200));
  }
}