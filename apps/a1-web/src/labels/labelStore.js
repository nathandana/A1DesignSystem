import { supabase, supabaseConfigured } from '../lib/supabase.js'

const STORAGE_KEY = 'a1-labels-v1'
const SUPABASE_TABLE = 'workspace_labels'
const SUPABASE_ROW_ID = 1

const DEFAULT_DATA = {
  locales: ['en', 'es', 'fr', 'de', 'pt', 'ja', 'zh', 'ar'],
  items: [],
}

let remoteReady = false
let lastSerialized = ''
let realtimeChannel = null
let realtimePoll = null
let realtimeSubscribers = 0

function normalize(data) {
  if (!data || typeof data !== 'object') return { ...DEFAULT_DATA }
  return {
    locales: Array.isArray(data.locales) ? data.locales : DEFAULT_DATA.locales,
    items: Array.isArray(data.items) ? data.items : DEFAULT_DATA.items,
  }
}

function serialize(data) {
  return JSON.stringify(normalize(data))
}

function hasItems(data) {
  return Array.isArray(data?.items) && data.items.length > 0
}

function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return normalize(parsed)
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_DATA }
}

const subscribers = new Set()

function notify(data = readLocal()) {
  subscribers.forEach((fn) => { try { fn(data) } catch { /* ignore */ } })
}

function writeLocal(data, { shouldNotify = true } = {}) {
  const normalized = normalize(data)
  const serialized = serialize(normalized)
  try { localStorage.setItem(STORAGE_KEY, serialized) } catch { /* ignore */ }
  lastSerialized = serialized
  if (shouldNotify) notify(normalized)
  return normalized
}

async function hasSession() {
  if (!supabaseConfigured) return false
  try {
    const { data } = await supabase.auth.getSession()
    return !!data?.session
  } catch {
    return false
  }
}

async function readRemote() {
  if (!await hasSession()) return null
  const { data, error } = await supabase
    .from(SUPABASE_TABLE)
    .select('data')
    .eq('id', SUPABASE_ROW_ID)
    .maybeSingle()
  if (error) throw error
  return data?.data ? normalize(data.data) : null
}

async function writeRemote(data) {
  if (!await hasSession()) return
  const normalized = normalize(data)
  const { error } = await supabase
    .from(SUPABASE_TABLE)
    .upsert({ id: SUPABASE_ROW_ID, data: normalized })
  if (error) throw error
}

async function pullRemote({ notifySubscribers = true } = {}) {
  try {
    const remote = await readRemote()
    if (!remote) return readLocal()
    const serialized = serialize(remote)
    if (serialized === lastSerialized) return remote
    return writeLocal(remote, { shouldNotify: notifySubscribers })
  } catch (error) {
    console.warn('[labels] Supabase pull failed', error)
    return readLocal()
  }
}

export function getLabels() {
  return readLocal()
}

export async function hydrateLabels() {
  if (remoteReady) return readLocal()
  remoteReady = true

  const local = readLocal()
  let remote = null
  try {
    remote = await readRemote()
  } catch (error) {
    console.warn('[labels] Supabase pull failed', error)
  }

  if (remote) {
    if (!hasItems(remote) && hasItems(local)) {
      writeRemote(local).catch((error) => console.warn('[labels] Supabase seed failed', error))
      return local
    }
    if (serialize(remote) !== serialize(local)) {
      writeLocal(remote, { shouldNotify: false })
      notify(remote)
      return remote
    }
    return remote
  }

  if (supabaseConfigured && local.items.length) {
    writeRemote(local).catch((error) => console.warn('[labels] Supabase seed failed', error))
  }
  return local
}

export function saveLabels(data) {
  const normalized = writeLocal(data)
  writeRemote(normalized).catch((error) => console.warn('[labels] Supabase save failed', error))
}

export function subscribeLabels(fn) {
  subscribers.add(fn)
  return () => subscribers.delete(fn)
}

export function exportLabels() {
  return readLocal()
}

export function importLabels(data) {
  if (!data || typeof data !== 'object') return
  const current = readLocal()
  const merged = {
    locales: Array.isArray(data.locales) ? data.locales : current.locales,
    items: Array.isArray(data.items) ? data.items : current.items,
  }
  saveLabels(merged)
}

export function subscribeRemoteLabels() {
  if (!supabaseConfigured) return () => {}
  realtimeSubscribers += 1
  if (!realtimeChannel) {
    ;(async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (data?.session?.access_token) supabase.realtime.setAuth(data.session.access_token)
      } catch { /* ignore */ }
      realtimeChannel = supabase
        .channel('workspace_labels_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: SUPABASE_TABLE, filter: `id=eq.${SUPABASE_ROW_ID}` },
          (payload) => {
            const incoming = payload.new?.data ? normalize(payload.new.data) : null
            if (!incoming) return
            if (serialize(incoming) === lastSerialized) return
            writeLocal(incoming)
          },
        )
        .subscribe()
    })()
  }
  if (!realtimePoll) {
    realtimePoll = setInterval(() => {
      pullRemote().catch(() => { /* offline */ })
    }, 8000)
  }
  return () => {
    realtimeSubscribers = Math.max(0, realtimeSubscribers - 1)
    if (realtimeSubscribers > 0) return
    if (realtimeChannel) { supabase.removeChannel(realtimeChannel); realtimeChannel = null }
    if (realtimePoll) { clearInterval(realtimePoll); realtimePoll = null }
  }
}

// ── Label object builders ────────────────────────────────────────────────────

/**
 * Convert flat items [{key, en, es, ...}] to the DTCG-nested format
 * {label: {category: {key: {$value, locale: {...}}}}} that LabelsProvider
 * understands.
 */
export function buildLabelsObject(items) {
  if (!items?.length) return { label: {} }
  const out = { label: {} }
  for (const item of items) {
    if (!item.key) continue
    const parts = item.key.split('.')
    let node = out.label
    for (let i = 0; i < parts.length - 1; i++) {
      if (!node[parts[i]]) node[parts[i]] = {}
      node = node[parts[i]]
    }
    const last = parts[parts.length - 1]
    const locales = {}
    for (const [k, v] of Object.entries(item)) {
      if (k === 'key' || k === 'en' || k === '__rid') continue
      if (v != null && v !== '') locales[k] = String(v)
    }
    node[last] = { $type: 'string', $value: item.en ?? '', locale: locales }
  }
  return out
}

/**
 * Convert project.labelOverrides {key: {locale: value}} to DTCG nested format
 * for LabelsProvider.
 */
export function buildProjectLabelsObject(labelOverrides) {
  if (!labelOverrides) return { label: {} }
  const items = Object.entries(labelOverrides).map(([key, locales]) => ({
    key,
    en: locales.en ?? '',
    ...Object.fromEntries(Object.entries(locales).filter(([k]) => k !== 'en')),
  }))
  return buildLabelsObject(items)
}

/**
 * Deep-merge label nodes. Later arguments override earlier ones.
 * Merges locale/brand maps shallowly; recursively merges nested nodes.
 */
export function deepMergeLabels(...nodes) {
  const result = {}
  for (const node of nodes) {
    if (!node || typeof node !== 'object') continue
    for (const [k, v] of Object.entries(node)) {
      if (k === '$value' || k === '$type' || k === '$description') {
        if (v != null && v !== '') result[k] = v
      } else if (k === 'locale' || k === 'brand') {
        result[k] = { ...(result[k] ?? {}), ...(v ?? {}) }
      } else if (v && typeof v === 'object') {
        result[k] = deepMergeLabels(result[k] ?? {}, v)
      } else {
        result[k] = v
      }
    }
  }
  return result
}
