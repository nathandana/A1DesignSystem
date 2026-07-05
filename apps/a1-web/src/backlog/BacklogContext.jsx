import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Snackbar } from '@gtivr4/a1-design-system-react'
import { useAuth } from '../lib/AuthContext.jsx'
import { registerSyncSource } from '../lib/manualSync.js'
import * as store from '../services/backlog/backlogStore'
import { runPersona, runPersonaOnItem, runStatusCleanup } from '../services/backlog/personas'
import changelog from '../../CHANGELOG.md?raw'
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
  const [toast, setToast] = useState(null)
  const labelResolverRef = useRef((_key, fallback) => fallback)
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
    const unregister = registerSyncSource('backlog', refresh)
    return () => { unsub(); unregister() }
  }, [user?.id, refresh]) // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = useCallback((scope) => {
    setCreateScope(scope || { kind: 'general' })
    setCreateOpen(true)
  }, [])

  const handleCreate = useCallback(async (input) => {
    const item = await store.createItem(input)
    await refresh()
    setToast({
      message: `Created ${ticketRef(item.number)} — ${item.title}`,
      href: `/backlog/${ticketRef(item.number)}`,
      actionLabel: labelResolverRef.current('app.backlog.menuOpenTicket', 'Open ticket'),
    })
    return item
  }, [refresh])

  const update = useCallback(async (prev, patch) => {
    try {
      const next = await store.updateItem(prev, patch)
      await refresh()
      if (next) setToast({ message: `Updated ${ticketRef(next.number)} — ${next.title}` })
      return next
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Could not update the ticket.' })
      await refresh()
      return null
    }
  }, [refresh])

  const comment = useCallback(async (item, kind, body) => {
    const c = await store.addComment(item, kind, body)
    await refresh()
    return c
  }, [refresh])

  // Answer a specific question inline (e.g. a multiple-choice answer to a PO question).
  const answer = useCallback(async (item, questionId, body, choice) => {
    const c = await store.answerQuestion(item, questionId, body, choice)
    await refresh()
    return c
  }, [refresh])

  const vote = useCallback(async (item, voted) => {
    await store.setVote(item, voted)
    await refresh()
  }, [refresh])

  // Merge (join) two similar tickets into one — A1-161. The duplicate is closed and its
  // thread/votes/description move to the canonical survivor.
  const merge = useCallback(async (duplicate, canonical) => {
    const res = await store.mergeTickets(duplicate, canonical)
    await refresh()
    setToast({ message: `Merged ${ticketRef(duplicate.number)} into ${ticketRef(canonical.number)}` })
    return res
  }, [refresh])

  // Link / unlink two tickets as related (A1-218) — symmetric; both tickets stay open.
  const link = useCallback(async (a, b) => {
    await store.linkTickets(a, b)
    await refresh()
    setToast({ message: `Linked ${ticketRef(a.number)} and ${ticketRef(b.number)}` })
  }, [refresh])

  const unlink = useCallback(async (a, b) => {
    await store.unlinkTickets(a, b)
    await refresh()
  }, [refresh])

  const remove = useCallback(async (item) => {
    await store.removeItem(item.id)
    await refresh()
    setToast({ message: `Deleted ${ticketRef(item.number)} — ${item.title}` })
  }, [refresh])

  const markRead = useCallback(async (ids) => {
    await store.markNotificationsRead(ids)
    await refresh()
  }, [refresh])

  const loadComments = useCallback((itemId) => store.listComments(itemId), [])

  const setLabelResolver = useCallback((resolver) => {
    labelResolverRef.current = typeof resolver === 'function'
      ? resolver
      : ((_key, fallback) => fallback)
  }, [])

  const openToastTicket = useCallback(() => {
    if (!toast?.href) return
    if (window.location.pathname !== toast.href) {
      window.history.pushState({ page: 'backlog-ticket' }, '', toast.href)
    }
    const event = typeof PopStateEvent === 'function'
      ? new PopStateEvent('popstate', { state: { page: 'backlog-ticket' } })
      : new Event('popstate')
    window.dispatchEvent(event)
    setToast(null)
  }, [toast?.href])

  // Virtual Team: run a persona over the backlog. Pass { dryRun: true } to preview
  // without writing; a real run refreshes so the board reflects the changes. The CHANGELOG
  // is supplied so the PO can move tickets that have shipped.
  const reviewWithPersona = useCallback(async (persona, opts) => {
    const summary = await runPersona(persona, { ...opts, changelog })
    if (!opts?.dryRun) await refresh()
    return summary
  }, [refresh])

  // Status-only cleanup: move open tickets that appear in the CHANGELOG to done/released.
  // No priority/size/question changes — just reconciles status against what's been shipped.
  const cleanupStatus = useCallback(async (persona, opts) => {
    const summary = await runStatusCleanup(persona, { ...opts, changelog })
    if (!opts?.dryRun) await refresh()
    return summary
  }, [refresh])

  // Review a single ticket with a persona (the per-ticket review button), then refresh so
  // the dialog reflects the new type/priority/size/tag/question. Passes the backlog for context.
  const reviewItem = useCallback(async (persona, item) => {
    const outcome = await runPersonaOnItem(persona, item, items)
    await refresh()
    return outcome
  }, [refresh, items])

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])
  const me = user ? { id: user.id, email: user.email } : null

  const value = useMemo(() => ({
    items, notifications, unreadCount, votedSet, loading,
    isCloud: store.isCloudBacklog(),
    user: me,
    openCreate, create: handleCreate, update, remove, comment, answer, vote, merge, link, unlink, markRead, loadComments, refresh,
    reviewWithPersona, reviewItem, cleanupStatus, setLabelResolver,
  }), [items, notifications, unreadCount, votedSet, loading, me,
    openCreate, handleCreate, update, remove, comment, answer, vote, merge, link, unlink, markRead, loadComments, refresh, reviewWithPersona, reviewItem, cleanupStatus, setLabelResolver])

  return (
    <BacklogContext.Provider value={value}>
      {children}
      <CreateTicketDialog
        open={createOpen}
        scope={createScope}
        existingItems={items}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
      <Snackbar
        open={!!toast}
        position="bottom"
        actionLabel={toast?.actionLabel}
        onAction={toast?.href ? openToastTicket : undefined}
        onClose={() => setToast(null)}
      >
        {toast?.message}
      </Snackbar>
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
