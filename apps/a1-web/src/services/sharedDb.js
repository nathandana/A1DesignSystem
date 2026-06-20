import { supabase } from '../lib/supabase.js'

// The shared workspace bundle (the app's exportEnvelope() blob: projects + pages
// + patterns + themes). A single row (id = 1) that every signed-in user reads and
// writes — RLS allows any authenticated user. Callers guard on `supabaseConfigured`
// + a signed-in user.

export async function fetchSharedData() {
  const { data, error } = await supabase
    .from('shared_state')
    .select('data')
    .eq('id', 1)
    .maybeSingle()
  if (error) throw error
  return data?.data ?? null
}

export async function saveSharedData(text) {
  const { error } = await supabase
    .from('shared_state')
    .upsert({ id: 1, data: text })
  if (error) throw error
}
