import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router'; // ماتنساش الـ import
import { Category, Product } from '../../core/models/product.model';
import { AdvertisementsApiService } from '../../core/services/advertisements-api.service';
import { CartApiService } from '../../core/services/cart-api.service';
import { ProductsApiService } from '../../core/services/products-api.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {

  // 2. البيانات (Data)
  categories: Category[] = [];
  allProducts: Product[] = [];

  // 3. متغيرات التحكم (State)
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  selectedCategory: string = 'all';
  showNewOnly: boolean = false;
  isAdvertisementMode = false;
  pageTitle = 'منتجاتنا';
  pageDescription = 'استكشف مجموعتنا الكاملة من مواد البناء عالية الجودة المصممة لتحمل أصعب الظروف.';
  private pendingCategoryParam = 'all';
  private advertisementProductIds = new Set<string>();

constructor(
    private route: ActivatedRoute,
    private router: Router, // ضيف الـ Router هنا
    private advertisementsApi: AdvertisementsApiService,
    private cartApi: CartApiService,
    private productsApi: ProductsApiService
  ) {}

  ngOnInit(): void {
    this.loadData();
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

    // مراقبة الـ Query Params للفلترة التلقائية عند الدخول للصفحة
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
        this.cartApi.showCartMessage('تمت إضافة المنتج إلى السلة');
      },
      error: () => {
        this.cartApi.showCartMessage('تعذر إضافة المنتج للسلة');
      }
    });
  }


goToDetails(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  getCategoryName(categoryId: string): string {
    return this.categories.find((category) => category.id === categoryId)?.name || categoryId;
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
    this.pageTitle = 'منتجاتنا';
    this.pageDescription = 'استكشف مجموعتنا الكاملة من مواد البناء عالية الجودة المصممة لتحمل أصعب الظروف.';
    this.advertisementProductIds.clear();
  }

}
