import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  TransferByCurrencyReport,
  TransferByDayReport,
  TransferByStatusReport,
  TRANSFER_STATUS_LABEL,
} from '../../../shared/models/transfer.model';
import { SolesPipe } from '../../../shared/pipes/soles.pipe';
import { TransferService } from '../../../core/services/transfer.service';
import { apiErrorMessage } from '../../../core/services/api-error';
import { DonutChart, DonutSlice } from '../../../shared/components/donut-chart/donut-chart';
import { BarChart, BarItem } from '../../../shared/components/bar-chart/bar-chart';
import { downloadCsv, printToPdf } from '../../../shared/utils/export';

type DayMetric = 'amount' | 'count';

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: '#1e7e34',
  PENDING: '#e8a13a',
  FAILED: '#c0392b',
};

const CURRENCY_COLORS: Record<string, string> = {
  PEN: '#c0392b',
  USD: '#1a5fb4',
  EUR: '#6c3fc4',
  GBP: '#1e7e34',
};

@Component({
  selector: 'app-transfers-report',
  imports: [
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    SolesPipe,
    DonutChart,
    BarChart,
  ],
  templateUrl: './transfers-report.html',
  styleUrl: './transfers-report.css',
})
export class TransfersReport {
  private transferService = inject(TransferService);

  byCurrency = signal<TransferByCurrencyReport[]>([]);
  byStatus = signal<TransferByStatusReport[]>([]);
  byDay = signal<TransferByDayReport[]>([]);

  loading = signal(false);
  loadingDay = signal(false);
  errorMessage = signal('');

  currencyColumns = ['currency', 'totalTransfers', 'totalAmount'];

  from = signal(this.isoDaysAgo(14));
  to = signal(this.isoDaysAgo(0));

  dayMetric = signal<DayMetric>('amount');

  statusDonut = computed<DonutSlice[]>(() =>
    this.byStatus().map(s => ({
      label: TRANSFER_STATUS_LABEL[s.status] ?? s.status,
      value: s.total,
      color: STATUS_COLORS[s.status] ?? '#999',
    })),
  );

  currencyBars = computed<BarItem[]>(() =>
    this.byCurrency().map(c => ({
      label: c.currency,
      value: c.totalAmount,
      display: `${c.currency} ${c.totalAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      color: CURRENCY_COLORS[c.currency] ?? 'var(--color-primary)',
    })),
  );

  dayMax = computed(() => {
    const metric = this.dayMetric();
    return Math.max(
      0,
      ...this.byDay().map(d => (metric === 'amount' ? d.totalAmount : d.totalTransfers)),
    );
  });
  dayColumns = computed(() => {
    const metric = this.dayMetric();
    const max = this.dayMax();
    return this.byDay().map(d => {
      const value = metric === 'amount' ? d.totalAmount : d.totalTransfers;
      return {
        day: d.day,
        shortDay: String(d.day).slice(5), // MM-dd
        transfers: d.totalTransfers,
        amount: d.totalAmount,
        value,
        height: max > 0 ? (value / max) * 100 : 0,
      };
    });
  });

  constructor() {
    this.loadAggregates();
    this.loadByDay();
  }

  loadAggregates(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.transferService.reportByCurrency().subscribe({
      next: data => this.byCurrency.set(data),
      error: err => this.errorMessage.set(apiErrorMessage(err, 'No se pudo cargar el reporte.')),
    });
    this.transferService.reportByStatus().subscribe({
      next: data => {
        this.byStatus.set(data);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(apiErrorMessage(err, 'No se pudo cargar el reporte.'));
      },
    });
  }

  loadByDay(): void {
    this.loadingDay.set(true);
    this.transferService.reportByDay(this.from(), this.to()).subscribe({
      next: data => {
        this.byDay.set(data);
        this.loadingDay.set(false);
      },
      error: err => {
        this.loadingDay.set(false);
        this.errorMessage.set(apiErrorMessage(err, 'No se pudo cargar el reporte por día.'));
      },
    });
  }

  statusText(status: TransferByStatusReport['status']): string {
    return TRANSFER_STATUS_LABEL[status] ?? status;
  }

  exportCurrencyCsv(): void {
    downloadCsv(
      'reporte-transferencias-por-moneda',
      ['Moneda', 'Cantidad', 'Monto total'],
      this.byCurrency().map(c => [c.currency, c.totalTransfers, c.totalAmount]),
    );
  }

  exportDayCsv(): void {
    downloadCsv(
      `reporte-transferencias-por-dia_${this.from()}_${this.to()}`,
      ['Fecha', 'Transferencias', 'Monto total'],
      this.byDay().map(d => [String(d.day), d.totalTransfers, d.totalAmount]),
    );
  }

  exportPdf(): void {
    printToPdf();
  }

  private isoDaysAgo(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
  }
}
