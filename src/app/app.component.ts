import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AlamanaMarket';
  private readonly defaultTitle = 'الأمانة لمواد البناء | أفضل مواد البناء والاسمنت والعوازل واللواصق';
  private readonly defaultDescription = 'الأمانة لمواد البناء متجر متخصص في مواد البناء، الاسمنت، اللواصق، العوازل، الترويبات، الجراوت، موانع التسرب ومنتجات الترميم بجودة عالية وأسعار تنافسية.';
  private readonly defaultKeywords = [
    'الأمانة',
    'الامانة',
    'الأمانة مواد البناء',
    'الامانة مواد البناء',
    'مواد البناء',
    'مواد بناء',
    'متجر مواد بناء',
    'اسمنت',
    'أسمنت',
    'لاصق بلاط',
    'لواصق البلاط',
    'مواد عزل',
    'عزل مائي',
    'ترويبة',
    'جراوت',
    'مانع تسرب',
    'ترميم',
    'كيماويات البناء',
    'Alamana Market',
    'Alamana building materials'
  ].join(', ');
  private readonly siteUrl = 'https://alamanamarket.com';
  private readonly defaultImage = `${this.siteUrl}/assets/images/logo.png`;
  showLayout = true;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly titleService: Title,
    private readonly metaService: Meta,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  ngOnInit() {
    AOS.init({
      duration: 2000,
      once: false, 
      mirror: true
    });

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateSeoFromRoute();
      this.updateLayoutVisibility();
    });

    this.updateSeoFromRoute();
    this.updateLayoutVisibility();
  }

  private updateSeoFromRoute(): void {
    const route = this.getDeepestChild(this.activatedRoute);
    const title = route.snapshot.data['title'] || this.defaultTitle;
    const description = route.snapshot.data['description'] || this.defaultDescription;
    const keywords = route.snapshot.data['keywords'] || this.defaultKeywords;
    const fullUrl = `${this.siteUrl}${this.router.url}`;

    this.titleService.setTitle(title);

    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'keywords', content: keywords });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' });
    this.metaService.updateTag({ name: 'author', content: 'الأمانة لمواد البناء' });
    this.metaService.updateTag({ name: 'language', content: 'Arabic' });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: fullUrl });
    this.metaService.updateTag({ property: 'og:locale', content: 'ar_KW' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'الأمانة لمواد البناء' });
    this.metaService.updateTag({ property: 'og:image', content: this.defaultImage });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: this.defaultImage });

    this.updateCanonical(fullUrl);
    this.updateStructuredData(fullUrl);
  }

  private getDeepestChild(route: ActivatedRoute): ActivatedRoute {
    let current = route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current;
  }

  private updateCanonical(url: string): void {
    let canonical = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }

  private updateStructuredData(url: string): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['Organization', 'Store'],
          '@id': `${this.siteUrl}/#organization`,
          name: 'الأمانة لمواد البناء',
          alternateName: ['الامانة','الأمانة','الامانه','الأمانه', 'الامانة مواد البناء', 'Alamana Market', 'Alamana Building Materials'],
          url: this.siteUrl,
          logo: this.defaultImage,
          image: this.defaultImage,
          description: this.defaultDescription,
          areaServed: ['Kuwait', 'الكويت'],
          knowsAbout: [
            'مواد البناء',
            'اسمنت',
            'لواصق البلاط',
            'العزل المائي',
            'الجراوت',
            'الترويبات',
            'موانع التسرب',
            'مواد الترميم',
            'كيماويات البناء'
          ],
          makesOffer: [
            { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'مواد بناء' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'اسمنت وكيماويات بناء' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'لواصق وعوازل وموانع تسرب' } }
          ]
        },
        {
          '@type': 'WebSite',
          '@id': `${this.siteUrl}/#website`,
          url: this.siteUrl,
          name: 'الأمانة لمواد البناء',
          alternateName: 'Alamana Market',
          inLanguage: 'ar',
          publisher: { '@id': `${this.siteUrl}/#organization` },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${this.siteUrl}/products?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': 'WebPage',
          '@id': `${url}#webpage`,
          url,
          name: this.titleService.getTitle(),
          description: this.defaultDescription,
          isPartOf: { '@id': `${this.siteUrl}/#website` },
          about: { '@id': `${this.siteUrl}/#organization` },
          inLanguage: 'ar'
        }
      ]
    };

    let script = this.document.getElementById('seo-structured-data') as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'seo-structured-data';
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.text = JSON.stringify(structuredData);
  }

  private updateLayoutVisibility(): void {
    const currentPath = this.router.url.split('?')[0];
    const authRoutes = ['/login', '/create-account'];
    this.showLayout = !authRoutes.includes(currentPath);
  }


}
