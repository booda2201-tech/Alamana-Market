import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements OnInit, OnDestroy {
  isSubmitting = false;
  isSuccess = false;

  formData = {
    fullName: '',
    phone: '',
    governorate: '',
    city: '',
    address: '',
    paymentMethod: 'knet'
  };

  governorates: string[] = ['الكويت العاصمة', 'حولي', 'الأحمدي', 'الفروانية', 'الجهراء', 'مبارك الكبير'];

  items = [
    {
      product: { id: '1', nameAr: 'بلاتينيوم فيكس بول تك', price: 12.500, image: 'assets/images/product-1.png' },
      quantity: 1
    }
  ];

  totalPrice = 12.500;
  totalItems = 1;


// constructor(private zone: NgZone) {}

ngOnInit(): void {
  // this.zone.runOutsideAngular(() => {
  //   gsap.fromTo('.checkout', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1 });
  // });
  this.calculateTotal(); // احسبها هنا مرة واحدة
}

calculateTotal() {
  this.totalPrice = this.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
}

  ngOnDestroy(): void {
    // عشان نمنع الـ Aw Snap لما تسيب الصفحة
    // ScrollTrigger.getAll().forEach(t => t.kill());
  }

  handleSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    setTimeout(() => {
      this.isSubmitting = false;
      this.isSuccess = true;
      window.scrollTo(0, 0); // عشان يطلع لفوق يشوف رسالة النجاح
    }, 1500);
  }

  setPaymentMethod(method: string) {
    this.formData.paymentMethod = method;
  }
}
