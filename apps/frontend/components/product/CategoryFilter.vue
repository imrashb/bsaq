<template>
  <div class="h-100 d-flex flex-column">
    <div class="pt-1">
      <v-text-field
        v-model="searchQuery"
        :placeholder="$t('common.search')"
        density="compact"
        variant="outlined"
        hide-details
        prepend-inner-icon="mdi-magnify"
        clearable
        single-line
      ></v-text-field>
    </div>

    <!-- Select / Unselect All Action -->
    <div class="pb-2 pt-1 d-flex justify-end">
      <v-btn
        variant="text"
        size="x-small"
        color="primary"
        class="text-caption"
        @click="toggleAll"
      >
        {{ isAllSelected ? $t("common.unselectAll") : $t("common.selectAll") }}
      </v-btn>
    </div>

    <div class="w-100">
      <v-checkbox
        v-for="facet in filteredFacets"
        :key="facet.category"
        v-model="categories"
        :value="facet.category"
        density="compact"
        hide-details
        color="primary"
        class="mb-1"
      >
        <template v-slot:label>
          <div class="d-flex align-center overflow-hidden w-100">
            <span
              class="text-body-2 text-truncate mr-2"
              :class="{
                'font-weight-medium text-high-emphasis': categories.includes(
                  facet.category
                ),
              }"
              :title="facet.category"
            >
              {{ facet.category }}
            </span>
            <v-spacer />
            <v-chip
              size="x-small"
              variant="tonal"
              class="font-weight-bold flex-shrink-0"
            >
              {{ facet.count }}
            </v-chip>
          </div>
        </template>
      </v-checkbox>

      <div
        v-if="facets.length === 0"
        class="text-caption text-center pa-4 text-medium-emphasis"
      >
        {{ $t("common.noCategories") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Facet } from "@bsaq/types";
import { useInjectFilters } from "~/composables/useFilters";

const props = defineProps<{
  facets: Facet[];
}>();

const { categories } = useInjectFilters();

const searchQuery = ref("");

const filteredFacets = computed(() => {
  if (!searchQuery.value) return props.facets;
  const q = searchQuery.value.toLowerCase();
  return props.facets.filter((f) => f.category.toLowerCase().includes(q));
});

const isAllSelected = computed(() => {
  if (filteredFacets.value.length === 0) return false;

  const filteredCategories = filteredFacets.value.map((f) => f.category);
  return filteredCategories.every((c) => categories.value.includes(c));
});

const toggleAll = () => {
  if (isAllSelected.value) {
    const filteredCategories = filteredFacets.value.map((f) => f.category);
    categories.value = categories.value.filter(
      (c) => !filteredCategories.includes(c)
    );
  } else {
    const filteredCategories = filteredFacets.value.map((f) => f.category);
    const newSelection = new Set([...categories.value, ...filteredCategories]);
    categories.value = Array.from(newSelection);
  }
};
</script>

<style scoped>
:deep(.v-selection-control .v-label) {
  width: 100%;
}

:deep(.v-selection-control) {
  width: 100%;
  max-width: 100%;
}
</style>
