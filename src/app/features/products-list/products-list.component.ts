import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { Category, Product } from '../../core/models/product.model';
import { AdvertisementsApiService } from '../../core/services/advertisements-api.service';
import { CartApiService } from '../../core/services/cart-api.service';
import { CountryService } from '../../core/services/country.service';
import { LanguageService } from '../../core/services/language.service';
import { ProductsApiService } from '../../core/services/products-api.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, OnDestroy {

  // 2. البيانات (Data)
  categories: Category[] = [];
  allProducts: Product[] = [];

  // 3. متغيرات التحكم (State)
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  selectedCategory: string = 'all';
  showNewOnly: boolean = false;
  isAdvertisementMode = false;
  pageTitle = '';
  pageDescription = '';
  private pendingCategoryParam = 'all';
  private advertisementProductIds = new Set<string>();
  private countrySubscription?: Subscription;
  private languageSubscription?: Subscription;

constructor(
    private route: ActivatedRoute,
    private router: Router,
    private advertisementsApi: AdvertisementsApiService,
    private cartApi: CartApiService,
    private countryService: CountryService,
    private productsApi: ProductsApiService,
    public readonly language: LanguageService
  ) {}

  ngOnInit(): void {
    this.resetAdvertisementMode();

    this.route.queryParams.subscribe(params => {
      const advertisementId = params['advertisementId'];
      if (advertisementId) {
        this.loadAdvertisementProducts(advertisementId);
        return;
      }

      this.resetAdvertisementMode();
      this.pendingCategoryParam = params['category'] || 'all';
      this.selectedCategory = this.resolveCategoryParam(this.pendingCategoryParam);
      this.showNewOnly = params['filter'] === 'new';
      this.applyFilters();
    });

    this.countrySubscription = this.countryService.selectedCountryId$.pipe(
      filter((countryId): countryId is number => !!countryId && countryId > 0),
      distinctUntilChanged()
    ).subscribe(() => {
      this.loadData();
    });

    this.countryService.loadCountries().subscribe();
    this.languageSubscription = this.language.language$.subscribe(() => {
      if (!this.isAdvertisementMode) {
        this.resetAdvertisementMode();
      }
    });
  }

  ngOnDestroy(): void {
    this.countrySubscription?.unsubscribe();
    this.languageSubscription?.unsubscribe();
  }

  private loadData(): void {
    this.productsApi.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.selectedCategory = this.resolveCategoryParam(this.pendingCategoryParam);
      this.applyFilters();
    });

    this.productsApi.getProducts().subscribe((products) => {
      this.allProducts = products;
      this.applyFilters();
    });
  }

  // 4. الدوال (Logic)
  applyFilters(): void {
    this.filteredProducts = this.allProducts.filter(p => {
      const matchAdvertisement = this.isAdvertisementMode
        ? this.advertisementProductIds.has(String(p.id))
        : true;
      const matchCategory = this.selectedCategory === 'all' || p.category === this.selectedCategory;
      const matchSearch = p.nameAr.includes(this.searchQuery) ||
                          p.nameEn.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchNew = this.showNewOnly ? p.isNew : true;

      return matchAdvertisement && matchCategory && matchSearch && matchNew;
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.showNewOnly = false;
    this.applyFilters();
  }

  addToCart(product: Product): void {
    const userId = this.cartApi.getCurrentUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartApi.addCartItem(userId, product, 1).subscribe({
      next: () => {
        this.cartApi.refreshCartCount(userId);
        this.cartApi.showCartMessage(this.language.translate('cart.added'));
      },
      error: () => {
        this.cartApi.showCartMessage(this.language.translate('cart.addFailed'));
      }
    });
  }


goToDetails(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((item) => item.id === categoryId);
    if (!category) {
      return categoryId;
    }
    return this.language.pickLocalized(category.nameAr, category.nameEn, category.name);
  }

  private resolveCategoryParam(categoryParam: string): string {
    if (!categoryParam || categoryParam === 'all') {
      return 'all';
    }

    if (this.categories.some((category) => category.id === categoryParam)) {
      return categoryParam;
    }

    const lowerParam = categoryParam.toLowerCase();
    if (lowerParam === 'adhesives') {
      const adhesivesCategory = this.categories.find((category) =>
        category.name.includes('لاصق') || category.name.includes('لواصق')
      );
      return adhesivesCategory?.id || categoryParam;
    }

    return categoryParam;
  }

  private loadAdvertisementProducts(advertisementId: string): void {
    this.isAdvertisementMode = true;
    this.selectedCategory = 'all';
    this.showNewOnly = false;
    this.advertisementProductIds.clear();

    this.advertisementsApi.getAdvertisementById(advertisementId).subscribe({
      next: (advertisement) => {
        this.pageTitle = advertisement.title || 'منتجات الإعلان';
        this.pageDescription = advertisement.description || 'تصفح المنتجات المرتبطة بهذا الإعلان من الأمانة لمواد البناء.';
        this.advertisementProductIds = new Set(advertisement.productIds);
        this.applyFilters();
      },
      error: () => {
        this.pageTitle = 'منتجات الإعلان';
        this.pageDescription = 'تعذر تحميل بيانات الإعلان، يمكنك تصفح جميع المنتجات.';
        this.advertisementProductIds.clear();
        this.applyFilters();
      }
    });
  }

  private resetAdvertisementMode(): void {
    this.isAdvertisementMode = false;
    this.pageTitle = this.language.translate('products.title');
    this.pageDescription = this.language.translate('products.description');
    this.advertisementProductIds.clear();
  }

}
