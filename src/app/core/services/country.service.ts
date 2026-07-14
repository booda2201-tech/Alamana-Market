import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { TranslationKey } from '../i18n/translations';
import { LanguageService } from './language.service';

export interface CatalogCountry {
  id: number;
  name: string;
  nameAr: string;
  nameEn: string;
  code: string;
  currencyAr: string;
  currencyEn: string;
  isDefault: boolean;
  officeAddress: string;
  phone: string;
  phone2: string;
  email: string;
  workingHours: string;
}

interface ApiCountry {
  id?: number;
  name?: string;
  nameAr?: string;
  nameEn?: string;
  country_name?: string;
  country_code?: string;
  currency?: string;
  currency_ar?: string;
  currency_en?: string;
  isDefault?: boolean;
  office_address?: string;
  phone?: string;
  phone2?: string;
  email?: string;
  working_hours?: string;
}

const STORAGE_KEY = 'catalog_country_id';

@Injectable({ providedIn: 'root' })
export class CountryService {
  private readonly baseUrl = 'https://api.alamanamarket.com/api';
  private readonly selectedCountryIdSubject = new BehaviorSubject<number | null>(this.readStoredCountryId());
  private countries: CatalogCountry[] = [];
  private loadPromise: Promise<CatalogCountry[]> | null = null;

