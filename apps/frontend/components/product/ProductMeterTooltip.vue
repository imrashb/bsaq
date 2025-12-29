<template>
  <v-tooltip
    location="top"
    content-class="bg-surface"
    activator="parent"
    offset="10"
    transition="fade-transition"
  >
    <div class="d-flex flex-column ga-2" style="min-width: 150px">
      <div class="font-weight-bold text-center">
        {{ title }}
      </div>

      <div class="position-relative w-100" style="height: 12px">
        <div
          class="w-100 h-100 rounded-pill position-absolute"
          :style="{
            background: `linear-gradient(to right, ${startColor}, ${endColor})`,
          }"
        />
        <div
          class="position-absolute top-50 translate-middle-y"
          :style="{ left: `${percentage}%` }"
        >
          <div class="marker-triangle-down" />
        </div>
      </div>

      <div
        class="d-flex justify-space-between text-caption text-medium-emphasis mt-1"
      >
        <span>{{ minLabel }}</span>
        <span>{{ maxLabel }}</span>
      </div>

      <!-- Current Value Highlight -->
      <div class="text-center font-weight-bold mt-1 text-white">
        {{ valueLabel }}
      </div>
    </div>
  </v-tooltip>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  value: number;
  max: number;
  minThreshold: number;
  minLabel: string;
  maxLabel: string;
  valueLabel: string;
  startColor: string;
  endColor: string;
}>();

const percentage = computed(() => {
  return Math.min(100, Math.max(0, (props.value / props.max) * 100));
});

const minThresholdPercent = computed(() => {
  return Math.min(100, Math.max(0, (props.minThreshold / props.max) * 100));
});
</script>

<style scoped>
.marker-triangle-down {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid white;
  transform: translateX(-50%);
}
</style>
