import { Routes } from '@angular/router';
import { SEO_SITE } from './core/seo/seo.config';

import { LandingPage } from '@landing/pages/landing-page/landing-page';
import { GuidePage } from '@guide/pages/guide-page/guide-page';
import { notAuthenticatedGuard } from './core/guards/not-authenticated-guard';
import { authenticatedGuard } from './core/guards/authenticated-guard';
import { SeoConfig } from './core/seo/seo.model';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: LandingPage,
        title: SEO_SITE.defaultTitle,
        data: {
            seo: {
                indexable: true,
                description: SEO_SITE.defaultDescription,
                canonicalPath: '/'
            } satisfies SeoConfig
        }
    },
    {
        path: 'guide',
        component: GuidePage,
        title: 'Guia de integración de la API | DevVault',
        data: {
            seo: {
                indexable: true,
                description: 'Aprende a integrar DevVault en tu portafolio: configura tu API Key y consulta tu perfil, experiencias, proyectos y tecnologías.',
                canonicalPath: '/guide'
            } satisfies SeoConfig
        }
    },
    {
        path: 'auth',
        loadChildren: () => import('@auth/auth.routes'),
        canMatch: [notAuthenticatedGuard],
        data: {
            seo: {
                indexable: false,
            } satisfies SeoConfig
        }
    },
    {
        path: '',
        loadChildren: () => import('@devVault-administrativa/devVault-administrativa.routes'),
        canMatch: [authenticatedGuard],
        data: {
            seo: {
                indexable: false,
            } satisfies SeoConfig
        }
    }

];
