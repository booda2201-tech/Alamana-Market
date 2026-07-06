export type ProductCategory = string;

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  category: ProductCategory;
  price: number;
  weight: string;
  description: string;
  descriptionAr?: string;
  descriptionEn?: string;
  specs: Record<string, string>;
  image: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  hasOffer?: boolean;
  oldPrice?: number;
  details?: ProductDetail[];
  galleryUrls?: string[];
  categoryName?: string;
  categoryNameAr?: string;
  categoryNameEn?: string;
  categoryDescription?: string;
  categoryDescriptionAr?: string;
  categoryDescriptionEn?: string;
  discount?: number;
  priceAfterDiscount?: number;
}

export interface ProductDetail {
  id: number;
  key: string;
  value: string;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  image?: string;
}
