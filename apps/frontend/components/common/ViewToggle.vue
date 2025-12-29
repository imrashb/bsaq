<template>
  <div class="d-flex align-center gap-2">
    <span class="text-caption text-medium-emphasis mr-2 d-none d-sm-block">{{ $t("common.view") }}:</span>
    <v-btn-toggle
      v-model="internalMode"
      mandatory
      density="compact"
      color="primary"
      variant="outlined"
      class="rounded-lg"
    >
      <v-btn
        value="grid"
        icon="mdi-view-grid-outline"
        size="small"
      />
      <v-btn
        value="list"
        icon="mdi-view-list-outline"
        size="small"
      />
    </v-btn-toggle>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: "grid" | "list";
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: "grid" | "list"): void;
}>();

const internalMode = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
