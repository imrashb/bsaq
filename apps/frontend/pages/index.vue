<template>
  <HomePage />
</template>

<script setup lang="ts">
import HomePage from "~/components/HomePage.vue";
import { useProvideFilters } from "~/composables/useFilters";

// Provide filter state to the component tree
useProvideFilters();
</script>
