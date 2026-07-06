import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { gsap } from 'gsap';
import { Subscription, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Product } from '../../core/models/product.model';
import { CartApiService } from '../../core/services/cart-api.service';
import { CountryService } from '../../core/services/country.service';
import { LanguageService } from '../../core/services/language.service';
import { ProductsApiService } from '../../core/services/products-api.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  product?: Product;
  isLoading = true;
  notAvailable = false;

  quantity: number = 1;
  activeTab: 'overview' | 'details' | 'category' = 'overview';
  specsArray: [string, string][] = [];
  activeImage = '';
  private countrySubscription?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productsApi: ProductsApiService,
    private readonly cartApi: CartApiService,
    private readonly countryService: CountryService,
    private readonly router: Router,
    public readonly language: LanguageService
  ) {}

  ngOnInit(): void {
    this.countrySubscription = combineLatest([
      this.countryService.selectedCountryId$.pipe(
        filter((countryId): countryId is number => !!countryId && countryId > 0),
        distinctUntilChanged()
      ),
      this.route.paramMap.pipe(map((params) => params.get('id')))
    ]).subscribe(([, productId]) => {
      if (!productId) {
        this.isLoading = false;
        this.notAvailable = true;
        this.product = undefined;
        return;
      }

      this.loadProduct(productId);
    });

    this.countryService.loadCountries().subscribe();
  }

  ngOnDestroy(): void {
    this.countrySubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.initAnimation();
  }

  get unavailableMessage(): string {
    const countryName = this.countryService.getSelectedLocalizedName();
    return this.language.translate('product.notAvailable.message', { country: countryName });
  }

  private loadProduct(productId: string): void {
    this.isLoading = true;
    this.notAvailable = false;
    this.product = undefined;

    this.productsApi.getProductById(productId).subscribe((product) => {
      this.isLoading = false;

      if (!product) {
        this.notAvailable = true;
        return;
      }

      this.product = product;
      this.specsArray = Object.entries(product.specs ?? {});
      this.activeImage = product.galleryUrls?.[0] || product.image || '';
    });
  }

  initAnimation() {
    gsap.from('.product-img', {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.6,
      ease: 'power2.out'
    });
  }

  changeQuantity(amount: number) {
    if (this.quantity + amount >= 1) {
      this.quantity += amount;
    }
  }

  setActiveImage(image: string): void {
    this.activeImage = image;
  }

  get productDetails() {
    return this.product?.details || [];
  }

  getDetailIcon(key: string): string {
    const normalizedKey = key.trim();
    if (normalizedKey.includes('وصف') || normalizedKey.toLowerCase().includes('description')) return 'bi-card-text';
    if (normalizedKey.includes('خصائص') || normalizedKey.toLowerCase().includes('feature')) return 'bi-stars';
    if (normalizedKey.includes('استخدام') || normalizedKey.toLowerCase().includes('use')) return 'bi-tools';
    if (normalizedKey.includes('تحذير') || normalizedKey.toLowerCase().includes('warning')) return 'bi-exclamation-triangle';
    if (normalizedKey.includes('تخزين') || normalizedKey.includes('تعبئة') || normalizedKey.toLowerCase().includes('storage')) return 'bi-box-seam';
    if (normalizedKey.includes('فنية') || normalizedKey.toLowerCase().includes('technical')) return 'bi-clipboard-data';
    if (normalizedKey.includes('الأداء') || normalizedKey.includes('اداء') || normalizedKey.toLowerCase().includes('performance')) return 'bi-graph-up-arrow';
    return 'bi-info-circle';
  }

  addToCart() {
    if (!this.product) {
      return;
    }
    const userId = this.cartApi.getCurrentUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartApi.addCartItem(userId, this.product, this.quantity).subscribe({
      next: () => {
        this.cartApi.refreshCartCount(userId);
        this.cartApi.showCartMessage(this.language.translate('cart.added'));
      },
      error: () => {
        this.cartApi.showCartMessage(this.language.translate('cart.addFailed'));
      }
    });
  }
}
