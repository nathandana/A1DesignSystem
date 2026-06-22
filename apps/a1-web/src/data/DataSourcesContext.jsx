import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../lib/AuthContext.jsx'
import * as store from '../services/dataSources/dataSourcesStore'
import { buildUsersSample, hasSeededSamples, markSeededSamples } from '../services/dataSources/samples'

/**
 * Holds the shared dataset list and the actions the Data page uses. Points the store
 * at the cloud (signed in) or local backend, then loads + subscribes so the page
 * updates live (Supabase Realtime + poll, or local events offline). Mirrors
 * BacklogContext, minus notifications/votes.
 */
const DataSourcesContext = createContext(null)

export function DataSourcesProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const reqId = useRef(0)

  const refresh = useCallback(async () => {
    const id = ++reqId.current
    const next = await store.listDataSources()
    if (id !== reqId.current) return // a newer refresh superseded this one
    setItems(next)
    setLoading(false)
  }, [])

  const seededRef = useRef(false)

  useEffect(() => {
    store.setDataSourceUser(user ?? null)
    setLoading(true)
    let cancelled = false
    ;(async () => {
      await refresh()
      // One-time sample seed: when the workspace has no datasets yet, drop in the
      // built-in "Users" sample so the page isn't empty on first run. Guarded by a
      // per-browser flag so deleting the sample doesn't bring it back. Wrapped so a
      // backend error (e.g. the cloud table not migrated yet) can't crash the app.
      if (!cancelled && !seededRef.current && !hasSeededSamples()) {
        seededRef.current = true
        try {
          const current = await store.listDataSources()
          if (!cancelled && current.length === 0) {
            await store.createDataSource(buildUsersSample())
            await refresh()
          }
          markSeededSamples()
        } catch (err) {
          console.warn('[data-sources] sample seed skipped', err)
        }
      }
    })()
    const unsub = store.subscribe(refresh)
    return () => { cancelled = true; unsub() }
  }, [user?.id, refresh]) // eslint-disable-line react-hooks/exhaustive-deps

  const create = useCallback(async (input) => {
    try {
      const item = await store.createDataSource(input)
      await refresh()
      return item
    } catch (err) {
      // e.g. the cloud `data_sources` table hasn't been migrated yet.
      console.warn('[data-sources] create failed', err)
      return null
    }
  }, [refresh])

  const update = useCallback(async (id, patch) => {
    const next = await store.updateDataSource(id, patch)
    await refresh()
    return next
  }, [refresh])

  const remove = useCallback(async (id) => {
    await store.removeDataSource(id)
    await refresh()
  }, [refresh])

  const me = user ? { id: user.id, email: user.email } : null

  const value = useMemo(() => ({
    items, loading,
    isCloud: store.isCloudDataSources(),
    user: me,
    create, update, remove, refresh,
  }), [items, loading, me, create, update, remove, refresh])

  return (
    <DataSourcesContext.Provider value={value}>
      {children}
    </DataSourcesContext.Provider>
  )
}

/** Dataset state + actions. Returns null outside the provider. */
export function useDataSources() {
  return useContext(DataSourcesContext)
}
