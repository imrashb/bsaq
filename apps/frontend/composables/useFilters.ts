import type { ProductSortOption } from "@bsaq/types";
import { ProductSortOptions } from "@bsaq/types";
import { type Ref, type InjectionKey, provide, inject, ref } from "vue";
import { useStorage } from "@vueuse/core";

// Define the raw values type
export interface FilterValues {
  price: [number, number];
  abv: [number, number];
  value: [number, number];
  categories: string[];
  search: string;
  sortBy: ProductSortOption;
  itemsPerPage: number;
  page: number;
}

// Define the state interface with Refs
export type FilterState = {
  [K in keyof FilterValues]: Ref<FilterValues[K]>;
} & {
  resetFilter: (key: keyof FilterValues) => void;
  isDefault: (key: keyof FilterValues) => boolean;
};

// Utility type for range keys
export type RangeFilterKeys = {
  [K in keyof FilterValues]: FilterValues[K] extends [number, number]
    ? K
    : never;
}[keyof FilterValues];

const FilterStateKey: InjectionKey<FilterState> = Symbol("FilterState");

// Default range values
export const DEFAULT_PRICE_MAX = 200;
export const DEFAULT_ABV_MAX = 100;
export const DEFAULT_VALUE_MAX = 100;

export const DEFAULT_RANGE_MIN = 0;

const DEFAULTS: FilterValues = {
  page: 1,
  itemsPerPage: 20,
  sortBy: ProductSortOptions.ValueDesc,
  search: "",
  categories: [],
  price: [DEFAULT_RANGE_MIN, DEFAULT_PRICE_MAX],
  abv: [DEFAULT_RANGE_MIN, DEFAULT_ABV_MAX],
  value: [DEFAULT_RANGE_MIN, DEFAULT_VALUE_MAX],
};

export function useProvideFilters(): FilterState {
  // Initialize state refs
  const stateRefs: { [K in keyof FilterValues]: Ref<FilterValues[K]> } = {
    page: ref(DEFAULTS.page),
    itemsPerPage: useStorage("bsaq-per-page", DEFAULTS.itemsPerPage),
    sortBy: useStorage<ProductSortOption>("bsaq-sort-by", DEFAULTS.sortBy),
    search: ref(DEFAULTS.search),
    categories: ref<string[]>([...DEFAULTS.categories]),
    price: ref<[number, number]>([...DEFAULTS.price]),
    abv: ref<[number, number]>([...DEFAULTS.abv]),
    value: ref<[number, number]>([...DEFAULTS.value]),
  };

  const resetFilter = <K extends keyof FilterValues>(key: K) => {
    const defaultValue = DEFAULTS[key];
    const ref = stateRefs[key];

    if (Array.isArray(defaultValue)) {
      // @ts-expect-error - Tuple vs Array assignment issue, safe to assign spread
      ref.value = [...defaultValue];
    } else {
      ref.value = defaultValue;
    }
  };

  const isDefault = <K extends keyof FilterValues>(key: K) => {
    const defaultValue = DEFAULTS[key];
    const currentValue = stateRefs[key].value;

    if (Array.isArray(defaultValue) && Array.isArray(currentValue)) {
      if (defaultValue.length !== currentValue.length) return false;
      return defaultValue.every((val, index) => val === currentValue[index]);
    }
    return defaultValue === currentValue;
  };

  const state: FilterState = {
    ...stateRefs,
    resetFilter,
    isDefault,
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
