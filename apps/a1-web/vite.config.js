import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import postcssGlobalData from '@csstools/postcss-global-data'
import postcssCustomMedia from 'postcss-custom-media'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '../..')

export default {
  esbuild: {
    jsxImportSource: 'react'
  },
  server: {
    fs: {
      allow: [repoRoot]
    }
  },
  css: {
    postcss: {
      plugins: [
        postcssGlobalData({
          files: [resolve(repoRoot, 'build/css/breakpoints.css')]
        }),
        postcssCustomMedia()
      ]
    }
  },
  build: {
    outDir: 'dist'
  }
}
