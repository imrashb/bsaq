import { type GetProductsResponse, type ProductSortOption } from "@bsaq/types";

export interface UseProductsParams {
  page: number;
  pageSize: number;
  sortBy: ProductSortOption;
  search: string;
  categories: string[];
  minPrice?: number;
  maxPrice?: number;
  minAbv?: number;
  maxAbv?: number;
}

export const useProducts = (
  params: Ref<UseProductsParams> | ComputedRef<UseProductsParams>
) => {
  return useFetch<GetProductsResponse>("/api/products", {
    query: computed(() => ({
      page: params.value.page,
      pageSize: params.value.pageSize,
      sort: params.value.sortBy,
      search: params.value.search,
      categories: params.value.categories,
      minPrice: params.value.minPrice,
      maxPrice: params.value.maxPrice,
      minAbv: params.value.minAbv,
      maxAbv: params.value.maxAbv,
    })),
  });
};
