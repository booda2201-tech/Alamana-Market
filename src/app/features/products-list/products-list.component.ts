import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router'; // ماتنساش الـ import
import { Category, Product } from '../../core/models/product.model';
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
  private pendingCategoryParam = 'all';

constructor(
    private route: ActivatedRoute,
    private router: Router, // ضيف الـ Router هنا
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
      this.pendingCategoryParam = params['category'] || 'all';
      this.selectedCategory = this.resolveCategoryParam(this.pendingCategoryParam);
      this.showNewOnly = params['filter'] === 'new';
      this.applyFilters();
    });
  }

  // 4. الدوال (Logic)
  applyFilters(): void {
    this.filteredProducts = this.allProducts.filter(p => {
      const matchCategory = this.selectedCategory === 'all' || p.category === this.selectedCategory;
      const matchSearch = p.nameAr.includes(this.searchQuery) ||
                          p.nameEn.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchNew = this.showNewOnly ? p.isNew : true;

      return matchCategory && matchSearch && matchNew;
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

}
