import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import mkcert from 'vite-plugin-mkcert';
import legacy from '@vitejs/plugin-legacy';
import dynamicImport from 'vite-plugin-dynamic-import';

export default defineConfig({
  server: {
    https: true,
  },
  plugins: [
    react(),
    legacy(),
    dynamicImport(),
    mkcert({
      hosts: ['groupcheck.dev', 'localhost'],
    }),
  ],
});
