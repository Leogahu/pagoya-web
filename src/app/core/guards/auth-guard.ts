import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (inject(TokenService).isLoggedIn) {
    return true;
  }
  return router.createUrlTree(['/auth/login']);
};
