import type { Product, Facet } from "../domain/product.js";

export interface GetProductsMeta {
  page: number;
  pageSize: number;
  total: number;
  maxPureAlcoholPerDollar: number;
  facets: Facet[];
}

export interface GetProductsResponse {
  data: Product[];
  meta: GetProductsMeta;
}

export interface GetProductsQuery {
  page?: number;
  pageSize?: number;
  sort?: string;
  search?: string;
  categories?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  minAbv?: number;
  maxAbv?: number;
}
