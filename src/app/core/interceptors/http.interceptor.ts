import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const token = '123456'

  const cloneRequest = req.clone({
    setHeaders: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  return next(cloneRequest);
};
