import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Utils/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  createUser(user: User) {
    return this.http.post(`${this.baseUrl}/users`, user);
  }

  authenticateUser(user: User) {}
}
