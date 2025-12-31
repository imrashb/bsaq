<template>
  <v-card
    class="h-100 d-flex flex-column transition-swing"
    variant="elevated"
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

    <!-- Grid View Layout -->
    <div class="bg-surface-lighten-1 pa-4">
      <ProductImage :src="product.imageUrl || product.url" height="175" />
    </div>

    <v-card-item class="pb-0">
      <div class="mb-2">
        <ProductAlcoholMeter
          :value="product.pureAlcoholPerDollar ?? 0"
          :max="maxPureAlcoholPerDollar || 15"
        />
      </div>
      <v-card-title
        class="text-subtitle-1 font-weight-bold line-clamp-2"
        style="line-height: 1.25"
      >
        {{ product.name }}
      </v-card-title>
      <v-card-subtitle class="mt-1">
        {{ product.category }}
      </v-card-subtitle>

      <ProductRating
        :rating="product.reviewsAverageRating"
        :count="product.reviewsCountRating"
        size="x-small"
      />
    </v-card-item>

    <v-card-text class="flex-grow-1 pt-3">
      <div class="d-flex justify-space-between align-end mb-3">
        <ProductPrice
          :current-price="product.currentPrice"
          :original-price="product.originalPrice"
          original-price-class="ml-1"
        />
      </div>

      <div
        class="d-flex justify-space-between text-caption text-medium-emphasis bg-surface-lighten-1 pa-2 rounded"
      >
        <span>{{ product.volumeMl }} {{ $t("common.ml") }}</span>
        <ProductAbvMeter :value="product.abv" />
        <span>{{ product.country }}</span>
      </div>
    </v-card-text>

    <v-divider class="border-opacity-10" />

    <v-card-actions class="d-flex w-100">
      <ProductSaqLink :url="product.url" />
    </v-card-actions>
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
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.bg-surface-lighten-1 {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
.product-card-overlay :deep(.v-overlay__scrim) {
  backdrop-filter: blur(5px);
  background: rgba(var(--v-theme-surface), 0.7) !important;
}
</style>
