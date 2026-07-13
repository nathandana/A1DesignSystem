import { json, options } from './_utils.mjs'

const DEFAULT_BRIDGE_HOST = process.env.A1_CODEX_BRIDGE_URL || 'http://127.0.0.1:4317'

function normalizeBridgeHost(value) {
  const raw = String(value || '').trim()
  if (!raw || raw === 'http://localhost:4317') return DEFAULT_BRIDGE_HOST
  const withProtocol = /^[a-z]+:\/\//i.test(raw) ? raw : `http://${raw}`
  return withProtocol.replace(/\/+$/, '')
}

async function bridgeFetch(host, route, payload, timeoutMs = 180000) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const url = `${host}${route}`
    const init = route === '/health'
      ? { signal: ctrl.signal }
      : {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: ctrl.signal,
          body: JSON.stringify(payload ?? {}),
        }
    const res = await fetch(url, init)
    const data = await res.json().catch(() => ({}))
    if (!res.ok || data?.ok === false) {
      const error = new Error(data?.error || `CODEX_BRIDGE_HTTP_${res.status}`)
      error.statusCode = res.status
      throw error
    }
    return data
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`The A1 Codex bridge timed out at ${host}.`)
    }
    if (error instanceof TypeError) {
      throw new Error(`The A1 Codex bridge is not reachable at ${host}.`)
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return options()
  try {
    const body = event.body ? JSON.parse(event.body) : {}
    const route = body.route || '/health'
    if (!route.startsWith('/')) throw new Error('Invalid bridge route.')
    const host = normalizeBridgeHost(body.bridgeHost)
    const result = await bridgeFetch(host, route, body.payload, body.timeoutMs)
    return json(200, result)
  } catch (error) {
    return json(error.statusCode || 502, { ok: false, error: error.message })
  }
}
