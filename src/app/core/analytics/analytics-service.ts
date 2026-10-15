import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { filter } from 'rxjs';

import { ANALYTICS_CONFIG } from './analytics.config';

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
  | ['set', GoogleTagGlobalSettings]
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
  private tagInitialized = false;
  private streamConfigured = false;
  private previousPublicPath: string | null = null;
  private lastTrackedNavigationId: number | null = null;
  private lastSuccessfulPublicContext: GoogleTagGlobalSettings | null = null;
  private readonly pendingNavigationIds = new Set<number>();

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
          (event): event is NavigationStart | NavigationEnd | NavigationCancel | NavigationError =>
            event instanceof NavigationStart ||
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.handleNavigationStart(event);
          return;
        }

        if (event instanceof NavigationEnd) {
          this.handleNavigationEnd(event);
          return;
        }

        this.handleFailedNavigation(event);
      });

    const initialNavigation = this.router.lastSuccessfulNavigation();

    if (this.router.navigated && initialNavigation) {
      const initialUrl = initialNavigation.finalUrl
        ? this.router.serializeUrl(initialNavigation.finalUrl)
        : this.router.url;
      this.trackNavigation(initialNavigation.id, initialUrl);
    }
  }

  private handleNavigationStart(event: NavigationStart): void {
    this.pendingNavigationIds.add(event.id);

    // Suspend before Angular changes the address bar so automatic events can
    // never inherit a private URL, token, query string or fragment.
    this.suspendMeasurement();
  }

  private handleNavigationEnd(event: NavigationEnd): void {
    this.pendingNavigationIds.delete(event.id);
    this.trackNavigation(event.id, event.urlAfterRedirects);
  }

  private handleFailedNavigation(event: NavigationCancel | NavigationError): void {
    this.pendingNavigationIds.delete(event.id);

    const browserWindow = this.getBrowserWindow();
    // Router 21 clears currentNavigation after emitting the terminal event.
    // Deferring also lets redirects or superseding navigations become current.
    browserWindow?.queueMicrotask(() => {
      if (
        this.destroyRef.destroyed ||
        this.pendingNavigationIds.size > 0 ||
        this.router.currentNavigation() !== null
      ) {
        return;
      }

      this.restoreLastSuccessfulMeasurement();
    });
  }

  private trackNavigation(navigationId: number, routerUrl: string): void {
    if (navigationId === this.lastTrackedNavigationId) {
      return;
    }

    this.lastTrackedNavigationId = navigationId;
    this.trackPublicPage(routerUrl);
  }

  private trackPublicPage(routerUrl: string): void {
    const pathname = this.getAllowedPath(routerUrl);

    if (pathname === null) {
      this.previousPublicPath = null;
      this.lastSuccessfulPublicContext = null;
      this.suspendMeasurement();
      return;
    }

    const browserWindow = this.getBrowserWindow();
    if (!browserWindow) {
      return;
    }

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

    // Set safe global context before resuming measurement so automatic events
    // can only inherit allowlisted page information.
    const safeContext: GoogleTagGlobalSettings = {
      allow_ad_personalization_signals: false,
      allow_google_signals: false,
      page_location: pageLocation,
      page_referrer: pageReferrer,
      page_title: pageTitle,
      send_page_view: false,
    };

    gtag('set', safeContext);
    this.setMeasurementDisabled(browserWindow, false);
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
    this.lastSuccessfulPublicContext = safeContext;
  }

  private restoreLastSuccessfulMeasurement(): void {
    if (!this.canMeasureOnThisHost() || !this.tagInitialized || !this.lastSuccessfulPublicContext) {
      this.suspendMeasurement();
      return;
    }

    const browserWindow = this.getBrowserWindow();
    const gtag = browserWindow?.gtag;

    if (!browserWindow || !gtag) {
      return;
    }

    gtag('set', this.lastSuccessfulPublicContext);
    this.setMeasurementDisabled(browserWindow, false);
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
  }

  private setMeasurementDisabled(browserWindow: AnalyticsWindow, disabled: boolean): void {
    const windowProperties = browserWindow as unknown as Record<string, unknown>;
    windowProperties[`ga-disable-${this.config.measurementId}`] = disabled;
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
