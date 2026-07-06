import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Category, Product } from '../models/product.model';
import { CountryService } from './country.service';
import { LanguageService } from './language.service';

interface ApiProduct {
  id?: string | number;
  productId?: string | number;
  nameAr?: string;
  nameEn?: string;
  name?: string;
  englishName?: string;
  category?: string | ApiProductCategory;
  categoryId?: string;
  categoryName?: string;
  price?: number | string;
  oldPrice?: number | string;
  weight?: string;
  description?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  image?: string;
  imageUrl?: string;
  isNew?: boolean;
  new?: boolean;
  isBestSeller?: boolean;
  hasOffer?: boolean;
  discount?: number | string;
  priceAfterDiscount?: number | string;
  specs?: Record<string, string>;
  details?: Array<{ id?: number; key?: string; value?: string; sortOrder?: number }>;
  gallery?: Array<{ imageUrl?: string; url?: string; path?: string; Url?: string }>;
  galleryUrls?: Array<{ imageUrl?: string; url?: string; path?: string; Url?: string; type?: string }>;
}

interface ApiProductCategory {
  id?: string | number;
  name?: string;
  nameAr?: string;
  nameEn?: string;
  description?: string;
  descriptionAr?: string;
  descriptionEn?: string;
}

type ApiListResponse = ApiProduct[] | { data?: ApiProduct[]; items?: ApiProduct[] };
type ApiCategoryListResponse = ApiCategory[] | { data?: ApiCategory[]; items?: ApiCategory[] };

interface ApiCategory {
  id?: string | number;
  name?: string;
  nameAr?: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  imagePath?: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  private readonly baseUrl = 'https://api.alamanamarket.com/api/';
  private readonly productUrl = `${this.baseUrl}Product`;
  private readonly categoriesUrl = `${this.baseUrl}Categories/GetAllCategories`;
  private readonly apiOrigin = 'https://api.alamanamarket.com';

  constructor(
    private readonly http: HttpClient,
    private readonly countryService: CountryService,
    private readonly languageService: LanguageService
  ) {}

  getProducts(categoryId?: string): Observable<Product[]> {
    return this.withCountryId((countryId) => {
      const params: Record<string, string> = { countryId: String(countryId) };
      if (categoryId && categoryId !== 'all') {
        params['categoryId'] = categoryId;
      }

      return this.http.get<ApiListResponse>(`${this.productUrl}/GetAllProducts`, { params }).pipe(
        map((response) => this.extractProducts(response)),
        map((products) => products.map((product) => this.mapProduct(product))),
        catchError(() => of([]))
      );
    });
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.withCountryId((countryId) =>
      this.http
        .get<ApiProduct>(`${this.productUrl}/GetProductById/${id}`, {
          params: { countryId: String(countryId) }
        })
        .pipe(
          map((product) => this.mapProduct(product)),
          catchError(() => of(undefined))
        )
    );
  }

  getBestSellers(take = 5): Observable<Product[]> {
    return this.withCountryId((countryId) =>
      this.http
        .get<ApiListResponse>(`${this.productUrl}/best-sellers`, {
          params: { countryId: String(countryId), take: String(take) }
        })
        .pipe(
          map((response) => this.extractProducts(response)),
          map((products) => products.map((product) => this.mapProduct(product))),
          catchError(() => of([]))
        )
    );
  }

  getRandomProducts(): Observable<Product[]> {
    return this.withCountryId((countryId) =>
      this.http
        .get<ApiListResponse>(`${this.productUrl}/GetRandomProducts`, {
          params: { countryId: String(countryId) }
        })
        .pipe(
          map((response) => this.extractProducts(response)),
          map((products) => products.map((product) => this.mapProduct(product))),
          catchError(() => of([]))
        )
    );
  }

