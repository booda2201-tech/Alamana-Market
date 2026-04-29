import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as AOS from 'aos';
import { Category, Product } from '../../core/models/product.model';
import { ProductsApiService } from '../../core/services/products-api.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private categoryLabels: Record<string, string> = {};
  private readonly brokenCategoryImageKeys = new Set<string>();
  categories: Category[] = [];

  bestSellers: Product[] = [];
  randomProducts: Product[] = [];

  constructor(
    private readonly productsApi: ProductsApiService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // 1. تشغيل AOS بإعدادات تضمن الظهور المتتابع
    AOS.init({
      duration: 1000,
      once: true,          // الأنيميشن يحصل مرة واحدة عشان يحافظ على الـ Premium look
      offset: 150,         // العنصر يظهر لما يدخل 150px في الشاشة
      easing: 'ease-out-quad',
      delay: 0,
    });

    this.productsApi.getBestSellers().subscribe((products) => {
      this.bestSellers = products.slice(0, 4);
    });

    this.productsApi.getRandomProducts().subscribe((products) => {
      this.randomProducts = products.slice(0, 4);
    });

    this.productsApi.getCategories().subscribe((categories) => {
      this.brokenCategoryImageKeys.clear();
      this.categories = categories.filter((category) => category.id !== 'all');
      this.categoryLabels = this.categories.reduce((acc, category) => {
        acc[category.id] = category.name;
        return acc;
      }, {} as Record<string, string>);
    });
  }

  getCategoryName(categoryId: string): string {
    return this.categoryLabels[categoryId] || categoryId;
  }

  getCategoryImage(category: Category): string {
    return category.image?.trim() || '';
  }

  hasCategoryImage(category: Category): boolean {
    const hasImagePath = Boolean(category.image?.trim());
    return hasImagePath && !this.brokenCategoryImageKeys.has(this.getCategoryImageKey(category));
  }

  onCategoryImageError(category: Category): void {
    this.brokenCategoryImageKeys.add(this.getCategoryImageKey(category));
  }

  private getCategoryImageKey(category: Category): string {
    return `${category.id}::${category.image?.trim() || ''}`;
  }

  ngAfterViewInit(): void {
    // 2. تشغيل GSAP للهيرو والبارالاكس
    this.initAnimations();

    // 3. تحديث AOS بعد ما الصور والـ ngFor يحملوا تماماً
    setTimeout(() => {
      AOS.refresh();
    }, 600);
  }

  private initAnimations() {
    const tl = gsap.timeline();

    // أنيميشن دخول الهيرو (Title -> Paragraph -> Buttons)
    tl.from('.hero-section .hero-title h1', {
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out',
      delay: 0.3
    })
    .from('.hero-section .hero-subtitle p', {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.8')
    .from('.flex.flex-wrap a button', {
      x: -30,
      scale: 0.9,
      opacity: 0,
      duration: 0.7,
      stagger: 0.2, // الزراير تظهر ورا بعضها
      ease: 'back.out(1.7)'
    }, '-=0.6');

    // تأثير الـ Parallax لصورة الخلفية
    gsap.to('.hero-bg-img', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // أنيميشن سكشن الخصم (السكشن الأزرق) - تأثير الطفو للصورة
    gsap.to('section.bg-\\[\\#0275d8\\] img', {
      y: -15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.from('.best-seller-card', {
      scrollTrigger: '.best-seller-card',
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2, // الكروت تظهر بالتتابع
      ease: 'power2.out'
    });

const productImg = document.querySelector('section.bg-\\[\\#0275d8\\] img');

productImg?.addEventListener('mouseenter', () => {
  // duration 0.1 ثانية مع ease قوي جداً للسرعة
  gsap.to(productImg, {
    rotate: 0,
    duration: 0.0000005,
    ease: "power4.out"
  });
});

productImg?.addEventListener('mouseleave', () => {
  // بنرجع للوضع الأصلي في لمح البصر
  gsap.to(productImg, {
    rotate: -6,
    duration: 5.250,
    ease: "power4.inOut"
  });
});
  }





  ngOnDestroy(): void {
    // تنظيف الـ ScrollTrigger لما تخرج من الصفحة عشان الأداء
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

addToCart(product: any) {
    console.log('تمت الإضافة للسلة:', product.nameAr);
    // هنا هتنادي الـ Cart Service بتاعتك
  }

  goToDetails(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

}
