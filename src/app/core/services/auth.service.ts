import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
  
export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUser = 'http://localhost:8080/api/users';
  private apiAuth = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.apiAuth}/login`, credentials);
  }

  registerUser(data: any) {
    return this.http.post<AuthResponse>(`${this.apiUser}/register`, data);
  }

  getCurrentUserId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch (e) {
      return null;
    }
  }

  getCurrentUserName(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userName || null;
    } catch (e) {
      return null;
    }
  }
}