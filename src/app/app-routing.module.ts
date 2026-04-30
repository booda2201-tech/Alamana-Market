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
import { VideosComponent } from './features/videos/videos.component';

const routes: Routes = [
  // الصفحة الرئيسية
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'الأمانة لمواد البناء | الرئيسية',
      description: 'اكتشف أفضل مواد البناء، العزل، اللواصق، ومنتجات الترميم في الكويت بجودة عالية وأسعار تنافسية.'
    }
  },

  // الصفحات التعريفية
  {
    path: 'about-us',
    component: AboutUsComponent,
    data: {
      title: 'من نحن | الأمانة لمواد البناء',
      description: 'تعرف على الأمانة لمواد البناء ورسالتنا في تقديم حلول بناء موثوقة للمشاريع السكنية والتجارية.'
    }
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: {
      title: 'تواصل معنا | الأمانة لمواد البناء',
      description: 'تواصل مع فريق الأمانة لمواد البناء للاستفسارات، الطلبات، والدعم الفني.'
    }
  },

  // المتجر والمنتجات
  {
    path: 'products',
    component: ProductsListComponent,
    data: {
      title: 'المنتجات | الأمانة لمواد البناء',
      description: 'تصفح جميع منتجات الأمانة من اللواصق، العوازل، الترميم، وموانع التسرب.'
    }
  },
  {
    path: 'products/:id',
    component: ProductDetailsComponent,
    data: {
      title: 'تفاصيل المنتج | الأمانة لمواد البناء',
      description: 'تعرف على مواصفات المنتج الفنية، الاستخدامات، والسعر قبل الشراء.'
    }
  }, // ترتيب سليم

  // الطلبات والسلة
  {
    path: 'orders',
    component: OrdersComponent,
    data: {
      title: 'الطلبات السابقة | الأمانة لمواد البناء',
      description: 'راجع حالة الطلبات السابقة وتفاصيل الشحن والدفع.'
    }
  },

  // السلة
  {
    path: 'cart',
    component: CartComponent,
    data: {
      title: 'سلة المشتريات | الأمانة لمواد البناء',
      description: 'راجع المنتجات في سلة المشتريات وأكمل عملية الطلب بسهولة.'
    }
  },

  // الدفع
  {
    path: 'checkout',
    component: CheckoutComponent,
    data: {
      title: 'إتمام الطلب | الأمانة لمواد البناء',
      description: 'أكمل بيانات الشحن والدفع لتأكيد طلبك من الأمانة لمواد البناء.'
    }
  },
  // الفيديوهات
  {
    path: 'videos',
    component: VideosComponent,
    data: {
      title: 'فيديوهات | الأمانة لمواد البناء',
      description: 'شاهد فيديوهات قصيرة لطرق الاستخدام والتطبيق العملي لمنتجات الأمانة.'
    }
  },
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
