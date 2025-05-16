import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    watch: {
      // https://rollupjs.org/configuration-options/#watch
      include: ['src/**/*'],
    },
    outDir: '../public',
    emptyOutDir: true,
  },
})