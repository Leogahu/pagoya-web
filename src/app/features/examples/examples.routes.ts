import { Routes } from '@angular/router';
import { Signals } from './signals/signals';
import { ReactiveForm } from './reactive-form/reactive-form';

export const EXAMPLES_ROUTES: Routes = [
  { path: 'signals',    component: Signals },
  { path: 'reactive-form', component: ReactiveForm },
];