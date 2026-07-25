import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { createReadStream, existsSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const appDir = resolve(fileURLToPath(new URL('..', import.meta.url)))
const distDir = resolve(appDir, 'dist')
const port = Number(process.env.TESLA_PROXY_PORT || process.env.PORT || 5189)
const appOrigin = process.env.TESLA_APP_ORIGIN || `http://127.0.0.1:${port}`
const clientId = process.env.TESLA_CLIENT_ID || ''
const clientSecret = process.env.TESLA_CLIENT_SECRET || ''
const redirectUri = process.env.TESLA_REDIRECT_URI || `${appOrigin}/api/tesla/oauth/callback`
const audience = process.env.TESLA_AUDIENCE || 'https://fleet-api.prd.na.vn.cloud.tesla.com'
const scopes = process.env.TESLA_SCOPES || 'openid offline_access vehicle_device_data vehicle_location vehicle_charging_cmds'

const authBase = 'https://auth.tesla.com/oauth2/v3'
const tokenUrl = 'https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token'

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
}

function sendJson(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    ...headers,
  })
  res.end(JSON.stringify(body))
}

function parseCookies(cookieHeader = '') {
  return Object.fromEntries(cookieHeader.split(';').map((part) => {
    const [key, ...value] = part.trim().split('=')
    return [key, decodeURIComponent(value.join('='))]
  }).filter(([key]) => key))
}

function encodeTokenCookie(token) {
  return Buffer.from(JSON.stringify(token), 'utf8').toString('base64url')
}

function decodeTokenCookie(value) {
  try {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'))
  } catch {
    return null
  }
}

function cookie(name, value, maxAge) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ]
  if (appOrigin.startsWith('https://')) parts.push('Secure')
  if (maxAge != null) parts.push(`Max-Age=${maxAge}`)
  return parts.join('; ')
}

function readBody(req) {
  return new Promise((resolveBody, reject) => {
    let raw = ''
    req.setEncoding('utf8')
    req.on('data', (chunk) => { raw += chunk })
    req.on('end', () => resolveBody(raw))
    req.on('error', reject)
  })
}

async function exchangeToken(params) {
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params),
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = body.error_description || body.error || `Tesla token request failed with ${response.status}`
    throw new Error(message)
  }
  return {
    ...body,
    expires_at: Date.now() + Number(body.expires_in || 0) * 1000,
  }
}

async function getAccessToken(req, res) {
  let token = decodeTokenCookie(parseCookies(req.headers.cookie).tesla_token)
  if (!token?.access_token) return null

  const expiresSoon = Number(token.expires_at || 0) < Date.now() + 120000
  if (!expiresSoon) return token.access_token
  if (!token.refresh_token) return token.access_token

  token = await exchangeToken({
    grant_type: 'refresh_token',
    client_id: clientId,
    refresh_token: token.refresh_token,
  })
  res.setHeader('Set-Cookie', cookie('tesla_token', encodeTokenCookie(token), 60 * 60 * 24 * 90))
  return token.access_token
}

function requireConfig(res) {
  if (clientId && clientSecret) return true
  sendJson(res, 501, {
    error: 'Tesla OAuth is not configured.',
    required: ['TESLA_CLIENT_ID', 'TESLA_CLIENT_SECRET'],
  })
  return false
}

async function proxyTesla(req, res, targetPath, init = {}) {
  const accessToken = await getAccessToken(req, res)
  if (!accessToken) {
    sendJson(res, 401, { error: 'Not connected to Tesla.' })
    return
  }

  const response = await fetch(`${audience}${targetPath}`, {
    method: init.method || 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    body: init.body,
  })
  const text = await response.text()
  res.writeHead(response.status, {
    'Content-Type': response.headers.get('content-type') || 'application/json; charset=utf-8',
  })
  res.end(text)
}

