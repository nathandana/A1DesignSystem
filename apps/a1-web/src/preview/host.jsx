import '../../../../build/css/tokens.css'
import '../../../../packages/react/src/themes.css'
import '../../../../packages/react/src/color-scheme.css'
import './preview.css'
import './host.css'
import { createRoot } from 'react-dom/client'
import { useEffect, useRef, useState } from 'react'
import { Banner, Button, IconButton, LabelsProvider, Link, PageLayout, Snackbar, Stack } from '@gtivr4/a1-design-system-react'
import { AuthProvider, useAuth } from '../lib/AuthContext.jsx'
import { SYSTEM_LABELS, resolveLabel } from '../labels/systemLabels.js'
import { beginPreviewImport, loadPreview } from './previewClient.js'
import { schedulePreviewExpiry } from './previewExpiry.js'

const query = new URLSearchParams(location.search)
const locale = query.get('locale') || navigator.language.split('-')[0]
const t = key => resolveLabel(SYSTEM_LABELS, locale, `jsonPreview.${key}`)
const id = location.pathname.split('/')[2] || query.get('id') || ''
const frameQuery = new URLSearchParams(query)
frameQuery.set('id', id)
const framePath = `/json-preview.html?${frameQuery}`

function PreviewHost() {
  const { user, loading } = useAuth()
  const frame = useRef(null)
  const [ready, setReady] = useState(false)
  const [message, setMessage] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const restoreBannerFocus = useRef(false)
  function toggleBanner(nextCollapsed) {
    restoreBannerFocus.current = true
    setCollapsed(nextCollapsed)
  }
  useEffect(() => {
    if (!restoreBannerFocus.current) return
    document.getElementById(collapsed ? 'a1-preview-reopen' : 'a1-preview-collapse')?.focus()
    restoreBannerFocus.current = false
  }, [collapsed])
  useEffect(() => {
    const controller = new AbortController()
    let cancelExpiry
    loadPreview(id, controller.signal).then(snapshot => {
      setReady(true)
      cancelExpiry = schedulePreviewExpiry(snapshot.expiresAt, () => setReady(false))
    }).catch(() => setReady(false))
    return () => { controller.abort(); cancelExpiry?.() }
  }, [])
  useEffect(() => {
    // Only navigation state crosses this boundary; never accept import requests
    // or JSON from the opaque-origin frame.
    const receive = event => {
      if (event.source !== frame.current?.contentWindow || event.origin !== 'null' || event.data?.type !== 'a1-preview-navigation') return
      const hash = event.data.hash
      if (typeof hash === 'string' && (hash === '' || /^#page=[^#]*$/.test(hash)) && hash.length < 2000 && location.hash !== hash) location.hash = hash
    }
    const update = () => frame.current?.contentWindow?.postMessage({ type: 'a1-preview-navigation', hash: location.hash }, '*')
    window.addEventListener('message', receive)
    window.addEventListener('hashchange', update)
    return () => { window.removeEventListener('message', receive); window.removeEventListener('hashchange', update) }
  }, [])
  function importProject() {
    if (loading || !ready) return
    try { location.assign(beginPreviewImport(id, user?.id ?? null)) }
    catch { setMessage(t('importFailed')) }
  }
  return <>
    <PageLayout viewportHeight footer={
      <div id="a1-preview-banner" hidden={collapsed}>
        <Banner variant="system" status="neutral" icon="auto_awesome" role="group" aria-live="off" action={
          <Stack direction="row" align="center" gap="xs">
            <Button variant="tertiary" disabled={loading || !ready} onClick={importProject}>{t('importProject')}</Button>
            <IconButton id="a1-preview-collapse" icon="close" label={t('collapseBanner')} aria-controls="a1-preview-banner" aria-expanded={!collapsed} onClick={() => toggleBanner(true)} />
          </Stack>
        }>
          <Link href="/">{t('madeWith')}</Link>
        </Banner>
      </div>
    }>
      <iframe ref={frame} className="a1-json-preview-frame" src={`${framePath}${location.hash}`} title={t('title')} sandbox="allow-scripts" referrerPolicy="no-referrer" />
    </PageLayout>
    {collapsed && <div className="a1-json-preview-attribution">
      <Button id="a1-preview-reopen" variant="secondary" size="sm" aria-controls="a1-preview-banner" aria-expanded={false} onClick={() => toggleBanner(false)}>{t('madeWith')}</Button>
    </div>}
    <Snackbar open={!!message} onClose={() => setMessage('')}>{message}</Snackbar>
  </>
}

document.documentElement.lang = locale
document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
createRoot(document.getElementById('root')).render(<AuthProvider><LabelsProvider labels={SYSTEM_LABELS} locale={locale}><PreviewHost /></LabelsProvider></AuthProvider>)
