import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this repo from /spherecode-v2/, so the production build
// needs that base. Dev stays at / so http://localhost:5173 works unchanged.
// Deploying at a domain root later? Set base back to '/'.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/spherecode-v2/' : '/',
  server: { host: true, port: 5173 },
}))
