<template>
  <v-toolbar color="surface" class="rounded-lg elevation-1">
    <!-- Results Count -->
    <div class="text-subtitle-1 font-weight-medium text-medium-emphasis ml-2">
      {{ $t("home.results", { count: total }) }}
    </div>

    <v-spacer />

    <div class="d-flex align-center ga-2 flex-1-0">
      <!-- Search/Filter (Placeholder for now) -->
      <v-text-field
        v-model="internalSearch"
        :label="$t('common.search')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        clearable
        hide-details
      />

      <v-divider vertical class="mx-2" />

      <!-- Sort Dropdown -->
      <v-select
        v-model="internalSort"
        :items="sortOptions"
        :label="$t('common.sort')"
        item-title="title"
        item-value="value"
        prepend-inner-icon="mdi-sort"
        variant="outlined"
        density="compact"
        hide-details
      />

      <v-divider vertical class="mx-2" />
      <ViewToggle v-model="internalViewMode" />
      <v-divider vertical class="mx-2" />
      <v-select
        v-model="internalItemsPerPage"
        :items="[10, 20, 50, 100]"
        :label="$t('common.perPage')"
        hide-details
        density="compact"
        variant="plain"
        class="nav-select"
        style="min-width: 100px"
      />
    </div>
  </v-toolbar>
</template>

<script setup lang="ts">
import ViewToggle from "~/components/common/ViewToggle.vue";

const props = defineProps<{
  total: number;
  viewMode: "grid" | "list";
  itemsPerPage: number;
  sortBy: string;
  search: string;
}>();

const emit = defineEmits<{
  (e: "update:viewMode", value: "grid" | "list"): void;
  (e: "update:itemsPerPage", value: number): void;
  (e: "update:sortBy", value: string): void;
  (e: "update:search", value: string): void;
}>();

// Internal state proxies
const internalViewMode = computed({
  get: () => props.viewMode,
  set: (val) => emit("update:viewMode", val),
});

const internalItemsPerPage = computed({
  get: () => props.itemsPerPage,
  set: (val) => emit("update:itemsPerPage", val),
});

const internalSort = computed({
  get: () => props.sortBy,
  set: (val) => emit("update:sortBy", val),
});

const internalSearch = computed({
  get: () => props.search,
  set: (val) => emit("update:search", val),
});

const { t } = useI18n();

const sortOptions = computed(() => [
  {
    title: t("common.sortBy.alcohol_desc"),
    value: "alcohol_desc", // Using string literals as previously seen work or if import was issue
  },
  {
    title: t("common.sortBy.alcohol_asc"),
    value: "alcohol_asc",
  },
  { title: t("common.sortBy.price_asc"), value: "price_asc" },
  { title: t("common.sortBy.price_desc"), value: "price_desc" },
]);
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
:deep(.nav-select .v-field__input) {
  padding-top: 0;
  padding-bottom: 0;
  min-height: 32px;
}
</style>