  readonly selectedCountryId$ = this.selectedCountryIdSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly languageService: LanguageService
  ) {}

  loadCountries(): Observable<CatalogCountry[]> {
    if (this.countries.length) {
      return of(this.countries);
    }

    return this.http.get<ApiCountry[]>(`${this.baseUrl}/Location/GetAllCountries`).pipe(
      map((response) => (response || []).map((country) => this.mapCountry(country))),
      tap((countries) => {
        this.countries = countries;
        this.applyInitialSelection(countries);
      }),
      catchError(() => of([]))
    );
  }

  ensureLoaded(): Promise<CatalogCountry[]> {
    if (this.countries.length) {
      return Promise.resolve(this.countries);
    }

    if (!this.loadPromise) {
      this.loadPromise = new Promise((resolve) => {
        this.loadCountries().subscribe((countries) => resolve(countries));
      });
    }

    return this.loadPromise;
  }

  whenReady(): Observable<number> {
    const current = this.getSelectedCountryId();
    if (current && current > 0) {
      return of(current);
    }

    return this.loadCountries().pipe(
      switchMap(() =>
        this.selectedCountryId$.pipe(
          filter((id): id is number => !!id && id > 0),
          take(1)
        )
      )
    );
  }

  getCountries(): CatalogCountry[] {
    return this.countries;
  }

  getSelectedCountryId(): number | null {
    return this.selectedCountryIdSubject.value;
  }

  getSelectedCountry(): CatalogCountry | undefined {
    const countryId = this.getSelectedCountryId();
    return this.countries.find((country) => country.id === countryId);
  }

  getLocalizedName(country?: CatalogCountry): string {
    if (!country) {
      return this.languageService.translate('common.country');
    }

    const isEnglish = this.languageService.current === 'en';
    const apiPrimary = (isEnglish ? country.nameEn : country.nameAr).trim();
    if (apiPrimary) {
      return apiPrimary;
    }

    // Temporary backend mismatch: Arabic text stored in nameEn while nameAr is empty.
    if (!isEnglish && this.containsArabic(country.nameEn)) {
      return country.nameEn.trim();
    }

    const apiFallback = (isEnglish ? country.nameAr : country.nameEn).trim();
    if (!isEnglish && apiFallback) {
      return apiFallback;
    }

    const translationKey = this.getCountryTranslationKey((country.code || '').toUpperCase());
    if (translationKey) {
      return this.languageService.translate(translationKey);
    }

    return country.name || this.languageService.translate('common.country');
  }

  getSelectedLocalizedName(): string {
    return this.getLocalizedName(this.getSelectedCountry());
  }

  getLocalizedCurrency(country?: CatalogCountry): string {
    const target = country ?? this.getSelectedCountry();
    if (!target) {
      return this.languageService.pickLocalized('د.ك', 'KWD');
    }

    return this.languageService.pickLocalized(target.currencyAr, target.currencyEn, target.currencyEn || target.currencyAr);
  }

  getSelectedLocalizedCurrency(): string {
    return this.getLocalizedCurrency();
  }

  getSelectedContactInfo(): {
    officeTitle: string;
    address: string;
    phones: string[];
    email: string;
    workingHours: string;
  } {
    const country = this.getSelectedCountry();

    return {
      officeTitle: this.getLocalizedName(country),
      address: country?.officeAddress?.trim() || this.languageService.translate('contact.address'),
      phones: [country?.phone?.trim(), country?.phone2?.trim()].filter((value): value is string => Boolean(value)),
      email: country?.email?.trim() || this.languageService.translate('contact.emailFallback'),
      workingHours: country?.workingHours?.trim() || this.languageService.translate('contact.hoursValue')
    };
  }

  private getCountryTranslationKey(code: string): TranslationKey | null {
    const keyMap: Record<string, TranslationKey> = {
      KW: 'country.kuwait',
      OM: 'country.oman',
      TR: 'country.turkey',
      EG: 'country.egypt'
    };

    return keyMap[code] ?? null;
  }

  setSelectedCountryId(countryId: number): void {
    if (!countryId || countryId === this.selectedCountryIdSubject.value) {
      return;
    }

    this.selectedCountryIdSubject.next(countryId);
    localStorage.setItem(STORAGE_KEY, String(countryId));
  }

  private applyInitialSelection(countries: CatalogCountry[]): void {
    if (!countries.length) {
      return;
    }

    const storedId = this.readStoredCountryId();
    const storedCountry = storedId ? countries.find((country) => country.id === storedId) : undefined;

    if (storedCountry) {
      this.selectedCountryIdSubject.next(storedCountry.id);
      return;
    }

    const defaultCountry = countries.find((country) => country.isDefault) ?? countries[0];
    this.setSelectedCountryId(defaultCountry.id);
  }

  private mapCountry(country: ApiCountry): CatalogCountry {
    const currencyAr = country.currency_ar || country.currency || '';
    const currencyEn = (country.currency_en || country.currency || currencyAr).toUpperCase();
    const { nameAr, nameEn } = this.resolveCountryNames(country);

    return {
      id: Number(country.id || 0),
      name: nameAr || nameEn || 'بلد',
      nameAr,
      nameEn,
      code: country.country_code || '',
      currencyAr,
      currencyEn,
      isDefault: Boolean(country.isDefault),
      officeAddress: country.office_address?.trim() || '',
      phone: country.phone?.trim() || '',
      phone2: country.phone2?.trim() || '',
      email: country.email?.trim() || '',
      workingHours: country.working_hours?.trim() || ''
    };
  }

  private resolveCountryNames(country: ApiCountry): { nameAr: string; nameEn: string } {
    const rawAr = (country.nameAr || '').trim();
    let rawEn = (country.nameEn || '').trim();
    const legacy = (country.country_name || country.name || '').trim();

    if (!rawEn && legacy) {
      rawEn = legacy;
    }

    // Backend currently puts Arabic in nameEn and leaves nameAr empty.
    if (!rawAr && this.containsArabic(rawEn)) {
      return { nameAr: rawEn, nameEn: '' };
    }

    if (rawAr && this.containsArabic(rawEn) && rawAr === rawEn) {
      return { nameAr: rawAr, nameEn: '' };
    }

    return {
      nameAr: rawAr,
      nameEn: this.containsArabic(rawEn) ? '' : rawEn
    };
  }

  private containsArabic(value: string): boolean {
    return /[\u0600-\u06FF]/.test(value);
  }

  private readStoredCountryId(): number | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }
}
