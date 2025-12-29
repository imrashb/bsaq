import { type GetProductsResponse } from "@bsaq/types";
import { computed, watch } from "vue";
import { useInjectFilters } from "~/composables/useFilters";
import { refDebounced } from "@vueuse/core";

export const useProducts = () => {
  const filterState = useInjectFilters();
  const { page } = filterState;

  const { search, sortBy, itemsPerPage, categories, price, abv } = filterState;

  const debouncedQuery = refDebounced(
    computed(() => ({
      pageSize: itemsPerPage.value,
      sortBy: sortBy.value,
      search: search.value,
      categories: categories.value,
      minPrice: price.value[0],
      maxPrice: price.value[1],
      minAbv: abv.value[0],
      maxAbv: abv.value[1],
    })),
    500
  );

  watch(
    debouncedQuery,
    () => {
      if (page.value !== 1) {
        page.value = 1;
      }
    },
    { deep: true, flush: "sync" }
  );

  const queryParams = computed(() => ({
    ...debouncedQuery.value,
    page: page.value,
  }));

  return useFetch<GetProductsResponse>("/api/products", {
    query: queryParams,
  });
};
