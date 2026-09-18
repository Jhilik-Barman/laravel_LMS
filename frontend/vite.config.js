import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: '127.0.0.1',
    port: 5173,

    proxy: {
      '/auth': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
        rewrite: (path) => `/api${path}`,
      },

      '/banners': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
        rewrite: (path) => `/api${path}`,
      },

      '/courses': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
        rewrite: (path) => `/api${path}`,
      },

      '/user': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
        rewrite: (path) => `/api${path}`,
      },
    },
  },
})