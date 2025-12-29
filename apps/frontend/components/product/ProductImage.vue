<template>
  <v-img :src="src || undefined" :height="height" :alt="alt" :cover="cover">
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-icon color="secondary">mdi-image-off</v-icon>
      </div>
    </template>
    <template #error>
      <div class="d-flex align-center justify-center fill-height">
        <v-icon color="error">mdi-image-broken</v-icon>
      </div>
    </template>

    <!-- Slot for overlays (e.g., chips) -->
    <slot />
  </v-img>
</template>

<script setup lang="ts">
defineProps<{
  src?: string | null;
  height?: string | number;
  alt?: string;
  cover?: boolean;
}>();
</script>

<style scoped>
.bg-surface-lighten-1 {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
</style>
