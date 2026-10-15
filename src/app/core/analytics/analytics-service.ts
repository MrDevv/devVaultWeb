import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

import { ANALYTICS_CONFIG } from './analytics.config';

type ConsentValue = 'granted' | 'denied';

interface ConsentSettings {
  ad_storage: 'denied';
  ad_user_data: 'denied';
  ad_personalization: 'denied';
  analytics_storage: ConsentValue;
}

interface GoogleTagConfig {
  allow_ad_personalization_signals: false;
  allow_google_signals: false;
  ignore_referrer: boolean;
  page_location: string;
  page_referrer: string;
  page_title: string;
  send_page_view: false;
  update?: true;
}

interface GoogleTagGlobalSettings {
  allow_ad_personalization_signals: false;
  allow_google_signals: false;
  page_location: string;
  page_referrer: string;
  page_title: string;
  send_page_view: false;
}

interface PageViewParameters {
  page_location: string;
  page_referrer: string;
  page_title: string;
  send_to: string;
}

type GtagArguments =
  | ['js', Date]
  | ['consent', 'default' | 'update', ConsentSettings]
  | ['set', GoogleTagGlobalSettings]
  | ['set', 'ads_data_redaction' | 'url_passthrough', boolean]
  | ['config', string, GoogleTagConfig]
  | ['event', 'page_view', PageViewParameters];

type Gtag = (...args: GtagArguments) => void;

interface AnalyticsWindow extends Window {
  dataLayer?: unknown[];
  gtag?: Gtag;
}

