import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import VueJsx from 'unplugin-vue-jsx/vite'
import { visualizer } from 'rollup-plugin-visualizer'

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
      VueJsx(),
      visualizer({ open: true }),
      AutoImport({
        resolvers: [
          ElementPlusResolver({ importStyle: 'sass' }), // 两处必须都引入{ importStyle: 'sass' }，自定义主题才能生效
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
          ElementPlusResolver({ importStyle: 'sass' }), // 两处必须都引入{ importStyle: 'sass' }，自定义主题才能生效
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
      minify: 'terser',
      assetsInlineLimit: 10 * 1024,
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name].[hash:8].chunk.js',
          entryFileNames: 'static/js/[name].[hash:8].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.names[0]?.endsWith('.css')) {
              return 'static/css/[name]-[hash:8][extname]'
            }
            // 其他文件打包到 media 文件夹
            return 'media/[ext]/[name]-[hash:8][extname]'
          },
          manualChunks(id) {
            const modules = [
              'element-plus',
              'vue-router',
              'pinia',
              'vue',
              'lodash',
              'echarts',
              'ant-design-vue',
              'xlsx',
              'codemirror',
            ]
            if (id.includes('node_modules')) {
              for (const module of modules) {
                if (id.includes(module)) return `lib/${module}`
              }
              return 'lib/vendor'
            }
          },
          compact: true,
        },
      },
      terserOptions: {
        compress: {
          pure_funcs: ['console.log'],
          drop_debugger: true,
        },
      },
    },
    // 代理跨域
    server: {
      proxy: {
        [env.VITE_BASE_API]: {
          // 获取数据的服务器地址设置
          target: env.VITE_SERVER,
          // 是否代理跨域
          changeOrigin: true,
          // 路径重写
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
