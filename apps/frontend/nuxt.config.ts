import { defineNuxtConfig } from "nuxt/config";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },
  compatibilityDate: "2025-12-29",
  css: ["@mdi/font/css/materialdesignicons.css"],
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error - vuetify plugin type mismatch
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@vueuse/nuxt",
    "@nuxtjs/i18n",
  ],
  app: {
    head: {
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&display=swap",
        },
      ],
    },
  },
  i18n: {
    langDir: "locales",
    locales: [
      { code: "en", iso: "en-US", file: "en.json", name: "English" },
      { code: "fr", iso: "fr-CA", file: "fr.json", name: "Français" },
    ],
    defaultLocale: "fr",
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  routeRules: {
    "/api/**": { proxy: "http://localhost:3001/**" },
  },
});
