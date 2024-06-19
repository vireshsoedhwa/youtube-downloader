import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    manifest: true,
    // rollupOptions: {
    //   // overwrite default .html entry
    //   input: 'main.jsx',
    // },
  },
  // base: "static",
  server: {
    origin: 'http://127.0.0.1:9000',
    port: 5173
  },
  plugins: [react()],
})
