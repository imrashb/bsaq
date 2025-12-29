<template>
  <v-container class="py-8 d-flex flex-column gap-4">
    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-start align-md-center justify-space-between gap-4"
    >
      <div>
        <h1 class="text-h3 font-weight-bold text-gradient">
          {{ $t("home.title") }}
        </h1>
        <p class="text-body-1 text-medium-emphasis" style="max-width: 600px">
          {{ $t("home.subtitle") }}
        </p>
      </div>
    </div>

    <!-- Toolbar Section -->
    <ProductToolbar
      v-model:view-mode="viewMode"
      v-model:items-per-page="itemsPerPage"
      v-model:sort-by="sortBy"
      v-model:search="search"
      :total="total"
    />

    <!-- Content Section -->
    <v-fade-transition mode="out-in">
      <!-- Loading State -->
      <v-row v-if="pending" key="loading">
        <v-col
          v-for="n in itemsPerPage"
          :key="n"
          cols="12"
          :sm="viewMode === 'grid' ? 6 : 12"
          :md="viewMode === 'grid' ? 4 : 8"
          :lg="viewMode === 'grid' ? 3 : 6"
          :class="{ 'mx-auto': viewMode === 'list' }"
        >
          <v-skeleton-loader
            :type="
              viewMode === 'grid'
                ? 'card, article'
                : 'list-item-avatar-three-line'
            "
          />
        </v-col>
      </v-row>

      <!-- Error State -->
      <v-alert
        v-else-if="error"
        key="error"
        type="error"
        variant="tonal"
        border="start"
        class="mb-5"
      >
        <template #title>
          {{ $t("errors.loading") }}
        </template>
        {{ error.message }}
        <template #append>
          <v-btn
            color="error"
            variant="outlined"
            size="small"
            @click="refresh()"
          >
            {{ $t("common.retry") }}
          </v-btn>
        </template>
      </v-alert>

      <!-- Products State -->
      <div v-else key="content" class="d-flex flex-column gap-4">
        <ProductGrid
          :products="products"
          :is-list="viewMode === 'list'"
          :max-pure-alcohol-per-dollar="maxPureAlcoholPerDollar"
        />

        <!-- Pagination -->
        <v-pagination
          v-if="total > 0"
          v-model="page"
          :length="totalPages"
          :total-visible="7"
          color="primary"
          rounded="circle"
          elevation="2"
        />
      </div>
    </v-fade-transition>
  </v-container>
</template>

<script setup lang="ts">
import type { Product } from "@bsaq/types";
import { useStorage } from "@vueuse/core";
import ViewToggle from "~/components/common/ViewToggle.vue";
import ProductGrid from "~/components/product/ProductGrid.vue";
import ProductToolbar from "~/components/product/ProductToolbar.vue";

// State
const page = ref(1);
const itemsPerPage = useStorage("bsaq-per-page", 20);
const viewMode = ref<"grid" | "list">("grid");
const sortBy = useStorage("bsaq-sort-by", "alcohol_desc");
const search = ref("");
const searchDebounced = refDebounced(search, 500);

// Data Fetching
const {
  data: response,
  pending,
  error,
  refresh,
} = await useFetch<{
  data: Product[];
  meta: { total: number; maxPureAlcoholPerDollar: number };
}>("/api/products", {
  query: {
    page,
    pageSize: itemsPerPage,
    sort: sortBy,
    search: searchDebounced,
  },
  watch: [page, itemsPerPage, sortBy, searchDebounced], // Auto-refetch when these change
});

const products = computed(() => response.value?.data || []);
const total = computed(() => response.value?.meta?.total || 0);
const maxPureAlcoholPerDollar = computed(
  () => response.value?.meta?.maxPureAlcoholPerDollar || 15
);
const totalPages = computed(() => Math.ceil(total.value / itemsPerPage.value));

// Scroll to top on page change
watch(page, () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Reset page when filters change
watch([itemsPerPage, sortBy, searchDebounced], () => {
  page.value = 1;
});
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.bg-surface-lighten-1 {
  background-color: rgb(var(--v-theme-surface));
}
.gap-4 {
  gap: 16px;
}
:deep(.nav-select .v-field__input) {
  padding-top: 0;
  padding-bottom: 0;
  min-height: 32px;
}
</style>
