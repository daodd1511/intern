import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Register } from '@js-camp/core/models/auth/register';

import { catchError, of, Subject, takeUntil, tap } from 'rxjs';

import {
  AuthService,
  ErrorService,
} from '../../../../core/services/';

/** Register component. */
@Component({
  selector: 'camp-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnDestroy {
  private readonly subscriptionDestroyed$: Subject<boolean> = new Subject();

  /** Register form group. */
  public readonly registerForm: FormGroup;

  public constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly errorService: ErrorService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly snackBar: MatSnackBar,
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  /** Handle form submission. */
  public onFormSubmit(): void {
    if (
      this.validateConfirmPassword(
        this.registerForm.controls['password'].value,
        this.registerForm.controls['confirmPassword'].value,
      )
    ) {
      this.authService
        .register(this.registerForm.value as Register)
        .pipe(
          tap(() => this.router.navigate([''])),
          catchError((error: unknown) => of(this.handleError(error))),
          takeUntil(this.subscriptionDestroyed$),
        )
        .subscribe();
    } else {
      this.registerForm.controls['confirmPassword'].setErrors({
        passwordMismatch: true,
      });
      this.changeDetectorRef.detectChanges();
    }
  }

  /**
   * Validate password confirmation.
   * @param password Password value.
   * @param confirmPassword Password confirmation value.
   */
  public validateConfirmPassword(
    password: string | null,
    confirmPassword: string | null,
  ): boolean {
    if (!password || !confirmPassword) {
      return false;
    }
    return password === confirmPassword;
  }

  /**
   * Handle error from server.
   * @param error Error from server.
   */
  private handleError(error: unknown): void {
    const errorData = this.errorService.getError(error);
    this.errorService.showErrorToForm(errorData, this.registerForm);
    this.errorService.openErrorDetailSnackBar(errorData, this.snackBar);
    this.changeDetectorRef.markForCheck();
  }

  /** @inheritdoc */
  public ngOnDestroy(): void {
    this.subscriptionDestroyed$.next(true);
    this.subscriptionDestroyed$.complete();
  }
}
