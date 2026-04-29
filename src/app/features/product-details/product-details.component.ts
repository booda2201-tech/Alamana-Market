import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { gsap } from 'gsap';
import { Product } from '../../core/models/product.model';
import { ProductsApiService } from '../../core/services/products-api.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  product?: Product;

  quantity: number = 1;
  activeTab: 'specs' | 'desc' | 'docs' = 'specs';
  specsArray: [string, string][] = []; // هنخزن الـ specs هنا بشكل ثابت

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productsApi: ProductsApiService
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

  addToCart() {
    if (!this.product) {
      return;
    }
    console.log('تمت الإضافة:', this.product.nameAr);
  }
}
