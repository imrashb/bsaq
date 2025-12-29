<template>
  <v-app-bar color="background" elevation="1" border>
    <template #prepend>
      <v-avatar class="mr-2" rounded="0" color="transparent">
        <v-img src="~/assets/logo.png" alt="BSAQ Logo" />
      </v-avatar>
    </template>

    <v-app-bar-title>
      <div class="d-flex flex-column">
        <span class="font-weight-bold text-h5 text-white">
          {{ $t("app.title") }}
        </span>
        <span class="text-caption text-medium-emphasis">{{
          $t("app.subtitle")
        }}</span>
      </div>
    </v-app-bar-title>

    <template #append>
      <v-btn-toggle
        :model-value="locale"
        mandatory
        color="primary"
        variant="flat"
        :rounded="false"
        divided
        class="mr-4"
        density="compact"
        @update:model-value="setLocale"
      >
        <v-btn
          v-for="l in typedLocales"
          :key="l.code"
          :value="l.code"
          size="small"
          :rounded="false"
        >
          {{ l.code.toUpperCase() }}
        </v-btn>
      </v-btn-toggle>
      <v-btn icon color="secondary" variant="text" class="mr-2" disabled>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon color="primary" variant="text">
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n();

// Cast locales to specific type for template usage to avoid TS errors
const typedLocales = computed(() => {
  return (locales.value || []) as Array<{ code: "en" | "fr"; name: string }>;
});
</script>

<style scoped>
.tracking-tight {
  letter-spacing: -0.025em;
}
</style>
