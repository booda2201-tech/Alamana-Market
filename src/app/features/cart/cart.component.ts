import { Component, OnInit } from '@angular/core';

export interface CartItem {
  product: {
    id: string;
    nameAr: string;
    category: string;
    price: number;
    image: string;
  };
  quantity: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  // داتا وهمية للعرض (Mock Data)
  items: CartItem[] = [
    {
      product: {
        id: "pf-pool-tech",
        nameAr: "بلاتينيوم فيكس بول تك C2FTES2",
        category: "لواصق البلاط",
        price: 12.500,
        image: "assets/images/product-1.png"
      },
      quantity: 1
    },
    {
      product: {
        id: "water-stop-200",
        nameAr: "واتر ستوب 200 - عازل مائي",
        category: "أنظمة العزل",
        price: 45.000,
        image: "assets/images/product-1.png"
      },
      quantity: 2
    }
  ];

  totalPrice: number = 0;
  totalItems: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.calculateTotals();
  }

  // حساب الإجمالي
  calculateTotals() {
    this.totalPrice = this.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    this.totalItems = this.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  updateQuantity(id: string, amount: number) {
    const item = this.items.find(i => i.product.id === id);
    if (item) {
      const newQty = item.quantity + amount;
      if (newQty >= 1) {
        item.quantity = newQty;
        this.calculateTotals();
      }
    }
  }

  removeFromCart(id: string) {
    this.items = this.items.filter(i => i.product.id !== id);
    this.calculateTotals();
  }
}
