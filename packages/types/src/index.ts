export type ProductAttributes = {
  volumeMl: number;
  abv: number;
  category: string;
  country: string;
  isAvailableInStore: boolean;
  name: string;
};

export type Product = ProductAttributes & {
  sku: string;
  url: string;
  imageUrl: string | null;
  currentPrice: number | null;
  originalPrice: number | null;
  pureAlcoholMl: number | null;
  pureAlcoholPerDollar: number | null;
  pureAlcoholPerOriginalDollar: number | null;
};

export const ProductSortOptions = {
  PriceAsc: "price_asc",
  PriceDesc: "price_desc",
  AlcoholAsc: "alcohol_asc",
  AlcoholDesc: "alcohol_desc",
} as const;

export type ProductSortOption =
  (typeof ProductSortOptions)[keyof typeof ProductSortOptions];
