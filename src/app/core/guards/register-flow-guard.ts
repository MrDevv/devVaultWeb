import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const registerFlowGuard: CanActivateFn = () => {
  const router = inject(Router);

  const state = router.currentNavigation()?.extras.state;
  const fromRegister = state?.['fromRegister'];
  const fromLogin = state?.['fromLogin'];

  if (fromRegister === true || fromLogin === true) {
    return true;
  }

  router.navigateByUrl('/auth/login');
  return false;
};
