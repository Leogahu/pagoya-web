import { Routes } from '@angular/router';
import { AccountList } from './account-list/account-list';
import { AccountForm } from './account-form/account-form';

export const ACCOUNTS_ROUTES: Routes = [
  { path: '', component: AccountList },
  { path: 'new', component: AccountForm },
];