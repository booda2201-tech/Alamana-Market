import { ChangeDetectorRef, Component, ElementRef, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as AOS from 'aos';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { Category, Product } from '../../core/models/product.model';
import { Advertisement, AdvertisementsApiService } from '../../core/services/advertisements-api.service';
import { CartApiService } from '../../core/services/cart-api.service';
import { CountryService } from '../../core/services/country.service';
import { LanguageService } from '../../core/services/language.service';
import { ProductsApiService } from '../../core/services/products-api.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('categoriesCarousel') categoriesCarousel?: ElementRef<HTMLElement>;
  @ViewChild('bestSellersCarousel') bestSellersCarousel?: ElementRef<HTMLElement>;
  @ViewChild('randomProductsCarousel') randomProductsCarousel?: ElementRef<HTMLElement>;

  private readonly brokenCategoryImageKeys = new Set<string>();
  private readonly preloadedAdvertisementImages = new Set<string>();
  categories: Category[] = [];
  categoriesActiveIndex = 0;

  bestSellers: Product[] = [];
  randomProducts: Product[] = [];
  bestSellersActiveIndex = 0;
  randomProductsActiveIndex = 0;
  heroProduct?: Product;
  advertisements: Advertisement[] = [];
  activeAdvertisementIndex = 0;
  adAnimationActive = false;
  private advertisementTouchStartX = 0;
  private advertisementTouchStartY = 0;
  private countrySubscription?: Subscription;

  constructor(
    private readonly productsApi: ProductsApiService,
    private readonly advertisementsApi: AdvertisementsApiService,
    private readonly cartApi: CartApiService,
    private readonly countryService: CountryService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    public readonly language: LanguageService
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

    this.countrySubscription = this.countryService.selectedCountryId$.pipe(
      filter((countryId): countryId is number => !!countryId && countryId > 0),
      distinctUntilChanged()
    ).subscribe(() => {
      this.loadCatalogData();
    });

    this.countryService.loadCountries().subscribe();
  }

  private loadCatalogData(): void {
    this.productsApi.getBestSellers().subscribe((products) => {
      this.bestSellers = products.slice(0, 4);
      this.bestSellersActiveIndex = 0;
    });

    this.productsApi.getRandomProducts().subscribe((products) => {
      this.randomProducts = products.slice(0, 4);
      this.randomProductsActiveIndex = 0;
    });

    this.advertisementsApi.getAdvertisements().subscribe((advertisements) => {
      this.advertisements = advertisements;
      this.activeAdvertisementIndex = 0;
      this.preloadAdvertisementImages(advertisements);
      setTimeout(() => AOS.refresh(), 200);
    });

    this.productsApi.getCategories().subscribe((categories) => {
      this.brokenCategoryImageKeys.clear();
      this.categories = categories.filter((category) => category.id !== 'all');
      this.categoriesActiveIndex = 0;
    });

    this.productsApi.getHeroProduct().subscribe((product) => {
      this.heroProduct = product;
      this.cdr.detectChanges();
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((item) => item.id === categoryId);
    if (!category) {
      return categoryId;
    }

    return this.language.pickLocalized(category.nameAr, category.nameEn, category.name);
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
    this.countrySubscription?.unsubscribe();
    // تنظيف الـ ScrollTrigger لما تخرج من الصفحة عشان الأداء
    ScrollTrigger.getAll().forEach(t => t.kill());
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

  onProductCarouselScroll(event: Event, section: 'categories' | 'bestSellers' | 'randomProducts'): void {
    const container = event.target as HTMLElement | null;
    if (!container) {
      return;
    }

    this.setCarouselActiveIndex(container, section);
  }

  goToCarouselSlide(section: 'categories' | 'bestSellers' | 'randomProducts', index: number): void {
    const container = this.getCarouselElement(section);
    if (!container) {
      return;
    }

    const cards = Array.from(container.children) as HTMLElement[];
    const target = cards[index];
    if (!target) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const delta =
      targetRect.left -
      containerRect.left -
      (container.clientWidth - target.offsetWidth) / 2;

    container.scrollTo({
      left: container.scrollLeft + delta,
      behavior: 'smooth'
    });

    if (section === 'categories') {
      this.categoriesActiveIndex = index;
    } else if (section === 'bestSellers') {
      this.bestSellersActiveIndex = index;
    } else {
      this.randomProductsActiveIndex = index;
    }
  }

  private getCarouselElement(section: 'categories' | 'bestSellers' | 'randomProducts'): HTMLElement | undefined {
    if (section === 'categories') {
      return this.categoriesCarousel?.nativeElement;
    }
    if (section === 'bestSellers') {
      return this.bestSellersCarousel?.nativeElement;
    }
    return this.randomProductsCarousel?.nativeElement;
  }

  private setCarouselActiveIndex(
    container: HTMLElement,
    section: 'categories' | 'bestSellers' | 'randomProducts'
  ): void {
    const cards = Array.from(container.children) as HTMLElement[];
    if (!cards.length) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - containerCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    if (section === 'categories') {
      this.categoriesActiveIndex = nearestIndex;
    } else if (section === 'bestSellers') {
      this.bestSellersActiveIndex = nearestIndex;
    } else {
      this.randomProductsActiveIndex = nearestIndex;
    }
  }

  get activeAdvertisement(): Advertisement | undefined {
    return this.advertisements[this.activeAdvertisementIndex];
  }

  setActiveAdvertisement(index: number): void {
    this.changeAdvertisement(index);
  }

  nextAdvertisement(): void {
    if (!this.advertisements.length) {
      return;
    }
    this.changeAdvertisement((this.activeAdvertisementIndex + 1) % this.advertisements.length);
  }

  previousAdvertisement(): void {
    if (!this.advertisements.length) {
      return;
    }
    this.changeAdvertisement((this.activeAdvertisementIndex - 1 + this.advertisements.length) % this.advertisements.length);
  }

  onAdvertisementTouchStart(event: TouchEvent): void {
    const touch = event.changedTouches[0];
    this.advertisementTouchStartX = touch.clientX;
    this.advertisementTouchStartY = touch.clientY;
  }

  onAdvertisementTouchEnd(event: TouchEvent): void {
    if (this.advertisements.length < 2) {
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.advertisementTouchStartX;
    const deltaY = touch.clientY - this.advertisementTouchStartY;

    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    if (deltaX > 0) {
      this.previousAdvertisement();
      return;
    }

    this.nextAdvertisement();
  }

  private changeAdvertisement(index: number): void {
    const advertisement = this.advertisements[index];
    if (!advertisement || index === this.activeAdvertisementIndex) {
      return;
    }

    this.adAnimationActive = false;
    this.cdr.detectChanges();
    this.activeAdvertisementIndex = index;
    this.adAnimationActive = true;
    window.setTimeout(() => {
      this.adAnimationActive = false;
    }, 1100);
  }

  private preloadAdvertisementImages(advertisements: Advertisement[]): void {
    advertisements.forEach((ad) => {
      if (!ad.imageUrl || this.preloadedAdvertisementImages.has(ad.imageUrl)) {
        return;
      }

      const image = new Image();
      image.src = ad.imageUrl;
      this.preloadedAdvertisementImages.add(ad.imageUrl);
    });
  }

}
