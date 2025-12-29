<template>
  <div>
    <div class="d-flex align-center ga-2">
      <v-text-field
        :model-value="model[0]"
        @update:model-value="(val) => (model = [Number(val), model[1]])"
        class="flex-1-1"
        type="number"
        density="compact"
        variant="outlined"
        hide-details
        :prefix="prefix"
        :suffix="suffix"
        :placeholder="$t('common.min')"
      ></v-text-field>
      <span class="text-medium-emphasis">-</span>
      <v-text-field
        :model-value="model[1]"
        @update:model-value="(val) => (model = [model[0], Number(val)])"
        class="flex-1-1"
        type="number"
        density="compact"
        variant="outlined"
        hide-details
        :prefix="prefix"
        :suffix="suffix"
        :placeholder="$t('common.max')"
      ></v-text-field>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  type RangeFilterKeys,
  useInjectFilters,
} from "~/composables/useFilters";

const props = defineProps<{
  filterId: RangeFilterKeys;
  prefix?: string;
  suffix?: string;
}>();

const filterState = useInjectFilters();
const model = filterState[props.filterId];
</script>
