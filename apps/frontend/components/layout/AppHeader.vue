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
        <v-fade-transition mode="out-in">
          <span
            :key="snowflakeMode ? 'safe' : 'unsafe'"
            class="text-caption text-medium-emphasis"
          >
            {{ snowflakeMode ? $t("app.subtitle_safe") : $t("app.subtitle") }}
          </span>
        </v-fade-transition>
      </div>
    </v-app-bar-title>

    <template #append>
      <div v-if="mdAndUp" class="d-flex align-center ga-2">
        <LanguageMenu />

        <template v-for="action in actions" :key="action.id">
          <v-tooltip v-if="action.tooltip" location="bottom">
            <template #activator="{ props }">
              <v-btn
                icon
                size="small"
                :color="action.color"
                variant="text"
                :href="action.href"
                :target="action.target"
                v-bind="props"
                @click="action.onClick"
              >
                <v-icon>{{ action.icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ action.tooltip }}</span>
          </v-tooltip>
          <v-btn
            v-else
            icon
            size="small"
            :color="action.color"
            variant="text"
            :href="action.href"
            :target="action.target"
            @click="action.onClick"
          >
            <v-icon>{{ action.icon }}</v-icon>
          </v-btn>
        </template>
      </div>

      <div v-else class="d-flex align-center ga-1">
        <LanguageMenu />
        <MobileMenu />
      </div>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import LanguageMenu from "~/components/common/LanguageMenu.vue";
import MobileMenu from "~/components/common/MobileMenu.vue";
import { useHeaderActions } from "~/composables/useHeaderActions";

const snowflakeMode = useSnowflakeMode();
const { mdAndUp } = useDisplay();
const actions = useHeaderActions();
</script>
