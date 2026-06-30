import { createClient } from '@supabase/supabase-js'

// Accounts + cloud sync are opt-in: without both env vars the client is null and
// `supabaseConfigured` is false, so the app runs fully on local storage.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = !!(url && key)

const localHosts = new Set(['localhost', '127.0.0.1', '::1'])
const hostname = typeof window === 'undefined' ? '' : window.location.hostname
const protocol = typeof window === 'undefined' ? '' : window.location.protocol

// Cloud sync can be configured locally, but the full-page auth gate is only for
// live/non-local deployments. This keeps local demos, QA captures, and dev work
// ungated while preserving invite-only access on the hosted app.
export const authRequired = supabaseConfigured && protocol !== 'file:' && !localHosts.has(hostname)

export const supabase = supabaseConfigured ? createClient(url, key) : null
