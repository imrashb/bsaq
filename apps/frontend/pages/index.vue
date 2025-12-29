<template>
  <v-container fluid class="pa-6">
    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-start align-md-center justify-space-between gap-4 mb-6"
    >
      <div>
        <h1 class="text-h3 font-weight-bold">
          {{ $t("home.title") }}
        </h1>
        <p class="text-body-1 text-medium-emphasis" style="max-width: 600px">
          {{ $t("home.subtitle") }}
        </p>
      </div>
    </div>

    <v-navigation-drawer
      v-model="drawer"
      :permanent="$vuetify.display.mdAndUp"
      :temporary="!$vuetify.display.mdAndUp"
      width="300"
      location="left"
      class="border-thin product-filters-drawer"
    >
      <ProductFilters
        :facets="facets"
        v-model="selectedCategories"
        v-model:priceRange="priceRange"
        v-model:abvRange="abvRange"
        @close="drawer = false"
      />
    </v-navigation-drawer>

    <v-row>
      <!-- Main Content -->
      <v-col cols="12">
        <!-- Toolbar -->
        <div class="mb-4">
          <ProductToolbar
            v-model:viewMode="viewMode"
            v-model:itemsPerPage="itemsPerPage"
            v-model:sortBy="sortBy"
            v-model:search="search"
            :total="total"
            @toggle-filters="drawer = !drawer"
          />
        </div>

        <!-- Product Grid -->
        <ProductGrid
          v-if="!pending && !error"
          :products="products"
          :view-mode="viewMode"
          :max-pure-alcohol-per-dollar="maxPureAlcoholPerDollar"
        />

        <!-- Loading / Error States -->
        <div
          v-else-if="pending"
          class="d-flex justify-center align-center py-12"
        >
          <v-progress-circular indeterminate color="primary" size="64" />
        </div>

        <div v-else class="text-center py-12">
          <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
          <div class="text-h6 text-error">
            {{ $t("home.error") }}
          </div>
          <v-btn color="primary" variant="text" class="mt-2" @click="refresh">
            {{ $t("common.retry") }}
          </v-btn>
        </div>

        <!-- Pagination -->
        <div class="mt-6 d-flex justify-center">
          <v-pagination
            v-model="page"
            :length="totalPages"
            :total-visible="7"
            rounded="circle"
          ></v-pagination>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useStorage, refDebounced } from "@vueuse/core";
import ProductGrid from "~/components/product/ProductGrid.vue";
import ProductToolbar from "~/components/product/ProductToolbar.vue";
import ProductFilters from "~/components/product/ProductFilters.vue";
import {
  ProductSortOptions,
  type GetProductsResponse,
  type ProductSortOption,
} from "@bsaq/types";
import { useProducts } from "~/composables/api/useProducts";

// State
const page = ref(1);
const itemsPerPage = useStorage("bsaq-per-page", 20);
const viewMode = useStorage<"grid" | "list">("bsaq-view-mode", "grid");
const sortBy = useStorage<ProductSortOption>(
  "bsaq-sort-by",
  ProductSortOptions.AlcoholDesc
);
const search = ref("");
const selectedCategories = ref<string[]>([]);
const priceRange = ref<[number, number]>([0, 200]);
const abvRange = ref<[number, number]>([0, 100]);

const drawer = ref(true); // Default open on desktop (controlled by permanent prop anyway), will be responsive

// Data Fetching
const rawQuery = computed(() => ({
  page: page.value,
  pageSize: itemsPerPage.value,
  sortBy: sortBy.value,
  search: search.value,
  categories: selectedCategories.value,
  minPrice: priceRange.value[0],
  maxPrice: priceRange.value[1],
  minAbv: abvRange.value[0],
  maxAbv: abvRange.value[1],
}));

const productsQuery = refDebounced(rawQuery, 500);

const { data: response, pending, error, refresh } = useProducts(productsQuery);

const products = computed(() => response.value?.data || []);
const total = computed(() => response.value?.meta?.total || 0);
const maxPureAlcoholPerDollar = computed(
  () => response.value?.meta?.maxPureAlcoholPerDollar || 15
);
const facets = computed(() => response.value?.meta?.facets || []);

const totalPages = computed(() => Math.ceil(total.value / itemsPerPage.value));

// Scroll to top on page change
watch(page, () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Reset page when filters change
watch(
  [itemsPerPage, sortBy, search, selectedCategories, priceRange, abvRange],
  () => {
    page.value = 1;
  }
);
</script>

<style scoped>
.sticky-top {
  position: sticky;
  z-index: 1;
}

/* Custom scrollbar for better look in small areas */
.product-filters-drawer
  :deep(.v-navigation-drawer__content::-webkit-scrollbar) {
  width: 6px;
}
.product-filters-drawer
  :deep(.v-navigation-drawer__content::-webkit-scrollbar-track) {
  background: transparent;
}
.product-filters-drawer
  :deep(.v-navigation-drawer__content::-webkit-scrollbar-thumb) {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
.product-filters-drawer
  :deep(.v-navigation-drawer__content::-webkit-scrollbar-thumb:hover) {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
