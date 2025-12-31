<template>
  <div class="d-flex align-center mt-1" v-if="count">
    <v-rating
      :model-value="(rating || 0) / 20"
      color="amber-lighten-2"
      density="comfortable"
      half-increments
      readonly
      :size="size"
    />
    <span class="text-caption text-medium-emphasis ml-1"> ({{ count }}) </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  rating?: number | null;
  count?: number | null;
  size?: string; // Default 'x-small' or passed 'small'
}>();
</script>
