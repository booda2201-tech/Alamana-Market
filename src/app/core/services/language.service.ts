import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { SiteLanguage, TRANSLATIONS, TranslationKey } from '../i18n/translations';

const STORAGE_KEY = 'site_language';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly languageSubject = new BehaviorSubject<SiteLanguage>(this.readStoredLanguage());
  readonly language$ = this.languageSubject.asObservable();

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.applyDocumentLanguage(this.current);
  }

  get current(): SiteLanguage {
    return this.languageSubject.value;
  }

  get isRtl(): boolean {
    return this.current === 'ar';
  }

  get dir(): 'rtl' | 'ltr' {
    return this.isRtl ? 'rtl' : 'ltr';
  }

  setLanguage(language: SiteLanguage): void {
    if (language === this.current) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, language);
    this.languageSubject.next(language);
    this.applyDocumentLanguage(language);
  }

  toggleLanguage(): void {
    this.setLanguage(this.current === 'ar' ? 'en' : 'ar');
  }

  translate(key: TranslationKey, params?: Record<string, string>): string {
    const template = TRANSLATIONS[this.current][key] ?? TRANSLATIONS.ar[key] ?? key;
    if (!params) {
      return template;
    }

    return Object.entries(params).reduce(
      (text, [name, value]) => text.replace(new RegExp(`{{${name}}}`, 'g'), value),
      template
    );
  }

  pickLocalized(arabic?: string, english?: string, fallback?: string): string {
    const ar = arabic?.trim();
    const en = english?.trim();
    const legacy = fallback?.trim();

    if (this.current === 'en') {
      return en || ar || legacy || '';
    }

    return ar || en || legacy || '';
  }

  private readStoredLanguage(): SiteLanguage {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'en' ? 'en' : 'ar';
  }

  private applyDocumentLanguage(language: SiteLanguage): void {
    const html = this.document.documentElement;
    html.lang = language;
    html.dir = language === 'ar' ? 'rtl' : 'ltr';
  }
}
