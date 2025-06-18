import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const isLoggedIn = this.authService.authenticateUser(
      this.username,
      this.password
    );
    if (isLoggedIn) {
      this.router.navigate(['/posts']);
    } else {
      alert('Invalid username or password');
    }
  }
}
