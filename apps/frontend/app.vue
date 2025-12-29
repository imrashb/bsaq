<script setup lang="ts">
import AppHeader from "./components/layout/AppHeader.vue";
</script>

<template>
  <v-app>
    <AppHeader />

    <v-main class="bg-background">
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<style>
body,
.v-application .text-h1,
.v-application .text-h2,
.v-application .text-h3,
.v-application .text-h4,
.v-application .text-h5,
.v-application .text-h6,
.v-application .text-subtitle-1,
.v-application .text-subtitle-2,
.v-application .text-body-1,
.v-application .text-body-2,
.v-application .text-button,
.v-application .text-caption,
.v-application .text-overline {
  font-family: "Outfit", sans-serif !important;
}
</style>
