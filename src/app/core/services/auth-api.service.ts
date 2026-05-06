import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly baseUrl = 'https://api.alamanamarket.com/api/Account';

  constructor(private readonly http: HttpClient) {}

  register(payload: RegisterPayload): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/userRegister`, payload);
  }

  login(payload: LoginPayload): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/Login`, payload);
  }
}
