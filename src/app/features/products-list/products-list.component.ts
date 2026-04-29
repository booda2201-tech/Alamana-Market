import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router'; // ماتنساش الـ import
import { Category, Product } from '../../core/models/product.model';
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
    console.log('تمت الإضافة للسلة:', product.nameAr);
    // منطق إضافة المنتج للسلة يوضع هنا
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
