import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CountryService } from './country.service';

interface ApiAdvertisement {
  id?: number;
  imageUrl?: string;
  title?: string;
  description?: string;
  productIds?: Array<number | string>;
}

export interface Advertisement {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  productIds: string[];
}

@Injectable({ providedIn: 'root' })
export class AdvertisementsApiService {
  private readonly baseUrl = 'https://api.alamanamarket.com/api';

  constructor(
    private readonly http: HttpClient,
    private readonly countryService: CountryService
  ) {}

  getAdvertisements(): Observable<Advertisement[]> {
    return this.countryService.whenReady().pipe(
      switchMap((countryId) =>
        this.http
          .get<ApiAdvertisement[]>(`${this.baseUrl}/Advertisements/GetAllAdvertisements`, {
            params: { countryId: String(countryId) }
          })
          .pipe(map((ads) => this.mapAdvertisements(ads)))
      )
    );
  }

  getAdvertisementById(id: string | number): Observable<Advertisement> {
    return this.countryService.whenReady().pipe(
      switchMap((countryId) =>
        this.http
          .get<ApiAdvertisement>(`${this.baseUrl}/Advertisements/GetAdvertisementById/${id}`, {
            params: { countryId: String(countryId) }
          })
          .pipe(map((ad) => this.mapAdvertisement(ad)))
      )
    );
  }

  private mapAdvertisements(ads: ApiAdvertisement[] | null | undefined): Advertisement[] {
    return (ads || []).map((ad) => this.mapAdvertisement(ad));
  }

  private mapAdvertisement(ad: ApiAdvertisement): Advertisement {
    return {
      id: Number(ad.id || 0),
      imageUrl: ad.imageUrl || 'assets/images/product-1.png',
      title: ad.title || '',
      description: ad.description || '',
      productIds: (ad.productIds || []).map((productId) => String(productId))
    };
  }
}
