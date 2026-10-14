import { Routes } from '@angular/router';
import { SEO_SITE } from './core/seo/seo.config';

import { LandingPage } from '@landing/pages/landing-page/landing-page';
import { GuidePage } from '@guide/pages/guide-page/guide-page';
import { notAuthenticatedGuard } from './core/guards/not-authenticated-guard';
import { authenticatedGuard } from './core/guards/authenticated-guard';
import { SeoConfig } from './core/seo/seo.model';
import { TermsPageComponent } from './terms-of-service/pages/terms-page/terms-page.component';
import { PrivacyPageComponent } from './privacy-policy/pages/privacy-page/privacy-page.component';

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
        path: 'terms-of-service',
        component: TermsPageComponent,
        title: 'Términos de servicio | DevVault',
        data: {
            seo: {
                indexable: true,
                description: 'Consulta las condiciones de uso de DevVault para gestionar tu perfil profesional, experiencias y proyectos, y utilizar su API.',
                canonicalPath: '/terms-of-service'
            } satisfies SeoConfig
        }
    },
    {
        path: 'privacy-policy',
        component: PrivacyPageComponent,
        title: 'Política de privacidad | DevVault',
        data: {
            seo: {
                indexable: true,
                description: 'Conoce cómo DevVault recopila, utiliza y protege tus datos personales y cómo puedes gestionar tu información.',
                canonicalPath: '/privacy-policy'
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
