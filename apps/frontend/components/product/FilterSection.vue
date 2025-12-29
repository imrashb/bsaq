<template>
  <DrawerSection
    :title="$t('common.filter')"
    icon="mdi-filter-variant"
    default-expanded
  >
    <div class="d-flex flex-column ga-4">
      <FilterSubsection :title="$t('common.price')" filter-key="price">
        <MinMaxFilter filterId="price" prefix="$" />
      </FilterSubsection>

      <FilterSubsection :title="`${$t('common.abv')} (%)`" filter-key="abv">
        <MinMaxFilter filterId="abv" suffix="%" />
      </FilterSubsection>

      <FilterSubsection
        :title="$t('common.categories')"
        filter-key="categories"
      >
        <CategoryFilter :facets="facets" />
      </FilterSubsection>
    </div>
  </DrawerSection>
</template>

<script setup lang="ts">
import type { Facet } from "@bsaq/types";
import DrawerSection from "~/components/common/DrawerSection.vue";
import MinMaxFilter from "./MinMaxFilter.vue";
import CategoryFilter from "./CategoryFilter.vue";
import FilterSubsection from "./FilterSubsection.vue";

const props = defineProps<{
  facets: Facet[];
}>();
</script>
