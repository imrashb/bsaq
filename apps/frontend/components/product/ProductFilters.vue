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

const props = defineProps<{
  facets: Facet[];
}>();

const model = defineModel<string[]>({ default: [] });
const priceRange = defineModel<[number, number]>("priceRange", {
  default: [0, 200],
});
const abvRange = defineModel<[number, number]>("abvRange", {
  default: [0, 100],
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { t } = useI18n();

interface FilterSection {
  id: string;
  title: string;
  component: any;
  props: any;
  contentClass?: string;
  containerClass?: string;
}

const sections = computed<FilterSection[]>(() => [
  {
    id: "price",
    title: t("common.price"),
    component: MinMaxFilter,
    props: {
      min: priceRange.value[0],
      max: priceRange.value[1],
      "onUpdate:min": (v?: number) =>
        (priceRange.value = [v ?? 0, priceRange.value[1]]),
      "onUpdate:max": (v?: number) =>
        (priceRange.value = [priceRange.value[0], v ?? 200]),
      prefix: "$",
    },
  },
  {
    id: "abv",
    title: `${t("common.abv")} (%)`,
    component: MinMaxFilter,
    props: {
      min: abvRange.value[0],
      max: abvRange.value[1],
      "onUpdate:min": (v?: number) =>
        (abvRange.value = [v ?? 0, abvRange.value[1]]),
      "onUpdate:max": (v?: number) =>
        (abvRange.value = [abvRange.value[0], v ?? 100]),
      suffix: "%",
    },
  },
  {
    id: "categories",
    title: t("common.categories"),
    component: CategoryFilter,
    props: {
      facets: props.facets,
      modelValue: model.value,
      "onUpdate:modelValue": (v: string[]) => (model.value = v),
    },
  },
]);
</script>

<style scoped></style>
