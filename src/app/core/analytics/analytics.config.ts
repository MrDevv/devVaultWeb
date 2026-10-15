import { InjectionToken } from '@angular/core';

import { environment } from '@environments/environment';

export interface AnalyticsConfig {
  enabled: boolean;
  measurementId: string;
  productionOrigin: string;
  allowedHosts: readonly string[];
  publicPages: Readonly<Record<string, string>>;
}

export const DEVVAULT_ANALYTICS_CONFIG: AnalyticsConfig = {
  enabled: environment.production,
  measurementId: 'G-8KFNVMPW5X',
  productionOrigin: 'https://devvault.netlify.app',
  allowedHosts: ['devvault.netlify.app'],
  publicPages: {
    '/': 'DevVault | Gestiona tu portafolio mediante una API',
    '/guide': 'Guia de integración de la API | DevVault',
    '/terms-of-service': 'Términos de servicio | DevVault',
    '/privacy-policy': 'Política de privacidad | DevVault',
  },
};

export const ANALYTICS_CONFIG = new InjectionToken<AnalyticsConfig>('DEVVAULT_ANALYTICS_CONFIG', {
  providedIn: 'root',
  factory: () => DEVVAULT_ANALYTICS_CONFIG,
});
