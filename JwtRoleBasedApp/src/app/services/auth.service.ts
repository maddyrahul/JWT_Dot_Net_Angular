// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoginModel } from '../models/login-model';
import { RegisterModel } from '../models/register-model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7110/api/Auth'; // Update to your backend API
  private userSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService, private router: Router) {
    // Initialize userSubject with username from localStorage
    const username = localStorage.getItem('username');
    this.userSubject.next(username);
  }

  register(user: RegisterModel): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(credentials: LoginModel): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  setUser(username: string | null) {
    if (username) {
      localStorage.setItem('username', username); // Store username in localStorage
    } else {
      localStorage.removeItem('username'); // Clear on logout
    }
    this.userSubject.next(username);
  }

  getUsernameObservable(): Observable<string | null> {
    return this.userSubject.asObservable();
  }

  getRole(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    }
    return null;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // Clear username from localStorage
    this.userSubject.next(null); // Emit null on logout
    this.router.navigate(['/login']);
  }
}
