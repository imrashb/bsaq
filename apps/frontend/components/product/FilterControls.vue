<template>
  <div>
    <div class="pa-4">
      <v-text-field
        v-model="search"
        :label="$t('common.search')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        clearable
        hide-details
      />
    </div>

    <div class="px-4 pb-3">
      <FilterSubsection :title="$t('common.perPage')" filter-key="itemsPerPage">
        <v-select
          v-model="itemsPerPage"
          :items="[10, 20, 50, 100]"
          hide-details
          density="compact"
          variant="outlined"
          full-width
        />
      </FilterSubsection>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInjectFilters } from "~/composables/useFilters";
import FilterSubsection from "./FilterSubsection.vue";

const { search, itemsPerPage } = useInjectFilters();
</script>
