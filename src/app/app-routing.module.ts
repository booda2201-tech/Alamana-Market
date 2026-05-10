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
import { LoginComponent } from './components/login/login.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { VideosComponent } from './features/videos/videos.component';

const routes: Routes = [
  // الصفحة الرئيسية
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'الأمانة لمواد البناء | مواد بناء، اسمنت، عوازل ولواصق',
      description: 'الأمانة لمواد البناء توفر مواد البناء، الاسمنت، لواصق البلاط، العوازل، الترويبات، الجراوت، موانع التسرب ومنتجات الترميم بجودة عالية.',
      keywords: 'الأمانة, الامانة, الأمانة مواد البناء, الامانة مواد البناء, مواد البناء, مواد بناء, اسمنت, أسمنت, لاصق بلاط, لواصق البلاط, عزل مائي, مواد عزل, ترويبة, جراوت, مانع تسرب, مواد ترميم, كيماويات البناء'
    }
  },

  // الصفحات التعريفية
  {
    path: 'about-us',
    component: AboutUsComponent,
    data: {
      title: 'من نحن | الأمانة لمواد البناء',
      description: 'تعرف على الأمانة لمواد البناء وخبرتنا في توفير حلول مواد البناء، الاسمنت، العوازل واللواصق للمشاريع السكنية والتجارية.',
      keywords: 'من نحن الأمانة, شركة مواد بناء, الأمانة مواد البناء, مورد مواد بناء, كيماويات البناء'
    }
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: {
      title: 'تواصل معنا | الأمانة لمواد البناء',
      description: 'تواصل مع الأمانة لمواد البناء للاستفسار عن مواد البناء، الاسمنت، اللواصق، العوازل، الأسعار والطلبات.',
      keywords: 'تواصل مع الأمانة, طلب مواد بناء, أسعار مواد البناء, شراء اسمنت, شراء لواصق بلاط'
    }
  },

  // المتجر والمنتجات
  {
    path: 'products',
    component: ProductsListComponent,
    data: {
      title: 'منتجات مواد البناء | اسمنت، لواصق، عوازل، ترويبات | الأمانة',
      description: 'تصفح منتجات الأمانة لمواد البناء: اسمنت، لواصق البلاط، العزل المائي، الترويبات، الجراوت، موانع التسرب ومواد الترميم.',
      keywords: 'منتجات مواد البناء, اسمنت, أسمنت, لاصق بلاط, لواصق, عوازل, عزل مائي, ترويبة, جراوت, مانع تسرب, مواد ترميم, مواد بناء الكويت'
    }
  },
  {
    path: 'products/:id',
    component: ProductDetailsComponent,
    data: {
      title: 'تفاصيل منتج مواد بناء | الأمانة لمواد البناء',
      description: 'تعرف على مواصفات واستخدامات وأسعار منتجات مواد البناء من الأمانة، مثل الاسمنت واللواصق والعوازل والترويبات.',
      keywords: 'تفاصيل منتج مواد بناء, سعر مواد بناء, مواصفات اسمنت, مواصفات لاصق بلاط, عزل مائي, ترويبة, جراوت'
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

  // تسجيل الدخول وإنشاء حساب
  { path: 'login', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent },


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
