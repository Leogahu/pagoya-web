import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Account,
  AccountStatus,
  ACCOUNT_STATUS_LABEL,
  ACCOUNT_TYPE_LABEL,
} from '../../../shared/models/account.model';
import { AccountService } from '../../../core/services/account.service';
import { apiErrorMessage } from '../../../core/services/api-error';
import { SolesPipe } from '../../../shared/pipes/soles.pipe';
import { DepositDialog } from '../deposit-dialog/deposit-dialog';

@Component({
  selector: 'app-account-list',
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatProgressBarModule,
    SolesPipe,
  ],
  templateUrl: './account-list.html',
  styleUrl: './account-list.css',
})
export class AccountList {
  private accountService = inject(AccountService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  typeLabel = ACCOUNT_TYPE_LABEL;
  statusLabel = ACCOUNT_STATUS_LABEL;

  accounts = signal<Account[]>([]);
  total = signal(0);
  loading = signal(false);
  errorMessage = signal('');

  pageIndex = signal(0);
  pageSize = signal(6);

  search = signal('');
  status = signal<AccountStatus | 'ALL'>('ALL');

  filtered = computed(() => {
    const text = this.search().toLowerCase();
    const st = this.status();
    return this.accounts().filter(
      a => a.accountNumber.toLowerCase().includes(text) && (st === 'ALL' || a.status === st),
    );
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.accountService
      .listMine({ page: this.pageIndex(), size: this.pageSize(), sort: 'id' })
      .subscribe({
        next: res => {
          this.accounts.set(res.content);
          this.total.set(res.totalElements);
          this.loading.set(false);
        },
        error: err => {
          this.loading.set(false);
          this.errorMessage.set(apiErrorMessage(err, 'No se pudieron cargar tus cuentas.'));
        },
      });
  }

  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.load();
  }

  deposit(acc: Account): void {
    this.dialog
      .open(DepositDialog, { data: { accountNumber: acc.accountNumber }, width: '360px' })
      .afterClosed()
      .subscribe((amount: number | undefined) => {
        if (!amount) return;
        this.accountService.deposit(acc.accountNumber, { amount }).subscribe({
          next: () => {
            this.snack.open('Recarga realizada con éxito.', 'OK', { duration: 3000 });
            this.load();
          },
          error: err => this.snack.open(apiErrorMessage(err), 'OK', { duration: 4000 }),
        });
      });
  }

  closeAccount(acc: Account): void {
    this.accountService.close(acc.accountNumber).subscribe({
      next: () => {
        this.snack.open('Cuenta cerrada.', 'OK', { duration: 3000 });
        this.load();
      },
      error: err => this.snack.open(apiErrorMessage(err), 'OK', { duration: 4000 }),
    });
  }
}
