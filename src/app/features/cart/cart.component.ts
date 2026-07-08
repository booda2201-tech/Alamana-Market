import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, skip } from 'rxjs/operators';
import { AppCartItem, CartApiService } from '../../core/services/cart-api.service';
import { CountryService } from '../../core/services/country.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  items: AppCartItem[] = [];

  totalPrice: number = 0;
  totalItems: number = 0;
  isLoading = true;
  requiresLogin = false;
  errorMessage = '';
  private userId = '';
  private countrySubscription?: Subscription;

  constructor(
    private readonly cartApi: CartApiService,
    private readonly countryService: CountryService,
    private readonly router: Router,
    public readonly language: LanguageService
  ) {}

  ngOnInit(): void {
    this.userId = this.cartApi.getCurrentUserId();

    if (!this.userId) {
      this.isLoading = false;
      this.requiresLogin = true;
      return;
    }

    this.loadCart();

    this.countrySubscription = this.countryService.selectedCountryId$
      .pipe(distinctUntilChanged(), skip(1))
      .subscribe(() => {
        this.loadCart();
      });
  }

  ngOnDestroy(): void {
    this.countrySubscription?.unsubscribe();
  }

  get selectedCountryName(): string {
    return this.countryService.getSelectedLocalizedName();
  }

  get emptyCountryDesc(): string {
    return this.language.translate('cart.emptyCountryDesc').replace('{country}', this.selectedCountryName);
  }

  calculateTotals(): void {
    this.totalPrice = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    this.totalItems = this.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  updateQuantity(item: AppCartItem, amount: number): void {
    const currentItem = this.items.find((i) => i.id === item.id);
    if (!currentItem) {
      return;
    }

    const newQty = currentItem.quantity + amount;
    if (newQty < 1) {
      return;
    }

    if (amount > 0) {
      this.cartApi.addCartItem(this.userId, {
        id: currentItem.productId,
        nameAr: currentItem.name,
        nameEn: currentItem.name,
        category: '',
        price: currentItem.price,
        weight: '',
        description: '',
        specs: {},
        image: currentItem.image
      }, 1).subscribe({
        next: () => this.loadCart(),
        error: () => {
          this.errorMessage = this.language.translate('cart.updateFailed');
        }
      });
      return;
    }

    this.deleteFromCart(currentItem.id, this.language.translate('cart.decreaseFailed'));
  }

  removeFromCart(cartItemId: number): void {
    this.deleteFromCart(cartItemId, this.language.translate('cart.removeFailed'));
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  loadCart(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cartApi.getOrCreateCart(this.userId).subscribe({
      next: (items) => {
        this.isLoading = false;
        this.items = items;
        this.calculateTotals();
        this.cartApi.refreshCartCount(this.userId);
      },
      error: () => {
        this.isLoading = false;
        this.items = [];
        this.totalPrice = 0;
        this.totalItems = 0;
        this.errorMessage = this.language.translate('cart.loadFailed');
      }
    });
  }

  private deleteFromCart(cartItemId: number, failMessage: string): void {
    this.cartApi.deleteCartItem(cartItemId).subscribe({
      next: () => {
        this.cartApi.showCartMessage(this.language.translate('cart.removed'));
        this.loadCart();
      },
      error: () => {
        this.errorMessage = failMessage;
      }
    });
  }
}
