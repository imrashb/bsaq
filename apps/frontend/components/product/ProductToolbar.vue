<template>
  <v-toolbar color="surface" class="d-flex rounded-lg elevation-1 px-4">
    <div class="d-flex align-center ga-2 flex-1-0">
      <div class="text-subtitle-1 font-weight-medium text-medium-emphasis">
        {{ $t("home.results", { count: total }) }}
      </div>
      <v-btn
        v-if="!mdAndUp"
        prepend-icon="mdi-tune"
        variant="text"
        color="primary"
        @click="$emit('toggle-filters')"
      >
        {{ $t("common.filterAndSort") }}
      </v-btn>

      <v-spacer />

      <div
        v-if="mdAndUp"
        class="d-flex align-center ga-2 flex-1-0"
        style="max-width: 400px"
      >
        <v-text-field
          v-model="search"
          :label="$t('common.search')"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />
      </div>
      <ViewToggle v-if="mdAndUp" v-model="viewMode" />
    </div>
  </v-toolbar>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import ViewToggle from "~/components/common/ViewToggle.vue";
import { useInjectFilters } from "~/composables/useFilters";

defineProps<{
  total: number;
}>();

defineEmits<{
  (e: "toggle-filters"): void;
}>();

const { mdAndUp } = useDisplay();
const viewMode = defineModel<"grid" | "list">("viewMode", { required: true });
const { search } = useInjectFilters();
</script>
