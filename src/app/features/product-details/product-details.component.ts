import { Component, OnInit, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  // منتج ثابت واحد للعرض الفوري
  product = {
    id: "pf-pool-tech-c2ftes2",
    nameAr: "بلاتينيوم فيكس بول تك C2FTES2",
    nameEn: "Platinum Fix Pool Tech C2FTES2",
    price: 12.500,
    weight: "20 كجم",
    description: "لاصق بلاط عالي الأداء مصمم خصيصاً لحمامات السباحة والمناطق المغمورة بالمياه.",
    specs: { "المعيار": "C2FTE S2", "التغطية": "3-5 كجم / م٢" },
    image: "assets/images/product-1.png",
    isNew: true
  };

  quantity: number = 1;
  activeTab: 'specs' | 'desc' | 'docs' = 'specs';
  specsArray: [string, string][] = []; // هنخزن الـ specs هنا بشكل ثابت

  constructor() {}

  ngOnInit(): void {
    // استخراج الداتا مرة واحدة فقط عند التحميل
    this.specsArray = Object.entries(this.product.specs);
  }

  ngAfterViewInit(): void {
    // تشغيل الأنيميشن مرة واحدة بعد التأكد من أن الـ View جاهز
    this.initAnimation();
  }

  initAnimation() {
    gsap.from('.product-img', {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.6,
      ease: 'power2.out'
    });
  }

  changeQuantity(amount: number) {
    if (this.quantity + amount >= 1) {
      this.quantity += amount;
    }
  }

  addToCart() {
    console.log('تمت الإضافة:', this.product.nameAr);
  }
}
