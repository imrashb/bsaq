<template>
  <div>
    <!-- Grid View -->
    <v-row v-if="viewMode === 'grid'">
      <v-col
        v-for="product in products"
        :key="product.sku"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <ProductCard
          :product="product"
          :is-list="false"
          :max-pure-alcohol-per-dollar="maxPureAlcoholPerDollar"
        />
      </v-col>
    </v-row>

    <!-- List View -->
    <v-row v-else>
      <v-col
        v-for="product in products"
        :key="product.sku"
        cols="12"
        md="8"
        lg="6"
        class="mx-auto"
      >
        <ProductCard
          :product="product"
          :is-list="true"
          :max-pure-alcohol-per-dollar="maxPureAlcoholPerDollar"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "@bsaq/types";
import ProductCard from "./ProductCard.vue";

defineProps<{
  products: Product[];
  viewMode: "grid" | "list";
  maxPureAlcoholPerDollar?: number;
}>();
</script>
