import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LucideAngularModule, Package, Clock, MapPin, ChevronDown, ChevronUp, Truck, CheckCircle2 } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsListComponent } from './features/products-list/products-list.component';
import { ProductDetailsComponent } from './features/product-details/product-details.component';
import { AboutUsComponent } from './features/about-us/about-us.component';
import { ContactComponent } from './features/contact/contact.component';
import { OrdersComponent } from './features/orders/orders.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { VideosComponent } from './features/videos/videos.component';
import { LoginComponent } from './components/login/login.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    ProductsListComponent,
    ProductDetailsComponent,
    AboutUsComponent,
    ContactComponent,
    OrdersComponent,
    CartComponent,
    CheckoutComponent,
    VideosComponent,
    LoginComponent,
    CreateAccountComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
LucideAngularModule.pick({
      Package,
      Clock,
      MapPin,
      ChevronDown,
      ChevronUp,
      Truck,
      CheckCircle2
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
