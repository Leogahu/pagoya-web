import { Component, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  AccountStatus,
  AccountSummaryReport,
  AccountType,
  ACCOUNT_STATUS_LABEL,
  ACCOUNT_TYPE_LABEL,
} from '../../../shared/models/account.model';
import { AccountService } from '../../../core/services/account.service';
import { apiErrorMessage } from '../../../core/services/api-error';
import { SolesPipe } from '../../../shared/pipes/soles.pipe';
import { DonutChart, DonutSlice } from '../../../shared/components/donut-chart/donut-chart';
import { BarChart, BarItem } from '../../../shared/components/bar-chart/bar-chart';
import { downloadCsv, printToPdf } from '../../../shared/utils/export';

type DonutMode = 'status' | 'type';

const STATUS_COLORS: Record<AccountStatus, string> = {
  ACTIVE: '#1e7e34',
  SUSPENDED: '#e8a13a',
  CLOSED: '#9aa0a6',
};

const TYPE_COLORS: Record<AccountType, string> = {
  SAVINGS: '#1a5fb4',
  CHECKING: '#6c3fc4',
};

@Component({
  selector: 'app-accounts-report',
  imports: [
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    SolesPipe,
    DonutChart,
    BarChart,
  ],
  templateUrl: './accounts-report.html',
  styleUrl: './accounts-report.css',
})
export class AccountsReport {
  private accountService = inject(AccountService);

  columns = ['type', 'status', 'total', 'totalBalance'];

  rows = signal<AccountSummaryReport[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  totalAccounts = computed(() => this.rows().reduce((sum, r) => sum + r.total, 0));
  totalBalance = computed(() => this.rows().reduce((sum, r) => sum + r.totalBalance, 0));

  donutMode = signal<DonutMode>('status');

  statusDonut = computed<DonutSlice[]>(() => {
    if (this.donutMode() === 'type') {
      const grouped = new Map<AccountType, number>();
      for (const r of this.rows()) {
        grouped.set(r.type, (grouped.get(r.type) ?? 0) + r.total);
      }
      return [...grouped.entries()].map(([type, total]) => ({
        label: ACCOUNT_TYPE_LABEL[type],
        value: total,
        color: TYPE_COLORS[type],
      }));
    }
    const grouped = new Map<AccountStatus, number>();
    for (const r of this.rows()) {
      grouped.set(r.status, (grouped.get(r.status) ?? 0) + r.total);
    }
    return [...grouped.entries()].map(([status, total]) => ({
      label: ACCOUNT_STATUS_LABEL[status],
      value: total,
      color: STATUS_COLORS[status],
    }));
  });

  balanceByType = computed<BarItem[]>(() => {
    const grouped = new Map<AccountType, number>();
    for (const r of this.rows()) {
      grouped.set(r.type, (grouped.get(r.type) ?? 0) + r.totalBalance);
    }
    return [...grouped.entries()].map(([type, balance]) => ({
      label: ACCOUNT_TYPE_LABEL[type],
      value: balance,
      display: `S/ ${balance.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      color: TYPE_COLORS[type],
    }));
  });

  constructor() {
    this.loading.set(true);
    this.accountService.summary().subscribe({
      next: data => {
        this.rows.set(data);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(apiErrorMessage(err, 'No se pudo cargar el reporte.'));
      },
    });
  }

  typeText(r: AccountSummaryReport): string {
    return ACCOUNT_TYPE_LABEL[r.type];
  }

  statusText(r: AccountSummaryReport): string {
    return ACCOUNT_STATUS_LABEL[r.status];
  }

  exportCsv(): void {
    downloadCsv(
      'reporte-cuentas',
      ['Tipo', 'Estado', 'Cantidad', 'Saldo'],
      this.rows().map(r => [this.typeText(r), this.statusText(r), r.total, r.totalBalance]),
    );
  }

  exportPdf(): void {
    printToPdf();
  }
}
