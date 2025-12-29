<template>
  <DrawerSection :title="$t('common.sort')" icon="mdi-sort" default-expanded>
    <v-select
      v-model="sortBy"
      :items="sortOptions"
      item-title="title"
      item-value="value"
      hide-details
      density="compact"
      variant="outlined"
      prepend-inner-icon="mdi-sort"
    />
  </DrawerSection>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ProductSortOptions } from "@bsaq/types";
import { useInjectFilters } from "~/composables/useFilters";
import DrawerSection from "~/components/common/DrawerSection.vue";

const { sortBy } = useInjectFilters();
const { t } = useI18n();

const sortOptions = computed(() => [
  { title: t("common.sortBy.value_desc"), value: ProductSortOptions.ValueDesc },
  { title: t("common.sortBy.value_asc"), value: ProductSortOptions.ValueAsc },
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
]);
</script>
