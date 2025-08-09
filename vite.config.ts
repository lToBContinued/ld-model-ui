import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const resolve = (url: string) => {
  return path.resolve(__dirname, url)
}

// https://vite.dev/config/
export default defineConfig((mode) => {
  const env = loadEnv(mode as any, process.cwd())

  return {
    base: './',
    plugins: [
      vue(),
      AutoImport({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: 'Icon',
          }),
        ],
        dts: resolve('src/typings/auto-imports.d.ts'),
      }),
      Components({
        dirs: ['src/components/'],
        extensions: ['vue'],
        resolvers: [
          IconsResolver({
            enabledCollections: ['ep'],
          }),
          ElementPlusResolver({ importStyle: 'sass' }),
        ],
        deep: true,
        dts: resolve('src/typings/components.d.ts'),
      }),
      Icons({
        autoInstall: true,
      }),
      createSvgIconsPlugin({
        iconDirs: [resolve('src/assets/icons')],
        symbolId: 'icon-[name]',
      }),
    ],
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variable.scss" as *; @use "@/styles/element/index.scss" as *;`,
        },
      },
      devSourcemap: true,
    },
    build: {
      emptyOutDir: true,
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'static',
      minify: true,
      cssMinify: true,
      cssCodeSplit: true,
      assetsInlineLimit: 10 * 1024,
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name].[hash:6].chunk.js',
          entryFileNames: 'static/js/[name].[hash:6].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'static/css/[name]-[hash:6][extname]'
            }
            // 其他文件打包到 media 文件夹
            return 'media/[name]-[hash:6][extname]'
          },
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('element-plus')) {
                return 'lib/element-plus'
              }
              if (id.includes('lodash')) return 'lib/lodash'
              return 'lib/vendor'
            }
          },
          compact: true,
        },
      },
    },
    // 代理跨域
    // server: {
    //   proxy: {
    //     [env.VITE_BASE_API]: {
    //       // 获取数据的服务器地址设置
    //       target: env.VITE_SERVER,
    //       // 是否代理跨域
    //       changeOrigin: true,
    //       // 路径重写
    //       rewrite: (path) => path.replace(/^\/api/, ''),
    //     },
    //   },
    // },
  }
})
