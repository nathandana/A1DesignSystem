import { useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase.js'
import { useAuth } from '../lib/AuthContext.jsx'

// Live presence for a single document: who else (signed-in) is currently viewing
// the same page id, via a Supabase Realtime presence channel. Returns the list of
// OTHER users on the page (excludes the local user). Dormant unless Supabase is
// configured and a user is signed in. Realtime presence works on channels directly
// — it does not need the postgres_changes publication.
export function usePagePresence(pageId, enabled = true) {
  const { user } = useAuth()
  const [others, setOthers] = useState([])

  useEffect(() => {
    if (!supabaseConfigured || !enabled || !pageId || !user) {
      setOthers([])
      return
    }
    const channel = supabase.channel(`presence-page-${pageId}`, {
      config: { presence: { key: user.id } },
    })

    const compute = () => {
      const state = channel.presenceState()
      const list = []
      for (const key of Object.keys(state)) {
        if (key === user.id) continue
        const meta = state[key]?.[0] ?? {}
        list.push({ key, email: meta.email || 'Someone' })
      }
      setOthers(list)
    }

    channel
      .on('presence', { event: 'sync' }, compute)
      .on('presence', { event: 'join' }, compute)
      .on('presence', { event: 'leave' }, compute)
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') channel.track({ email: user.email, at: Date.now() })
      })

    return () => { supabase.removeChannel(channel) }
  }, [pageId, enabled, user?.id, user?.email])

  return others
}
