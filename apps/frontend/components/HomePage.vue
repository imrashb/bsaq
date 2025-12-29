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
      <ProductFilters :facets="facets" @close="drawer = false" />
    </v-navigation-drawer>

    <v-row>
      <!-- Main Content -->
      <v-col cols="12">
        <!-- Toolbar -->
        <div class="mb-4">
          <ProductToolbar
            :view-mode="viewMode"
            :total="total"
            @update:view-mode="viewModePreference = $event"
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
import { useStorage } from "@vueuse/core";
import { useDisplay } from "vuetify";
import ProductGrid from "~/components/product/ProductGrid.vue";
import ProductToolbar from "~/components/product/ProductToolbar.vue";
import ProductFilters from "~/components/product/ProductFilters.vue";
import { useProducts } from "~/composables/api/useProducts";
import { useInjectFilters } from "~/composables/useFilters";

const { page, itemsPerPage } = useInjectFilters();

const viewModePreference = useStorage<"grid" | "list">(
  "bsaq-view-mode",
  "grid"
);
const drawer = ref(true);

const { mdAndUp } = useDisplay();
const viewMode = computed(() =>
  mdAndUp.value ? viewModePreference.value : "grid"
);

const { data: response, pending, error, refresh } = useProducts();

const products = computed(() => response.value?.data || []);
const total = computed(() => response.value?.meta?.total || 0);
const maxPureAlcoholPerDollar = computed(
  () => response.value?.meta?.maxPureAlcoholPerDollar || 15
);
const facets = computed(() => response.value?.meta?.facets || []);

const totalPages = computed(() => Math.ceil(total.value / itemsPerPage.value));

watch(page, () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
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
