import { Routes } from '@angular/router';

import { LandingPage } from '@landing/pages/landing-page/landing-page';
import { GuidePage } from '@guide/pages/guide-page/guide-page';
import { notAuthenticatedGuard } from './core/guards/not-authenticated-guard';
import { authenticatedGuard } from './core/guards/authenticated-guard';

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
        loadChildren: () => import('@auth/auth.routes'),
        canMatch: [notAuthenticatedGuard]
    },
    {
        path: '',
        loadChildren: () => import('@devVault-administrativa/devVault-administrativa.routes'),
        canMatch: [authenticatedGuard]
    }

];
