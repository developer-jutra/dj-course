import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContractorSummary as Contractor, ContractorDetails, ContractorStatus } from '../../contract/contract';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractorsService {
  private http = inject(HttpClient);

  getContractorsList(): Observable<Contractor[]> {
    return this.http.get<Contractor[]>(`${environment.API_URL}/contractors`);
  }

  getContractorDetails(id: number): Observable<ContractorDetails | undefined> {
    return this.http.get<ContractorDetails>(`${environment.API_URL}/contractors/${id}`);
  }

  updateContractorStatus(id: Contractor['id'], status: ContractorStatus): Observable<ContractorDetails | undefined> {
    return this.http.patch<ContractorDetails>(`${environment.API_URL}/contractors/${id}`, { status });
    }

  addContractor(contractorData: any): Observable<Contractor> {
    return this.http.post<Contractor>(`${environment.API_URL}/contractors`, contractorData);
  }
}
