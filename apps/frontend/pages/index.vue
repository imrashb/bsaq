<template>
  <v-container class="py-8">
    <!-- Header Section -->
    <div
      class="d-flex flex-column flex-md-row align-start align-md-center justify-space-between mb-8 gap-4"
    >
      <div>
        <h1 class="text-h3 font-weight-bold text-gradient mb-2">
          {{ $t("home.title") }}
        </h1>
        <p
          class="text-body-1 text-medium-emphasis"
          style="max-width: 600px"
        >
          {{ $t("home.subtitle") }}
        </p>
      </div>

      <div
        class="d-flex align-center gap-4 bg-surface-lighten-1 pa-2 rounded-lg elevation-1"
      >
        <ViewToggle v-model="viewMode" />
        <v-divider
          vertical
          class="mx-2"
        />
        <v-select
          v-model="itemsPerPage"
          :items="[10, 20, 50, 100]"
          :label="$t('common.perPage')"
          hide-details
          density="compact"
          variant="plain"
          class="nav-select"
          style="min-width: 100px"
        />
      </div>
    </div>

    <!-- Content Section -->
    <v-fade-transition mode="out-in">
      <!-- Loading State -->
      <v-row
        v-if="pending"
        key="loading"
      >
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
      <div
        v-else
        key="content"
      >
        <ProductGrid
          :products="products"
          :is-list="viewMode === 'list'"
        />

        <!-- Pagination -->
        <div class="d-flex justify-center mt-8">
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
      </div>
    </v-fade-transition>
  </v-container>
</template>

<script setup lang="ts">
import type { Product } from "@bsaq/types";
import { useStorage } from "@vueuse/core";
import ViewToggle from "~/components/common/ViewToggle.vue";
import ProductGrid from "~/components/product/ProductGrid.vue";

// State
const page = ref(1);
const itemsPerPage = useStorage("bsaq-per-page", 20);
const viewMode = useStorage<"grid" | "list">("bsaq-view-mode", "grid");

// Data Fetching
const {
  data: response,
  pending,
  error,
  refresh,
} = await useFetch<{ data: Product[]; meta: { total: number } }>(
  "/api/products",
  {
    query: {
      page,
      pageSize: itemsPerPage,
    },
    watch: [page, itemsPerPage], // Auto-refetch when these change
  }
);

const products = computed(() => response.value?.data || []);
const total = computed(() => response.value?.meta?.total || 0);
const totalPages = computed(() => Math.ceil(total.value / itemsPerPage.value));

// Scroll to top on page change
watch(page, () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
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
