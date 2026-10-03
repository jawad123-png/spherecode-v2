import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deploy base. Defaults to '/' so any root deploy (spherecode.dev via Netlify,
// or a plain `npm run build`) is correct out of the box. GitHub Pages serves
// this repo from a subpath, so its workflow sets VITE_BASE=/spherecode-v2/.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? (process.env.VITE_BASE || '/') : '/',
  server: { host: true, port: 5173 },
}))
