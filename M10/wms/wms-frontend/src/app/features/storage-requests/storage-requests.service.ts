import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { StorageRequest } from './storage-request.model';
import { MOCK_STORAGE_REQUESTS } from '../../mock/storage-requests.mock';

@Injectable({
  providedIn: 'root',
})
export class StorageRequestService {
  private mockStorageRequests: StorageRequest[] = MOCK_STORAGE_REQUESTS;

  getStorageRequests(): Observable<StorageRequest[]> {
    return of(this.mockStorageRequests).pipe(delay(300));
  }

  updateStorageRequestStatus(
    requestId: number,
    status: string,
    employeeId: number
  ): Observable<void> {
    const request = this.mockStorageRequests.find(r => r.id === requestId);
    if (request) {
      request.status = status as any;
      request.decisionEmployeeId = employeeId;
      request.decisionDate = new Date();
    }
    return of(void 0).pipe(delay(500));
  }
} 