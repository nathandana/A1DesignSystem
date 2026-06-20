import { supabase, supabaseConfigured } from '../lib/supabase.js'

// Shared, attributed edit history (the `edit_history` table). An append-only log of
// changes to a page / theme / pattern, each tagged with the signed-in user. Stored
// in Supabase so it's attached to the object and visible to every user — not local.
// Dormant unless Supabase is configured and a user is set.

let currentUser = null

/** Set the user tagged on new history entries (called on auth change). */
export function setHistoryUser(user) {
  currentUser = user ? { id: user.id, email: user.email } : null
}

/** Append a change to the log. No-op unless configured + signed in. */
export async function appendHistory({ entityType, entityId, label, snapshot }) {
  if (!supabaseConfigured || !currentUser || !entityId) return
  const { error } = await supabase.from('edit_history').insert({
    entity_type: entityType,
    entity_id: entityId,
    label: label || 'Edit',
    user_id: currentUser.id,
    user_email: currentUser.email,
    snapshot: snapshot ?? null,
  })
  if (error) console.warn('[history] append failed', error)
}

/** Fetch an object's history, oldest first. */
export async function fetchHistory(entityType, entityId, limit = 200) {
  if (!supabaseConfigured || !entityId) return []
  const { data, error } = await supabase
    .from('edit_history')
    .select('id,label,user_email,snapshot,created_at')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .order('created_at', { ascending: true })
    .limit(limit)
  if (error) { console.warn('[history] fetch failed', error); return [] }
  return data ?? []
}

/** Rename a history entry's label. */
export async function updateHistoryLabel(id, label) {
  if (!supabaseConfigured) return
  const { error } = await supabase.from('edit_history').update({ label }).eq('id', id)
  if (error) console.warn('[history] rename failed', error)
}
