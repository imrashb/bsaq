<template>
  <v-card
    class="h-100 d-flex flex-column transition-swing"
    variant="outlined"
    hover
    style="cursor: default !important"
  >
    <v-overlay
      :model-value="loading"
      contained
      class="align-center justify-center product-card-overlay"
      persistent
      no-click-animation
      z-index="2"
    >
      <v-progress-circular indeterminate color="primary" size="32" />
    </v-overlay>

    <!-- List View Layout -->
    <div class="d-flex flex-row align-center h-100">
      <v-avatar class="ma-3 pa-3" size="128" rounded="lg">
        <ProductImage :src="product.imageUrl || product.url" />
      </v-avatar>

      <div class="flex-grow-1 py-3 pr-3 d-flex flex-column">
        <div class="d-flex justify-space-between align-start">
          <div class="flex-grow-1 mr-4">
            <div class="d-flex align-center justify-space-between w-100 mb-1">
              <div class="text-h6 font-weight-bold text-truncate">
                {{ product.name }}
              </div>
              <ProductAlcoholMeter
                :value="product.pureAlcoholPerDollar ?? 0"
                :max="maxPureAlcoholPerDollar || 15"
              />
            </div>
            <div class="text-caption text-medium-emphasis mb-2">
              <v-icon color="secondary"> mdi-bottle-wine </v-icon>
              {{ product.category }} • {{ product.country }}
            </div>

            <ProductRating
              :rating="product.reviewsAverageRating"
              :count="product.reviewsCountRating"
              size="small"
            />
          </div>
        </div>

        <v-divider class="my-2 border-opacity-25" />

        <div class="d-flex align-center mt-auto">
          <div class="mr-4">
            <ProductPrice
              :current-price="product.currentPrice"
              :original-price="product.originalPrice"
            />
          </div>

          <v-divider vertical class="mx-2" />

          <div class="text-caption text-medium-emphasis">
            <div>
              <strong class="text-white">{{ product.volumeMl }}</strong>
              {{ $t("common.ml") }}
            </div>
            <ProductAbvMeter :value="product.abv" />
          </div>

          <v-spacer />

          <div style="min-width: 140px">
            <ProductSaqLink :url="product.url" />
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { Product } from "@bsaq/types";
import ProductImage from "./ProductImage.vue";
import ProductAlcoholMeter from "./ProductAlcoholMeter.vue";
import ProductAbvMeter from "./ProductAbvMeter.vue";
import ProductPrice from "./ProductPrice.vue";
import ProductRating from "./ProductRating.vue";
import ProductSaqLink from "./ProductSaqLink.vue";

defineProps<{
  product: Product;
  maxPureAlcoholPerDollar?: number;
  loading?: boolean;
}>();
</script>

<style scoped>
.product-card-overlay :deep(.v-overlay__scrim) {
  backdrop-filter: blur(5px);
  background: rgba(var(--v-theme-surface), 0.7) !important;
}
</style>
