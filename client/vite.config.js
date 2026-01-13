import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Minimal stub to prevent build errors from convex/server imports
const stubConvexServer = () => ({
  name: 'stub-convex-server',
  resolveId(id) {
    if (id === 'convex/server') {
      return id
    }
  },
  load(id) {
    if (id === 'convex/server') {
      // Create a working proxy that mimics Convex's anyApi behavior
      return `
        const createApiProxy = (path = []) => {
          const handler = {
            get(target, prop) {
              // Return the function reference string for Convex
              if (typeof prop === 'string') {
                return createApiProxy([...path, prop]);
              }
              return undefined;
            }
          };
          
          // The proxy represents a function reference
          const proxy = new Proxy(
            function() {},
            handler
          );
          
          // Add toString to return the path as a string reference
          Object.defineProperty(proxy, 'toString', {
            value: () => path.join(':')
          });
          
          // Store the path for Convex to use
          proxy._path = path;
          
          return proxy;
        };
        
        export const anyApi = createApiProxy();
        export const componentsGeneric = () => ({});
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
  },
  optimizeDeps: {
    exclude: ['convex']
  }
})
