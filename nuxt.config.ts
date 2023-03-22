// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "acceptHMRUpdate"],
      },
    ],
  ],
  css: ["@fortawesome/fontawesome-svg-core/styles.css"],
  ssr: false,
  runtimeConfig: {
    public: {
      MAPBOX_API_KEY: process.env.NUXT_ENV_MAPBOX_API_KEY,
      OPENWEATHER_API_KEY: process.env.NUXT_ENV_OPENWEATHER_API_KEY,
    },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
});