  getHeroProduct(): Observable<Product | undefined> {
    return this.withCountryId((countryId) =>
      this.http
        .get<ApiProduct>(`${this.productUrl}/hero`, {
          params: { countryId: String(countryId) }
        })
        .pipe(
          map((product) => (product ? this.mapProduct(product) : undefined)),
          catchError(() => of(undefined))
        )
    );
  }

  getCategories(): Observable<Category[]> {
    return this.withCountryId((countryId) =>
      this.http
        .get<ApiCategoryListResponse>(this.categoriesUrl, {
          params: { countryId: String(countryId) }
        })
        .pipe(
          map((response) => this.extractCategories(response)),
          map((categoriesResponse) => {
            const categoryMap = new Map<string, Category>();

            categoriesResponse.forEach((category) => {
              const categoryId = String(category.id ?? '');
              const nameAr = category.nameAr || category.name || '';
              const nameEn = category.nameEn || category.nameAr || category.name || '';
              if (!categoryId || categoryMap.has(categoryId)) {
                return;
              }

              categoryMap.set(categoryId, {
                id: categoryId,
                nameAr,
                nameEn,
                name: this.pickLocalizedText(nameAr, nameEn, category.name) || categoryId,
                image: this.normalizeImageUrl(category.imagePath)
              });
            });

            const categories = Array.from(categoryMap.values());
            return [
              {
                id: 'all',
                nameAr: 'جميع المنتجات',
                nameEn: 'All Products',
                name: this.pickLocalizedText('جميع المنتجات', 'All Products')
              },
              ...categories
            ];
          }),
          catchError(() => of([
            {
              id: 'all',
              nameAr: 'جميع المنتجات',
              nameEn: 'All Products',
              name: this.pickLocalizedText('جميع المنتجات', 'All Products')
            }
          ]))
        )
    );
  }

  private withCountryId<T>(project: (countryId: number) => Observable<T>): Observable<T> {
    return this.countryService.whenReady().pipe(switchMap((countryId) => project(countryId)));
  }

