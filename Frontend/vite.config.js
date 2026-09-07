<<<<<<< HEAD
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@video-optimized': fileURLToPath(new URL('./src/video-optimized', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
})

=======
>>>>>>> eedbcff04e4df72bc11abac7f4590aaade2f8d85
