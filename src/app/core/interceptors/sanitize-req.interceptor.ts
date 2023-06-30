import { HttpInterceptorFn } from '@angular/common/http';
import { StringUtils } from '../../utils/string.utils';

export const sanitizeRequestPayloadInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.body) {
    const reqSanitized = request.clone({
      body: StringUtils.deepObjectTrim(request.body),
    });

    return next(reqSanitized);
  }

  return next(request);
}
