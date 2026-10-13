import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SeoConfig } from './seo.model';
import { SEO_SITE } from './seo.config';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly documento = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

    apply(pageTitle: string, config: SeoConfig): void {
    this.title.setTitle(pageTitle);

    this.setName(
      'robots',
      config.indexable ? 'index, follow' : 'noindex'
    );

    if (!config.indexable) {
      this.clearPublicMetadata();
      return;
    }

    const description =
      config.description ?? SEO_SITE.defaultDescription;

    const canonicalUrl = new URL(
      config.canonicalPath ?? '/',
      SEO_SITE.url
    ).href;

    this.setName('description', description);

    this.setProperty('og:type', 'website');
    this.setProperty('og:site_name', SEO_SITE.name);
    this.setProperty('og:locale', 'es_PE');
    this.setProperty('og:title', pageTitle);
    this.setProperty('og:description', description);
    this.setProperty('og:url', canonicalUrl);

    this.setName('twitter:title', pageTitle);
    this.setName('twitter:description', description);

    const image = config.image ?? SEO_SITE.defaultImage;

    if (image) {
      const imageUrl = new URL(image, SEO_SITE.url).href;
      const imageAlt =
        config.imageAlt ?? SEO_SITE.defaultImageAlt;

      this.setProperty('og:image', imageUrl);
      this.setProperty('og:image:alt', imageAlt);

      this.setName('twitter:card', 'summary_large_image');
      this.setName('twitter:image', imageUrl);
      this.setName('twitter:image:alt', imageAlt);
    } else {
      this.meta.removeTag('property="og:image"');
      this.meta.removeTag('property="og:image:alt"');
      this.meta.removeTag('name="twitter:image"');
      this.meta.removeTag('name="twitter:image:alt"');

      this.setName('twitter:card', 'summary');
    }

    this.setCanonical(canonicalUrl);

    this.setWebsiteStructuredData(
      config.canonicalPath === '/'
    );
  }

  private setName(name: string, content: string): void {
    this.meta.updateTag(
      { name, content },
      `name="${name}"`
    );
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag(
      { property, content },
      `property="${property}"`
    );
  }

  private setCanonical(href: string): void {
    const links = Array.from(
      this.documento.head.querySelectorAll<HTMLLinkElement>(
        'link[rel="canonical"]'
      )
    );

    const canonical =
      links.shift() ?? this.documento.createElement('link');

    canonical.rel = 'canonical';
    canonical.href = href;

    if (!canonical.parentNode) {
      this.documento.head.appendChild(canonical);
    }

    links.forEach(link => link.remove());
  }

  private setWebsiteStructuredData(enabled: boolean): void {
    this.removeStructuredData();

    if (!enabled) return;

    const data = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SEO_SITE.name,
      url: `${SEO_SITE.url}/`,
      description: SEO_SITE.defaultDescription,
      inLanguage: 'es'
    };

    const script = this.documento.createElement('script');

    script.type = 'application/ld+json';
    script.setAttribute('data-devvault-seo', '');
    script.textContent = JSON.stringify(data)
      .replace(/</g, '\\u003c');

    this.documento.head.appendChild(script);
  }

  private removeStructuredData(): void {
    this.documento.head
      .querySelectorAll('script[data-devvault-seo]')
      .forEach(element => element.remove());
  }

  private clearPublicMetadata(): void {
    this.meta.removeTag('name="description"');

    const properties = [
      'og:type',
      'og:site_name',
      'og:locale',
      'og:title',
      'og:description',
      'og:url',
      'og:image',
      'og:image:alt'
    ];

    const names = [
      'twitter:card',
      'twitter:title',
      'twitter:description',
      'twitter:image',
      'twitter:image:alt'
    ];

    properties.forEach(property => {
      this.meta.removeTag(`property="${property}"`);
    });

    names.forEach(name => {
      this.meta.removeTag(`name="${name}"`);
    });

    this.documento.head
      .querySelectorAll('link[rel="canonical"]')
      .forEach(element => element.remove());

    this.removeStructuredData();
  }
}
