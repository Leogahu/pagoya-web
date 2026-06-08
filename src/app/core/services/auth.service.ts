import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from '../../shared/models/auth.model';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokens = inject(TokenService);
  private base = `${environment.apiUrl}/auth`;

  isLoggedIn = signal(this.tokens.isLoggedIn);

  login(body: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, body).pipe(
      tap(res => {
        this.tokens.save(res.accessToken, res.refreshToken, res.email, res.role);
        this.isLoggedIn.set(true);
      }),
    );
  }

  register(body: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.base}/register`, body);
  }

  logout(): void {
    const refreshToken = this.tokens.refreshToken;
    if (refreshToken) {
      this.http.post(`${this.base}/logout`, { refreshToken }).subscribe();
    }
    this.tokens.clear();
    this.isLoggedIn.set(false);
  }
}
