import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Category } from '../../core/models/product.model';
import { ProductsApiService } from '../../core/services/products-api.service';
// import { CartService } from '../services/cart.service'; // مثال لو عندك Service للكرتونة

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
  isMobileMenuOpen = false;
  isScrolled = false;
  currentUrl = '/';
  totalItems = 0;

  navLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'منتجاتنا', href: '/products', hasMegaMenu: true },
    { name: 'جديد', href: '/products', queryParams: { filter: 'new' } },
    { name: 'من نحن', href: '/about-us' },
    { name: 'تواصل معنا', href: '/contact' },
    // { name: 'الطلبات السابقة', href: '/orders' },
  ];

  categories: Category[] = [];

  constructor(
    private router: Router,
    private productsApi: ProductsApiService
  ) {}

  ngOnInit() {
    this.productsApi.getCategories().subscribe((categories) => {
      this.categories = categories;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.urlAfterRedirects.split('?')[0];
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  goToSearch(): void {
    this.router.navigate(['/products']);
  }



}
