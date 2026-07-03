// Manual "Sync now" registry. The 8s background polls that used to keep the
// shared workspace, labels, backlog, and data sources fresh were removed to stop
// uncached Supabase egress (each re-downloaded a whole table/blob every tick).
// Realtime is still the live path; this registry lets the Account "Sync now"
// action pull everything once, on demand, when Realtime hasn't delivered.
//
// Store-backed pulls (cloud sync envelope, labels) register here directly.
// React contexts (Backlog, Data sources) register their `refresh` on mount so a
// manual sync also re-reads their tables. Each source is keyed so re-registering
// (e.g. after a resubscribe) replaces rather than duplicates.

const sources = new Map()

/**
 * Register a manual-pull function under a stable key. Returns an unregister fn.
 * @param {string} key stable id, e.g. 'cloud' | 'labels' | 'backlog' | 'dataSources'
 * @param {() => Promise<unknown> | unknown} pull runs one refresh/pull
 */
export function registerSyncSource(key, pull) {
  sources.set(key, pull)
  return () => {
    if (sources.get(key) === pull) sources.delete(key)
  }
}

/**
 * Run every registered pull once, concurrently. Never rejects — a failing source
 * is logged and the rest still run. Resolves after all settle.
 */
export async function runManualSync() {
  const runs = [...sources.entries()].map(async ([key, pull]) => {
    try {
      await pull()
    } catch (e) {
      console.warn(`[manual-sync] "${key}" failed`, e)
    }
  })
  await Promise.all(runs)
}
