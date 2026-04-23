import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth-service';

export const authenticatedGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const status = authService.authStatus();

  if (status == 'not-authenticated') {
    router.navigateByUrl("/auth/login")
    return false;
  }

  return true;
};
