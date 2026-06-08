import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { apiErrorMessage } from '../../../core/services/api-error';
import { dniValidator, phoneValidator } from '../../../shared/validators/pagoya-validators';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  hidePassword = signal(true);
  loading = signal(false);
  errorMessage = signal('');

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    dni: ['', [Validators.required, dniValidator()]],
    phone: ['', [phoneValidator()]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  togglePassword(event: MouseEvent): void {
    event.preventDefault();
    this.hidePassword.update(v => !v);
  }

  submit(): void {
    this.errorMessage.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const v = this.form.getRawValue();

    this.auth
      .register({
        fullName: v.fullName!,
        email: v.email!,
        dni: v.dni!,
        password: v.password!,
        phone: v.phone || undefined,
      })
      .subscribe({
        next: () => this.router.navigateByUrl('/auth/login'),
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.errorMessage.set(apiErrorMessage(err, 'No pudimos crear tu cuenta. Intenta de nuevo.'));
        },
      });
  }
}
