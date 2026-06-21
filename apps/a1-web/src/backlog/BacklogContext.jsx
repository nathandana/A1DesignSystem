import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Snackbar } from '@gtivr4/a1-design-system-react'
import { useAuth } from '../lib/AuthContext.jsx'
import * as store from '../services/backlog/backlogStore'
import { ticketRef } from '../services/backlog/types'
import { CreateTicketDialog } from './CreateTicketDialog'

/**
 * Holds the shared backlog state (tickets, the current user's notifications, which
 * tickets they've voted for) and exposes the actions every backlog surface uses.
 * Also owns the one global "New ticket" dialog so any surface can open it pre-scoped
 * via `useBacklog().openCreate(scope)`. Subscribes to the store so the board and the
 * notification badge update live (Realtime + poll fallback, or local events offline).
 */
const BacklogContext = createContext(null)

export function BacklogProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [notifications, setNotifications] = useState([])
  const [votedSet, setVotedSet] = useState(() => new Set())
  const [loading, setLoading] = useState(true)
  const [createScope, setCreateScope] = useState(null) // null = closed
  const [createOpen, setCreateOpen] = useState(false)
  const [toast, setToast] = useState('')
  const reqId = useRef(0)

  const refresh = useCallback(async () => {
    const id = ++reqId.current
    const [nextItems, nextNotifs, voted] = await Promise.all([
      store.listItems(), store.listNotifications(), store.votedItemIds(),
    ])
    if (id !== reqId.current) return // a newer refresh superseded this one
    setItems(nextItems)
    setNotifications(nextNotifs)
    setVotedSet(new Set(voted))
    setLoading(false)
  }, [])

  // Point the store at the cloud (signed in) or local backend, then (re)load and
  // subscribe. Re-runs when the signed-in user changes so we resubscribe to the new
  // backend and pick up that user's notifications / votes.
  useEffect(() => {
    store.setBacklogUser(user ?? null)
    setLoading(true)
    refresh()
    const unsub = store.subscribe(refresh)
    return unsub
  }, [user?.id, refresh]) // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = useCallback((scope) => {
    setCreateScope(scope || { kind: 'general' })
    setCreateOpen(true)
  }, [])

  const handleCreate = useCallback(async (input) => {
    const item = await store.createItem(input)
    await refresh()
    setToast(`Created ${ticketRef(item.number)} — ${item.title}`)
    return item
  }, [refresh])

  const update = useCallback(async (prev, patch) => {
    const next = await store.updateItem(prev, patch)
    await refresh()
    return next
  }, [refresh])

  const comment = useCallback(async (item, kind, body) => {
    const c = await store.addComment(item, kind, body)
    await refresh()
    return c
  }, [refresh])

  const vote = useCallback(async (item, voted) => {
    await store.setVote(item, voted)
    await refresh()
  }, [refresh])

  const markRead = useCallback(async (ids) => {
    await store.markNotificationsRead(ids)
    await refresh()
  }, [refresh])

  const loadComments = useCallback((itemId) => store.listComments(itemId), [])

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])
  const me = user ? { id: user.id, email: user.email } : null

  const value = useMemo(() => ({
    items, notifications, unreadCount, votedSet, loading,
    isCloud: store.isCloudBacklog(),
    user: me,
    openCreate, create: handleCreate, update, comment, vote, markRead, loadComments, refresh,
  }), [items, notifications, unreadCount, votedSet, loading, me,
    openCreate, handleCreate, update, comment, vote, markRead, loadComments, refresh])

  return (
    <BacklogContext.Provider value={value}>
      {children}
      <CreateTicketDialog
        open={createOpen}
        scope={createScope}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
      <Snackbar open={!!toast} position="bottom" onClose={() => setToast('')}>{toast}</Snackbar>
    </BacklogContext.Provider>
  )
}

/** Backlog state + actions. Returns null outside the provider (e.g. standalone pages). */
export function useBacklog() {
  return useContext(BacklogContext)
}

/** Convenience for "create ticket" launchers: returns `openCreate(scope)` or a no-op. */
export function useOpenCreateTicket() {
  const ctx = useContext(BacklogContext)
  return ctx ? ctx.openCreate : () => {}
}
