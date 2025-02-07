import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  build: {
    // Enable minification and tree shaking
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'date-utils': ['date-fns'],
          'ui-components': ['@radix-ui/react-dialog', 'framer-motion']
        }
      }
    },
    // Enable source map compression
    sourcemap: true,
    // Enable chunk size optimization
    chunkSizeWarningLimit: 1000
  },
  // Enable caching
  server: {
    hmr: {
      overlay: false
    }
  }
});