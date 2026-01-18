// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['@/assets/styles/reset.css', '@/assets/styles/css-variables.css'],
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts',
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/main.scss" as *;',
        },
      },
    },
  },
  googleFonts: {
    families: {
      'Exo 2': [400, 500, 700],
      'Roboto': [400, 500, 700],
      'Lato': true,
    },
    display: 'swap',
  },
})
