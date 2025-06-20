import { TestBed } from '@angular/core/testing';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthService } from '../Services/auth.service';
import { ErrorHandlerService } from '../Services/error-handler.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let errorHandler: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [provideHttpClientTesting()],
      providers: [
        AuthService,
        ErrorHandlerService,
        provideHttpClient(withInterceptorsFromDi()), // Register interceptors
        {
          provide: 'HTTP_INTERCEPTORS',
          useValue: authInterceptor,
          multi: true,
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    errorHandler = TestBed.inject(ErrorHandlerService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header when user is logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    spyOn(authService, 'getToken').and.returnValue('mock-token');

    http.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');

    req.flush({}); // Respond
  });

  it('should not add Authorization header when user is not logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(false);

    http.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush({});
  });

  it('should call error handler on HTTP error', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    spyOn(authService, 'getToken').and.returnValue('mock-token');
    const handleErrorSpy = spyOn(errorHandler, 'handleError').and.callThrough();

    http.get('/error').subscribe({
      error: () => {
        expect(handleErrorSpy).toHaveBeenCalled();
      },
    });

    const req = httpMock.expectOne('/error');
    req.flush('Something went wrong', {
      status: 500,
      statusText: 'Server Error',
    });
  });
});
