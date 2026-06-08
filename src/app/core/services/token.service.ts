import { Injectable } from '@angular/core';
import { Role } from '../../shared/models/auth.model';

const ACCESS_KEY = 'pagoya.accessToken';
const REFRESH_KEY = 'pagoya.refreshToken';
const EMAIL_KEY = 'pagoya.email';
const ROLE_KEY = 'pagoya.role';

@Injectable({ providedIn: 'root' })
export class TokenService {
  get accessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  }

  get refreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  }

  get email(): string | null {
    return localStorage.getItem(EMAIL_KEY);
  }

  get role(): Role | null {
    return localStorage.getItem(ROLE_KEY) as Role | null;
  }

  save(accessToken: string, refreshToken: string, email: string, role: Role): void {
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(EMAIL_KEY, email);
    localStorage.setItem(ROLE_KEY, role);
  }

  clear(): void {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(ROLE_KEY);
  }

  get isLoggedIn(): boolean {
    return !!this.accessToken;
  }
}
