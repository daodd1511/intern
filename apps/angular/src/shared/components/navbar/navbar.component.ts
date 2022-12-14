import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, Observable, tap, takeUntil } from 'rxjs';

import { AuthService } from '../../../core/services';

/** Navbar component. */
@Component({
  selector: 'camp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnDestroy {
  private readonly subscriptionDestroyed$: Subject<boolean> = new Subject();

  /** Check whether user authenticated or not. */
  public isAuthenticated$: Observable<boolean>;

  public constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.isAuthenticated$ = this.authService.checkAuthentication();
  }

  /** Handle logout. */
  public logout(): void {
    this.authService
      .logout()
      .pipe(
        tap(() => this.router.navigate(['auth/login'])),
        takeUntil(this.subscriptionDestroyed$),
      )
      .subscribe();
  }

  /** @inheritdoc */
  public ngOnDestroy(): void {
    this.subscriptionDestroyed$.next(true);
    this.subscriptionDestroyed$.complete();
  }
}
