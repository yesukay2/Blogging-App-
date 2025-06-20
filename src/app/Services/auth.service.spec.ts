import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { zip } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [provideHttpClientTesting()],
      providers: [{ provide: Router, useValue: spy }],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a user', () => {
    const mockUser = {
      name: 'Test',
      email: 'test@test.com',
      id: 1,
      username: 'test',
      address: {
        street: 'test',
        suite: 'test',
        city: 'test',
        zipcode: 'test',
        geo: { lat: 'test', lng: 'test' },
      },
      phone: '1234567890',
      website: 'test.com',
      company: { name: 'test', catchPhrase: 'test', bs: 'test' },
    };
    service.createUser(mockUser).subscribe((res) => {
      expect(res).toEqual(mockUser);
    });

    const req = httpMock.expectOne(
      'https://jsonplaceholder.typicode.com/users'
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should authenticate with correct credentials', () => {
    const result = service.authenticateUser('admin', 'admin');
    expect(result).toBeTrue();
    expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token-yesu');
  });

  it('should not authenticate with incorrect credentials', () => {
    const result = service.authenticateUser('user', 'wrong');
    expect(result).toBeFalse();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('should logout and remove token', () => {
    localStorage.setItem('auth_token', 'mock-token');
    service.logout();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should return token', () => {
    localStorage.setItem('auth_token', 'token123');
    expect(service.getToken()).toBe('token123');
  });

  it('should return true if logged in', () => {
    localStorage.setItem('auth_token', 'token123');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if not logged in', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });
});
