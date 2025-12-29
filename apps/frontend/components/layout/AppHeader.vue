<template>
  <v-app-bar color="background" elevation="1" border>
    <template #prepend>
      <v-avatar color="primary" class="mr-2" variant="tonal">
        <v-icon icon="mdi-glass-wine" />
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
      <div class="d-flex align-center mr-4">
        <v-btn
          v-for="l in typedLocales"
          :key="l.code"
          :variant="locale === l.code ? 'tonal' : 'text'"
          :color="locale === l.code ? 'primary' : 'medium-emphasis'"
          size="small"
          class="px-2 min-w-0"
          @click="setLocale(l.code)"
        >
          {{ l.code.toUpperCase() }}
        </v-btn>
      </div>
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
