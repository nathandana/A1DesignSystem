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

// Match Netlify's isolated preview response locally, including opaque-origin
// module fetches. Public build assets carry no credentials.
const previewPolicy = "sandbox allow-scripts; base-uri 'none'; object-src 'none'; frame-ancestors 'self'"
function previewMiddleware(server) {
  server.middlewares.use((request, response, next) => {
    if (/^\/(preview\/|json-preview\.html)/.test(request.url || '')) {
      if (request.url.startsWith('/json-preview.html')) response.setHeader('Content-Security-Policy', previewPolicy)
      response.setHeader('Referrer-Policy', 'no-referrer')
      response.setHeader('Cache-Control', 'no-store')
      if (request.url.startsWith('/preview/')) request.url = '/preview.html'
    }
    next()
  })
}

export default {
  plugins: [{ name: 'a1-json-preview', configureServer: previewMiddleware, configurePreviewServer: previewMiddleware }],
  preview: { cors: { origin: '*' } },
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
    cors: { origin: '*' },
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
      input: { main: resolve(__dirname, 'index.html'), jsonPreview: resolve(__dirname, 'json-preview.html'), previewHost: resolve(__dirname, 'preview.html') },
      onwarn(warning, defaultHandler) {
        if (isAnthropicSdkBrowserExternalizationWarning(warning)) {
          return
        }

        defaultHandler(warning)
      }
    }
  }
}
