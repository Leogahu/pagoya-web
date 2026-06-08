import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { phoneValidator } from '../../../shared/validators/pagoya-validators';
import { CustomerService } from '../../../core/services/customer.service';
import { apiErrorMessage } from '../../../core/services/api-error';

@Component({
  selector: 'app-profile-edit',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile-edit.html',
  styleUrl: './profile-edit.css',
})
export class ProfileEdit {
  private fb = inject(FormBuilder);
  private customerService = inject(CustomerService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  dni = signal('');

  loading = signal(false);
  saving = signal(false);
  errorMessage = signal('');

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.maxLength(100)]],
    phone: ['', [phoneValidator()]],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.customerService.findMe().subscribe({
      next: customer => {
        this.dni.set(customer.dni);
        this.form.patchValue({
          fullName: customer.fullName,
          phone: customer.phone ?? '',
        });
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(apiErrorMessage(err, 'No se pudo cargar tu perfil.'));
      },
    });
  }

  submit(): void {
    this.errorMessage.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fullName, phone } = this.form.getRawValue();
    this.saving.set(true);
    this.customerService
      .updateMe({ fullName: fullName!, phone: phone || undefined })
      .subscribe({
        next: () => {
          this.snack.open('Perfil actualizado con éxito.', 'OK', { duration: 3000 });
          this.router.navigateByUrl('/app/profile');
        },
        error: err => {
          this.saving.set(false);
          this.errorMessage.set(apiErrorMessage(err, 'No se pudo actualizar tu perfil.'));
        },
      });
  }
}
