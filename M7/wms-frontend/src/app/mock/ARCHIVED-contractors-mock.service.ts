import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { ContractorSummary as Contractor, ContractorDetails } from '../contract/contract';
import { MOCK_CONTRACTORS, MOCK_CONTRACTOR_DETAILS_LIST } from './contractors.mock';

@Injectable({
  providedIn: 'root'
})
export class ContractorsMockService {
  private mockContractors: Contractor[] = MOCK_CONTRACTORS;
  private mockContractorDetailsList: ContractorDetails[] = MOCK_CONTRACTOR_DETAILS_LIST;

  getContractors(): Observable<Contractor[]> {
    return of(this.mockContractors).pipe(delay(500));
  }

  getContractorById(id: string): Observable<ContractorDetails> {
    const contractor = this.mockContractorDetailsList.find(c => c.id === id);
    if (contractor) {
      return of(contractor).pipe(delay(500));
    }
    return throwError(() => new Error('Contractor not found'));
  }
} 