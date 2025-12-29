<template>
  <v-expansion-panels v-model="panel" variant="accordion" static>
    <v-expansion-panel :value="0">
      <v-expansion-panel-title>
        <v-icon v-if="icon" :icon="icon" class="mr-2" size="small" />
        <span class="text-subtitle-2 font-weight-bold">{{ title }}</span>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <slot />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  icon?: string;
  defaultExpanded?: boolean;
}>();

const panel = ref(props.defaultExpanded !== false ? 0 : undefined);
</script>

<style scoped>
:deep(.v-expansion-panel-title) {
  padding: 12px 16px;
}
:deep(.v-expansion-panel-text__wrapper) {
  padding: 8px 16px 16px;
}
</style>
