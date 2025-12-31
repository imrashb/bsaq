<template>
  <v-btn
    color="primary"
    variant="flat"
    size="small"
    append-icon="mdi-open-in-new"
    :href="url"
    target="_blank"
    class="flex-grow-1"
  >
    {{ $t("common.viewAtSaq") }}
  </v-btn>
</template>

<script setup lang="ts">
defineProps<{
  url: string;
}>();
</script>
