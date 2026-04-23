import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth-service';

export const notAuthenticatedGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const status = authService.authStatus();    

  if(status == 'authenticated' || status == 'checking'){
    router.navigateByUrl("/home")
    return false;
  }
  
  return true;
};
