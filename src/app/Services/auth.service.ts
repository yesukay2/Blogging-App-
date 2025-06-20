import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Utils/interfaces';
import { Router } from '@angular/router';

const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient, private router: Router) {}

  createUser(user: User) {
    return this.http.post(`${this.baseUrl}/users`, user);
  }

  authenticateUser(email: string, password: string): boolean {
    if (email === 'admin' && password === 'admin') {
      localStorage.setItem(TOKEN_KEY, 'mock-jwt-token-yesu');
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
