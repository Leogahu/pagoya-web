import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-deposit-dialog',
  imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Recargar cuenta</h2>
    <mat-dialog-content>
      <p class="account">{{ data.accountNumber }}</p>
      <mat-form-field appearance="outline" class="full">
        <mat-label>Monto a recargar</mat-label>
        <input matInput type="number" min="1" [(ngModel)]="amount" placeholder="0.00" />
        <span matTextPrefix>S/&nbsp;</span>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button (click)="ref.close()">Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="!amount || amount < 1" (click)="ref.close(amount)">
        Recargar
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .account { color: var(--color-text-muted); margin-bottom: 12px; font-family: monospace; }
    .full { width: 100%; }
  `,
})
export class DepositDialog {
  data = inject<{ accountNumber: string }>(MAT_DIALOG_DATA);
  ref = inject(MatDialogRef<DepositDialog>);
  amount: number | null = null;
}
