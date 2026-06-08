import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountType } from '../../../shared/models/account.model';
import { AccountService } from '../../../core/services/account.service';
import { apiErrorMessage } from '../../../core/services/api-error';

@Component({
  selector: 'app-account-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './account-form.html',
  styleUrl: './account-form.css',
})
export class AccountForm {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  loading = signal(false);
  errorMessage = signal('');

  form = this.fb.group({
    type: ['SAVINGS' as AccountType, [Validators.required]],
  });

  submit(): void {
    this.errorMessage.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.accountService.create({ type: this.form.getRawValue().type! }).subscribe({
      next: () => {
        this.snack.open('Cuenta creada con éxito.', 'OK', { duration: 3000 });
        this.router.navigateByUrl('/app/accounts');
      },
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(apiErrorMessage(err, 'No se pudo crear la cuenta.'));
      },
    });
  }
}
