<template>
  <div class="d-flex flex-column bg-surface h-100">
    <v-card-title
      class="text-subtitle-1 font-weight-bold pa-4 d-flex align-center justify-space-between flex-shrink-0"
    >
      {{ $t("common.filterAndSort") }}
      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        class="d-md-none"
        @click="$emit('close')"
      />
    </v-card-title>
    <v-divider class="flex-shrink-0" />

    <FilterControls />
    <v-divider class="flex-shrink-0" />

    <div class="flex-grow-1 overflow-y-auto">
      <SortingSection />
      <v-divider />
      <FilterSection :facets="facets" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Facet } from "@bsaq/types";
import FilterControls from "./FilterControls.vue";
import SortingSection from "./SortingSection.vue";
import FilterSection from "./FilterSection.vue";

defineProps<{
  facets: Facet[];
}>();

defineEmits<{
  (e: "close"): void;
}>();
</script>

<style scoped>
/* Custom scrollbar styles */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
