import { ResultOf } from "@graphql-typed-document-node/core";
import { PRODUCTS_QUERY } from "./config.js";

export type Mapper<T> = {
  name: string;
  key: keyof T;
  transform?: (value: string) => T[keyof T];
};

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
  currentPrice: number | null;
  originalPrice: number | null;
  pureAlcoholMl: number | null;
  pureAlcoholPerDollar: number | null;
  pureAlcoholPerOriginalDollar: number | null;
};

export type ProductSearchQuery = ResultOf<typeof PRODUCTS_QUERY>;
export type ProductSearchItem = NonNullable<
  NonNullable<ProductSearchQuery["productSearch"]["items"]>[number]
>;

export const extractCurrentPrice = (item: ProductSearchItem) => {
  return item.productView?.__typename === "SimpleProductView"
    ? item.productView?.price?.final?.amount?.value
    : item.productView?.priceRange?.maximum?.final?.amount?.value;
};

export const extractOriginalPrice = (item: ProductSearchItem) => {
  return item.productView?.__typename === "SimpleProductView"
    ? item.productView?.price?.regular?.amount?.value
    : item.productView?.priceRange?.maximum?.regular?.amount?.value;
};

export const calculatePureAlcoholMl = (attributes: ProductAttributes) => {
  return (attributes.abv * attributes.volumeMl) / 100;
};

export const calculatePureAlcoholPerDollar = (
  pureAlcoholMl: number,
  price: number | null | undefined,
) => {
  return pureAlcoholMl / (price || 1);
};

export const extractSku = (item: ProductSearchItem) => {
  return item.product.sku;
};

export const extractUrl = (item: ProductSearchItem) => {
  return item.productView?.url;
};