  private mapProduct(apiProduct: ApiProduct): Product {
    const id = String(apiProduct.id ?? apiProduct.productId ?? '');
    const category = this.getCategoryId(apiProduct);
    const nameAr = apiProduct.nameAr || apiProduct.name || '';
    const nameEn = apiProduct.nameEn || apiProduct.englishName || nameAr;
    const descriptionAr = apiProduct.descriptionAr || apiProduct.description || '';
    const descriptionEn = apiProduct.descriptionEn || '';
    const description = this.pickLocalizedText(descriptionAr, descriptionEn);
    const categoryInfo = typeof apiProduct.category === 'object' ? apiProduct.category : undefined;
    const categoryNameAr = categoryInfo?.nameAr || categoryInfo?.name || '';
    const categoryNameEn = categoryInfo?.nameEn || categoryNameAr;
    const categoryName = categoryInfo
      ? this.pickLocalizedText(categoryNameAr, categoryNameEn, categoryInfo.name)
      : this.getCategoryName(apiProduct);
    const categoryDescriptionAr = categoryInfo
      ? (categoryInfo.descriptionAr || categoryInfo.description || categoryInfo.nameAr || categoryInfo.name || '')
      : '';
    const categoryDescriptionEn = categoryInfo
      ? (categoryInfo.descriptionEn || categoryInfo.nameEn || categoryDescriptionAr)
      : '';
    const categoryDescription = categoryInfo
      ? this.pickLocalizedText(categoryDescriptionAr, categoryDescriptionEn, categoryInfo.description)
        || this.pickLocalizedText(categoryNameAr, categoryNameEn, categoryInfo.name)
      : '';

    const galleryImage =
      apiProduct.gallery?.[0]?.imageUrl ||
      apiProduct.gallery?.[0]?.url ||
      apiProduct.gallery?.[0]?.path ||
      apiProduct.gallery?.[0]?.Url ||
      apiProduct.galleryUrls?.[0]?.imageUrl ||
      apiProduct.galleryUrls?.[0]?.url ||
      apiProduct.galleryUrls?.[0]?.path ||
      apiProduct.galleryUrls?.[0]?.Url;
    const originalPrice = Number(apiProduct.price ?? 0);
    const discountedPrice = Number(apiProduct.priceAfterDiscount ?? 0);
    const discount = Number(apiProduct.discount ?? 0);
    const hasDiscountPrice = discountedPrice > 0 && discountedPrice < originalPrice;
    const productPrice = hasDiscountPrice ? discountedPrice : originalPrice;
    const oldPrice = apiProduct.oldPrice !== undefined ? Number(apiProduct.oldPrice) : originalPrice;
    const inferredOffer = discount > 0 || oldPrice > productPrice;
    const hasOffer = apiProduct.hasOffer ?? inferredOffer;
    const galleryUrls = this.getGalleryUrls(apiProduct);

    return {
      id,
      nameAr: nameAr || 'منتج',
      nameEn,
      category,
      price: productPrice,
      oldPrice: hasOffer ? oldPrice : undefined,
      weight: apiProduct.weight || '',
      description,
      descriptionAr,
      descriptionEn,
      specs: apiProduct.specs || {},
      image: this.normalizeImageUrl(apiProduct.imageUrl || apiProduct.image || galleryImage) || 'assets/images/product-1.png',
      isNew: Boolean(apiProduct.isNew ?? apiProduct.new),
      isBestSeller: Boolean(apiProduct.isBestSeller),
      hasOffer,
      details: (apiProduct.details || [])
        .map((detail) => ({
          id: Number(detail.id || 0),
          key: detail.key || '',
          value: detail.value || '',
          sortOrder: Number(detail.sortOrder || 0)
        }))
        .filter((detail) => detail.key.trim() && detail.value.trim())
        .sort((a, b) => a.sortOrder - b.sortOrder),
      galleryUrls: galleryUrls.length ? galleryUrls : [this.normalizeImageUrl(apiProduct.imageUrl || apiProduct.image || galleryImage) || 'assets/images/product-1.png'],
      categoryName,
      categoryNameAr: categoryNameAr || categoryName,
      categoryNameEn: categoryNameEn || categoryName,
      categoryDescription,
      categoryDescriptionAr,
      categoryDescriptionEn,
      discount,
      priceAfterDiscount: discountedPrice
    };
  }

  private getGalleryUrls(apiProduct: ApiProduct): string[] {
    const gallery = [
      ...(apiProduct.gallery || []).map((item) => item.imageUrl || item.url || item.path || item.Url),
      ...(apiProduct.galleryUrls || []).map((item) => item.imageUrl || item.url || item.path || item.Url)
    ];

    return gallery
      .map((url) => this.normalizeImageUrl(url))
      .filter((url): url is string => Boolean(url));
  }

  private normalizeCategory(category?: string): Product['category'] {
    const value = (category || '').toLowerCase();
    if (value.includes('water') || value.includes('عزل')) return 'waterproofing';
    if (value.includes('seal') || value.includes('سيل') || value.includes('تسرب')) return 'sealants';
    if (value.includes('grout') || value.includes('تروي') || value.includes('جراوت')) return 'grouts';
    return 'adhesives';
  }

  private getCategoryName(apiProduct: ApiProduct): string {
    if (typeof apiProduct.category === 'object' && apiProduct.category) {
      return this.pickLocalizedText(
        apiProduct.category.nameAr,
        apiProduct.category.nameEn,
        apiProduct.category.name
      ) || String(apiProduct.category.id || '');
    }

    return apiProduct.categoryName || (typeof apiProduct.category === 'string' ? apiProduct.category : '') || apiProduct.categoryId || '';
  }

  private pickLocalizedText(arabic?: string, english?: string, fallback?: string): string {
    return this.languageService.pickLocalized(arabic, english, fallback);
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
