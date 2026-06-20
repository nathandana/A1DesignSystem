import { supabase } from '../lib/supabase.js'

// Per-user project bundle (the exportAllText() blob). One row per user; RLS
// scopes it to the owner. Callers guard on `supabaseConfigured` + a user id.

export async function fetchUserProjects(userId) {
  const { data, error } = await supabase
    .from('user_projects')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data?.data ?? null
}

export async function saveUserProjects(userId, text) {
  const { error } = await supabase
    .from('user_projects')
    .upsert({ user_id: userId, data: text })
  if (error) throw error
}
