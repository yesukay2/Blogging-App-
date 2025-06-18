import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  login() {
    const isLoggedIn = this.authService.authenticateUser(
      this.loginForm.value.username!,
      this.loginForm.value.password!
    );
    if (isLoggedIn) {
      this.router.navigate(['/posts']);
    } else {
      alert('Invalid username or password');
    }
  }
}
