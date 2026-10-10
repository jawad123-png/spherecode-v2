import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))

// Deploy base. Defaults to '/' so any root deploy (spherecode.dev via Netlify,
// or a plain `npm run build`) is correct out of the box. GitHub Pages serves
// this repo from a subpath, so its workflow sets VITE_BASE=/spherecode-v2/.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? (process.env.VITE_BASE || '/') : '/',
  server: { host: true, port: 5173 },
  build: {
    // One HTML entry per division so each URL has its own <head>. These dirs
    // are written by scripts/gen-pages.mjs, which runs before every build.
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        web: resolve(root, 'web/index.html'),
        bpo: resolve(root, 'bpo/index.html'),
        va: resolve(root, 'virtual-assistants/index.html'),
      },
    },
  },
}))
