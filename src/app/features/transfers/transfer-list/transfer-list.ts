import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  Transfer,
  TransferStatus,
  TRANSFER_STATUS_LABEL,
  TRANSFER_TYPE_LABEL,
} from '../../../shared/models/transfer.model';
import { Account } from '../../../shared/models/account.model';
import { SolesPipe } from '../../../shared/pipes/soles.pipe';
import { AccountService } from '../../../core/services/account.service';
import { TransferService } from '../../../core/services/transfer.service';
import { apiErrorMessage } from '../../../core/services/api-error';

@Component({
  selector: 'app-transfer-list',
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressBarModule,
    SolesPipe,
  ],
  templateUrl: './transfer-list.html',
  styleUrl: './transfer-list.css',
})
export class TransferList {
  private accountService = inject(AccountService);
  private transferService = inject(TransferService);

  columns = ['date', 'source', 'destination', 'type', 'amount', 'status'];

  accounts = signal<Account[]>([]);
  transfers = signal<Transfer[]>([]);
  loading = signal(false);
  errorMessage = signal('');

    accountFilter = signal<string>('ALL');
  search = signal('');
  status = signal<TransferStatus | 'ALL'>('ALL');

  pageIndex = signal(0);
  pageSize = signal(10);

  filtered = computed(() => {
    const text = this.search().toLowerCase();
    const st = this.status();
    const acc = this.accountFilter();
    return this.transfers().filter(
      t =>
        (acc === 'ALL' || t.sourceAccountNumber === acc) &&
        (st === 'ALL' || t.status === st) &&
        (this.destinationOf(t).toLowerCase().includes(text) ||
          t.sourceAccountNumber.toLowerCase().includes(text)),
    );
  });


  paged = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.accountService.listMine({ page: 0, size: 100, sort: 'id' }).subscribe({
      next: res => {
        this.accounts.set(res.content);
        if (!res.content.length) {
          this.transfers.set([]);
          this.loading.set(false);
          return;
        }
        // La API lista por cuenta de origen: pedimos las de TODAS las cuentas.
        forkJoin(
          res.content.map(a =>
            this.transferService.findByAccount(a.accountNumber, {
              page: 0,
              size: 500,
              sort: 'createdAt,desc',
            }),
          ),
        ).subscribe({
          next: pages => {
            const merged = new Map<number, Transfer>();
            for (const page of pages) {
              for (const t of page.content) merged.set(t.id, t);
            }
            const all = [...merged.values()].sort((a, b) =>
              b.createdAt.localeCompare(a.createdAt),
            );
            this.transfers.set(all);
            this.loading.set(false);
          },
          error: err => {
            this.loading.set(false);
            this.errorMessage.set(
              apiErrorMessage(err, 'No se pudieron cargar las transferencias.'),
            );
          },
        });
      },
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(apiErrorMessage(err, 'No se pudieron cargar tus cuentas.'));
      },
    });
  }

  resetPage(): void {
    this.pageIndex.set(0);
  }

  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  destinationOf(t: Transfer): string {
    return t.type === 'INTERNAL'
      ? (t.targetAccountNumber ?? '—')
      : `${t.externalBeneficiaryName} · ${t.externalBankName}`;
  }

  statusText(t: Transfer): string {
    return TRANSFER_STATUS_LABEL[t.status];
  }

  typeText(t: Transfer): string {
    return TRANSFER_TYPE_LABEL[t.type];
  }

  statusClass(t: Transfer): string {
    return 'status-' + t.status.toLowerCase();
  }
}
