import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenDto } from '@js-camp/core/dtos/token.dto';
import { TokenMapper } from '@js-camp/core/mappers/auth/token.mapper';
import { Token } from '@js-camp/core/models/auth/token';

import { catchError, defer, map, merge, Observable, of, ReplaySubject, retry, switchMap, tap } from 'rxjs';

import { ApiConfigService } from './api-config.service';

import { StorageService } from './storage.service';

const TOKEN_KEY = 'TOKENS';

/** Api service. */
@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private readonly tokenUpdated$ = new ReplaySubject<Token | null>(1);

  /** Token observer. */
  private readonly token$: Observable<Token | null>;

  public constructor(
    private readonly storageService: StorageService,
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfigService,
    private readonly router: Router,
  ) {
    const tokenFromStorage$ = defer(() =>
      this.storageService.get<Token>(TOKEN_KEY));
    this.token$ = merge(tokenFromStorage$, this.tokenUpdated$);
  }

  /** Get token from local storage. */
  public getTokens(): Observable<Token | null> {
    return this.token$;
  }

  /**
   * Save token to local storage.
   * @param token Token received from server.
   */
  public saveToken(token: Token): Observable<void> {
    return defer(() => this.storageService.set(TOKEN_KEY, token)).pipe(
      tap(() => this.tokenUpdated$.next(token)),
    );
  }

  /** Destroy token from local storage. */
  public destroyToken(): Observable<void> {
    return defer(() => this.storageService.remove(TOKEN_KEY)).pipe(
      tap(() => this.tokenUpdated$.next(null)),
    );
  }

  /** Refresh token. */
  public refreshToken(): Observable<void | null> {
    return this.token$.pipe(
      switchMap(token => {
        if (token === null) {
          return of(null);
        }
        return this.http
          .post<TokenDto>(
          `${this.apiConfig.apiUrl}auth/token/refresh/`,
          { refresh: token.refresh },
        )
          .pipe(
            map(response => TokenMapper.fromDto(response)),
            switchMap(tokens => this.saveToken(tokens)),
            retry(3),
            catchError(() => {
              this.router.navigate(['/auth/login']);
              return this.destroyToken();
            }),
          );
      }),
    );
  }
}
