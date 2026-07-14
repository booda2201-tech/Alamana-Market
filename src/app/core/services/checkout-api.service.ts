import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

interface ApiLocationItem {
  id?: number;
  locationId?: number;
  countryId?: number;
  governorateId?: number;
  cityId?: number;
  districtId?: number;
  name?: string;
  nameAr?: string;
  nameEn?: string;
  title?: string;
  country_name?: string;
  governorate_name?: string;
  city_name?: string;
  district_name?: string;
}

type ApiLocationResponse = ApiLocationItem[] | { data?: ApiLocationItem[]; items?: ApiLocationItem[] };

export interface LocationOption {
  id: number;
  name: string;
  nameAr: string;
  nameEn: string;
}

export interface PaymentMethodOption {
  id: number;
  name: string;
  nameAr: string;
  nameEn: string;
}

export interface CreateOrderPayload {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  countryId: number;
  governorateId: number;
  cityId: number;
  districtId: number;
  street: string;
  buildingNumber: string;
  floor: string;
  apartment: string;
  landmark: string;
  paymentMethodId: number;
}

@Injectable({ providedIn: 'root' })
export class CheckoutApiService {
  private readonly baseUrl = 'https://api.alamanamarket.com/api';

  constructor(private readonly http: HttpClient) {}

  getCountries(): Observable<LocationOption[]> {
    return this.http.get<ApiLocationResponse>(`${this.baseUrl}/Location/GetAllCountries`, this.getAuthOptions()).pipe(
      map((response) => this.mapLocationItems(response, ['countryId', 'id', 'locationId']))
    );
  }

  getGovernoratesByCountry(countryId: number): Observable<LocationOption[]> {
    return this.http
      .get<ApiLocationResponse>(`${this.baseUrl}/Location/GetGovernoratesByCountryId/${countryId}`, this.getAuthOptions())
      .pipe(map((response) => this.mapLocationItems(response, ['governorateId', 'id', 'locationId'])));
  }

  getCitiesByGovernorate(governorateId: number): Observable<LocationOption[]> {
    return this.http
      .get<ApiLocationResponse>(`${this.baseUrl}/Location/GetCitiesByGovernorateId/${governorateId}`, this.getAuthOptions())
      .pipe(map((response) => this.mapLocationItems(response, ['cityId', 'id', 'locationId'])));
  }

  getDistrictsByCity(cityId: number): Observable<LocationOption[]> {
    return this.http
      .get<ApiLocationResponse>(`${this.baseUrl}/Location/GetDistrictsByCityId/${cityId}`, this.getAuthOptions())
      .pipe(map((response) => this.mapLocationItems(response, ['districtId', 'id', 'locationId'])));
  }

  getPaymentMethods(): Observable<PaymentMethodOption[]> {
    return this.http
      .get<ApiLocationResponse>(`${this.baseUrl}/PaymentMethods/GetAllPaymentMethods`, this.getAuthOptions())
      .pipe(map((response) => this.mapPaymentMethods(response)));
  }

  createOrder(payload: CreateOrderPayload): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/Orders/CreateOrder`, payload, this.getAuthOptions());
  }

  private mapLocationItems(
    response: ApiLocationResponse,
    idKeys: Array<keyof ApiLocationItem>
  ): LocationOption[] {
    const rawItems = Array.isArray(response) ? response : response.data || response.items || [];
    return rawItems
      .map((item) => {
        const { nameAr, nameEn } = this.resolveNames(item);
        return {
          id: Number(this.pickFirstValue(item, idKeys) ?? 0),
          name: nameAr || nameEn,
          nameAr,
          nameEn
        };
      })
      .filter((item) => item.id > 0 && (item.nameAr.length > 0 || item.nameEn.length > 0));
  }

  private mapPaymentMethods(response: ApiLocationResponse): PaymentMethodOption[] {
    const rawItems = Array.isArray(response) ? response : response.data || response.items || [];
    return rawItems
      .map((item) => {
        const { nameAr, nameEn } = this.resolveNames(item);
        return {
          id: Number(item.id ?? item.locationId ?? 0),
          name: nameAr || nameEn,
          nameAr,
          nameEn
        };
      })
      .filter((item) => item.id > 0 && (item.nameAr.length > 0 || item.nameEn.length > 0));
  }

  private resolveNames(item: ApiLocationItem): { nameAr: string; nameEn: string } {
    const legacy =
      item.governorate_name ||
      item.city_name ||
      item.district_name ||
      item.country_name ||
      item.name ||
      item.title ||
      '';

    let nameAr = (item.nameAr || '').trim();
    let nameEn = (item.nameEn || '').trim();

    if (!nameAr && !nameEn && legacy.trim()) {
      const value = legacy.trim();
      if (this.containsArabic(value)) {
        nameAr = value;
      } else {
        nameEn = value;
      }
    }

    // Backend sometimes stores Arabic text in nameEn while nameAr is empty.
    if (!nameAr && this.containsArabic(nameEn)) {
      nameAr = nameEn;
      nameEn = '';
    }

    if (nameAr && this.containsArabic(nameEn) && nameAr === nameEn) {
      nameEn = '';
    }

    if (this.containsArabic(nameEn)) {
      nameEn = '';
    }

    return { nameAr, nameEn };
  }

  private containsArabic(value: string): boolean {
    return /[\u0600-\u06FF]/.test(value);
  }

  private pickFirstValue(item: ApiLocationItem, keys: Array<keyof ApiLocationItem>): string | number | undefined {
    for (const key of keys) {
      const value = item[key];
      if (typeof value === 'string' && value.trim().length > 0) {
        return value;
      }
      if (typeof value === 'number' && !Number.isNaN(value) && value > 0) {
        return value;
      }
    }
    return undefined;
  }

  private getAuthOptions(): { headers?: HttpHeaders } {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return {};
    }
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }
}
