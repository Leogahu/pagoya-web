import { Routes } from '@angular/router';
import { TransferList } from './transfer-list/transfer-list';
import { TransferForm } from './transfer-form/transfer-form';

export const TRANSFERS_ROUTES: Routes = [
  { path: '',    component: TransferList },
  { path: 'new', component: TransferForm },
];