import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import postcssGlobalData from '@csstools/postcss-global-data'
import postcssCustomMedia from 'postcss-custom-media'

const appDirectory = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(appDirectory, '../..')

export default {
  esbuild: {
    jsxImportSource: 'react',
  },
  resolve: {
    alias: [
      {
        find: /^@gtivr4\/a1-design-system-react\/(.+)$/,
        replacement: resolve(repoRoot, 'packages/react/src/$1'),
      },
      {
        find: '@gtivr4/a1-design-system-react',
        replacement: resolve(repoRoot, 'packages/react/src/index.js'),
      },
    ],
  },
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
  css: {
    postcss: {
      plugins: [
        postcssGlobalData({
          files: [resolve(repoRoot, 'build/css/breakpoints.css')],
        }),
        postcssCustomMedia(),
      ],
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 5000,
  },
}
