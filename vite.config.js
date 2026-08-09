import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // raises the warning threshold to 1MB
  },
})
