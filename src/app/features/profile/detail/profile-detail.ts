import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Customer } from '../../../shared/models/customer.model';
import { CustomerService } from '../../../core/services/customer.service';
import { TokenService } from '../../../core/services/token.service';
import { apiErrorMessage } from '../../../core/services/api-error';

@Component({
  selector: 'app-profile-detail',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
  ],
  templateUrl: './profile-detail.html',
  styleUrl: './profile-detail.css',
})
export class ProfileDetail {
  private customerService = inject(CustomerService);
  private tokens = inject(TokenService);

  customer = signal<Customer | null>(null);
  loading = signal(false);
  errorMessage = signal('');

  email = this.tokens.email ?? '';
  role = this.tokens.role ?? '';

  initials = computed(() => {
    const name = this.customer()?.fullName ?? '';
    return (
      name
        .split(' ')
        .filter(Boolean)
        .map(p => p[0])
        .slice(0, 4)
        .join('')
        .toUpperCase() || '—'
    );
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.customerService.findMe().subscribe({
      next: customer => {
        this.customer.set(customer);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(apiErrorMessage(err, 'No se pudo cargar tu perfil.'));
      },
    });
  }
}
