import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const registerFlowGuard: CanActivateFn = () => {
  const router = inject(Router);

  const fromRegister = router.currentNavigation()?.extras.state?.['fromRegister'];

  if (fromRegister === true) {
    return true;
  }

  router.navigateByUrl('/auth/login');
  return false;
};
