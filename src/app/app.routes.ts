import { Routes } from '@angular/router';

import { LoginPage } from './auth/pages/login-page/login-page';
import { HomePage } from './devVault-front/home/pages/home-page/home-page';
import { RegisterPage } from './auth/pages/register/register-page';
import { LandingPage } from './landing/pages/landing-page/landing-page';
import { GuidePage } from './guide/pages/guide-page/guide-page';
import { DevVaultFrontLayout } from './devVault-front/shared/layouts/dev-vault-front-layout/dev-vault-front-layout';

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
        children: [
            {
                path: 'login',
                component: LoginPage
            },
            {
                path: 'register',
                component: RegisterPage
            }
        ]
    },
    {
        path: '',
        component: DevVaultFrontLayout,
        children: [
            {
                path: 'home',
                component: HomePage
            },
            {
                path: '**',
                redirectTo: 'home'
            }
        ]
        
    }

];
