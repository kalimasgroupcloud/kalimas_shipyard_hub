import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base: './' makes the build portable — assets resolve relatively so the app
// works on GitHub Pages sub-paths (e.g. /kalimas_shipyard_hub/) and on any
// custom domain root (e.g. hub.kalimasgroup.com) without config changes.
// The hash-router (src/router.js) needs no server-side rewrite rules.
export default defineConfig({
  base: './',
  plugins: [react()],
})
