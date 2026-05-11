import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

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

  constructor(private readonly http: HttpClient) {}

  getAdvertisements(): Observable<Advertisement[]> {
    return this.http.get<ApiAdvertisement[]>(`${this.baseUrl}/Advertisements/GetAllAdvertisements`).pipe(
      map((ads) =>
        (ads || []).map((ad) => ({
          id: Number(ad.id || 0),
          imageUrl: ad.imageUrl || 'assets/images/product-1.png',
          title: ad.title || '',
          description: ad.description || '',
          productIds: (ad.productIds || []).map((id) => String(id))
        }))
      )
    );
  }

  getAdvertisementById(id: string | number): Observable<Advertisement> {
    return this.http.get<ApiAdvertisement>(`${this.baseUrl}/Advertisements/GetAdvertisementById/${id}`).pipe(
      map((ad) => ({
        id: Number(ad.id || 0),
        imageUrl: ad.imageUrl || 'assets/images/product-1.png',
        title: ad.title || '',
        description: ad.description || '',
        productIds: (ad.productIds || []).map((productId) => String(productId))
      }))
    );
  }
}
