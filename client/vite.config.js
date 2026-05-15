import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  plugins: [
    tailwindcss(),
    {
      name: 'copy-redirects',
      writeBundle() {
        copyFileSync(resolve(__dirname, 'public/_redirects'), resolve(__dirname, 'dist/_redirects'))
      },
    },
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
