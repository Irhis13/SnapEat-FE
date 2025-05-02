import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string }>('http://localhost:8080/auth/login', credentials);
  }

  register(data: any) {
    return this.http.post('http://localhost:8080/api/users/register', data);
  }
}
