import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppCartItem, CartApiService } from '../../core/services/cart-api.service';

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
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.cartApi.getCurrentUserId();

    if (!this.userId) {
      this.isLoading = false;
      this.errorMessage = 'لازم تسجل دخول أولاً علشان تشوف السلة.';
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
          this.errorMessage = 'تعذر تحديث الكمية حالياً.';
        }
      });
      return;
    }

    this.deleteFromCart(currentItem.id, 'تعذر تقليل الكمية حالياً.');
  }

  removeFromCart(cartItemId: number): void {
    this.deleteFromCart(cartItemId, 'تعذر حذف المنتج من السلة.');
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
        this.errorMessage = 'تعذر تحميل السلة حالياً. حاول مرة أخرى.';
      }
    });
  }

  private deleteFromCart(cartItemId: number, failMessage: string): void {
    this.cartApi.deleteCartItem(cartItemId).subscribe({
      next: () => {
        this.cartApi.showCartMessage('تم حذف المنتج من السلة');
        this.loadCart();
      },
      error: () => {
        this.errorMessage = failMessage;
      }
    });
  }
}
