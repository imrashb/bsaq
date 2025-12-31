<template>
  <ProductCardList
    v-if="isList"
    :product="product"
    :max-pure-alcohol-per-dollar="maxPureAlcoholPerDollar"
    :loading="loading"
  />
  <ProductCardGrid
    v-else
    :product="product"
    :max-pure-alcohol-per-dollar="maxPureAlcoholPerDollar"
    :loading="loading"
  />
</template>

<script setup lang="ts">
import type { Product } from "@bsaq/types";
import ProductCardList from "./ProductCardList.vue";
import ProductCardGrid from "./ProductCardGrid.vue";

defineProps<{
  product: Product;
  isList?: boolean;
  maxPureAlcoholPerDollar?: number;
  loading?: boolean;
}>();
</script>
