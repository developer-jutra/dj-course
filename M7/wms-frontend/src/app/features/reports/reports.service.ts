import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { OperationalMetrics, UtilizationReport, FinancialReport, AuditTrail } from './reports.model';
import { getOperationalMetrics, getUtilizationReport, getFinancialReport, getAuditTrails } from '../../mock/reports.mock';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  getOperationalMetrics(period: string): Observable<OperationalMetrics> {
    return of(getOperationalMetrics(period)).pipe(delay(300));
  }

  getUtilizationReport(period: string): Observable<UtilizationReport> {
    return of(getUtilizationReport(period)).pipe(delay(300));
  }

  getFinancialReport(period: string): Observable<FinancialReport> {
    return of(getFinancialReport(period)).pipe(delay(300));
  }

  getAuditTrails(filter: string, dateFrom: string, dateTo: string): Observable<AuditTrail> {
    return of(getAuditTrails(filter, dateFrom, dateTo)).pipe(delay(300));
  }

  exportReport(type: string, period: string): Observable<Blob> {
    // Mock PDF blob
    const mockPdfContent = `Mock ${type} report for ${period}`;
    const blob = new Blob([mockPdfContent], { type: 'application/pdf' });
    return of(blob).pipe(delay(500));
  }
}