import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['authenticateUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatSnackBarModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /posts on successful login', () => {
    mockAuthService.authenticateUser.and.returnValue(true);

    component.loginForm.setValue({ username: 'admin', password: 'admin' });
    component.login();

    expect(mockAuthService.authenticateUser).toHaveBeenCalledWith(
      'admin',
      'admin'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should show snackbar on failed login', () => {
    mockAuthService.authenticateUser.and.returnValue(false);

    component.loginForm.setValue({ username: 'wrong', password: 'user' });
    component.login();

    expect(mockAuthService.authenticateUser).toHaveBeenCalledWith(
      'wrong',
      'user'
    );
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Invalid username or password',
      'Close',
      { duration: 3000 }
    );
  });

  it('should not attempt login if form is invalid', () => {
    component.loginForm.setValue({ username: '', password: '' });
    component.login();

    expect(mockAuthService.authenticateUser).toHaveBeenCalledWith('', '');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
