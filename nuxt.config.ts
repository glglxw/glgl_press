// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-14',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss'
  ],
  runtimeConfig: {
    // Server-only - accessible via process.env or useRuntimeConfig()
    geminiApiKey: process.env.API_KEY || '',
    public: {
      // Client-side accessible
    }
  },

  // Enable auto-import for components
  components: true,

  // Nitro server config for API routes
  nitro: {
    storage: {
      data: {
        driver: 'fs',
        base: './server/data'
      }
    }
  }
})
