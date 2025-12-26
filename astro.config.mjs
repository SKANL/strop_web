// @ts-check
import { defineConfig } from 'astro/config';

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '~': resolve(__dirname, 'src')
        }
    },

    plugins: [tailwindcss()]
  },

  integrations: [react()]
});