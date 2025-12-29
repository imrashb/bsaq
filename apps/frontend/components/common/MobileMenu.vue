<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn icon size="small" variant="text" v-bind="props">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list density="compact">
      <v-list-item
        v-for="action in actions"
        :key="action.id"
        :href="action.href"
        :target="action.target"
        @click="action.onClick"
      >
        <template #prepend>
          <v-icon :color="action.color">
            {{ action.icon }}
          </v-icon>
        </template>
        <v-list-item-title>{{ action.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { useHeaderActions } from "~/composables/useHeaderActions";

const actions = useHeaderActions();
</script>
