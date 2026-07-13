const DEFAULT_HOST = import.meta.env.VITE_CODEX_BRIDGE_URL || 'http://127.0.0.1:4317'
const HOST_KEY = 'a1-jobs-codex-bridge-host'

function normalizeBridgeHost(value) {
  const raw = String(value || '').trim()
  if (!raw || raw === 'http://localhost:4317') return DEFAULT_HOST
  const withProtocol = /^[a-z]+:\/\//i.test(raw) ? raw : `http://${raw}`
  return withProtocol.replace(/\/+$/, '')
}

export function localCodexBridgeHost() {
  try {
    return normalizeBridgeHost(localStorage.getItem(HOST_KEY))
  } catch {
    return DEFAULT_HOST
  }
}

export function setLocalCodexBridgeHost(host) {
  try {
    const value = String(host || '').trim()
    if (value) localStorage.setItem(HOST_KEY, normalizeBridgeHost(value))
    else localStorage.removeItem(HOST_KEY)
  } catch {
    /* ignore */
  }
}

async function codexProxy(route, payload, timeoutMs) {
  const res = await fetch('/api/codex-task', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      route,
      payload,
      timeoutMs,
      bridgeHost: localCodexBridgeHost(),
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error || `CODEX_BRIDGE_HTTP_${res.status}`)
  }
  return data
}

export async function checkLocalCodexBridge(timeoutMs = 1500) {
  try {
    const data = await codexProxy('/health', null, timeoutMs)
    return data?.ok === true
  } catch {
    return false
  }
}

export async function runJobsCodexTask(route, payload, timeoutMs = 180000) {
  return codexProxy(route, payload, timeoutMs)
}
