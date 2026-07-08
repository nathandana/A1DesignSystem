import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import postcssGlobalData from '@csstools/postcss-global-data'
import postcssCustomMedia from 'postcss-custom-media'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '../..')

const isAnthropicSdkBrowserExternalizationWarning = (warning) => {
  const message = typeof warning === 'string' ? warning : warning?.message ?? ''
  const plugin = typeof warning === 'string' ? undefined : warning?.plugin

  return (
    (!plugin || plugin === 'rolldown:vite-resolve') &&
    message.includes('has been externalized for browser compatibility') &&
    message.includes('@anthropic-ai/sdk/') &&
    /Module "node:(?:fs|path)"/.test(message)
  )
}

export default {
  esbuild: {
    jsxImportSource: 'react'
  },
  resolve: {
    alias: [
      {
        find: /^@gtivr4\/a1-design-system-react\/(.+)$/,
        replacement: resolve(repoRoot, 'packages/react/src/$1')
      },
      {
        find: '@gtivr4/a1-design-system-react',
        replacement: resolve(repoRoot, 'packages/react/src/index.js')
      }
    ]
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
    outDir: 'dist',
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (isAnthropicSdkBrowserExternalizationWarning(warning)) {
          return
        }

        defaultHandler(warning)
      }
    }
  }
}
