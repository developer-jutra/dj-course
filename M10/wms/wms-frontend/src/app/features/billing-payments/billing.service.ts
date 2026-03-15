import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BillingOverview, Invoice } from './billing.model';
import { MOCK_BILLING_OVERVIEW, MOCK_INVOICES } from '../../mock/billing.mock';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private mockOverview: BillingOverview = MOCK_BILLING_OVERVIEW;

  private mockInvoices: Invoice[] = MOCK_INVOICES;

  getBillingOverview(): Observable<BillingOverview> {
    return of(this.mockOverview).pipe(delay(300));
  }

  getInvoices(): Observable<Invoice[]> {
    return of(this.mockInvoices).pipe(delay(300));
  }

  getInvoice(id: number): Observable<Invoice | undefined> {
    const invoice = this.mockInvoices.find(inv => inv.id === id);
    return of(invoice).pipe(delay(200));
  }
}