const ANALYTICS_SCRIPT_ATTRIBUTE = 'data-devvault-analytics';
const GOOGLE_TAG_SCRIPT_SELECTOR =
  `script[${ANALYTICS_SCRIPT_ATTRIBUTE}], ` +
  'script[src^="https://www.googletagmanager.com/gtag/js"]';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly config = inject(ANALYTICS_CONFIG);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  private initialized = false;
  private consentGranted = false;
  private tagInitialized = false;
  private streamConfigured = false;
  private previousPublicPath: string | null = null;

  initialize(): void {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    if (!this.canMeasureOnThisHost()) {
      return;
    }

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationStart | NavigationEnd =>
            event instanceof NavigationStart || event instanceof NavigationEnd,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.handleNavigationStart(event.url);
          return;
        }

        this.handleNavigationEnd(event.urlAfterRedirects);
      });
  }

  /**
   * Integration point for the analytics category of a future consent manager.
   * Calling this more than once does not create extra tags or page views.
   */
  grantAnalyticsConsent(): void {
    if (this.consentGranted) {
      return;
    }

    this.consentGranted = true;
    this.initialize();

    if (!this.canMeasureOnThisHost() || !this.router.navigated) {
      return;
    }

    this.trackPublicPage(this.router.url);
  }

  /** Integration point for withdrawing the analytics category consent. */
  revokeAnalyticsConsent(): void {
    if (!this.consentGranted) {
      return;
    }

    this.consentGranted = false;
    this.previousPublicPath = null;
    this.suspendMeasurement();
    this.deleteAnalyticsCookies();
  }

  private handleNavigationStart(targetUrl: string): void {
    // Suspend before Angular changes the address bar so automatic events can
    // never inherit a private URL, token, query string or fragment.
    this.suspendMeasurement();

    if (this.getAllowedPath(targetUrl) === null) {
      this.previousPublicPath = null;
    }
  }

  private handleNavigationEnd(urlAfterRedirects: string): void {
    if (!this.consentGranted) {
      return;
    }

    this.trackPublicPage(urlAfterRedirects);
  }

  private trackPublicPage(routerUrl: string): void {
    const pathname = this.getAllowedPath(routerUrl);

    if (pathname === null) {
      this.previousPublicPath = null;
      this.suspendMeasurement();
      return;
    }

    const browserWindow = this.getBrowserWindow();
    if (!browserWindow) {
      return;
    }

    const consent: ConsentSettings = {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted',
    };
    const pageLocation = new URL(pathname, this.config.productionOrigin).href;
    const pageReferrer = this.previousPublicPath
      ? new URL(this.previousPublicPath, this.config.productionOrigin).href
      : '';
    const pageTitle = this.config.publicPages[pathname] ?? 'DevVault';

    this.ensureGoogleTag(browserWindow);
    const gtag = browserWindow.gtag;

    if (!gtag) {
      return;
    }

    // Set safe global context before granting storage. Consent pings and any
    // automatic events can then only inherit allowlisted page information.
    gtag('set', {
      allow_ad_personalization_signals: false,
      allow_google_signals: false,
      page_location: pageLocation,
      page_referrer: pageReferrer,
      page_title: pageTitle,
      send_page_view: false,
    });
    this.setMeasurementDisabled(browserWindow, false);
    gtag('consent', 'update', consent);
    gtag('config', this.config.measurementId, {
      allow_ad_personalization_signals: false,
      allow_google_signals: false,
      ignore_referrer: pageReferrer.length === 0,
      page_location: pageLocation,
      page_referrer: pageReferrer,
      page_title: pageTitle,
      send_page_view: false,
      ...(this.streamConfigured ? { update: true as const } : {}),
    });
    this.streamConfigured = true;

    gtag('event', 'page_view', {
      page_location: pageLocation,
      page_referrer: pageReferrer,
      page_title: pageTitle,
      send_to: this.config.measurementId,
    });

    this.previousPublicPath = pathname;
  }

  private ensureGoogleTag(browserWindow: AnalyticsWindow): void {
    if (this.tagInitialized) {
      return;
    }

    this.tagInitialized = true;
    browserWindow.dataLayer ??= [];

    if (!browserWindow.gtag) {
      browserWindow.gtag = function (..._args: GtagArguments): void {
        browserWindow.dataLayer?.push(arguments);
      };

      browserWindow.gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      });
      browserWindow.gtag('set', 'ads_data_redaction', true);
      browserWindow.gtag('set', 'url_passthrough', false);
      browserWindow.gtag('js', new Date());
    }

    if (this.document.head.querySelector(GOOGLE_TAG_SCRIPT_SELECTOR)) {
      return;
    }

    const script = this.document.createElement('script');
    script.async = true;
    script.referrerPolicy = 'no-referrer';
    script.src =
      'https://www.googletagmanager.com/gtag/js?id=' +
      encodeURIComponent(this.config.measurementId);
    script.setAttribute(ANALYTICS_SCRIPT_ATTRIBUTE, '');
    this.document.head.appendChild(script);
  }

  private suspendMeasurement(): void {
    const browserWindow = this.getBrowserWindow();

    if (!browserWindow || !this.tagInitialized) {
      return;
    }

    this.setMeasurementDisabled(browserWindow, true);
    browserWindow.gtag?.('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });
  }

  private setMeasurementDisabled(browserWindow: AnalyticsWindow, disabled: boolean): void {
    const windowProperties = browserWindow as unknown as Record<string, unknown>;
    windowProperties[`ga-disable-${this.config.measurementId}`] = disabled;
  }

  private deleteAnalyticsCookies(): void {
    if (!this.canMeasureOnThisHost()) {
      return;
    }

    const hostname = this.document.location.hostname;
    const cookieNames = this.document.cookie
      .split(';')
      .map((cookie) => cookie.trim().split('=')[0])
      .filter((name): name is string => Boolean(name?.startsWith('_ga')));

    for (const name of cookieNames) {
      this.document.cookie = `${name}=; Max-Age=0; path=/`;
      this.document.cookie = `${name}=; Max-Age=0; path=/; domain=${hostname}`;
      this.document.cookie = `${name}=; Max-Age=0; path=/; domain=.${hostname}`;
    }
  }

  private getAllowedPath(routerUrl: string): string | null {
    try {
      const productionOrigin = new URL(this.config.productionOrigin).origin;
      const url = new URL(routerUrl, `${productionOrigin}/`);

      if (url.origin !== productionOrigin) {
        return null;
      }

      return Object.prototype.hasOwnProperty.call(this.config.publicPages, url.pathname)
        ? url.pathname
        : null;
    } catch {
      return null;
    }
  }

  private canMeasureOnThisHost(): boolean {
    const browserWindow = this.getBrowserWindow();

    return Boolean(
      this.config.enabled &&
      browserWindow &&
      this.config.allowedHosts.includes(browserWindow.location.hostname),
    );
  }

  private getBrowserWindow(): AnalyticsWindow | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return this.document.defaultView as AnalyticsWindow | null;
  }
}
