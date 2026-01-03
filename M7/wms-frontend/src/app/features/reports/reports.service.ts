import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { OperationalMetrics, UtilizationReport, FinancialReport, AuditTrail } from './reports.model';
import { MOCK_AUDIT_TRAIL, MOCK_FINANCIAL_REPORT, MOCK_OPERATIONAL_METRICS, MOCK_UTILIZATION_REPORT } from '../../mock/reports.mock';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private mockOperationalMetrics: OperationalMetrics = MOCK_OPERATIONAL_METRICS;

  private mockUtilizationReport: UtilizationReport = MOCK_UTILIZATION_REPORT;

  private mockFinancialReport: FinancialReport = MOCK_FINANCIAL_REPORT;

  private mockAuditTrail: AuditTrail = MOCK_AUDIT_TRAIL;

  getOperationalMetrics(period: string): Observable<OperationalMetrics> {
    return of(this.mockOperationalMetrics).pipe(delay(300));
  }

  getUtilizationReport(period: string): Observable<UtilizationReport> {
    return of(this.mockUtilizationReport).pipe(delay(300));
  }

  getFinancialReport(period: string): Observable<FinancialReport> {
    return of(this.mockFinancialReport).pipe(delay(300));
  }

  getAuditTrails(filter: string, dateFrom: string, dateTo: string): Observable<AuditTrail> {
    return of(this.mockAuditTrail).pipe(delay(300));
  }

  exportReport(type: string, period: string): Observable<Blob> {
    // Mock PDF blob
    const mockPdfContent = `Mock ${type} report for ${period}`;
    const blob = new Blob([mockPdfContent], { type: 'application/pdf' });
    return of(blob).pipe(delay(500));
  }
}