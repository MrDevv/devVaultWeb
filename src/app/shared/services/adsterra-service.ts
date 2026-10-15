import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

interface AdsterraOptions {
  key: string;
  format: 'iframe';
  height: number;
  width: number;
  params: Record<string, never>;
}

interface AdsterraWindow extends Window {
  atOptions?: AdsterraOptions;
}

type CleanupBanner = () => void;

export const ADSTERRA_BANNER_WIDTH = 300;
export const ADSTERRA_BANNER_HEIGHT = 250;

const ADSTERRA_OPTIONS: Readonly<AdsterraOptions> = Object.freeze({
  key: '22b7b11e009a1bbe7550e69c099a850d',
  format: 'iframe',
  height: ADSTERRA_BANNER_HEIGHT,
  width: ADSTERRA_BANNER_WIDTH,
  params: {},
});

const ADSTERRA_SCRIPT_URL = 'https://bauval.org/22/22b7b11e009a1bbe7550e69c099a850d';
const LOAD_TIMEOUT_MS = 15_000;

@Injectable({ providedIn: 'root' })
export class AdsterraService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  private loadQueue: Promise<void> = Promise.resolve();

  mountBanner(container: HTMLElement): CleanupBanner {
    if (!isPlatformBrowser(this.platformId)) {
      return () => undefined;
    }

    let destroyed = false;
    let cleanupActiveLoad: CleanupBanner = () => undefined;

    const loadBanner = (): Promise<void> => {
      if (destroyed) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        if (destroyed) {
          resolve();
          return;
        }

        const browserWindow = this.document.defaultView as AdsterraWindow | null;
        if (!browserWindow) {
          resolve();
          return;
        }

        const originalNodes = new Set(Array.from(container.childNodes));
        const ownedNodes = new Set<Node>();
        const hadOwnAtOptions = Object.prototype.hasOwnProperty.call(browserWindow, 'atOptions');
        const previousAtOptions = browserWindow.atOptions;
        const currentOptions: AdsterraOptions = {
          ...ADSTERRA_OPTIONS,
          params: {},
        };
        const script = this.document.createElement('script');
        let settled = false;

        const mutationObserver = new MutationObserver((records) => {
          for (const record of records) {
            record.addedNodes.forEach((node) => ownedNodes.add(node));
          }
        });

        const restoreAtOptions = (): void => {
          if (browserWindow.atOptions !== currentOptions) {
            return;
          }

          if (hadOwnAtOptions) {
            browserWindow.atOptions = previousAtOptions;
          } else {
            delete browserWindow.atOptions;
          }
        };

        const removeOwnedContent = (): void => {
          for (const node of Array.from(container.childNodes)) {
            if (!originalNodes.has(node)) {
              node.parentNode?.removeChild(node);
            }
          }

          for (const node of ownedNodes) {
            if (container.contains(node)) {
              node.parentNode?.removeChild(node);
            }
          }

          ownedNodes.clear();
        };

        const detachLoadHandlers = (): void => {
          script.removeEventListener('load', handleLoad);
          script.removeEventListener('error', handleError);
          browserWindow.clearTimeout(timeoutId);
        };

        const finishQueueTurn = (removeContent: boolean): void => {
          if (settled) {
            return;
          }

          settled = true;
          detachLoadHandlers();
          restoreAtOptions();

          if (removeContent) {
            mutationObserver.disconnect();
            removeOwnedContent();
          }

          resolve();
        };

        // A script load only releases the queue; it does not prove that an ad was rendered.
        const handleLoad = (): void => finishQueueTurn(false);
        const handleError = (): void => finishQueueTurn(true);
        const timeoutId = browserWindow.setTimeout(() => finishQueueTurn(true), LOAD_TIMEOUT_MS);

        cleanupActiveLoad = (): void => {
          if (!settled) {
            settled = true;
            detachLoadHandlers();
            restoreAtOptions();
            resolve();
          }

          mutationObserver.disconnect();
          removeOwnedContent();
        };

        mutationObserver.observe(container, { childList: true, subtree: true });
        browserWindow.atOptions = currentOptions;

        script.async = false;
        script.src = ADSTERRA_SCRIPT_URL;
        script.addEventListener('load', handleLoad);
        script.addEventListener('error', handleError);
        ownedNodes.add(script);
        container.appendChild(script);
      });
    };

    this.loadQueue = this.loadQueue.then(loadBanner, loadBanner);

    return () => {
      if (destroyed) {
        return;
      }

      destroyed = true;
      cleanupActiveLoad();
    };
  }
}
