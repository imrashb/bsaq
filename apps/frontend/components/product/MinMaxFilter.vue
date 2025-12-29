<template>
  <div>
    <div class="d-flex align-center ga-2">
      <v-text-field
        :model-value="min"
        @update:model-value="(val) => (min = Number(val))"
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
        :model-value="max"
        @update:model-value="(val) => (max = Number(val))"
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
const min = defineModel<number>("min");
const max = defineModel<number>("max");

defineProps<{
  prefix?: string;
  suffix?: string;
}>();
</script>
