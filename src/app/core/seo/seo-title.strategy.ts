import { inject, Injectable } from '@angular/core';
import {
  PRIMARY_OUTLET,
  RouterStateSnapshot,
  TitleStrategy
} from '@angular/router';

import { SEO_SITE } from './seo.config';
import { SeoConfig } from './seo.model';
import { SeoService } from './seo-service';

@Injectable()
export class SeoTitleStrategy extends TitleStrategy {
  private readonly seoService = inject(SeoService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let route = snapshot.root;

    // Una ruta no se indexa salvo que lo declare expresamente.
    let config: SeoConfig = { indexable: false };

    while (true) {
      const routeSeo = route.data['seo'] as SeoConfig | undefined;

      if (routeSeo) {
        config = routeSeo;
      }

      const child = route.children.find(
        item => item.outlet === PRIMARY_OUTLET
      );

      if (!child) break;
      route = child;
    }

    const pageTitle =
      this.buildTitle(snapshot) ??
      (config.indexable ? SEO_SITE.defaultTitle : SEO_SITE.name);

    this.seoService.apply(pageTitle, config);
  }
}