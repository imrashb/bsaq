<template>
  <v-footer
    class="bg-surface flex-grow-0 d-flex flex-column justify-center align-center py-6 text-caption text-medium-emphasis border-t-thin"
  >
    <div class="text-center" style="max-width: 800px">
      {{ $t("footer.disclaimer") }}
    </div>
  </v-footer>
</template>

<script setup lang="ts">
// Simple footer component
</script>

<style scoped>
.v-footer {
  width: 100%;
}
</style>
