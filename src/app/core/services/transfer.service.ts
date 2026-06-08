import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageParams, PageResponse } from '../../shared/models/common.model';
import {
  Transfer,
  TransferByCurrencyReport,
  TransferByDayReport,
  TransferByStatusReport,
  TransferRequest,
} from '../../shared/models/transfer.model';

@Injectable({ providedIn: 'root' })
export class TransferService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/transfers`;

  create(body: TransferRequest): Observable<Transfer> {
    return this.http.post<Transfer>(this.base, body);
  }

  findByAccount(
    accountNumber: string,
    params: PageParams = {},
  ): Observable<PageResponse<Transfer>> {
    return this.http.get<PageResponse<Transfer>>(`${this.base}/account/${accountNumber}`, {
      params: this.toParams(params),
    });
  }

  reportByCurrency(): Observable<TransferByCurrencyReport[]> {
    return this.http.get<TransferByCurrencyReport[]>(`${this.base}/reports/by-currency`);
  }

  reportByStatus(): Observable<TransferByStatusReport[]> {
    return this.http.get<TransferByStatusReport[]>(`${this.base}/reports/by-status`);
  }

  reportByDay(from: string, to: string): Observable<TransferByDayReport[]> {
    return this.http.get<TransferByDayReport[]>(`${this.base}/reports/by-day`, {
      params: new HttpParams().set('from', from).set('to', to),
    });
  }

  private toParams(params: PageParams): HttpParams {
    let http = new HttpParams();
    if (params.page != null) http = http.set('page', params.page);
    if (params.size != null) http = http.set('size', params.size);
    if (params.sort) http = http.set('sort', params.sort);
    return http;
  }
}
