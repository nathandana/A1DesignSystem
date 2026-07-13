import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import postcssGlobalData from '@csstools/postcss-global-data'
import postcssCustomMedia from 'postcss-custom-media'
import { loadEnv } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '../..')
const functionsDir = resolve(__dirname, 'server/functions')

function readRequestBody(req) {
  return new Promise((resolveBody, reject) => {
    let raw = ''
    req.setEncoding('utf8')
    req.on('data', (chunk) => { raw += chunk })
    req.on('end', () => resolveBody(raw))
    req.on('error', reject)
  })
}

function localApiFunctions() {
  return {
    name: 'a1-jobs-local-api-functions',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res) => {
        const url = new URL(req.url || '/', 'http://127.0.0.1')
        const functionName = url.pathname.replace(/^\/+/, '').split('/')[0]
        if (!functionName) {
          res.statusCode = 404
          res.end('Function not found')
          return
        }

        try {
          const mod = await import(`${resolve(functionsDir, `${functionName}.mjs`)}?t=${Date.now()}`)
          if (typeof mod.handler !== 'function') throw new Error(`Function ${functionName} has no handler.`)
          const headers = {
            ...req.headers,
            'x-forwarded-proto': req.headers['x-forwarded-proto'] || 'http',
          }
          const result = await mod.handler({
            httpMethod: req.method,
            headers,
            path: `/api/${functionName}`,
            queryStringParameters: Object.fromEntries(url.searchParams.entries()),
            body: ['GET', 'HEAD'].includes(req.method) ? '' : await readRequestBody(req),
          })
          res.statusCode = result.statusCode || 200
          for (const [key, value] of Object.entries(result.headers || {})) {
            res.setHeader(key, value)
          }
          res.end(result.body || '')
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: error.message }))
        }
      })
    },
  }
}

export default ({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] == null) process.env[key] = value
  }

  return {
    plugins: [localApiFunctions()],
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
}
