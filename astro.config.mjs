// @ts-check
import { defineConfig } from 'astro/config';

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import { visualizer } from 'rollup-plugin-visualizer';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  // Prefetch para navegación instantánea entre páginas
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  },

  vite: {
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '~': resolve(__dirname, 'src')
        }
    },

    plugins: [
      tailwindcss(),
      visualizer({
        emitFile: true,
        filename: 'stats.html',
        gzipSize: true,
        brotliSize: true
      })
    ]
  },

  integrations: [react()]
});