import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

interface ApiOrderItem {
  productName?: string;
  quantity?: number;
  price?: number;
  imageUrl?: string;
}

interface ApiOrder {
  orderId?: number;
  totalAmount?: number;
  status?: string | null;
  createdAt?: string;
  items?: ApiOrderItem[];
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface UserOrder {
  id: string;
  total: number;
  status: string;
  date: Date;
  items: OrderItem[];
}

@Injectable({ providedIn: 'root' })
export class OrdersApiService {
  private readonly baseUrl = 'https://api.alamanamarket.com/api';

  constructor(private readonly http: HttpClient) {}

  getOrdersByUserId(userId: string): Observable<UserOrder[]> {
    return this.http
      .get<ApiOrder[]>(`${this.baseUrl}/Orders/GetOrdersByUserId/${encodeURIComponent(userId)}`, this.getAuthOptions())
      .pipe(
        map((orders) =>
          (orders || []).map((order) => ({
            id: `ORD-${order.orderId ?? 0}`,
            total: Number(order.totalAmount ?? 0),
            status: this.normalizeStatus(order.status),
            date: new Date(order.createdAt || new Date().toISOString()),
            items: (order.items || []).map((item) => ({
              name: item.productName || 'منتج',
              quantity: Number(item.quantity ?? 1),
              price: Number(item.price ?? 0),
              image: item.imageUrl || 'assets/images/product-1.png'
            }))
          }))
        )
      );
  }

  private normalizeStatus(status: string | null | undefined): string {
    if (!status) return 'قيد المراجعة';
    return status;
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
}
