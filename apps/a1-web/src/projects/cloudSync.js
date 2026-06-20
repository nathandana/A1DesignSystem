import { supabaseConfigured } from '../lib/supabase.js'
import { fetchSharedData, saveSharedData } from '../services/sharedDb.js'
import { exportAllText, importAllText } from './projectStore'
import { onStorageWrite, suspendStorageNotify } from '../editor/storage'
import { exportUserPatterns, importUserPatterns, subscribePatterns } from '../patterns/patternStore'
import { exportThemes, importThemes, subscribeThemes } from '../lib/themeStore'

// Cloud sync for all editor data — a single SHARED workspace: every signed-in user
// reads and writes the same bundle. On sign-in the shared bundle is pulled into
// local storage (or the shared row is seeded from local if empty), then local
// changes are pushed back — debounced — whenever projects, patterns, or themes
// change. The bundle is one JSON envelope in the `shared_state.data` text column:
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

export async function startCloudSync(userId, { onHydrated } = {}) {
  currentUserId = userId
  if (!supabaseConfigured || !userId) return
  try {
    const remote = await fetchSharedData()
    if (remote && remote.trim()) {
      // Hydrate local storage from the shared bundle without echoing writes back up.
      suspendPush = true
      suspendStorageNotify(true)
      try { importEnvelope(remote) } finally { suspendStorageNotify(false); suspendPush = false }
      onHydrated?.()
    } else {
      // Shared bundle is empty — seed it from whatever is local.
      await saveSharedData(exportEnvelope())
    }
  } catch (e) {
    console.warn('[cloudSync] pull failed', e)
  }
  if (!unsubscribers.length) {
    unsubscribers.push(onStorageWrite(schedulePush))   // projects + pages
    unsubscribers.push(subscribePatterns(schedulePush)) // user patterns
    unsubscribers.push(subscribeThemes(schedulePush))   // saved themes
  }
}

// Explicitly push everything in local storage up to the user's account now
// (replaces the cloud copy). Used by the Account page's "Import local data".
export async function pushLocalData(userId) {
  if (!supabaseConfigured || !userId) throw new Error('Cloud sync is not configured.')
  await saveUserProjects(userId, exportEnvelope())
}

export function stopCloudSync() {
  currentUserId = null
  unsubscribers.forEach((u) => u())
  unsubscribers = []
  if (pushTimer) { clearTimeout(pushTimer); pushTimer = null }
}

function schedulePush() {
  if (!supabaseConfigured || !currentUserId || suspendPush) return
  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = setTimeout(() => {
    pushTimer = null
    saveUserProjects(currentUserId, exportEnvelope()).catch((e) => console.warn('[cloudSync] push failed', e))
  }, 1500)
}
