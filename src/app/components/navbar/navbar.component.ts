import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Category } from '../../core/models/product.model';
import { CartApiService } from '../../core/services/cart-api.service';
import { CatalogCountry, CountryService } from '../../core/services/country.service';
import { LanguageService } from '../../core/services/language.service';
import { ProductsApiService } from '../../core/services/products-api.service';
import { TranslationKey } from '../../core/i18n/translations';

interface NavLink {
  name: string;
  href: string;
  hasMegaMenu?: boolean;
  queryParams?: Record<string, string>;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  isScrolled = false;
  currentUrl = '/';
  totalItems = 0;
  cartMessage = '';
  countries: CatalogCountry[] = [];
  selectedCountryId: number | null = null;
  isLocaleMenuOpen = false;
  navLinks: NavLink[] = [];
  private countrySubscription?: Subscription;
  private languageSubscription?: Subscription;

  get isErrorMessage(): boolean {
    return /تعذر|خطأ|فشل|Could not|failed/i.test(this.cartMessage);
  }

  categories: Category[] = [];

  constructor(
    private router: Router,
    private productsApi: ProductsApiService,
    private cartApi: CartApiService,
    private countryService: CountryService,
    public readonly language: LanguageService
  ) {}

  get isHeroNavbar(): boolean {
    return !this.isScrolled && this.currentUrl === '/';
  }

  getSelectedCountryName(): string {
    const country = this.countries.find((item) => item.id === this.selectedCountryId);
    return this.countryService.getLocalizedName(country);
  }

  getLocalizedCountryName(country: CatalogCountry): string {
    return this.countryService.getLocalizedName(country);
  }

  getLocalizedCurrency(country?: CatalogCountry): string {
    return this.countryService.getLocalizedCurrency(country);
  }

  ngOnInit() {
    this.buildNavLinks();
    this.languageSubscription = this.language.language$.subscribe(() => {
      this.buildNavLinks();
      this.isMobileMenuOpen = false;
    });

    this.countryService.loadCountries().subscribe((countries) => {
      this.countries = countries;
      this.selectedCountryId = this.countryService.getSelectedCountryId();
    });

    this.countrySubscription = this.countryService.selectedCountryId$.subscribe((countryId) => {
      this.selectedCountryId = countryId;
      if (countryId) {
        this.loadCategories();
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.urlAfterRedirects.split('?')[0];
    });

    this.cartApi.cartCount$.subscribe((count) => {
      this.totalItems = count;
    });

    this.cartApi.cartMessage$.subscribe((message) => {
      this.cartMessage = message;
    });

    this.cartApi.refreshCartCount(this.cartApi.getCurrentUserId());
  }

  ngOnDestroy(): void {
    this.countrySubscription?.unsubscribe();
    this.languageSubscription?.unsubscribe();
  }

  toggleLanguage(): void {
    this.language.toggleLanguage();
  }

  private buildNavLinks(): void {
    const t = (key: TranslationKey) => this.language.translate(key);
    this.navLinks = [
      { name: t('nav.home'), href: '/' },
      { name: t('nav.products'), href: '/products', hasMegaMenu: true },
      { name: t('nav.new'), href: '/products', queryParams: { filter: 'new' } },
      { name: t('nav.about'), href: '/about-us' },
      { name: t('nav.contact'), href: '/contact' },
      { name: t('nav.orders'), href: '/orders' },
    ];
  }

  toggleLocaleMenu(event: Event): void {
    event.stopPropagation();
    this.isLocaleMenuOpen = !this.isLocaleMenuOpen;
  }

  selectCountry(countryId: number): void {
    this.selectedCountryId = countryId;
    this.isLocaleMenuOpen = false;
    this.countryService.setSelectedCountryId(countryId);
  }

  @HostListener('document:click')
  closeLocaleMenu(): void {
    this.isLocaleMenuOpen = false;
  }

  private loadCategories(): void {
    this.productsApi.getCategories().subscribe((categories) => {
      this.categories = categories.filter((category) => category.id !== 'all');
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  goToSearch(): void {
    this.router.navigate(['/products']);
  }
}
