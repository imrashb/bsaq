<template>
  <DrawerSection
    :title="$t('common.filter')"
    icon="mdi-filter-variant"
    default-expanded
  >
    <div class="d-flex flex-column ga-4">
      <div>
        <div class="text-subtitle-2 font-weight-medium mb-2">
          {{ $t("common.price") }}
        </div>
        <MinMaxFilter filterId="price" prefix="$" />
      </div>

      <div>
        <div class="text-subtitle-2 font-weight-medium mb-2">
          {{ $t("common.abv") }} (%)
        </div>
        <MinMaxFilter filterId="abv" suffix="%" />
      </div>

      <div>
        <div class="text-subtitle-2 font-weight-medium mb-2">
          {{ $t("common.categories") }}
        </div>
        <CategoryFilter :facets="facets" />
      </div>
    </div>
  </DrawerSection>
</template>

<script setup lang="ts">
import type { Facet } from "@bsaq/types";
import DrawerSection from "~/components/common/DrawerSection.vue";
import MinMaxFilter from "./MinMaxFilter.vue";
import CategoryFilter from "./CategoryFilter.vue";

defineProps<{
  facets: Facet[];
}>();
</script>
