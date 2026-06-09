import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(__dirname, 'src/icons')],
        symbolId: 'icon-[name]'
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '/src/styles/variables.scss' as *;`
        }
      }
    },
    server: {
      port: 80,
      open: true,
      proxy: {
        '/dev-api': {
          target: env.VITE_API_TARGET || 'http://127.0.0.1:10030',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-api/, '/api')
        }
      }
    },
    define: {
      __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE)
    }
  }
})
