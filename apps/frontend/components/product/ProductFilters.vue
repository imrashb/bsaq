<template>
  <div class="d-flex flex-column bg-surface">
    <v-card-title
      class="text-subtitle-1 font-weight-bold pa-4 d-flex align-center justify-space-between flex-shrink-0"
    >
      {{ $t("common.filter") }}
      <!-- Close button on mobile -->
      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        class="d-md-none"
        @click="$emit('close')"
      />
    </v-card-title>
    <v-divider class="flex-shrink-0" />

    <template v-for="(section, index) in sections" :key="section.id">
      <div>
        <div
          v-if="section.title"
          class="px-4 pt-3 pb-2 text-subtitle-2 font-weight-bold"
        >
          {{ section.title }}
        </div>
        <div :class="section.contentClass || 'px-4 pb-3'">
          <component
            v-if="section.component"
            :is="section.component"
            v-bind="section.props as any"
          />
          <slot v-else :name="section.id" v-bind="section.props" />
        </div>
      </div>
      <v-divider v-if="index < sections.length - 1" class="flex-shrink-0" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { Facet } from "@bsaq/types";
import MinMaxFilter from "./MinMaxFilter.vue";
import CategoryFilter from "./CategoryFilter.vue";
import type { RangeFilterKeys } from "~/composables/useFilters";

const props = defineProps<{
  facets: Facet[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { t } = useI18n();

interface FilterSection {
  id: string;
  title: string;
  component: any;
  props: {
    filterId?: RangeFilterKeys;
    [key: string]: any;
  };
  contentClass?: string;
  containerClass?: string;
}

const sections = computed<FilterSection[]>(() => [
  {
    id: "price",
    title: t("common.price"),
    component: MinMaxFilter,
    props: {
      filterId: "price",
      prefix: "$",
    },
  },
  {
    id: "abv",
    title: `${t("common.abv")} (%)`,
    component: MinMaxFilter,
    props: {
      filterId: "abv",
      suffix: "%",
    },
  },
  {
    id: "categories",
    title: t("common.categories"),
    component: CategoryFilter,
    props: {
      facets: props.facets,
    },
  },
]);
</script>
