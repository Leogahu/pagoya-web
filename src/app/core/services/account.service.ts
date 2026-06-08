import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageParams, PageResponse } from '../../shared/models/common.model';
import {
  Account,
  AccountBalance,
  AccountSummaryReport,
  CreateAccountRequest,
  DepositRequest,
  RecipientAccount,
} from '../../shared/models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/accounts`;

  create(body: CreateAccountRequest): Observable<Account> {
    return this.http.post<Account>(this.base, body);
  }

  listMine(params: PageParams = {}): Observable<PageResponse<Account>> {
    return this.http.get<PageResponse<Account>>(`${this.base}/me`, {
      params: this.toParams(params),
    });
  }

  balance(accountNumber: string): Observable<AccountBalance> {
    return this.http.get<AccountBalance>(`${this.base}/${accountNumber}/balance`);
  }

  deposit(accountNumber: string, body: DepositRequest): Observable<AccountBalance> {
    return this.http.post<AccountBalance>(`${this.base}/${accountNumber}/deposit`, body);
  }

  close(accountNumber: string): Observable<Account> {
    return this.http.patch<Account>(`${this.base}/${accountNumber}/close`, {});
  }

  findRecipients(dni: string): Observable<RecipientAccount[]> {
    return this.http.get<RecipientAccount[]>(`${this.base}/recipient`, {
      params: new HttpParams().set('dni', dni),
    });
  }

  listByCustomer(customerId: number, params: PageParams = {}): Observable<PageResponse<Account>> {
    return this.http.get<PageResponse<Account>>(`${this.base}/customer/${customerId}`, {
      params: this.toParams(params),
    });
  }

  summary(): Observable<AccountSummaryReport[]> {
    return this.http.get<AccountSummaryReport[]>(`${this.base}/reports/summary`);
  }

  private toParams(params: PageParams): HttpParams {
    let http = new HttpParams();
    if (params.page != null) http = http.set('page', params.page);
    if (params.size != null) http = http.set('size', params.size);
    if (params.sort) http = http.set('sort', params.sort);
    return http;
  }
}
