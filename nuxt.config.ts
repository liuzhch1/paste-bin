// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: false,
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap',
        },
      ],
    },
  },
  ui: {
    global: true,
  },
  vite: {
    resolve: {
      alias: {
        'monaco-editor': 'monaco-editor/esm/vs/editor/editor.api.js',
      },
    },
  },
  css: ['@/assets/css/main.css'],
  modules: ['@nuxt/ui'],
})
