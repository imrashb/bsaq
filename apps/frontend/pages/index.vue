<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center my-5">
        <h1 class="text-h3 font-weight-bold text-primary mb-2">
          Best Value Alcohol
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Find the most alcohol for your money at SAQ
        </p>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="pending">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-alert
      v-else-if="error"
      type="error"
      title="Error loading products"
      :text="error.message"
      class="mb-5"
    ></v-alert>

    <!-- Product Grid -->
    <v-row v-else>
      <v-col
        v-for="product in products"
        :key="product.sku"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="h-100 d-flex flex-column" hover border>
          <v-img
            :src="product.url"
            height="200"
            cover
            class="bg-grey-lighten-2"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey-lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
            <!-- Fallback if URL is not an image (since URL is likely product page URL) -->
            <div
              v-if="!product.imageUrl"
              class="d-flex align-center justify-center fill-height bg-grey-darken-3 text-h5 text-grey"
            >
              No Image
            </div>
          </v-img>

          <v-card-item>
            <v-card-title class="text-subtitle-1 font-weight-bold text-wrap">
              {{ product.name }}
            </v-card-title>
            <v-card-subtitle>
              {{ product.category }} | {{ product.country }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text class="flex-grow-1">
            <div class="d-flex justify-space-between align-center mb-2">
              <span class="text-h6 text-success font-weight-bold"
                >${{ product.currentPrice }}</span
              >
              <span
                v-if="
                  product.originalPrice &&
                  product.originalPrice > product.currentPrice
                "
                class="text-caption text-decoration-line-through text-grey"
              >
                ${{ product.originalPrice }}
              </span>
            </div>

            <v-chip color="secondary" size="small" class="font-weight-bold">
              {{ (product.pureAlcoholPerDollar ?? 0).toFixed(2) }} ml/$
            </v-chip>
            <div class="text-caption mt-2">
              {{ product.volumeMl }}ml • {{ (product.abv * 100).toFixed(1) }}%
              ABV
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              block
              variant="tonal"
              color="primary"
              :href="product.url"
              target="_blank"
            >
              View at SAQ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { Product } from "@bsaq/types";

const {
  data: response,
  pending,
  error,
} = await useFetch<{ data: Product[] }>("/api/products", {
  query: {
    page: 1,
    pageSize: 20,
  },
});

const products = computed(() => response.value?.data || []);
</script>
