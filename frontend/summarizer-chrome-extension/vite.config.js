import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',  // Path to your manifest
          dest: '',  // Copy to the root of dist folder
        },
      ],
    }),
  ],
  build: {
    outDir: 'dist',  // Output directory for the build
    rollupOptions: {
      input: 'index.html',  // Set the entry point as index.html
    },
  },
});
