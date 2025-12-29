<template>
  <v-toolbar color="surface" class="rounded-lg elevation-1 pr-2">
    <!-- Results Count (hidden on very small screens if needed, but keeping for now) -->
    <div
      class="text-subtitle-1 font-weight-medium text-medium-emphasis ml-4 d-none d-sm-block"
    >
      {{ $t("home.results", { count: total }) }}
    </div>

    <!-- Mobile Filter Toggle -->
    <v-btn
      prepend-icon="mdi-filter-variant"
      variant="text"
      color="primary"
      class="d-md-none ml-2"
      @click="$emit('toggle-filters')"
    >
      {{ $t("common.filter") }}
    </v-btn>

    <v-spacer />

    <div class="d-flex align-center ga-2 flex-1-0">
      <!-- Search/Filter (Placeholder for now) -->
      <v-text-field
        v-model="search"
        :label="$t('common.search')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        clearable
        hide-details
      />

      <v-divider vertical class="mx-2" />

      <!-- Sort Dropdown -->
      <v-select
        v-model="sortBy"
        :items="sortOptions"
        :label="$t('common.sort')"
        item-title="title"
        item-value="value"
        prepend-inner-icon="mdi-sort"
        variant="outlined"
        density="compact"
        hide-details
      />

      <v-divider vertical class="mx-2" />
      <ViewToggle v-model="viewMode" />
      <v-divider vertical class="mx-2" />
      <v-select
        v-model="itemsPerPage"
        :items="[10, 20, 50, 100]"
        :label="$t('common.perPage')"
        hide-details
        density="compact"
        variant="plain"
        class="nav-select"
        style="min-width: 100px"
      />
    </div>
  </v-toolbar>
</template>

<script setup lang="ts">
import ViewToggle from "~/components/common/ViewToggle.vue";
import { ProductSortOptions } from "@bsaq/types";
import { useInjectFilters } from "~/composables/useFilters";

const props = defineProps<{
  total: number;
}>();

const emit = defineEmits<{
  (e: "toggle-filters"): void;
}>();

const viewMode = defineModel<"grid" | "list">("viewMode", { required: true });

const { search, sortBy, itemsPerPage } = useInjectFilters();

const { t } = useI18n();

const sortOptions = computed(() => [
  {
    title: t("common.sortBy.alcohol_desc"),
    value: ProductSortOptions.AlcoholDesc,
  },
  {
    title: t("common.sortBy.alcohol_asc"),
    value: ProductSortOptions.AlcoholAsc,
  },
  { title: t("common.sortBy.price_asc"), value: ProductSortOptions.PriceAsc },
  { title: t("common.sortBy.price_desc"), value: ProductSortOptions.PriceDesc },
  { title: t("common.sortBy.value_desc"), value: ProductSortOptions.ValueDesc },
  { title: t("common.sortBy.value_asc"), value: ProductSortOptions.ValueAsc },
]);
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
:deep(.nav-select .v-field__input) {
  padding-top: 0;
  padding-bottom: 0;
  min-height: 32px;
}
</style>
