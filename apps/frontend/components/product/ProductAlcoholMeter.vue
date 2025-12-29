<template>
  <div class="d-flex align-center ga-2" style="min-width: 120px">
    <!-- Meter Bar -->
    <div
      class="flex-grow-1 position-relative rounded-pill overflow-hidden bg-surface-lighten-2"
      style="height: 6px"
    >
      <div
        class="position-absolute top-0 left-0 h-100 rounded-pill transition-all"
        :style="{
          width: `${percentage}%`,
          backgroundColor: color,
        }"
      />
    </div>

    <!-- Value Text -->
    <div class="text-caption font-weight-bold" :style="{ color: color }">
      {{ value.toFixed(2) }}
      <span class="text-medium-emphasis" style="font-size: 0.8em"
        >{{ $t("common.ml") }}/$</span
      >
    </div>

    <ProductMeterTooltip
      :title="$t('product.mlPerDollar')"
      :value="value"
      :max="max"
      :min-threshold="max / 3"
      min-label="0"
      :max-label="`${max.toFixed(0)}`"
      :value-label="`${value.toFixed(2)} ml/$`"
      :start-color="METER_COLORS.BAD"
      :end-color="METER_COLORS.GOOD"
    />
  </div>
</template>

<script setup lang="ts">
import ProductMeterTooltip from "./ProductMeterTooltip.vue";
import { METER_COLORS } from "~/constants/styling";

const props = defineProps<{
  value: number;
  max: number;
}>();

const percentage = computed(() =>
  Math.min(100, (props.value / props.max) * 100)
);

const color = computed(() => {
  const current = props.value;
  const max = props.max;
  const minThreshold = max / 3;

  if (current < minThreshold) return METER_COLORS.BAD;

  // Map [minThreshold, max] to hue [30, 120] (Orange -> Green)
  const normalized = (current - minThreshold) / (max - minThreshold);
  const hue = 30 + normalized * 90; // Start at 30 (orange), go up to 120 (green)
  return `hsl(${Math.min(120, Math.max(30, hue))}, 85%, 45%)`;
});
</script>

<style scoped>
.bg-surface-lighten-2 {
  background-color: rgba(255, 255, 255, 0.1);
}
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
