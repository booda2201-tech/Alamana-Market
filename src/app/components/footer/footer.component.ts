import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  // مصفوفة للسوشيال ميديا لسهولة التعديل
socialLinks = [
  // { id: 'youtube', icon: 'bi-youtube', href: '#', color: '#FF0000' },
  // { id: 'twitter', icon: 'bi-twitter-x', href: '#', color: '#000000' },
  { id: 'instagram', icon: 'bi-instagram', href: 'https://www.instagram.com/alamana_cme?igsh=MTFpY3g3ajdzMTBvMw==', color: '' }, // سيب اللون فاضي هنا
  // { id: 'facebook', icon: 'bi-facebook', href: '#', color: '#1877F2' }
];
}
