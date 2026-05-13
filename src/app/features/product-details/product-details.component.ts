import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { gsap } from 'gsap';
import { Product } from '../../core/models/product.model';
import { CartApiService } from '../../core/services/cart-api.service';
import { ProductsApiService } from '../../core/services/products-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  product?: Product;

  quantity: number = 1;
  activeTab: 'overview' | 'details' | 'category' = 'overview';
  specsArray: [string, string][] = []; // هنخزن الـ specs هنا بشكل ثابت
  activeImage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productsApi: ProductsApiService,
    private readonly cartApi: CartApiService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const productId = params.get('id');
      if (!productId) {
        return;
      }

      this.productsApi.getProductById(productId).subscribe((product) => {
        this.product = product;
        this.specsArray = Object.entries(product?.specs ?? {});
        this.activeImage = product?.galleryUrls?.[0] || product?.image || '';
      });
    });
  }

  ngAfterViewInit(): void {
    // تشغيل الأنيميشن مرة واحدة بعد التأكد من أن الـ View جاهز
    this.initAnimation();
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
    if (normalizedKey.includes('وصف')) return 'bi-card-text';
    if (normalizedKey.includes('خصائص')) return 'bi-stars';
    if (normalizedKey.includes('استخدام')) return 'bi-tools';
    if (normalizedKey.includes('تحذير')) return 'bi-exclamation-triangle';
    if (normalizedKey.includes('تخزين') || normalizedKey.includes('تعبئة')) return 'bi-box-seam';
    if (normalizedKey.includes('فنية')) return 'bi-clipboard-data';
    if (normalizedKey.includes('الأداء') || normalizedKey.includes('اداء')) return 'bi-graph-up-arrow';
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
        this.cartApi.showCartMessage('تمت إضافة المنتج إلى السلة');
      },
      error: () => {
        this.cartApi.showCartMessage('تعذر إضافة المنتج للسلة');
      }
    });
  }

}
