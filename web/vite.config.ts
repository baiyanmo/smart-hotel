import { defineConfig } from 'vite'

export default defineConfig({
  base: '/web/',
  assetsInclude: ['**/*.zip'],
  server: {
    port: 8000,
    host: true,
    watch: { ignored: ['**/airi/**'] },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    entries: ['index.html'],
  },
  build: {
    assetsInlineLimit: 0,
  },
})