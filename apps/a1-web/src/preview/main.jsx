import '../../../../build/css/tokens.css'
import '../../../../packages/react/src/themes.css'
import '../../../../packages/react/src/color-scheme.css'
import '../../../../packages/react/src/utilities/spacing.css'
import '../../../../packages/react/src/utilities/width.css'
import '../editor/responsiveVisibility.css'
import './preview.css'
import { createRoot } from 'react-dom/client'
import { Component, useEffect, useMemo, useState } from 'react'
import { Banner, CircularProgress, LabelsProvider, PageTitle, Paragraph, Section, Stack, TopHeader } from '@gtivr4/a1-design-system-react'
import { RenderPageDefinition } from '../editor/pageRenderer'
import { buildProjectNav, buildProjectBreadcrumb } from '../projects/projectNav'
import { resolveAutoBreadcrumbs } from '../projects/projectLayout'
import { loadPreview } from './previewClient.js'
import { schedulePreviewExpiry } from './previewExpiry.js'
import { themeClassName, VALID_THEMES } from '../lib/appThemes'
import { SYSTEM_LABELS, resolveLabel } from '../labels/systemLabels.js'

const query = new URLSearchParams(location.search)
const locale = query.get('locale') || navigator.language.split('-')[0]
const t = key => resolveLabel(SYSTEM_LABELS, locale, `jsonPreview.${key}`)
const previewId = location.pathname.split('/')[2] || query.get('id') || ''
const currentScreen = () => new URLSearchParams(location.hash.slice(1)).get('page')
const hrefFor = id => `#${new URLSearchParams({ page: id })}`

document.documentElement.lang = locale
document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'

function Status({ state }) {
  useEffect(() => { document.documentElement.dataset.a1PreviewState = state }, [state])
  if (state === 'loading') return <Stack as="main" align="center" justify="center" style={{ minBlockSize: '100svh' }} aria-label={t('loading')}>
    <CircularProgress indeterminate size="xl" aria-label={t('loading')} />
  </Stack>
  return <main><PageTitle title={t('title')} /><Section padding="lg" contentWidth="md"><Banner status="error"><Paragraph role="status">{t(state)}</Paragraph></Banner></Section></main>
}

function ReadyMarker() {
  useEffect(() => { document.documentElement.dataset.a1PreviewState = 'ready' }, [])
  return null
}

class RenderBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { document.documentElement.dataset.a1PreviewState = 'renderError' }
  render() { return this.state.failed ? <Status state="renderError" /> : this.props.children }
}

function PreviewDocument({ snapshot }) {
  const [screen, setScreen] = useState(currentScreen)
  const project = snapshot.kind === 'project' ? snapshot.document : null
  const pages = useMemo(() => {
    const items = project?.pages || [{ id: snapshot.document.page.id, title: snapshot.document.page.name, definition: snapshot.document }]
    return items.map((page, index) => ({
      ...page, id: page.id ?? `#${index}`, title: page.title || t('untitled'), parentId: page.parentId ?? null, order: index,
      definition: typeof page.definition === 'string' ? JSON.parse(page.definition) : page.definition,
    }))
  }, [project, snapshot])
  const page = screen ? pages.find(item => item.id === screen) : pages[0]
  const navigate = id => { location.hash = hrefFor(id) }
  const options = { activePageId: page?.id, onNavigate: navigate, hrefFor }
  const navItems = buildProjectNav(pages, options)
  const definition = page?.definition ? resolveAutoBreadcrumbs(page.definition, buildProjectBreadcrumb(pages, options)) : null

  useEffect(() => {
    const onHash = () => {
      setScreen(currentScreen())
      if (window.parent !== window) window.parent.postMessage({ type: 'a1-preview-navigation', hash: location.hash }, '*')
    }
    const onMessage = event => {
      if (event.source === window.parent && event.data?.type === 'a1-preview-navigation' && typeof event.data.hash === 'string' && location.hash !== event.data.hash) location.replace(event.data.hash || '#')
    }
    window.addEventListener('message', onMessage)
    window.addEventListener('hashchange', onHash)
    // Covers anchor links nested in menus/cards as well as renderer-level links.
    const onClick = event => {
      const anchor = event.target.closest?.('a[href]')
      const href = anchor?.getAttribute('href')
      if (!href || !/^(\/)?\?/.test(href) || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const id = new URLSearchParams(href.slice(href.indexOf('?'))).get('page')
      if (id !== null) { event.preventDefault(); navigate(id) }
    }
    document.addEventListener('click', onClick, true)
    return () => { window.removeEventListener('message', onMessage); window.removeEventListener('hashchange', onHash); document.removeEventListener('click', onClick, true) }
  }, [])
  useEffect(() => {
    const theme = query.get('theme') || project?.theme
    document.documentElement.className = `${VALID_THEMES.includes(theme) ? themeClassName(theme) : ''} ${query.get('mode') === 'dark' ? 'a1-theme-dark' : 'a1-theme-light'}`
    document.title = `${page?.title || t('title')} — A1`
  }, [project, page])
  return <>
    {project && <TopHeader logo={project.name || t('project')} logoHref={hrefFor(pages[0].id)} navItems={navItems} />}
    {!page ? <Status state="pageMissing" /> : definition ? <RenderBoundary key={page.id}><RenderPageDefinition definition={definition} onNavigate={navigate} /><ReadyMarker /></RenderBoundary> : <main><ReadyMarker /><Section padding="lg"><Paragraph>{t('blank')}</Paragraph></Section></main>}
  </>
}

function Preview() {
  const [state, setState] = useState('loading')
  const [snapshot, setSnapshot] = useState(null)
  useEffect(() => {
    const controller = new AbortController()
    let cancelExpiry
    async function load() {
      try {
        const data = await loadPreview(previewId, controller.signal)
        const remaining = Date.parse(data.expiresAt) - Date.now()
        if (remaining <= 0) { setState('expired'); return }
        setSnapshot(data); setState('ready')
        cancelExpiry = schedulePreviewExpiry(data.expiresAt, () => { setSnapshot(null); setState('expired') })
      } catch (error) { if (!controller.signal.aborted) setState(['expired', 'missing', 'invalid'].includes(error.message) ? error.message : 'unavailable') }
    }
    load()
    return () => { controller.abort(); cancelExpiry?.() }
  }, [])
  return state === 'ready' && snapshot ? <PreviewDocument snapshot={snapshot} /> : <Status state={state} />
}

// A separate entry point: no auth, analytics, cloud sync or workspace providers.
createRoot(document.getElementById('root')).render(<LabelsProvider locale={locale} labels={SYSTEM_LABELS}><RenderBoundary><Preview /></RenderBoundary></LabelsProvider>)
