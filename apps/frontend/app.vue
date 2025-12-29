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
body {
  font-family: "Outfit", sans-serif !important;
}
</style>
