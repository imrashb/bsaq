<template>
  <div>
    <div class="d-flex align-center ga-2 mb-2">
      <div class="text-subtitle-2 font-weight-medium">
        {{ title }}
      </div>
      <v-spacer />
      <v-fade-transition>
        <v-btn
          v-if="filterKey && !isDefault(filterKey)"
          variant="text"
          size="small"
          color="primary"
          density="compact"
          @click="resetFilter(filterKey)"
        >
          {{ $t("common.reset") }}
        </v-btn>
      </v-fade-transition>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useInjectFilters, type FilterState } from "~/composables/useFilters";

defineProps<{
  title: string;
  filterKey?: keyof FilterState;
}>();

const { isDefault, resetFilter } = useInjectFilters();
</script>
