export type ProductCategory = string;

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  category: ProductCategory;
  price: number;
  weight: string;
  description: string;
  specs: Record<string, string>;
  image: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  hasOffer?: boolean;
  oldPrice?: number;
}

export interface Category {
  id: string;
  name: string;
  image?: string;
}
