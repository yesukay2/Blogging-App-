import { TestBed } from '@angular/core/testing';
import { ErrorHandlerService } from './error-handler.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [ErrorHandlerService, { provide: MatSnackBar, useValue: spy }],
    });

    service = TestBed.inject(ErrorHandlerService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle client-side error and show correct message', () => {
    const error = new HttpErrorResponse({
      error: new ErrorEvent('Network error'),
      status: 0,
      statusText: 'Unknown Error',
    });

    service.handleError(error).subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        expect(err.message).toBe('Error establishing a network connection!');
        expect(snackBarSpy.open).toHaveBeenCalledWith(
          'Error establishing a network connection!',
          'Dismiss',
          { duration: 4000 }
        );
      },
    });
  });

  it('should handle server-side error and show correct message', () => {
    const error = new HttpErrorResponse({
      error: { message: 'Server down' },
      status: 500,
      statusText: 'Internal Server Error',
    });

    service.handleError(error).subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        expect(err.message).toBe('Server Error. Please try again later.');
        expect(snackBarSpy.open).toHaveBeenCalledWith(
          'Server Error. Please try again later.',
          'Dismiss',
          { duration: 4000 }
        );
      },
    });
  });
});
