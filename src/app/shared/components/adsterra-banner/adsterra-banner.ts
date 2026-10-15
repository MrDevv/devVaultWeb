import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import {
  ADSTERRA_BANNER_HEIGHT,
  ADSTERRA_BANNER_WIDTH,
  AdsterraService,
} from '@shared/services/adsterra-service';

@Component({
  selector: 'adsterra-banner',
  imports: [],
  templateUrl: './adsterra-banner.html',
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
        width: 100%;
      }
    `,
  ],
})
export class AdsterraBanner {
  private readonly adsterraService = inject(AdsterraService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly measurementContainer =
    viewChild.required<ElementRef<HTMLElement>>('measurementContainer');
  private readonly adContainer = viewChild.required<ElementRef<HTMLElement>>('adContainer');

  readonly hasEnoughSpace = signal(false);
  readonly bannerWidth = ADSTERRA_BANNER_WIDTH;
  readonly bannerHeight = ADSTERRA_BANNER_HEIGHT;

  private initialized = false;
  private cleanupBanner: () => void = () => undefined;

  constructor() {
    afterNextRender(() => {
      const measurementContainer = this.measurementContainer().nativeElement;

      const updateAvailableSpace = (width: number): void => {
        const hasEnoughSpace = width >= this.bannerWidth;
        this.hasEnoughSpace.set(hasEnoughSpace);

        if (hasEnoughSpace && !this.initialized) {
          this.initialized = true;
          this.cleanupBanner = this.adsterraService.mountBanner(this.adContainer().nativeElement);
        }
      };

      const observer = new ResizeObserver(([entry]) => {
        if (!entry || this.destroyRef.destroyed) {
          return;
        }

        updateAvailableSpace(entry.contentRect.width);
      });

      observer.observe(measurementContainer);
      updateAvailableSpace(measurementContainer.getBoundingClientRect().width);

      this.destroyRef.onDestroy(() => {
        observer.disconnect();
        this.cleanupBanner();
      });
    });
  }
}
