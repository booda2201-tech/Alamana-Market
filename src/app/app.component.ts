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
  private readonly defaultTitle = 'الأمانة لمواد البناء';
  private readonly defaultDescription = 'الأمانة لمواد البناء توفر حلول متكاملة تشمل اللواصق، العوازل، الترميم، وموانع التسرب بجودة عالية.';
  private readonly siteUrl = 'https://alamanamarket.com';

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
    ).subscribe(() => this.updateSeoFromRoute());

    this.updateSeoFromRoute();
  }

  private updateSeoFromRoute(): void {
    const route = this.getDeepestChild(this.activatedRoute);
    const title = route.snapshot.data['title'] || this.defaultTitle;
    const description = route.snapshot.data['description'] || this.defaultDescription;
    const fullUrl = `${this.siteUrl}${this.router.url}`;

    this.titleService.setTitle(title);

    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: fullUrl });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });

    this.updateCanonical(fullUrl);
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


}
