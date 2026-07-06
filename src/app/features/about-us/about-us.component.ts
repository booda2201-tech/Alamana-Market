import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as AOS from 'aos';
import { gsap } from 'gsap';
import { LanguageService } from '../../core/services/language.service';
import { TranslationKey } from '../../core/i18n/translations';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit, AfterViewInit {

  readonly stats: Array<{ labelKey: TranslationKey; value: string; icon: string }> = [
    { labelKey: 'about.statYears', value: '+15', icon: 'bi bi-clock-history' },
    { labelKey: 'about.statProjects', value: '+1000', icon: 'bi bi-building' },
    { labelKey: 'about.statClients', value: '+5000', icon: 'bi bi-people' },
    { labelKey: 'about.statBranches', value: '5', icon: 'bi bi-geo-alt' },
  ];

  constructor(public readonly language: LanguageService) {}

  ngOnInit(): void {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-quad'
    });
  }

  ngAfterViewInit(): void {
    // GSAP Animation للـ Hero عشان تبقى زي Framer Motion
    const tl = gsap.timeline();

    tl.from('.hero-img', { scale: 1.2, duration: 1.5, ease: 'power2.out' })
      .from('.hero-title', { y: 50, opacity: 0, duration: 0.8 }, '-=1')
      .from('.hero-p', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5');
  }
}
