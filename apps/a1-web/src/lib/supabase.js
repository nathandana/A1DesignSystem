import { createClient } from '@supabase/supabase-js'

// Accounts + cloud sync are opt-in: without both env vars the client is null and
// `supabaseConfigured` is false, so the app runs fully on local storage.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = !!(url && key)

export const supabase = supabaseConfigured ? createClient(url, key) : null
