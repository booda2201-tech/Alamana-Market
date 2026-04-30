import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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
    { name: 'عروض', href: '/products', queryParams: { filter: 'offers' } },
    { name: 'من نحن', href: '/about-us' },
    { name: 'تواصل معنا', href: '/contact' },
    { name: 'الطلبات السابقة', href: '/orders' },
  ];

  // الأقسام الحقيقية بناءً على مشروعك
  categories = [
    { id: 'all', name: 'جميع المنتجات' },
    { id: 'adhesives', name: 'لواصق البلاط' },
    { id: 'waterproofing', name: 'أنظمة العزل المائي' },
    { id: 'sealants', name: 'موانع التسرب' },
    { id: 'grouts', name: 'الترويبة (الجراوت)' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
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



}
