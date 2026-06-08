import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenService } from '../services/token.service';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (inject(TokenService).role === 'ADMIN') {
    return true;
  }
  inject(MatSnackBar).open(
    'Esta sección requiere permisos de administrador.',
    'OK',
    { duration: 4000 },
  );
  return router.createUrlTree(['/app/dashboard']);
};
