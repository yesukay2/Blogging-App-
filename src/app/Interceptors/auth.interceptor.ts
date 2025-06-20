import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../Services/auth.service';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from '../Services/error-handler.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const errorHandler = inject(ErrorHandlerService);

  if (authService.isLoggedIn()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      return errorHandler.handleError(error);
    })
  );
};
