import { Directive, effect, ElementRef, inject, input, NgZone, output } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScroll {
  readonly appInfiniteScroll = output<void>();
  readonly infiniteScrollRootMargin = input('200px 0px');

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly ngZone = inject(NgZone);

  constructor() {
    effect((onCleanup) => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            this.ngZone.run(() => this.appInfiniteScroll.emit());
          }
        },
        { rootMargin: this.infiniteScrollRootMargin() }
      );

      observer.observe(this.elementRef.nativeElement);

      onCleanup(() => observer.disconnect());
    });
  }
}