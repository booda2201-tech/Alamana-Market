import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category, Product } from '../models/product.model';

interface ApiProduct {
  id?: string | number;
  productId?: string | number;
  nameAr?: string;
  nameEn?: string;
  name?: string;
  englishName?: string;
  category?: string | { id?: string | number; name?: string; description?: string };
  categoryId?: string;
  categoryName?: string;
  price?: number | string;
  oldPrice?: number | string;
  weight?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  isNew?: boolean;
  new?: boolean;
  isBestSeller?: boolean;
  hasOffer?: boolean;
  discount?: number | string;
  priceAfterDiscount?: number | string;
  specs?: Record<string, string>;
  gallery?: Array<{ imageUrl?: string; url?: string; path?: string }>;
  galleryUrls?: Array<{ imageUrl?: string; url?: string; path?: string; type?: string }>;
}

type ApiListResponse = ApiProduct[] | { data?: ApiProduct[]; items?: ApiProduct[] };
type ApiCategoryListResponse = ApiCategory[] | { data?: ApiCategory[]; items?: ApiCategory[] };

interface ApiCategory {
  id?: string | number;
  name?: string;
  imagePath?: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  private readonly baseUrl = 'https://api.alamanamarket.com/api/';
  private readonly productUrl = `${this.baseUrl}Product`;
  private readonly categoriesUrl = `${this.baseUrl}Categories/GetAllCategories`;
  private readonly apiOrigin = 'https://api.alamanamarket.com';

  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<ApiListResponse>(`${this.productUrl}/GetAllProducts`).pipe(
      map((response) => this.extractProducts(response)),
      map((products) => products.map((product) => this.mapProduct(product))),
      catchError(() => of([]))
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.http.get<ApiProduct>(`${this.productUrl}/GetProductById/${id}`).pipe(
      map((product) => this.mapProduct(product)),
      catchError(() => of(undefined))
    );
  }

  getBestSellers(take = 5): Observable<Product[]> {
    return this.http.get<ApiListResponse>(`${this.productUrl}/best-sellers?take=${take}`).pipe(
      map((response) => this.extractProducts(response)),
      map((products) => products.map((product) => this.mapProduct(product))),
      catchError(() => of([]))
    );
  }

  getRandomProducts(): Observable<Product[]> {
    return this.http.get<ApiListResponse>(`${this.productUrl}/GetRandomProducts`).pipe(
      map((response) => this.extractProducts(response)),
      map((products) => products.map((product) => this.mapProduct(product))),
      catchError(() => of([]))
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<ApiCategoryListResponse>(this.categoriesUrl).pipe(
      map((response) => this.extractCategories(response)),
      map((categoriesResponse) => {
        const categoryMap = new Map<string, Category>();

        categoriesResponse.forEach((category) => {
          const rawCategory = (category.name || '').trim();
          const categoryId = String(category.id ?? this.normalizeCategory(rawCategory));
          if (!categoryMap.has(categoryId)) {
            categoryMap.set(categoryId, {
              id: categoryId,
              name: rawCategory || categoryId,
              image: this.normalizeImageUrl(category.imagePath)
            });
          }
        });

        const categories = Array.from(categoryMap.values());
        return [{ id: 'all', name: 'جميع المنتجات' }, ...categories];
      }),
      catchError(() => of([{ id: 'all', name: 'جميع المنتجات' }]))
    );
  }

  private mapProduct(apiProduct: ApiProduct): Product {
    const id = String(apiProduct.id ?? apiProduct.productId ?? '');
    const category = this.getCategoryId(apiProduct);
    const nameAr = apiProduct.nameAr || apiProduct.name || 'منتج';
    const nameEn = apiProduct.nameEn || apiProduct.englishName || nameAr;

    const galleryImage =
      apiProduct.gallery?.[0]?.imageUrl ||
      apiProduct.gallery?.[0]?.url ||
      apiProduct.gallery?.[0]?.path ||
      apiProduct.galleryUrls?.[0]?.imageUrl ||
      apiProduct.galleryUrls?.[0]?.url ||
      apiProduct.galleryUrls?.[0]?.path;
    const productPrice = Number(apiProduct.price ?? apiProduct.priceAfterDiscount ?? 0);
    const oldPrice = apiProduct.oldPrice !== undefined ? Number(apiProduct.oldPrice) : Number(apiProduct.price ?? 0);
    const inferredOffer = Number(apiProduct.discount ?? 0) > 0 || oldPrice > productPrice;
    const hasOffer = apiProduct.hasOffer ?? inferredOffer;

    return {
      id,
      nameAr,
      nameEn,
      category,
      price: productPrice,
      oldPrice: hasOffer ? oldPrice : undefined,
      weight: apiProduct.weight || '',
      description: apiProduct.description || '',
      specs: apiProduct.specs || {},
      image: this.normalizeImageUrl(apiProduct.imageUrl || apiProduct.image || galleryImage) || 'assets/images/product-1.png',
      isNew: Boolean(apiProduct.isNew ?? apiProduct.new),
      isBestSeller: Boolean(apiProduct.isBestSeller),
      hasOffer
    };
  }

  private normalizeCategory(category?: string): Product['category'] {
    const value = (category || '').toLowerCase();
    if (value.includes('water') || value.includes('عزل')) return 'waterproofing';
    if (value.includes('seal') || value.includes('سيل') || value.includes('تسرب')) return 'sealants';
    if (value.includes('grout') || value.includes('تروي') || value.includes('جراوت')) return 'grouts';
    return 'adhesives';
  }

  private getCategoryName(apiProduct: ApiProduct): string {
    if (typeof apiProduct.category === 'object') {
      return apiProduct.category?.name || String(apiProduct.category?.id || '');
    }
    return apiProduct.categoryName || apiProduct.category || apiProduct.categoryId || '';
  }

  private getCategoryId(apiProduct: ApiProduct): string {
    if (typeof apiProduct.category === 'object') {
      const objectCategoryId = apiProduct.category?.id;
      if (objectCategoryId !== undefined && objectCategoryId !== null) {
        return String(objectCategoryId);
      }
      return this.normalizeCategory(apiProduct.category?.name);
    }

    if (apiProduct.categoryId) {
      return String(apiProduct.categoryId);
    }

    if (apiProduct.category && !Number.isNaN(Number(apiProduct.category))) {
      return String(apiProduct.category);
    }

    return this.normalizeCategory(this.getCategoryName(apiProduct));
  }

  private extractProducts(response: ApiListResponse): ApiProduct[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.items)) {
      return response.items;
    }

    return [];
  }

  private extractCategories(response: ApiCategoryListResponse): ApiCategory[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.items)) {
      return response.items;
    }

    return [];
  }

  private normalizeImageUrl(imagePath?: string): string {
    if (!imagePath) {
      return '';
    }

    const cleanedPath = imagePath.trim().replace(/^['"]|['"]$/g, '').replace(/\\/g, '/');
    if (!cleanedPath) {
      return '';
    }

    if (cleanedPath.startsWith('http://') || cleanedPath.startsWith('https://')) {
      return cleanedPath.replace('http://', 'https://');
    }

    if (cleanedPath.startsWith('//')) {
      return `https:${cleanedPath}`;
    }

    return cleanedPath.startsWith('/')
      ? `${this.apiOrigin}${cleanedPath}`
      : `${this.apiOrigin}/${cleanedPath}`;
  }
}
