import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import mkcert from 'vite-plugin-mkcert';
import legacy from '@vitejs/plugin-legacy';
import dynamicImport from 'vite-plugin-dynamic-import';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  server: {
    port: 3000,
    https: true,
  },
  plugins: [
    react(),
    legacy(),
    dynamicImport(),
    AutoImport({
      dts: true,
      eslintrc: {
        enabled: true,
      },
      include: /\.tsx?$/,
      imports: [
        'react',
        {
          react: ['createContext'],
        },
      ],
    }),
    mkcert({
      hosts: ['groupcheck.dev', 'localhost'],
    }),
  ],
});
