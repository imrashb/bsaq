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

    <div class="d-flex align-center justify-space-between px-4 pb-3">
      <span class="text-body-2 text-medium-emphasis">
        {{ $t("common.perPage") }}
      </span>
      <v-select
        v-model="itemsPerPage"
        :items="[10, 20, 50, 100]"
        hide-details
        density="compact"
        variant="outlined"
        style="max-width: 100px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInjectFilters } from "~/composables/useFilters";

const { search, itemsPerPage } = useInjectFilters();
</script>
