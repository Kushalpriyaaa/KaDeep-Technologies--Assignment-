import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin to stub out convex/server imports in client build
const stubConvexServer = () => ({
  name: 'stub-convex-server',
  resolveId(id) {
    if (id === 'convex/server') {
      return id
    }
  },
  load(id) {
    if (id === 'convex/server') {
      // Create a deep proxy that returns function reference strings
      return `
        const createDeepProxy = (path = []) => {
          const handler = {
            get(target, prop) {
              // Handle special properties
              if (prop === 'toString') {
                return () => path.filter(p => typeof p === 'string').join(':');
              }
              if (prop === Symbol.toStringTag) {
                return 'ConvexFunction';
              }
              if (prop === Symbol.toPrimitive || prop === 'valueOf') {
                return () => path.filter(p => typeof p === 'string').join(':');
              }
              if (typeof prop === 'symbol') {
                return undefined;
              }
              // Continue building the path for nested access
              return createDeepProxy([...path, prop]);
            },
            apply(target, thisArg, args) {
              return path.filter(p => typeof p === 'string').join(':');
            }
          };
          return new Proxy(() => {}, handler);
        };
        
        export const componentsGeneric = () => ({});
        export const anyApi = createDeepProxy();
      `
    }
  }
})

export default defineConfig({
  plugins: [react(), stubConvexServer()],
  publicDir: 'public',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist'
  }
})
