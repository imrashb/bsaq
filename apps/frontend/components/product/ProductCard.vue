<template>
  <v-card
    :class="['h-100', 'd-flex', 'flex-column', 'transition-swing']"
    :variant="isList ? 'outlined' : 'elevated'"
    hover
  >
    <!-- List View Layout -->
    <div v-if="isList" class="d-flex flex-row align-center h-100">
      <v-avatar class="ma-3 pa-3" size="128" rounded="lg">
        <ProductImage :src="product.imageUrl || product.url" />
      </v-avatar>

      <div class="flex-grow-1 py-3 pr-3 d-flex flex-column">
        <div class="d-flex justify-space-between align-start">
          <div>
            <div class="text-h6 font-weight-bold text-truncate">
              {{ product.name }}
            </div>
            <div class="text-caption text-medium-emphasis mb-2">
              <v-icon size="x-small" color="secondary" class="mr-1">
                mdi-bottle-wine
              </v-icon>
              {{ product.category }} • {{ product.country }}
            </div>
          </div>
          <v-chip
            color="secondary"
            variant="flat"
            size="small"
            class="font-weight-bold elevation-2"
          >
            {{ (product.pureAlcoholPerDollar ?? 0).toFixed(2) }} ml/$
          </v-chip>
        </div>

        <v-divider class="my-2 border-opacity-25" />

        <div class="d-flex align-center mt-auto">
          <div class="mr-4">
            <div class="text-h6 font-weight-bold text-success">
              {{ formatPrice(product.currentPrice) }}
            </div>
            <div
              v-if="
                product.originalPrice &&
                product.originalPrice > product.currentPrice!
              "
              class="text-caption text-decoration-line-through text-disabled"
            >
              {{ formatPrice(product.originalPrice) }}
            </div>
          </div>

          <v-divider vertical class="mx-2" />

          <div class="text-caption text-medium-emphasis">
            <div>
              <strong class="text-white">{{ product.volumeMl }}</strong>
              {{ $t("common.ml") }}
            </div>
            <div>
              <strong class="text-white">{{ product.abv.toFixed(1) }}%</strong>
              {{ $t("common.abv") }}
            </div>
          </div>

          <v-spacer />

          <v-btn
            color="primary"
            variant="tonal"
            size="small"
            append-icon="mdi-open-in-new"
            :href="product.url"
            target="_blank"
          >
            {{ $t("common.viewAtSaq") }}
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Grid View Layout -->
    <template v-else>
      <div class="bg-surface-lighten-1 pa-4">
        <ProductImage :src="product.imageUrl || product.url" height="175">
          <div class="position-absolute top-0 right-0 pa-2">
            <v-chip
              color="secondary"
              variant="flat"
              size="small"
              class="font-weight-bold elevation-4"
            >
              {{ (product.pureAlcoholPerDollar ?? 0).toFixed(2) }}
              {{ $t("product.mlPerDollar") }}
            </v-chip>
          </div>
        </ProductImage>
      </div>

      <v-card-item class="pb-0">
        <v-card-title
          class="text-subtitle-1 font-weight-bold line-clamp-2"
          style="line-height: 1.25"
        >
          {{ product.name }}
        </v-card-title>
        <v-card-subtitle class="mt-1">
          {{ product.category }}
        </v-card-subtitle>
      </v-card-item>

      <v-card-text class="flex-grow-1 pt-3">
        <div class="d-flex justify-space-between align-end mb-3">
          <div>
            <span class="text-h5 font-weight-bold text-success">{{
              formatPrice(product.currentPrice)
            }}</span>
            <div
              v-if="
                product.originalPrice &&
                product.originalPrice > product.currentPrice!
              "
              class="text-caption text-decoration-line-through text-disabled ml-1"
            >
              {{ formatPrice(product.originalPrice) }}
            </div>
          </div>
        </div>

        <div
          class="d-flex justify-space-between text-caption text-medium-emphasis bg-surface-lighten-1 pa-2 rounded"
        >
          <span>{{ product.volumeMl }} {{ $t("common.ml") }}</span>
          <span>{{ product.abv.toFixed(1) }}% {{ $t("common.abv") }}</span>
          <span>{{ product.country }}</span>
        </div>
      </v-card-text>

      <v-divider class="border-opacity-10" />

      <v-card-actions>
        <v-btn
          block
          variant="text"
          color="primary"
          :href="product.url"
          target="_blank"
        >
          {{ $t("common.viewAtSaq") }}
          <v-icon end icon="mdi-arrow-right" size="small" />
        </v-btn>
      </v-card-actions>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import type { Product } from "@bsaq/types";
import ProductImage from "./ProductImage.vue";

defineProps<{
  product: Product;
  isList?: boolean;
}>();

const formatPrice = (price: number | null | undefined) => {
  if (price === null || price === undefined) return "";
  return `${price.toFixed(2)} $`;
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.bg-surface-lighten-1 {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
</style>
