import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CURRENCIES,
  Currency,
  TransferRequest,
  TransferType,
} from '../../../shared/models/transfer.model';
import {
  Account,
  ACCOUNT_STATUS_LABEL,
  ACCOUNT_TYPE_LABEL,
} from '../../../shared/models/account.model';
import { minAmountValidator } from '../../../shared/validators/pagoya-validators';
import { SolesPipe } from '../../../shared/pipes/soles.pipe';
import { AccountService } from '../../../core/services/account.service';
import { TransferService } from '../../../core/services/transfer.service';
import { apiErrorMessage } from '../../../core/services/api-error';

@Component({
  selector: 'app-transfer-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    SolesPipe,
  ],
  templateUrl: './transfer-form.html',
  styleUrl: './transfer-form.css',
})
export class TransferForm {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private transferService = inject(TransferService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  currencies = CURRENCIES;
  typeLabel = ACCOUNT_TYPE_LABEL;
  statusLabel = ACCOUNT_STATUS_LABEL;
  sourceAccounts = signal<Account[]>([]);

  type = signal<TransferType>('INTERNAL');
  loading = signal(false);
  submitting = signal(false);
  errorMessage = signal('');

  form = this.fb.group({
    sourceAccountNumber: ['', [Validators.required]],
    amount: [null as number | null, [Validators.required, minAmountValidator(1)]],
    currency: ['PEN', [Validators.required]],
    targetAccountNumber: ['', [Validators.required]],
    externalBankName: [''],
    externalAccountNumber: [''],
    externalBeneficiaryName: [''],
  });

  constructor() {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading.set(true);
    this.accountService.listMine({ page: 0, size: 100, sort: 'id' }).subscribe({
      next: res => {
        this.sourceAccounts.set(res.content);
        const firstActive = res.content.find(a => a.status === 'ACTIVE');
        if (firstActive) {
          this.form.controls.sourceAccountNumber.setValue(firstActive.accountNumber);
        }
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(apiErrorMessage(err, 'No se pudieron cargar tus cuentas.'));
      },
    });
  }

  setType(type: TransferType): void {
    this.type.set(type);
    const c = this.form.controls;
    const internal = type === 'INTERNAL';

    c.targetAccountNumber.setValidators(internal ? [Validators.required] : []);
    c.externalBeneficiaryName.setValidators(internal ? [] : [Validators.required]);
    c.externalBankName.setValidators(internal ? [] : [Validators.required]);
    c.externalAccountNumber.setValidators(internal ? [] : [Validators.required]);

    [
      c.targetAccountNumber,
      c.externalBeneficiaryName,
      c.externalBankName,
      c.externalAccountNumber,
    ].forEach(ctrl => ctrl.updateValueAndValidity());
  }

  submit(): void {
    this.errorMessage.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const internal = this.type() === 'INTERNAL';
    const body: TransferRequest = {
      sourceAccountNumber: v.sourceAccountNumber!,
      type: this.type(),
      amount: v.amount!,
      currency: v.currency as Currency,
      ...(internal
        ? { targetAccountNumber: v.targetAccountNumber! }
        : {
            externalBankName: v.externalBankName!,
            externalAccountNumber: v.externalAccountNumber!,
            externalBeneficiaryName: v.externalBeneficiaryName!,
          }),
    };

    this.submitting.set(true);
    this.transferService.create(body).subscribe({
      next: () => {
        this.snack.open('Transferencia enviada con éxito.', 'OK', { duration: 3000 });
        this.router.navigateByUrl('/app/transfers');
      },
      error: err => {
        this.submitting.set(false);
        this.errorMessage.set(apiErrorMessage(err, 'No se pudo realizar la transferencia.'));
      },
    });
  }
}
