import { Component } from '@angular/core';
// ضيف group هنا في الـ imports
import { trigger, style, transition, animate, group } from '@angular/animations';
import { CartApiService } from '../../core/services/cart-api.service';
import { OrdersApiService, UserOrder } from '../../core/services/orders-api.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
animations: [
  trigger('detailExpand', [
    transition(':enter', [
      // البداية: الارتفاع صفر والشفافية صفر مع إزاحة خفيفة للفوق
      style({ height: '0px', opacity: 0, overflow: 'hidden' }),
      group([
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ height: '*' })),
        animate('300ms 50ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    transition(':leave', [
      style({ height: '*', opacity: 1, overflow: 'hidden' }),
      group([
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ height: '0px' })),
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ])
]
})
export class OrdersComponent {
expandedOrderId: string | null = null;
isLoading = true;
errorMessage = '';

orders: UserOrder[] = [];

constructor(
  private readonly ordersApi: OrdersApiService,
  private readonly cartApi: CartApiService
) {
  this.loadOrders();
}

// في ملف orders.component.ts
toggleOrder(id: string) {
    // لو دوست على المفتوح هيقفل (null)، ولو دوست على واحد تاني هيفتح ويقفل القديم
    this.expandedOrderId = this.expandedOrderId === id ? null : id;
  }



  getStatusClass(status: string) {
    switch (status) {
      case 'تم التوصيل': return 'bg-green-100 text-green-700 border-green-200';
      case 'في الطريق': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  }

  private loadOrders(): void {
    const userId = this.cartApi.getCurrentUserId();
    if (!userId) {
      this.isLoading = false;
      this.errorMessage = 'لازم تسجل دخول أولاً لعرض الطلبات.';
      return;
    }

    this.ordersApi.getOrdersByUserId(userId).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'تعذر تحميل الطلبات السابقة حالياً.';
        this.isLoading = false;
      }
    });
  }
}
