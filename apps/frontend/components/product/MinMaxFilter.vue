<template>
  <div>
    <div class="d-flex align-center ga-2">
      <v-text-field
        :model-value="model[0]"
        @update:model-value="updateMin"
        class="flex-1-1"
        type="number"
        density="compact"
        variant="outlined"
        hide-details
        :prefix="prefix"
        :suffix="suffix"
        :placeholder="$t('common.min')"
        :max="model[1]"
      ></v-text-field>
      <span class="text-medium-emphasis">-</span>
      <v-text-field
        :model-value="model[1]"
        @update:model-value="updateMax"
        class="flex-1-1"
        type="number"
        density="compact"
        variant="outlined"
        hide-details
        :prefix="prefix"
        :suffix="suffix"
        :placeholder="$t('common.max')"
        :min="model[0]"
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

const updateMin = (val: string | number) => {
  const numVal = Number(val);
  model.value = [Math.min(numVal, model.value[1]), model.value[1]];
};

const updateMax = (val: string | number) => {
  const numVal = Number(val);
  model.value = [model.value[0], Math.max(numVal, model.value[0])];
};
</script>
