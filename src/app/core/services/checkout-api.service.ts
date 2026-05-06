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
}

export interface PaymentMethodOption {
  id: number;
  name: string;
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
      map((response) =>
        this.mapLocationItems(response, ['country_name', 'nameAr', 'name', 'title'], ['countryId', 'id', 'locationId'])
      )
    );
  }

  getGovernoratesByCountry(countryId: number): Observable<LocationOption[]> {
    return this.http
      .get<ApiLocationResponse>(`${this.baseUrl}/Location/GetGovernoratesByCountryId/${countryId}`, this.getAuthOptions())
      .pipe(
        map((response) =>
          this.mapLocationItems(response, ['governorate_name', 'nameAr', 'name', 'title'], ['governorateId', 'id', 'locationId'])
        )
      );
  }

  getCitiesByGovernorate(governorateId: number): Observable<LocationOption[]> {
    return this.http
      .get<ApiLocationResponse>(`${this.baseUrl}/Location/GetCitiesByGovernorateId/${governorateId}`, this.getAuthOptions())
      .pipe(
        map((response) =>
          this.mapLocationItems(response, ['city_name', 'nameAr', 'name', 'title'], ['cityId', 'id', 'locationId'])
        )
      );
  }

  getDistrictsByCity(cityId: number): Observable<LocationOption[]> {
    return this.http
      .get<ApiLocationResponse>(`${this.baseUrl}/Location/GetDistrictsByCityId/${cityId}`, this.getAuthOptions())
      .pipe(
        map((response) =>
          this.mapLocationItems(response, ['district_name', 'nameAr', 'name', 'title'], ['districtId', 'id', 'locationId'])
        )
      );
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
    nameKeys: Array<keyof ApiLocationItem>,
    idKeys: Array<keyof ApiLocationItem>
  ): LocationOption[] {
    const rawItems = Array.isArray(response) ? response : response.data || response.items || [];
    return rawItems
      .map((item) => ({
        id: Number(this.pickFirstValue(item, idKeys) ?? 0),
        name: String(this.pickFirstValue(item, nameKeys) ?? '').trim()
      }))
      .filter((item) => item.id > 0 && item.name.length > 0);
  }

  private mapPaymentMethods(response: ApiLocationResponse): PaymentMethodOption[] {
    const rawItems = Array.isArray(response) ? response : response.data || response.items || [];
    return rawItems
      .map((item) => ({
        id: Number(item.id ?? item.locationId ?? 0),
        name: String(item.nameAr || item.name || item.title || '').trim()
      }))
      .filter((item) => item.id > 0 && item.name.length > 0);
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
