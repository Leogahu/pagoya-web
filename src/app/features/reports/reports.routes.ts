import { Routes } from '@angular/router';

export const REPORTS_ROUTES: Routes = [
  { path: '', redirectTo: 'accounts', pathMatch: 'full' },
  {
    path: 'accounts',
    loadComponent: () =>
      import('./accounts/accounts-report').then(m => m.AccountsReport),
  },
  {
    path: 'transfers',
    loadComponent: () =>
      import('./transfers/transfers-report').then(m => m.TransfersReport),
  },
];
