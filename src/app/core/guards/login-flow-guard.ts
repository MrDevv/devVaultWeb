import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginFlowGuard: CanActivateFn = () => {
  const router = inject(Router);

  const fromLogin = router.currentNavigation()?.extras.state?.['fromLogin'];

  if (fromLogin === true) {
    return true;
  }

  router.navigateByUrl('/auth/login');
  return false;
};
