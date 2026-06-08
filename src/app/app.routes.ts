import { Routes } from '@angular/router';
import { MainLayout } from './shared/layouts/main-layout/main-layout';
import { AuthLayout } from './shared/layouts/auth-layout/auth-layout';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { customerGuard } from './core/guards/customer-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

 
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
      },
    ],
  },

 
  {
    path: 'app',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

    
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
      },

     
      {
        path: 'assistant',
        loadComponent: () =>
          import('./features/assistant/assistant').then(m => m.Assistant),
      },

    
      {
        path: 'accounts',
        canActivate: [customerGuard],
        loadChildren: () =>
          import('./features/accounts/accounts.routes').then(m => m.ACCOUNTS_ROUTES),
      },
      {
        path: 'transfers',
        canActivate: [customerGuard],
        loadChildren: () =>
          import('./features/transfers/transfers.routes').then(m => m.TRANSFERS_ROUTES),
      },
      {
        path: 'reports',
        canActivate: [adminGuard],
        loadChildren: () =>
          import('./features/reports/reports.routes').then(m => m.REPORTS_ROUTES),
      },
      {
        path: 'profile',
        canActivate: [customerGuard],
        loadChildren: () =>
          import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES),
      },

   
      {
        path: 'examples',
        loadChildren: () =>
          import('./features/examples/examples.routes').then(m => m.EXAMPLES_ROUTES),
      },
    ],
  },
];
