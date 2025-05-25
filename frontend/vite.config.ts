import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  build: {
    outDir: "../public",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          solid: ['solid-js'],
          pixi: ['pixi.js'],
        }
      },
    },
  }
})
