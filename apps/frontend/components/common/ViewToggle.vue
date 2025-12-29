<template>
  <v-btn-toggle
    v-model="internalMode"
    mandatory
    color="primary"
    variant="text"
    :rounded="false"
  >
    <v-btn value="grid" :rounded="false" icon="mdi-view-grid-outline" />
    <v-btn value="list" :rounded="false" icon="mdi-view-list-outline" />
  </v-btn-toggle>
</template>

<script setup lang="ts">
const internalMode = defineModel<"grid" | "list">({ required: true });
</script>
