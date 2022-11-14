import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, catchError } from 'rxjs';

import { JwtService } from '../services';
import { ApiConfigService } from '../services/api-config.service';

/** Refresh token interceptor. */
@Injectable()
export class RefreshInterceptor implements HttpInterceptor {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly apiConfig: ApiConfigService,
  ) {}

  /**
   * Interceptor.
   * @param request Request object.
   * @param next Handler function.
   */
  public intercept<T>(
    request: HttpRequest<T>,
    next: HttpHandler,
  ): Observable<HttpEvent<T>> {
    return next.handle(request).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401 && this.shouldRefreshToken(request.url)) {
            return this.jwtService.refreshToken().pipe(
              switchMap(() => next.handle(request)),
            );
          }
        }
        throw error;
      }),
    );
  }

  private shouldRefreshToken(url: string): boolean {
    const isAuthRequest = url.startsWith(
      new URL('auth', this.apiConfig.apiUrl).toString(),
    );
    return !isAuthRequest;
  }
}
