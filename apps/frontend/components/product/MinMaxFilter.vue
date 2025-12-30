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
        :step="step"
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
        :step="step"
      ></v-text-field>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  type RangeFilterKeys,
  useInjectFilters,
} from "~/composables/useFilters";

const {
  filterId,
  prefix,
  suffix,
  step = 1,
} = defineProps<{
  filterId: RangeFilterKeys;
  prefix?: string;
  suffix?: string;
  step?: number;
}>();

const filterState = useInjectFilters();
const model = filterState[filterId];

const roundTo2Decimals = (num: number): number => {
  return Math.round(num * 100) / 100;
};

// Simplified parser: parses number, handles NaN. No bounds passed here (bounding logic separate).
const parseNumber = (val: string | number): number | null => {
  let numVal = Number(String(val));
  return isNaN(numVal) ? null : numVal;
};

const updateMin = (val: string | number) => {
  let numVal = parseNumber(val);
  if (numVal === null) return;

  const [currentMin, currentMax] = model.value;

  numVal = Math.max(0, Math.min(numVal, currentMax));
  numVal = roundTo2Decimals(numVal);

  if (numVal !== currentMin) {
    model.value = [numVal, currentMax];
  }
};

const updateMax = (val: string | number) => {
  let numVal = parseNumber(val);
  if (numVal === null) return;

  const [currentMin, currentMax] = model.value;

  numVal = Math.max(currentMin, numVal);
  numVal = roundTo2Decimals(numVal);

  if (numVal !== currentMax) {
    model.value = [currentMin, numVal];
  }
};
</script>
