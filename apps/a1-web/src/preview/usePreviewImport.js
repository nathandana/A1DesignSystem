import { useEffect, useRef, useState } from 'react'
import { consumePreviewImport, loadPreview, readPreviewImport } from './previewClient.js'
import { validateImportJson } from '../editor/jsonValidation.js'

// Import intent is created only by the trusted preview banner in this tab.
// A URL alone or a sandbox message cannot create a workspace project.
export function usePreviewImport({ user, workspace, onImport, onMessage, onError, t }) {
  const [nonce] = useState(() => new URLSearchParams(location.search).get('importPreview'))
  const [intent] = useState(() => readPreviewImport(nonce))
  const done = useRef(false)
  const latest = useRef({ onImport, onMessage, onError, t })
  latest.current = { onImport, onMessage, onError, t }
  useEffect(() => {
    if (!intent || done.current) return
    const userId = user?.id ?? null
    if (userId !== intent.userId) {
      done.current = true
      consumePreviewImport(nonce)
      latest.current.onMessage(latest.current.t('jsonPreview.accountChanged'))
      return
    }
    if (workspace.userId !== userId || workspace.state === 'loading') return
    const controller = new AbortController()
    async function run() {
      const say = key => latest.current.onMessage(latest.current.t(`jsonPreview.${key}`))
      let stage = 'workspace'
      try {
        if (workspace.state !== 'ready') throw new Error('importWorkspaceFailed')
        say('importing')
        stage = 'fetch'
        const snapshot = await loadPreview(intent.previewId, controller.signal)
        if (controller.signal.aborted || done.current) return
        stage = 'validation'
        const validation = validateImportJson(snapshot.document)
        if (!validation.valid) throw Object.assign(new Error('importValidationFailed'), { diagnostics: validation.errors })
        // Consume before mutation so reload/double clicks cannot duplicate it.
        done.current = true
        consumePreviewImport(nonce)
        stage = 'import'
        await latest.current.onImport(snapshot.document)
        say(userId ? 'imported' : 'openedLocally')
      } catch (error) {
        if (!controller.signal.aborted) {
          done.current = true
          consumePreviewImport(nonce)
          latest.current.onMessage('')
          latest.current.onError({
            previewId: intent.previewId,
            stage,
            timestamp: new Date().toISOString(),
            code: error?.message || 'UNKNOWN_ERROR',
            status: error?.status,
            diagnostics: error?.diagnostics,
            cause: error?.cause?.message,
          })
        }
      }
    }
    run()
    return () => controller.abort()
  }, [user?.id, workspace, intent, nonce])
}
