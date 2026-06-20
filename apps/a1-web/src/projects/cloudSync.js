import { supabase, supabaseConfigured } from '../lib/supabase.js'
import { fetchSharedData, saveSharedData } from '../services/sharedDb.js'
import { exportAllText, importAllText } from './projectStore'
import { onStorageWrite, suspendStorageNotify } from '../editor/storage'
import { exportUserPatterns, importUserPatterns, subscribePatterns } from '../patterns/patternStore'
import { exportThemes, importThemes, subscribeThemes } from '../lib/themeStore'

// Cloud sync for all editor data — a single SHARED workspace: every signed-in user
// reads and writes the same bundle. On sign-in the shared bundle is pulled into
// local storage (or the shared row is seeded from local if empty), then local
// changes are pushed back — debounced — whenever projects, patterns, or themes
// change. A Supabase **realtime** subscription re-pulls automatically when any other
// client writes, so changes propagate live without a reload. The bundle is one JSON
// envelope in the `shared_state.data` text column:
//   { __a1bundle, projects: <exportAllText text>, patterns: [...], themes: [...] }
// Images are not in the envelope — they sync separately via Supabase Storage.
// Last-write-wins across users (the whole envelope is replaced on each push).
// Dormant unless Supabase is configured and a user is signed in.

const BUNDLE_VERSION = 2

/** Serialise every synced data type into one envelope string. */
function exportEnvelope() {
  return JSON.stringify({
    __a1bundle: BUNDLE_VERSION,
    projects: exportAllText(),
    patterns: exportUserPatterns(),
    themes: exportThemes(),
  })
}

/** Restore from an envelope (or a legacy projects-only plain-text export). */
function importEnvelope(text) {
  if (!text || !text.trim()) return
  let bundle = null
  try {
    const parsed = JSON.parse(text)
    if (parsed && parsed.__a1bundle) bundle = parsed
  } catch { /* not JSON — a legacy plain-text projects export */ }
  if (bundle) {
    if (typeof bundle.projects === 'string') importAllText(bundle.projects)
    importUserPatterns(bundle.patterns)
    importThemes(bundle.themes)
  } else {
    importAllText(text) // legacy: projects-only
  }
}

let currentUserId = null
let pushTimer = null
let unsubscribers = []
let suspendPush = false
let channel = null
let pollTimer = null
let onHydratedCb = null
const POLL_MS = 8000
// The envelope string we last pulled or pushed — used to ignore our own realtime
// echo and skip redundant re-hydrates.
let lastSyncedData = null

/** Apply a shared bundle pulled from the cloud without echoing the writes back up. */
function hydrateFromRemote(text) {
  if (text == null || text === lastSyncedData) return
  lastSyncedData = text
  suspendPush = true
  suspendStorageNotify(true)
  try { importEnvelope(text) } finally { suspendStorageNotify(false); suspendPush = false }
  onHydratedCb?.()
}

export async function startCloudSync(userId, { onHydrated } = {}) {
  currentUserId = userId
  onHydratedCb = onHydrated ?? null
  if (!supabaseConfigured || !userId) return
  try {
    const remote = await fetchSharedData()
    if (remote && remote.trim()) {
      lastSyncedData = remote
      suspendPush = true
      suspendStorageNotify(true)
      try { importEnvelope(remote) } finally { suspendStorageNotify(false); suspendPush = false }
      onHydrated?.()
    } else {
      // Shared bundle is empty — seed it from whatever is local.
      const envelope = exportEnvelope()
      lastSyncedData = envelope
      await saveSharedData(envelope)
    }
  } catch (e) {
    console.warn('[cloudSync] pull failed', e)
  }
  // Live updates: re-pull whenever any client writes the shared row. Realtime needs
  // the access token so its connection is authenticated (the shared_state SELECT
  // policy is `to authenticated`), or no change events are delivered.
  if (!channel) {
    try {
      const { data } = await supabase.auth.getSession()
      if (data?.session?.access_token) supabase.realtime.setAuth(data.session.access_token)
    } catch { /* ignore */ }
    channel = supabase
      .channel('shared_state_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shared_state', filter: 'id=eq.1' },
        (payload) => hydrateFromRemote(payload.new?.data),
      )
      .subscribe()
  }
  // Reliable fallback: poll the shared row so changes propagate even if Realtime
  // isn't enabled on the table (or its auth doesn't resolve). hydrateFromRemote
  // skips when nothing changed, so this is cheap.
  if (!pollTimer) {
    pollTimer = setInterval(() => {
      fetchSharedData().then(hydrateFromRemote).catch(() => { /* offline */ })
    }, POLL_MS)
  }
  // Push local changes (debounced) when projects/pages, patterns, or themes change.
  if (!unsubscribers.length) {
    unsubscribers.push(onStorageWrite(schedulePush))
    unsubscribers.push(subscribePatterns(schedulePush))
    unsubscribers.push(subscribeThemes(schedulePush))
  }
}

// Explicitly push everything in local storage up to the shared workspace now
// (replaces the shared copy). Used by the Account page's "Import local data".
export async function pushLocalData(userId) {
  if (!supabaseConfigured || !userId) throw new Error('Cloud sync is not configured.')
  const envelope = exportEnvelope()
  lastSyncedData = envelope
  await saveSharedData(envelope)
}

export function stopCloudSync() {
  currentUserId = null
  onHydratedCb = null
  unsubscribers.forEach((u) => u())
  unsubscribers = []
  if (pushTimer) { clearTimeout(pushTimer); pushTimer = null }
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
  if (channel) { supabase.removeChannel(channel); channel = null }
  lastSyncedData = null
}

function schedulePush() {
  if (!supabaseConfigured || !currentUserId || suspendPush) return
  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = setTimeout(() => {
    pushTimer = null
    const envelope = exportEnvelope()
    lastSyncedData = envelope // ignore the realtime echo of our own write
    saveSharedData(envelope).catch((e) => console.warn('[cloudSync] push failed', e))
  }, 1500)
}
