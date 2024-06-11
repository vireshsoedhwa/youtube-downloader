import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'
import { resolve, join } from 'path';

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: "/static/",
//   build: {
//     manifest: "manifest.json",
//     outDir: resolve("./assets"),
//     rollupOptions: {
//       input: {
//         main : '/src/main.jsx'
//       }
//     }
//   }
// })


export default defineConfig((mode) => {
  const env = loadEnv(mode, process.cwd(), '');

  const INPUT_DIR = './src';
  const OUTPUT_DIR = './dist';

  return {
    plugins: [react()],
    // resolve: {
    //   alias: {
    //     '@': resolve(INPUT_DIR),
    //     'react': 'vue/dist/vue.esm-bundler.js',
    //   },
    // },
    // root: resolve(INPUT_DIR),
    base: "/static/",
    // server: {
    //   host: env.DJANGO_VITE_DEV_SERVER_HOST,
    //   port: env.DJANGO_VITE_DEV_SERVER_PORT,
    // },
    build: {
      manifest: true,
      emptyOutDir: true,
      outDir: 'dist',
      rollupOptions: {
        input: INPUT_DIR + '/main.jsx'
      },
    },
  };
});