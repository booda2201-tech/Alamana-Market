import { Component } from '@angular/core';
// ضيف group هنا في الـ imports
import { trigger, style, transition, animate, group } from '@angular/animations';

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

  // داتا تجريبية بنفس هيكلة الـ Context اللي عندك
orders = [
    {
      id: 'ORD-2026-001',
      date: new Date('2026-04-28T10:30:00'),
      total: 45.250,
      status: 'قيد التحضير',
      paymentMethod: 'knet',
      deliveryInfo: {
        fullName: 'عبدالرحمن خالد',
        governorate: 'الجيزة',
        city: 'حدائق الأهرام',
        address: 'البوابة الأولى، منطقة أ',
        phone: '96590000001'
      },
      items: [
        {
          product: { id: '101', nameAr: 'لاصق بلاط سوبر فيكس', image: '../../../assets/images/product-1.png', price: 15.000 },
          quantity: 2
        },
        {
          product: { id: '102', nameAr: 'ترويبة جراوت عازلة', image: '../../../assets/images/product-2.png', price: 15.250 },
          quantity: 1
        }
      ]
    },
    {
      id: 'ORD-2026-002',
      date: new Date('2026-04-25T14:15:00'),
      total: 120.000,
      status: 'في الطريق',
      paymentMethod: 'visa',
      deliveryInfo: {
        fullName: 'أحمد محمد',
        governorate: 'حولي',
        city: 'السالمية',
        address: 'قطعة 3، شارع الخليج، مبنى 12',
        phone: '96590000002'
      },
      items: [
        {
          product: { id: '103', nameAr: 'أنظمة عزل مائي متطورة', image: '../../../assets/images/product-3.png', price: 60.000 },
          quantity: 2
        }
      ]
    },
    {
      id: 'ORD-2026-003',
      date: new Date('2026-04-20T09:00:00'),
      total: 18.500,
      status: 'تم التوصيل',
      paymentMethod: 'cod',
      deliveryInfo: {
        fullName: 'محمد علي',
        governorate: 'العاصمة',
        city: 'الكويت',
        address: 'برج الأمانة، الطابق 5',
        phone: '96590000003'
      },
      items: [
        {
          product: { id: '104', nameAr: 'منظف سيراميك احترافي', image: '../../../assets/images/product-4.png', price: 9.250 },
          quantity: 2
        }
      ]
    }
  ];

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
}
