import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< Updated upstream
  resolve: {
    alias: {
      '@video-optimized': fileURLToPath(new URL('./src/video-optimized', import.meta.url)),
    },
  },
  assetsInclude: ['**/*.mp3', '**/*.mpeg', '**/*.mp4', '**/*.wav', '**/*.webm'],
  server: {
    host: true,
    port: 5173,
  },
=======
  assetsInclude: ['**/*.mpeg', '**/*.mp3.mpeg', '**/*.glb'],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@video-optimized': fileURLToPath(new URL('./src/video-optimized', import.meta.url)),
    },
  },
>>>>>>> Stashed changes
})
