import { Routes } from '@angular/router';

import { LandingPage } from '@landing/pages/landing-page/landing-page';
import { GuidePage } from '@guide/pages/guide-page/guide-page';

export const routes: Routes = [
    {
        path: '',
        component: LandingPage
    },
    {
        path: 'guide',
        component: GuidePage
    },
    {
        path: 'auth',
        loadChildren: () => import('@auth/auth.routes')
    },
    {
        path: '',
        loadChildren: () => import('@devVault-administrativa/devVault-administrativa.routes')
    }

];
