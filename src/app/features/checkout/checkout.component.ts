import { Component, OnInit, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AppCartItem, CartApiService } from '../../core/services/cart-api.service';
import { CheckoutApiService, CreateOrderPayload, LocationOption, PaymentMethodOption } from '../../core/services/checkout-api.service';
import { Router } from '@angular/router';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements OnInit, OnDestroy {
  isSubmitting = false;
  isSuccess = false;
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  private userId = '';

  formData = {
    fullName: '',
    email: '',
    phone: '',
    countryId: 0,
    governorateId: 0,
    cityId: 0,
    districtId: 0,
    street: '',
    buildingNumber: '',
    floor: '',
    apartment: '',
    landmark: '',
    paymentMethodId: 0
  };

  countries: LocationOption[] = [];
  governorates: LocationOption[] = [];
  cities: LocationOption[] = [];
  districts: LocationOption[] = [];
  paymentMethods: PaymentMethodOption[] = [];

  items: AppCartItem[] = [];
  totalPrice = 12.500;
  totalItems = 0;


// constructor(private zone: NgZone) {}
  constructor(
    private readonly cartApi: CartApiService,
    private readonly checkoutApi: CheckoutApiService,
    private readonly router: Router
  ) {}

ngOnInit(): void {
  this.userId = this.cartApi.getCurrentUserId();
  if (!this.userId) {
    this.isLoading = false;
    this.errorMessage = 'لازم تسجل دخول أولاً لإتمام الطلب.';
    return;
  }

  const authUserRaw = localStorage.getItem('auth_user');
  if (authUserRaw) {
    try {
      const user = JSON.parse(authUserRaw) as { userName?: string; email?: string };
      this.formData.fullName = user.userName || '';
      this.formData.email = user.email || '';
    } catch {
      // ignore parsing issue
    }
  }

  this.loadCart();
  this.loadCountries();
  this.loadPaymentMethods();
}

calculateTotal(): void {
  this.totalPrice = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  this.totalItems = this.items.reduce((acc, item) => acc + item.quantity, 0);
}

  ngOnDestroy(): void {
    // عشان نمنع الـ Aw Snap لما تسيب الصفحة
    // ScrollTrigger.getAll().forEach(t => t.kill());
  }

  handleSubmit() {
    if (this.isSubmitting || !this.canSubmitOrder()) return;
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload: CreateOrderPayload = {
      userId: this.userId,
      fullName: this.formData.fullName.trim(),
      email: this.formData.email.trim(),
      phone: this.formData.phone.trim(),
      countryId: this.formData.countryId,
      governorateId: this.formData.governorateId,
      cityId: this.formData.cityId,
      districtId: this.formData.districtId,
      street: this.formData.street.trim(),
      buildingNumber: this.formData.buildingNumber.trim(),
      floor: this.formData.floor.trim(),
      apartment: this.formData.apartment.trim(),
      landmark: this.formData.landmark.trim(),
      paymentMethodId: this.formData.paymentMethodId
    };

    this.checkoutApi.createOrder(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.isSuccess = true;
        this.successMessage = 'تم استلام طلبك بنجاح';
        window.scrollTo(0, 0);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'تعذر إتمام الطلب حالياً. حاول مرة أخرى.';
      }
    });
  }

  setPaymentMethod(methodId: number) {
    this.formData.paymentMethodId = methodId;
  }

  onCountryChange(): void {
    const countryId = Number(this.formData.countryId);
    this.formData.governorateId = 0;
    this.formData.cityId = 0;
    this.formData.districtId = 0;
    this.governorates = [];
    this.cities = [];
    this.districts = [];
    if (!countryId) {
      return;
    }

    this.checkoutApi.getGovernoratesByCountry(countryId).subscribe((options) => {
      this.governorates = options;
    });
  }

  onGovernorateChange(): void {
    const governorateId = Number(this.formData.governorateId);
    this.formData.cityId = 0;
    this.formData.districtId = 0;
    this.cities = [];
    this.districts = [];
    if (!governorateId) {
      return;
    }

    this.checkoutApi.getCitiesByGovernorate(governorateId).subscribe((options) => {
      this.cities = options;
    });
  }

  onCityChange(): void {
    const cityId = Number(this.formData.cityId);
    this.formData.districtId = 0;
    this.districts = [];
    if (!cityId) {
      return;
    }

    this.checkoutApi.getDistrictsByCity(cityId).subscribe((options) => {
      this.districts = options;
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private loadCart(): void {
    this.isLoading = true;
    this.cartApi.getOrCreateCart(this.userId).subscribe({
      next: (items) => {
        this.items = items;
        this.calculateTotal();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'تعذر تحميل بيانات السلة.';
        this.isLoading = false;
      }
    });
  }

  private loadCountries(): void {
    this.checkoutApi.getCountries().subscribe({
      next: (options) => {
        this.countries = options;
      },
      error: () => {
        this.errorMessage = 'تعذر تحميل بيانات المناطق.';
      }
    });
  }

  private loadPaymentMethods(): void {
    this.checkoutApi.getPaymentMethods().subscribe({
      next: (methods) => {
        this.paymentMethods = methods;
        if (!this.formData.paymentMethodId && methods.length) {
          this.formData.paymentMethodId = methods[0].id;
        }
      },
      error: () => {
        this.errorMessage = 'تعذر تحميل طرق الدفع.';
      }
    });
  }

  private canSubmitOrder(): boolean {
    return Boolean(
      this.formData.fullName.trim() &&
      this.formData.email.trim() &&
      this.formData.phone.trim() &&
      this.formData.countryId &&
      this.formData.governorateId &&
      this.formData.cityId &&
      this.formData.districtId &&
      this.formData.street.trim() &&
      this.formData.buildingNumber.trim() &&
      this.formData.floor.trim() &&
      this.formData.apartment.trim()
      && this.formData.paymentMethodId
    );
  }
}
