import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin to replace convex/server imports with empty module
const replaceConvexServer = () => ({
  name: 'replace-convex-server',
  resolveId(id) {
    if (id === 'convex/server') {
      return id
    }
  },
  load(id) {
    if (id === 'convex/server') {
      // Return a module that exports what api.js needs but does nothing
      return `
        export const anyApi = new Proxy({}, {
          get: () => new Proxy(() => {}, {
            get: () => new Proxy(() => {}, {
              get: () => () => {}
            })
          })
        });
        export const componentsGeneric = () => ({});
      `
    }
  }
})

export default defineConfig({
  plugins: [react(), replaceConvexServer()],
  publicDir: 'public',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist'
  }
})
