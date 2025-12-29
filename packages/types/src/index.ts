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
