import { useEffect, useRef, useState } from 'react'
import { consumePreviewImport, loadPreview, readPreviewImport } from './previewClient.js'

// Import intent is created only by the trusted preview toolbar in this tab.
// A URL alone or a sandbox message cannot create a workspace project.
export function usePreviewImport({ user, workspace, onImport, onMessage, t }) {
  const [nonce] = useState(() => new URLSearchParams(location.search).get('importPreview'))
  const [intent] = useState(() => readPreviewImport(nonce))
  const done = useRef(false)
  const latest = useRef({ onImport, onMessage, t })
  latest.current = { onImport, onMessage, t }
  useEffect(() => {
    if (!intent || done.current) return
    if (!user || user.id !== intent.userId) {
      done.current = true
      consumePreviewImport(nonce)
      latest.current.onMessage(latest.current.t('jsonPreview.signInRequired'))
      return
    }
    if (workspace.userId !== user.id || workspace.state === 'loading') return
    const controller = new AbortController()
    async function run() {
      const say = key => latest.current.onMessage(latest.current.t(`jsonPreview.${key}`))
      try {
        if (workspace.state !== 'ready') throw new Error('importFailed')
        say('importing')
        const snapshot = await loadPreview(intent.previewId, controller.signal)
        if (controller.signal.aborted || done.current) return
        // Consume before mutation so reload/double clicks cannot duplicate it.
        done.current = true
        consumePreviewImport(nonce)
        latest.current.onImport(snapshot.document)
        say('imported')
      } catch (error) {
        if (!controller.signal.aborted) {
          done.current = true
          consumePreviewImport(nonce)
          say(['expired', 'missing', 'invalid'].includes(error.message) ? error.message : 'importFailed')
        }
      }
    }
    run()
    return () => controller.abort()
  }, [user?.id, workspace, intent, nonce])
}
