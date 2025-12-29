import { ResultOf } from "@graphql-typed-document-node/core";
import { PRODUCTS_QUERY } from "./config.js";

import type { Product, ProductAttributes } from "@bsaq/types";

export type Mapper<T> = {
  name: string;
  key: keyof T;
  transform?: (value: string) => T[keyof T];
};

export type { Product, ProductAttributes };

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

export const extractImageUrl = (item: ProductSearchItem) => {
  return (
    item.product?.small_image?.url ||
    item.product?.thumbnail?.url ||
    item.productView?.images?.find(
      (img) =>
        img?.roles?.includes("small_image") ||
        img?.roles?.includes("thumbnail"),
    )?.url ||
    item.productView?.images?.[0]?.url
  );
};
