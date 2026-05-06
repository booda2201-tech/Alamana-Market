import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Product } from '../models/product.model';

interface CartApiItem {
  id?: number;
  name?: string;
  price?: number;
  quantity?: number;
  totalPrice?: number;
  imagePath?: string;
  productId?: number;
  cartId?: number;
}

interface CartApiResponse {
  id?: number;
  totalAmount?: number;
  userId?: string;
  createAt?: string;
  cartItems?: CartApiItem[];
}

export interface AppCartItem {
  id: number;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private readonly baseUrl = 'https://api.alamanamarket.com/api';
  private readonly apiOrigin = 'https://api.alamanamarket.com';
  private readonly cartCountSubject = new BehaviorSubject<number>(0);
  readonly cartCount$ = this.cartCountSubject.asObservable();
  private readonly cartMessageSubject = new BehaviorSubject<string>('');
  readonly cartMessage$ = this.cartMessageSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  getOrCreateCart(userId: string): Observable<AppCartItem[]> {
    return this.http
      .get<CartApiResponse>(`${this.baseUrl}/Cart/GetOrCreateCart/${encodeURIComponent(userId)}`, this.getAuthOptions())
      .pipe(map((response) => this.mapCartItems(response)));
  }

  addCartItem(userId: string, product: Product, quantity = 1): Observable<unknown> {
    const payload = {
      userId,
      quantity,
      productId: Number(product.id)
    };
    return this.http.post(`${this.baseUrl}/CartItems/AddCartItem`, payload, this.getAuthOptions());
  }

  deleteCartItem(cartItemId: number): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/CartItems/DeleteCartItem/${cartItemId}`, this.getAuthOptions());
  }

  refreshCartCount(userId: string): void {
    if (!userId) {
      this.cartCountSubject.next(0);
      return;
    }
    this.getOrCreateCart(userId).subscribe({
      next: (items) => {
        const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
        this.cartCountSubject.next(totalItems);
      },
      error: () => this.cartCountSubject.next(0)
    });
  }

  getCurrentUserId(): string {
    const authUserRaw = localStorage.getItem('auth_user');
    const token = localStorage.getItem('auth_token') || '';

    if (authUserRaw) {
      try {
        const parsed = JSON.parse(authUserRaw) as Record<string, unknown>;
        const directUserId = this.pickUserIdFromObject(parsed);
        if (directUserId) {
          return directUserId;
        }
      } catch {
        // ignore invalid JSON and continue with token fallback
      }
    }

    return this.extractUserIdFromToken(token);
  }

  showCartMessage(message: string): void {
    this.cartMessageSubject.next(message);
    setTimeout(() => this.cartMessageSubject.next(''), 2200);
  }

  private mapCartItems(response: CartApiResponse): AppCartItem[] {
    const items = Array.isArray(response?.cartItems) ? response.cartItems : [];
    return items.map((item) => ({
      id: Number(item.id || 0),
      productId: String(item.productId ?? ''),
      name: item.name || 'منتج',
      image: this.normalizeImageUrl(item.imagePath) || 'assets/images/product-1.png',
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
      totalPrice: Number(item.totalPrice || 0)
    }));
  }

  private pickUserIdFromObject(payload: Record<string, unknown>): string {
    const candidates = [
      payload['userId'],
      payload['userid'],
      payload['userID'],
      payload['id'],
      payload['sub'],
      payload['nameid'],
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
    ];

    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim().length > 0) {
        return candidate;
      }
      if (typeof candidate === 'number') {
        return String(candidate);
      }
    }

    return '';
  }

  private extractUserIdFromToken(token: string): string {
    if (!token || !token.includes('.')) {
      return '';
    }
    try {
      const payloadPart = token.split('.')[1];
      const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
      const decoded = atob(padded);
      const payload = JSON.parse(decoded) as Record<string, unknown>;
      return this.pickUserIdFromObject(payload);
    } catch {
      return '';
    }
  }

  private getAuthOptions(): { headers?: HttpHeaders } {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return {};
    }
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  private normalizeImageUrl(imagePath?: string): string {
    if (!imagePath) {
      return '';
    }
    const cleanedPath = imagePath.trim().replace(/^['"]|['"]$/g, '').replace(/\\/g, '/');
    if (!cleanedPath) {
      return '';
    }
    if (cleanedPath.startsWith('http://') || cleanedPath.startsWith('https://')) {
      return cleanedPath.replace('http://', 'https://');
    }
    if (cleanedPath.startsWith('//')) {
      return `https:${cleanedPath}`;
    }
    return cleanedPath.startsWith('/') ? `${this.apiOrigin}${cleanedPath}` : `${this.apiOrigin}/${cleanedPath}`;
  }
}
