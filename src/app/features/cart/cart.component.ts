import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppCartItem, CartApiService } from '../../core/services/cart-api.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  items: AppCartItem[] = [];

  totalPrice: number = 0;
  totalItems: number = 0;
  isLoading = true;
  errorMessage = '';
  private userId = '';

  constructor(
    private readonly cartApi: CartApiService,
    private readonly router: Router,
    public readonly language: LanguageService
  ) {}

  ngOnInit(): void {
    this.userId = this.cartApi.getCurrentUserId();

    if (!this.userId) {
      this.isLoading = false;
      this.errorMessage = this.language.translate('cart.loginRequired');
      return;
    }

    this.loadCart();
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

  private loadCart(): void {
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