async function handleApi(req, res, url) {
  if (url.pathname === '/api/tesla/config') {
    sendJson(res, 200, {
      connected: !!parseCookies(req.headers.cookie).tesla_token,
      configured: !!(clientId && clientSecret),
      audience,
      scopes,
    })
    return true
  }

  if (url.pathname === '/api/tesla/logout') {
    res.writeHead(302, {
      Location: '/',
      'Set-Cookie': [
        cookie('tesla_token', '', 0),
        cookie('tesla_oauth_state', '', 0),
      ],
    })
    res.end()
    return true
  }

  if (url.pathname === '/api/tesla/oauth/start') {
    if (!requireConfig(res)) return true
    const state = crypto.randomUUID()
    const authUrl = new URL(`${authBase}/authorize`)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('scope', scopes)
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('prompt_missing_scopes', 'true')
    authUrl.searchParams.set('require_requested_scopes', 'true')
    res.writeHead(302, {
      Location: authUrl.toString(),
      'Set-Cookie': cookie('tesla_oauth_state', state, 600),
    })
    res.end()
    return true
  }

  if (url.pathname === '/api/tesla/oauth/callback') {
    if (!requireConfig(res)) return true
    const expectedState = parseCookies(req.headers.cookie).tesla_oauth_state
    const state = url.searchParams.get('state')
    const code = url.searchParams.get('code')
    if (!code || !state || state !== expectedState) {
      res.writeHead(302, { Location: '/?tesla=auth_error' })
      res.end()
      return true
    }
    try {
      const token = await exchangeToken({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code,
        audience,
        redirect_uri: redirectUri,
      })
      res.writeHead(302, {
        Location: '/',
        'Set-Cookie': [
          cookie('tesla_token', encodeTokenCookie(token), 60 * 60 * 24 * 90),
          cookie('tesla_oauth_state', '', 0),
        ],
      })
      res.end()
    } catch (error) {
      res.writeHead(302, { Location: `/?tesla=auth_error&message=${encodeURIComponent(error.message)}` })
      res.end()
    }
    return true
  }

  if (url.pathname === '/api/tesla/vehicles/fleet_status') {
    const rawBody = req.method === 'POST' ? await readBody(req) : '{}'
    await proxyTesla(req, res, '/api/1/vehicles/fleet_status', {
      method: 'POST',
      body: rawBody,
    })
    return true
  }

  if (url.pathname === '/api/tesla/charging/history') {
    await proxyTesla(req, res, `/api/1/dx/charging/history${url.search}`)
    return true
  }

  if (url.pathname === '/api/tesla/vehicles') {
    await proxyTesla(req, res, `/api/1/vehicles${url.search}`)
    return true
  }

  const vehicleMatch = url.pathname.match(/^\/api\/tesla\/vehicles\/([^/]+)(?:\/([^/]+))?$/)
  if (vehicleMatch) {
    const vin = encodeURIComponent(vehicleMatch[1])
    const leaf = vehicleMatch[2]
    const allowedLeaves = new Set([
      'vehicle_data',
      'mobile_enabled',
      'nearby_charging_sites',
      'recent_alerts',
      'release_notes',
      'service_data',
      'fleet_telemetry_config',
      'fleet_telemetry_errors',
    ])
    if (!leaf) {
      await proxyTesla(req, res, `/api/1/vehicles/${vin}${url.search}`)
      return true
    }
    if (allowedLeaves.has(leaf)) {
      await proxyTesla(req, res, `/api/1/vehicles/${vin}/${leaf}${url.search}`)
      return true
    }
  }

  return false
}

async function serveStatic(req, res, url) {
  const pathname = url.pathname === '/' ? '/index.html' : url.pathname
  const candidate = normalize(join(distDir, pathname))
  const filePath = candidate.startsWith(distDir) && existsSync(candidate) ? candidate : join(distDir, 'index.html')
  const ext = extname(filePath)
  res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' })
  createReadStream(filePath).pipe(res)
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', appOrigin)
  try {
    if (url.pathname.startsWith('/api/tesla') && await handleApi(req, res, url)) return
    if (!existsSync(join(distDir, 'index.html'))) {
      const fallback = await readFile(join(appDir, 'README.md'), 'utf8')
      res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end(`Build the app first with npm run build --workspace=tesla-a1.\n\n${fallback}`)
      return
    }
    await serveStatic(req, res, url)
  } catch (error) {
    sendJson(res, 500, { error: error.message })
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Tesla A1 running at http://127.0.0.1:${port}/`)
})
