import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es'
import { OVERLAY_DEFAULT_CONFIG } from '@angular/cdk/overlay';
import { SeoTitleStrategy } from './core/seo/seo-title.strategy';

registerLocaleData(localeEs)

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    
    {
      provide: OVERLAY_DEFAULT_CONFIG,
      useValue: { usePopover: false }
    },

    {
      provide: TitleStrategy,
      useClass: SeoTitleStrategy
    },

    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    )
  ]
};
