import { Routes } from '@angular/router';
import { ProfileDetail } from './detail/profile-detail';
import { ProfileEdit } from './edit/profile-edit';

export const PROFILE_ROUTES: Routes = [
  { path: '',     component: ProfileDetail },
  { path: 'edit', component: ProfileEdit },
];
