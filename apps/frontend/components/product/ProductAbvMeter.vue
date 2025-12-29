<template>
  <div
    class="d-flex align-center justify-center rounded px-2 py-0 font-weight-bold ml-1 text-center"
    :style="{
      backgroundColor: backgroundColor,
      color: textColor,
      minWidth: '48px',
    }"
  >
    {{ value.toFixed(1) }}% {{ $t("common.abv") }}

    <ProductMeterTooltip
      :title="$t('common.abv')"
      :value="value"
      :max="60"
      :min-threshold="0"
      min-label="0%"
      max-label="60%"
      :value-label="`${value.toFixed(1)}%`"
      :start-color="METER_COLORS.GOOD"
      :end-color="METER_COLORS.BAD"
    />
  </div>
</template>

<script setup lang="ts">
import ProductMeterTooltip from "./ProductMeterTooltip.vue";
import { METER_COLORS } from "~/constants/styling";

const props = defineProps<{
  value: number;
}>();

const MAX_ABV = 60;

const backgroundColor = computed(() => {
  const current = props.value;
  // Map [0, MAX_ABV] to hue [120, 0] (Green -> Red)
  const normalized = current / MAX_ABV;
  const hue = 120 - normalized * 120;
  return `hsl(${Math.max(0, Math.min(120, hue))}, 85%, 25%)`; // Darker background
});

const textColor = computed(() => {
  const current = props.value;
  // Map [0, MAX_ABV] to hue [120, 0] (Green -> Red)
  const normalized = current / MAX_ABV;
  const hue = 120 - normalized * 120;
  return `hsl(${Math.max(0, Math.min(120, hue))}, 100%, 75%)`; // Lighter text
});
</script>
