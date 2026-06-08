export type Role = 'ADMIN' | 'CUSTOMER' | 'MERCHANT';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  dni: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  role: Role;
  accessExpiresInMs: number;
}

export interface RegisterResponse {
  userId: number;
  email: string;
  role: Role;
  customerId: number;
  fullName: string;
  dni: string;
}

export interface RefreshRequest {
  refreshToken: string;
}
