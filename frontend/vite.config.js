import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig(({ mode }) => {
//   return{
//   build: {
//     manifest: true,
//     // rollupOptions: {
//     //   // overwrite default .html entry
//     //   input: 'main.jsx',
//     // },
//   },
//   // base: "static",
//   server: {
//     origin: 'http://127.0.0.1:9000',
//       port: 5173
//   },
//   plugins: [
//     mode === 'development' && react(),
//   ].filter(Boolean),
// }})

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    plugins: [react()],
    build: {
      minify: !isDevelopment,
      sourcemap: isDevelopment,
    },
    server: {
      origin: 'http://127.0.0.1:9000',
      port: 5173
    },
  };
});