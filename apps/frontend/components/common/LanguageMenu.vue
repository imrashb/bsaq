<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn icon size="small" variant="text" v-bind="props">
        <v-icon>mdi-translate</v-icon>
      </v-btn>
    </template>
    <v-list :selected="[locale]" density="compact">
      <v-list-item
        v-for="lang in LANGUAGES"
        :key="lang.code"
        :value="lang.code"
        @click="setLocale(lang.code)"
      >
        <v-list-item-title>{{ lang.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { LANGUAGES } from "~/utils/constants";

const { locale, setLocale } = useI18n();
</script>
