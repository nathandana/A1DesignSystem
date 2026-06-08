import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

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
  build: {
    outDir: 'dist'
  }
}
