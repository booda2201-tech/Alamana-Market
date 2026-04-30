import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsListComponent } from './features/products-list/products-list.component';
import { ProductDetailsComponent } from './features/product-details/product-details.component';
import { AboutUsComponent } from './features/about-us/about-us.component';
import { ContactComponent } from './features/contact/contact.component';
import { OrdersComponent } from './features/orders/orders.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';

const routes: Routes = [
  // الصفحة الرئيسية
  { path: '', component: HomeComponent },

  // الصفحات التعريفية
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact', component: ContactComponent },

  // المتجر والمنتجات
  { path: 'products', component: ProductsListComponent },
  { path: 'products/:id', component: ProductDetailsComponent }, // ترتيب سليم

  // الطلبات والسلة
  { path: 'orders', component: OrdersComponent },

  // السلة
  { path: 'cart', component: CartComponent },

  // الدفع
  { path: 'checkout', component: CheckoutComponent },
  // حماية من المسارات الغلط (Redirect to Home)
  // دي مهمة جداً عشان لو اليوزر كتب أي حاجة عشوائية يرجع للرئيسية بدل ما الصفحة تضرب
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // بيرجع الصفحة لفوق خالص أول ما تنقل
      scrollPositionRestoration: 'enabled',
      // بيشغل التنقل بين الـ Anchors داخل الصفحة الواحدة
      anchorScrolling: 'enabled',
      // بيخلي الأنيميشن يلحق يشتغل لو عندك GSAP أو AOS
      scrollOffset: [0, 0]
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
