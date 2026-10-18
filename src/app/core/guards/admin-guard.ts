import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth-service';

export const adminGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const isAdmin = authService.user()?.rol.descripcion === 'admin';

  if (!isAdmin) {
    router.navigateByUrl("/");
    return false;
  }

  return true;
};
