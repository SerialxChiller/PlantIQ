import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Project site is served from a sub-path: https://<user>.github.io/PlantIQ/
  base: '/PlantIQ/',
  plugins: [
    tailwindcss(),
    react(),
  ],
})