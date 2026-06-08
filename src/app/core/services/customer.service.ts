import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Customer, UpdateCustomerRequest } from '../../shared/models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/customers`;

  findMe(): Observable<Customer> {
    return this.http.get<Customer>(`${this.base}/me`);
  }

  updateMe(body: UpdateCustomerRequest): Observable<Customer> {
    return this.http.put<Customer>(`${this.base}/me`, body);
  }

  deleteMe(): Observable<void> {
    return this.http.delete<void>(`${this.base}/me`);
  }
}
