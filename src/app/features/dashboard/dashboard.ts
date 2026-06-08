import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SolesPipe } from '../../shared/pipes/soles.pipe';
import { Account, AccountSummaryReport, ACCOUNT_TYPE_LABEL } from '../../shared/models/account.model';
import {
  Transfer,
  TransferByStatusReport,
  TRANSFER_STATUS_LABEL,
  TRANSFER_TYPE_LABEL,
} from '../../shared/models/transfer.model';
import { AccountService } from '../../core/services/account.service';
import { TransferService } from '../../core/services/transfer.service';
import { CustomerService } from '../../core/services/customer.service';
import { TokenService } from '../../core/services/token.service';
import { apiErrorMessage } from '../../core/services/api-error';
import { DonutChart, DonutSlice } from '../../shared/components/donut-chart/donut-chart';

const ACCOUNT_PALETTE = ['#c0392b', '#1a5fb4', '#6c3fc4', '#1e7e34', '#e8a13a', '#0d9488'];

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: '#1e7e34',
  PENDING: '#e8a13a',
  FAILED: '#c0392b',
};

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    SolesPipe,
    DonutChart,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private accountService = inject(AccountService);
  private transferService = inject(TransferService);
  private customerService = inject(CustomerService);
  private tokens = inject(TokenService);

  isAdmin = this.tokens.role === 'ADMIN';

  userName = signal('');
  loading = signal(false);
  errorMessage = signal('');

  accounts = signal<Account[]>([]);
  movements = signal<Transfer[]>([]);
  columns = ['date', 'destination', 'type', 'amount'];

  totalBalance = computed(() => this.accounts().reduce((sum, a) => sum + a.balance, 0));
  activeCount = computed(() => this.accounts().filter(a => a.status === 'ACTIVE').length);

  balanceDonut = computed<DonutSlice[]>(() =>
    this.accounts()
      .filter(a => a.balance > 0)
      .map((a, i) => ({
        label: `${ACCOUNT_TYPE_LABEL[a.type]} · ${a.accountNumber}`,
        value: a.balance,
        color: ACCOUNT_PALETTE[i % ACCOUNT_PALETTE.length],
      })),
  );

  accountSummary = signal<AccountSummaryReport[]>([]);
  transferStatus = signal<TransferByStatusReport[]>([]);

  totalAccounts = computed(() => this.accountSummary().reduce((s, r) => s + r.total, 0));
  globalBalance = computed(() => this.accountSummary().reduce((s, r) => s + r.totalBalance, 0));
  totalTransfers = computed(() => this.transferStatus().reduce((s, r) => s + r.total, 0));

  statusDonut = computed<DonutSlice[]>(() =>
    this.transferStatus().map(s => ({
      label: TRANSFER_STATUS_LABEL[s.status] ?? s.status,
      value: s.total,
      color: STATUS_COLORS[s.status] ?? '#999',
    })),
  );

  constructor() {
    if (this.isAdmin) {
      this.userName.set('Administrador');
      this.loadAdminData();
    } else {
      this.loadName();
      this.loadCustomerData();
    }
  }

  loadName(): void {
    this.customerService.findMe().subscribe({
      next: c => this.userName.set(c.fullName.split(' ')[0]),
      error: () => this.userName.set(''),
    });
  }

  loadCustomerData(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.accountService.listMine({ page: 0, size: 100, sort: 'id' }).subscribe({
      next: res => {
        this.accounts.set(res.content);
        this.loading.set(false);
        this.loadMovements(res.content);
      },
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(apiErrorMessage(err, 'No se pudo cargar tu información.'));
      },
    });
  }

  loadMovements(accounts: Account[]): void {
    if (!accounts.length) {
      this.movements.set([]);
      return;
    }
    forkJoin(
      accounts.map(a =>
        this.transferService.findByAccount(a.accountNumber, {
          page: 0,
          size: 5,
          sort: 'createdAt,desc',
        }),
      ),
    ).subscribe({
      next: pages => {
        const merged = new Map<number, Transfer>();
        for (const page of pages) {
          for (const t of page.content) merged.set(t.id, t);
        }
        const latest = [...merged.values()]
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, 5);
        this.movements.set(latest);
      },
      error: () => this.movements.set([]),
    });
  }


  loadAdminData(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.accountService.summary().subscribe({
      next: data => {
        this.accountSummary.set(data);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(apiErrorMessage(err, 'No se pudo cargar el resumen.'));
      },
    });
    this.transferService.reportByStatus().subscribe({
      next: data => this.transferStatus.set(data),
      error: () => this.transferStatus.set([]),
    });
  }

  destinationOf(t: Transfer): string {
    return t.type === 'INTERNAL'
      ? (t.targetAccountNumber ?? '—')
      : `${t.externalBeneficiaryName} · ${t.externalBankName}`;
  }

  typeText(t: Transfer): string {
    return TRANSFER_TYPE_LABEL[t.type];
  }
}
