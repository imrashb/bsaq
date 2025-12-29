import type { ProductSortOption } from "@bsaq/types";
import { ProductSortOptions } from "@bsaq/types";
import { type Ref, type InjectionKey, provide, inject, ref } from "vue";
import { useStorage } from "@vueuse/core";

export interface FilterState {
  price: Ref<[number, number]>;
  abv: Ref<[number, number]>;
  categories: Ref<string[]>;
  search: Ref<string>;
  sortBy: Ref<ProductSortOption>;
  itemsPerPage: Ref<number>;
  page: Ref<number>;
}

// Utility type: keys of FilterState where value is Ref<[number, number]>
export type RangeFilterKeys = {
  [K in keyof FilterState]: FilterState[K] extends Ref<[number, number]>
    ? K
    : never;
}[keyof FilterState];

const FilterStateKey: InjectionKey<FilterState> = Symbol("FilterState");

export function useProvideFilters(): FilterState {
  const page = ref(1);
  const itemsPerPage = useStorage("bsaq-per-page", 20);
  const sortBy = useStorage<ProductSortOption>(
    "bsaq-sort-by",
    ProductSortOptions.ValueDesc
  );
  const search = ref("");
  const categories = ref<string[]>([]);
  const price = ref<[number, number]>([0, 200]);
  const abv = ref<[number, number]>([0, 100]);

  const state: FilterState = {
    price,
    abv,
    categories,
    search,
    sortBy,
    itemsPerPage,
    page,
  };

  provide(FilterStateKey, state);
  return state;
}

export function useInjectFilters() {
  const state = inject(FilterStateKey);
  if (!state) {
    throw new Error("useInjectFilters must be used within a useProvideFilters");
  }
  return state;
}
