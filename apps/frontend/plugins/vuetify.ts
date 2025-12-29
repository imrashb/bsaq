import { defineNuxtPlugin } from "#app";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: "customDark",
      themes: {
        customDark: {
          dark: true,
          colors: {
            background: "#0f172a", // Slate 900
            surface: "#1e293b", // Slate 800
            primary: "#8b5cf6", // Violet 500
            secondary: "#2dd4bf", // Teal 400
            error: "#f43f5e", // Rose 500
            info: "#3b82f6", // Blue 500
            success: "#10b981", // Emerald 500
            warning: "#f59e0b", // Amber 500
          },
        },
      },
    },
    defaults: {
      global: {
        style: [{ fontFamily: "'Outfit', sans-serif" }],
      },
      VBtn: {
        rounded: "lg",
        style: [{ textTransform: "none", letterSpacing: "0" }],
      },
      VCard: { rounded: "lg", elevation: 4 },
      VTextField: { variant: "outlined", density: "comfortable" },
      VSelect: { variant: "outlined", density: "comfortable" },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
