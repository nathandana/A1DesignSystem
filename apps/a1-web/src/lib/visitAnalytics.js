import { supabase, supabaseConfigured } from './supabase.js'

const ENDPOINT = '/.netlify/functions/visit-analytics'
const SESSION_KEY = 'a1-visit-analytics-session'
const SESSION_TIMEOUT = 30 * 60 * 1000
const HEARTBEAT_INTERVAL = 30 * 1000

let currentSession = null

function loadSession() {
  if (currentSession) return currentSession
  try {
    const stored = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null')
    if (stored?.id && Date.now() - stored.lastSeen < SESSION_TIMEOUT) {
      currentSession = stored
    }
  } catch { /* start a fresh visit */ }
  return currentSession
}

function visitSession() {
  const previous = loadSession()
  const now = Date.now()
  const isNew = !previous || now - previous.lastSeen >= SESSION_TIMEOUT
  currentSession = isNew ? { id: crypto.randomUUID(), lastSeen: now } : { ...previous, lastSeen: now }
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentSession)) } catch { /* analytics stays best effort */ }
  return { ...currentSession, isNew }
}

async function send(action, details = {}, beacon = false) {
  if (!supabaseConfigured) return
  const session = action === 'end' ? loadSession() : visitSession()
  if (!session || (action === 'end' && Date.now() - session.lastSeen >= SESSION_TIMEOUT)) return
  const body = JSON.stringify({ action, sessionId: session.id, ...details })

  if (beacon && navigator.sendBeacon) {
    navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }))
    return
  }

  try {
    const { data } = await supabase.auth.getSession()
    await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(data?.session?.access_token
          ? { authorization: `Bearer ${data.session.access_token}` }
          : {}),
      },
      body,
      keepalive: true,
    })
  } catch { /* analytics must never interrupt the app */ }
}

export function recordPageView(page, path = window.location.pathname) {
  void send('pageview', { page, path })
}

export function startVisitHeartbeat(getCurrentPage) {
  const heartbeat = () => {
    if (document.visibilityState !== 'visible') return
    const previous = loadSession()
    if (!previous || Date.now() - previous.lastSeen >= SESSION_TIMEOUT) {
      const current = getCurrentPage()
      recordPageView(current.page, current.path)
      return
    }
    void send('heartbeat')
  }
  const end = () => { void send('end', {}, true) }
  const visible = () => { if (document.visibilityState === 'visible') heartbeat() }
  const interval = window.setInterval(heartbeat, HEARTBEAT_INTERVAL)
  window.addEventListener('pagehide', end)
  document.addEventListener('visibilitychange', visible)
  return () => {
    window.clearInterval(interval)
    window.removeEventListener('pagehide', end)
    document.removeEventListener('visibilitychange', visible)
  }
}
