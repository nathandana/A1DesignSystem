import { useEffect, useRef, useState } from 'react'
import { readStored, writeStored, isHistoryFlushSuppressed } from './storage'

export type HistoryEntry = {
  id: string
  json: string
  label: string
  timestamp: number
  /** True when the user has explicitly named this entry — shown prominently in history. */
  primary?: boolean
}

type HistoryState = {
  entries: HistoryEntry[]
  index: number
  workingJson: string
}

function uid() {
  return `h${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
}

// Each entry stores a full JSON snapshot, so an unbounded history fills the
// localStorage quota across many pages. Cap the retained depth — generous for
// undo while keeping per-page storage bounded.
const MAX_HISTORY = 50

// Keep at most MAX_HISTORY entries, dropping the oldest and shifting the index.
function capHistory(entries: HistoryEntry[], index: number): { entries: HistoryEntry[]; index: number } {
  if (entries.length <= MAX_HISTORY) return { entries, index }
  const overflow = entries.length - MAX_HISTORY
  return { entries: entries.slice(overflow), index: Math.max(0, index - overflow) }
}

// ── Persistence ───────────────────────────────────────────────────────────────

type PersistedHistory = { entries: HistoryEntry[]; index: number }

function validatePersisted(raw: unknown): PersistedHistory | null {
  if (!raw || typeof raw !== 'object') return null
  const p = raw as Record<string, unknown>
  if (!Array.isArray(p.entries) || p.entries.length === 0) return null
  if (typeof p.index !== 'number' || p.index < 0 || p.index >= p.entries.length) return null
  for (const e of p.entries) {
    if (
      !e || typeof e !== 'object' ||
      typeof (e as Record<string, unknown>).id !== 'string' ||
      typeof (e as Record<string, unknown>).json !== 'string' ||
      typeof (e as Record<string, unknown>).label !== 'string' ||
      typeof (e as Record<string, unknown>).timestamp !== 'number'
    ) return null
  }
  return p as unknown as PersistedHistory
}

function loadHistory(storageKey: string): PersistedHistory | null {
  try {
    const raw = readStored(storageKey)
    if (!raw) return null
    return validatePersisted(JSON.parse(raw))
  } catch {
    return null
  }
}

function saveHistory(storageKey: string, entries: HistoryEntry[], index: number) {
  const capped = capHistory(entries, index)
  writeStored(storageKey, JSON.stringify({ entries: capped.entries, index: capped.index }))
}

// Max one history entry per this interval for continuous prop changes (e.g.
// slider drags). Leading + trailing throttle: commits immediately on the first
// change in a window, then once more with the latest value after the interval
// elapses, so the final position is always captured.
const PROP_THROTTLE_MS = 10_000

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Manages editor undo/redo history with automatic localStorage persistence.
 *
 * @param fallbackJson  Initial JSON used when no persisted history exists.
 * @param storageKey    localStorage key for persistence. Omit for session-only history.
 */
export function useEditorHistory(
  fallbackJson: string,
  storageKey?: string,
  onCommit?: (json: string, label: string) => void,
) {
  const onCommitRef = useRef(onCommit)
  onCommitRef.current = onCommit

  // Throttle state for commitProp
  const propTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const propLastRef = useRef<number>(0)
  const propPendingRef = useRef<{ json: string; label: string } | null>(null)

  const [state, setState] = useState<HistoryState>(() => {
    const persisted = storageKey ? loadHistory(storageKey) : null
    if (persisted) {
      return {
        entries: persisted.entries,
        index: persisted.index,
        workingJson: persisted.entries[persisted.index].json,
      }
    }
    return {
      entries: [{ id: uid(), json: fallbackJson, label: 'Initial state', timestamp: Date.now() }],
      index: 0,
      workingJson: fallbackJson,
    }
  })

  // Persist history at most once per minute instead of on every edit — far fewer
  // localStorage writes (and less churn against the quota). The latest state is
  // always flushed when the editor unmounts (e.g. switching pages) or the tab is
  // hidden/closed, so at most ~1 minute of edits is ever at risk.
  const latestRef = useRef({ entries: state.entries, index: state.index })
  latestRef.current = { entries: state.entries, index: state.index }
  const dirtyRef = useRef(false)

  useEffect(() => {
    dirtyRef.current = true
    // Also flush shortly after a commit (not just the 60s safety interval) so page
    // edits reach storage — and therefore cloud sync — promptly for other users.
    if (!storageKey) return
    const t = setTimeout(() => {
      if (isHistoryFlushSuppressed() || !dirtyRef.current) return
      saveHistory(storageKey, latestRef.current.entries, latestRef.current.index)
      dirtyRef.current = false
    }, 2500)
    return () => clearTimeout(t)
  }, [state.entries, state.index, storageKey])

  useEffect(() => {
    if (!storageKey) return
    const flush = () => {
      if (isHistoryFlushSuppressed()) return
      if (!dirtyRef.current) return
      saveHistory(storageKey, latestRef.current.entries, latestRef.current.index)
      dirtyRef.current = false
    }
    const interval = setInterval(flush, 60_000)
    const onVisibility = () => { if (document.visibilityState === 'hidden') flush() }
    window.addEventListener('beforeunload', flush)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeunload', flush)
      document.removeEventListener('visibilitychange', onVisibility)
      flush() // flush latest on unmount (page switch)
    }
  }, [storageKey])

  // ── Actions ─────────────────────────────────────────────────────────────────

  // Update the display without creating a history entry (call on every keystroke).
  function setWorking(json: string) {
    setState(prev => ({ ...prev, workingJson: json }))
  }

  function doCommit(json: string, label: string) {
    setState(prev => {
      const truncated = prev.entries.slice(0, prev.index + 1)
      const entry: HistoryEntry = { id: uid(), json, label, timestamp: Date.now() }
      const capped = capHistory([...truncated, entry], truncated.length)
      return { entries: capped.entries, index: capped.index, workingJson: json }
    })
    onCommitRef.current?.(json, label)
  }

  function clearPropsTimer() {
    if (propTimerRef.current) { clearTimeout(propTimerRef.current); propTimerRef.current = null }
    propPendingRef.current = null
  }

  // Commit a named snapshot. Truncates any undone future so the new entry is
  // always the tip of the stack — standard linear undo behaviour.
  // Also cancels any pending throttled prop commit so a hard action (delete,
  // move, add) always takes precedence as the next history entry.
  function commit(json: string, label: string) {
    clearPropsTimer()
    doCommit(json, label)
  }

  // Throttled commit for continuous prop changes (e.g. slider drags).
  // Updates the canvas immediately via setWorking on every call; creates at
  // most one history entry per PROP_THROTTLE_MS using a leading + trailing
  // strategy so the first and final values in a burst are both recorded.
  function commitProp(json: string, label: string) {
    setState(prev => ({ ...prev, workingJson: json }))

    const now = Date.now()
    const sinceLastCommit = now - propLastRef.current

    if (sinceLastCommit >= PROP_THROTTLE_MS) {
      // Leading edge: enough time has passed — commit immediately and clear any timer.
      if (propTimerRef.current) { clearTimeout(propTimerRef.current); propTimerRef.current = null }
      propPendingRef.current = null
      propLastRef.current = now
      doCommit(json, label)
    } else {
      // Within the throttle window: record the latest value for the trailing commit.
      propPendingRef.current = { json, label }
      if (!propTimerRef.current) {
        propTimerRef.current = setTimeout(() => {
          propTimerRef.current = null
          const p = propPendingRef.current
          if (p) {
            propPendingRef.current = null
            propLastRef.current = Date.now()
            doCommit(p.json, p.label)
          }
        }, PROP_THROTTLE_MS - sinceLastCommit)
      }
    }
  }

  function undo() {
    setState(prev => {
      if (prev.index <= 0) return prev
      const idx = prev.index - 1
      return { ...prev, index: idx, workingJson: prev.entries[idx].json }
    })
  }

  function redo() {
    setState(prev => {
      if (prev.index >= prev.entries.length - 1) return prev
      const idx = prev.index + 1
      return { ...prev, index: idx, workingJson: prev.entries[idx].json }
    })
  }

  function jump(i: number) {
    setState(prev => {
      const idx = Math.max(0, Math.min(i, prev.entries.length - 1))
      return { ...prev, index: idx, workingJson: prev.entries[idx].json }
    })
  }

  // Restore pushes the named entry to the top without truncating the existing
  // future — entries after the current index remain accessible.
  function restore(entryId: string) {
    setState(prev => {
      const source = prev.entries.find(e => e.id === entryId)
      if (!source) return prev
      const time = new Date(source.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
      const entry: HistoryEntry = {
        id: uid(),
        json: source.json,
        label: `Restored from ${time}`,
        timestamp: Date.now(),
      }
      const capped = capHistory([...prev.entries, entry], prev.entries.length)
      return { entries: capped.entries, index: capped.index, workingJson: source.json }
    })
  }

  // Discard the current history stack and start fresh from json.
  // Used when switching between versions so undo doesn't bleed across them.
  function reset(json: string, label = 'Version switch') {
    setState({
      entries: [{ id: uid(), json, label, timestamp: Date.now() }],
      index: 0,
      workingJson: json,
    })
  }

  // Rename an entry and mark it as a primary (named) checkpoint.
  function rename(entryId: string, label: string) {
    setState(prev => ({
      ...prev,
      entries: prev.entries.map(e =>
        e.id === entryId ? { ...e, label, primary: true } : e
      ),
    }))
  }

  return {
    workingJson: state.workingJson,
    entries: state.entries,
    index: state.index,
    canUndo: state.index > 0,
    canRedo: state.index < state.entries.length - 1,
    setWorking,
    commit,
    commitProp,
    undo,
    redo,
    jump,
    restore,
    rename,
    reset,
  }
}
