// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  // Nitro config for Vercel
  nitro: {
    preset: 'vercel'
  },

  // Runtime config for environment variables
  runtimeConfig: {
    // Private keys (kun server-side)
    resendApiKey: process.env.RESEND_API_KEY,

    // Public keys (client + server)
    public: {
      // Ingen public keys nødvendige for dette projekt
    }
  },

  // App config
  app: {
    head: {
      title: 'Drillenisse - Send en hilsen',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Send en julehilsen fra din drillenisse' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
    }
  }
})
