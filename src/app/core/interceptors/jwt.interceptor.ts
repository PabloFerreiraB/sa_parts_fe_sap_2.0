import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionStorageService } from '@core/services';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const sessionStorage = inject(SessionStorageService);
  let token = sessionStorage.retrieve('token');

  if (token) {
    const cloneRequest = request.clone({
      setHeaders: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    return next(cloneRequest);
  }

  return next(request);
};
