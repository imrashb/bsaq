<template>
  <div class="position-relative">
    <v-row v-if="loading && !products.length">
      <template v-if="viewMode === 'grid'">
        <v-col v-for="n in 24" :key="n" cols="12" sm="6" md="4" lg="3" xl="2">
          <v-skeleton-loader type="card" />
        </v-col>
      </template>
      <template v-else>
        <v-col v-for="n in 24" :key="n" cols="12" md="8" lg="6" class="mx-auto">
          <v-skeleton-loader type="list-item-avatar-three-line" />
        </v-col>
      </template>
    </v-row>

    <div v-else>
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
            :loading="loading"
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
            :loading="loading"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "@bsaq/types";
import ProductCard from "./ProductCard.vue";

defineProps<{
  products: Product[];
  viewMode: "grid" | "list";
  loading?: boolean;
  maxPureAlcoholPerDollar?: number;
}>();
</script>
