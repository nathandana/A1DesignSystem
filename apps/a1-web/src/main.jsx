import '../../../build/css/tokens.css'
import '../../../packages/react/src/themes.css'
import '../../../packages/react/src/color-scheme.css'
import { createRoot } from 'react-dom/client'
import { useEffect, useRef, useState } from 'react'
import {
  Button,
  LabelsProvider,
  Menu,
  MenuSection,
  MessageEmptyState,
  PageLayout,
  RadioGroup,
  Section,
  SegmentedControl,
  SelectField,
  Snackbar,
  Switch,
  TopHeader,
} from '@gtivr4/a1-design-system-react'
import actionLabels    from '../../../system/labels/action.json'
import calendarLabels  from '../../../system/labels/calendar.json'
import codeLabels      from '../../../system/labels/code.json'
import fieldLabels     from '../../../system/labels/field.json'
import statusBarLabels from '../../../system/labels/status-bar.json'

const allLabels = {
  label: {
    ...actionLabels.label,
    ...calendarLabels.label,
    ...codeLabels.label,
    ...fieldLabels.label,
    ...statusBarLabels.label,
  },
}

const localeOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'pt', label: 'Português' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' },
  { value: 'ar', label: 'العربية' },
]

const VALID_LOCALES = localeOptions.map((o) => o.value)
import { Home } from './pages/Home.jsx'
import { Features } from './pages/Features.jsx'
import { GetStarted } from './pages/GetStarted.jsx'
import { FoundationDetail, Foundations, foundations } from './pages/foundations'
import {
  Components,
  getComponentsSidebar,
  getComponentsAside,
  componentCategories,
  componentCategoryPageIds,
  componentPageIds,
  componentPageTitles,
} from './pages/Components.jsx'
import { Projects } from './pages/Projects.jsx'
import { Templates } from './pages/Templates.jsx'
import { Accessibility } from './pages/Accessibility.jsx'
import { Releases } from './pages/Releases.jsx'
import { EditorPage } from './pages/EditorPage.tsx'
import { EditorPreviewPage, resolvePageJson } from './pages/EditorPreviewPage.tsx'
import { EditorSidebar } from './editor/EditorSidebar.jsx'
import { EDITOR_EXAMPLES, DEFAULT_EXAMPLE_ID, NEW_PAGE_ID, makeBlankPage } from './editor/examples/index.ts'
import { readStored, writeStored, suppressHistoryFlush } from './editor/storage.ts'
import './styles.css'

// True when this window was opened as a standalone preview (no app chrome).
const IS_STANDALONE = new URLSearchParams(window.location.search).has('standalone')

const FOUNDATION_PAGE_IDS = foundations.map((foundation) => foundation.id)
const RESOURCE_PAGE_IDS = ['features', 'get-started', 'projects', 'accessibility', 'releases']
const RESOURCE_PAGE_ICONS = {
  features: 'star',
  'get-started': 'rocket_launch',
  projects: 'folder',
  accessibility: 'accessibility',
  releases: 'new_releases',
}
const COMPONENT_ROUTE_IDS = ['components', ...componentCategoryPageIds, ...componentPageIds]

const PAGES = ['home', 'features', 'get-started', 'foundations', ...FOUNDATION_PAGE_IDS, ...COMPONENT_ROUTE_IDS, 'templates', 'editor', 'editor-preview', 'projects', 'accessibility', 'releases']

const PAGE_TITLES = {
  home: 'A1 Design System',
  features: 'Features',
  'get-started': 'Get Started',
  foundations: 'Foundations',
  ...Object.fromEntries(foundations.map((foundation) => [foundation.id, foundation.title])),
  ...componentPageTitles,
  templates: 'Templates',
  editor: 'Editor',
  'editor-preview': 'Editor Preview',
  projects: 'Projects',
  accessibility: 'Accessibility',
  releases: 'Releases',
}

const themeOptions = [
  { value: 'a1Light', label: 'Default' },
  { value: 'a1Heritage', label: 'Heritage' },
  { value: 'a1Accessible', label: 'Accessible' },
  { value: 'fresh', label: 'Fresh' },
]

const colorSchemeOptions = [
  { value: 'light', icon: 'light_mode', ariaLabel: 'Light mode' },
  { value: 'dark', icon: 'dark_mode', ariaLabel: 'Dark mode' },
  { value: 'system', icon: 'desktop_windows', ariaLabel: 'System mode' },
]

const VALID_THEMES = themeOptions.map((o) => o.value)
const VALID_COLOR_MODES = colorSchemeOptions.map((o) => o.value)

function getPage(search = window.location.search) {
  const page = new URLSearchParams(search).get('page') || 'home'
  return PAGES.includes(page) ? page : 'home'
}

function getPath(page) {
  return page === 'home' ? '/' : `/?page=${page}`
}

function isPlainLeftClick(e) {
  return e.button === 0 && !e.metaKey && !e.altKey && !e.ctrlKey && !e.shiftKey
}


function App() {
  const [activePage, setActivePage] = useState(() => getPage())
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('a1-web-theme')
    return VALID_THEMES.includes(stored) ? stored : 'a1Light'
  })
  const [colorMode, setColorMode] = useState(() => {
    const stored = localStorage.getItem('a1-web-color-mode')
    return VALID_COLOR_MODES.includes(stored) ? stored : 'system'
  })
  const [reducedMotion, setReducedMotion] = useState(() =>
    localStorage.getItem('a1-web-reduced-motion') === 'true'
  )
  const [contrastMore, setContrastMore] = useState(() =>
    localStorage.getItem('a1-web-contrast-more') === 'true'
  )
  const [locale, setLocale] = useState(() => {
    const stored = localStorage.getItem('a1-web-locale')
    return VALID_LOCALES.includes(stored) ? stored : 'en'
  })
  const [systemColorScheme, setSystemColorScheme] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [componentSearch, setComponentSearch] = useState('')
  const [detailTab, setDetailTab] = useState('configure')
  const [editorExampleId, setEditorExampleId] = useState(() => {
    // A `doc` query param deep-links straight to a specific page in the editor.
    const doc = new URLSearchParams(window.location.search).get('doc')
    if (doc) return doc
    return localStorage.getItem('a1-editor-active-example') ?? DEFAULT_EXAMPLE_ID
  })
  const [userPages, setUserPages] = useState(
    () => { try { return JSON.parse(readStored('a1-editor-user-pages') ?? '[]') } catch { return [] } }
  )
  const [editorView, setEditorView] = useState('edit')
  const [editorDirty, setEditorDirty] = useState(false)
  const [editorSelectedNodeId, setEditorSelectedNodeId] = useState(null)
  const [editorDefinition, setEditorDefinition] = useState(null)
  const [editorPendingMove, setEditorPendingMove] = useState(null)
  const [editorAddTarget, setEditorAddTarget] = useState(null)
  const [editorPendingAction, setEditorPendingAction] = useState(null) // { type: 'delete'|'ungroup', nodeId }
  const [editorPendingConvert, setEditorPendingConvert] = useState(null) // { nodeId, newType, newProps }
  const [deletedPage, setDeletedPage] = useState(null) // { page: { id, label }, index } — for undo
  const [pageSnackbarOpen, setPageSnackbarOpen] = useState(false)
  const [editorMessage, setEditorMessage] = useState('') // transient editor notice (no action)
  const importInputRef = useRef(null)
  const resolvedColorScheme = colorMode === 'system' ? systemColorScheme : colorMode

  // Switch the editor to another page id (shared by select, delete, and undo).
  function switchToEditorPage(id) {
    setEditorExampleId(id)
    localStorage.setItem('a1-editor-active-example', id)
    setEditorView('edit')
    setEditorDirty(false)
    setEditorSelectedNodeId(null)
    setEditorDefinition(null)
  }

  // Whether an editor page id resolves to something we can open. Editor pages are
  // stored locally, so a shared `doc` link to a page created in another browser
  // won't resolve here — we show a "page not found" notice for those.
  function editorPageExists(id) {
    if (!id) return false
    if (EDITOR_EXAMPLES.some((e) => e.id === id)) return true
    if (userPages.some((p) => p.id === id)) return true
    try {
      if (localStorage.getItem(`a1-editor-versions-${id}`)) return true
      if (localStorage.getItem(`a1-editor-history-${id}`)) return true
    } catch { /* ignore */ }
    return false
  }

  // Delete the active user page (built-in examples are not deletable). The page's
  // saved content is left in localStorage so Undo can restore it intact.
  function handleDeletePage() {
    if (!editorExampleId.startsWith(NEW_PAGE_ID)) return
    const index = userPages.findIndex((p) => p.id === editorExampleId)
    if (index === -1) return
    const page = userPages[index]
    const remaining = userPages.filter((p) => p.id !== editorExampleId)
    setUserPages(remaining)
    writeStored('a1-editor-user-pages', JSON.stringify(remaining))
    setDeletedPage({ page, index })
    setPageSnackbarOpen(true)
    const nextId = remaining.length > 0
      ? remaining[Math.max(0, index - 1)].id
      : DEFAULT_EXAMPLE_ID
    switchToEditorPage(nextId)
  }

  function handleUndoDeletePage() {
    if (!deletedPage) return
    const { page, index } = deletedPage
    setUserPages((prev) => {
      const next = [...prev]
      next.splice(Math.min(index, next.length), 0, page)
      writeStored('a1-editor-user-pages', JSON.stringify(next))
      return next
    })
    switchToEditorPage(page.id)
    setPageSnackbarOpen(false)
    setDeletedPage(null)
  }

  // Duplicate the active page (built-in or user) into a new user page seeded with
  // the current content, then switch to it.
  function handleDuplicatePage() {
    const sourceDef = editorDefinition
    if (!sourceDef) return
    const newId = `${NEW_PAGE_ID}-${Date.now()}`
    const newName = `${sourceDef.page?.name || 'Untitled'} copy`
    const newDef = { ...sourceDef, page: { ...sourceDef.page, id: newId, name: newName } }
    const json = JSON.stringify(newDef, null, 2)
    const versionId = `v-${Date.now()}`
    // Seed the new page's versions state so the editor loads the copied content.
    const ok = writeStored(
      `a1-editor-versions-${newId}`,
      JSON.stringify({ versions: [{ id: versionId, label: 'Base', json }], activeVersionId: versionId }),
    )
    if (!ok) {
      setEditorMessage('Could not duplicate — browser storage is full. Delete unused pages and try again.')
      return
    }
    setUserPages((prev) => {
      const next = [...prev, { id: newId, label: newName }]
      writeStored('a1-editor-user-pages', JSON.stringify(next))
      return next
    })
    switchToEditorPage(newId)
  }

  // Export every editor page (built-in + user) as one plain-text file holding
  // each page's latest JSON, so nothing is lost if local storage is cleared.
  function handleExportAll() {
    const allPages = [
      ...EDITOR_EXAMPLES.map((e) => ({ id: e.id, label: e.label })),
      ...userPages,
    ]
    const sections = allPages.map(({ id, label }) => {
      const json = resolvePageJson(id) ?? '(no content)'
      return `===== ${label} (${id}) =====\n${json}`
    })
    const content =
      `A1 Editor — all pages export\n` +
      `Generated: ${new Date().toISOString()}\n` +
      `Pages: ${allPages.length}\n\n` +
      sections.join('\n\n')

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `a1-editor-pages-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  // Restore pages from an "Export all" file: parse each delimited section back
  // into its page JSON, write it to that page's storage, register any new user
  // pages, then reload so the editor picks everything up cleanly.
  async function handleImportFile(event) {
    const file = event.target.files?.[0]
    event.target.value = '' // allow re-importing the same file later
    if (!file) return

    let text = ''
    try { text = await file.text() } catch { setEditorMessage('Could not read that file.'); return }

    // Sections look like:  ===== Label (id) =====\n<json>
    const re = /^===== (.*?) \(([^)]+)\) =====$/gm
    const matches = [...text.matchAll(re)]
    if (matches.length === 0) {
      setEditorMessage('No pages found in that file.')
      return
    }

    const exampleIds = new Set(EDITOR_EXAMPLES.map((e) => e.id))
    let nextUserPages = [...userPages]
    let imported = 0

    matches.forEach((m, i) => {
      const id = m[2]
      const start = m.index + m[0].length
      const end = i + 1 < matches.length ? matches[i + 1].index : text.length
      const json = text.slice(start, end).trim()

      let parsed
      try { parsed = JSON.parse(json) } catch { return } // skip invalid sections
      const pretty = JSON.stringify(parsed, null, 2)
      const stamp = `${Date.now()}-${i}`

      // Seed both stores so the page loads regardless of which the editor reads.
      writeStored(`a1-editor-versions-${id}`, JSON.stringify({
        versions: [{ id: `v-import-${stamp}`, label: 'Imported', json: pretty }],
        activeVersionId: `v-import-${stamp}`,
      }))
      writeStored(`a1-editor-history-${id}`, JSON.stringify({
        entries: [{ id: `h-import-${stamp}`, json: pretty, label: 'Imported', timestamp: Date.now() }],
        index: 0,
      }))

      if (!exampleIds.has(id) && !nextUserPages.some((p) => p.id === id)) {
        nextUserPages.push({ id, label: parsed.page?.name || m[1] || 'Untitled' })
      }
      imported += 1
    })

    if (imported === 0) {
      setEditorMessage('That file did not contain any valid page JSON.')
      return
    }

    writeStored('a1-editor-user-pages', JSON.stringify(nextUserPages))
    // Reload to load imported content. Suppress the editor's history flush first
    // so the open page's stale in-memory state can't clobber what we just wrote.
    suppressHistoryFlush()
    window.location.reload()
  }

  function navigate(page, { replace = false } = {}) {
    const next = PAGES.includes(page) ? page : 'home'
    const nextPath = getPath(next)
    const currentPath = `${window.location.pathname}${window.location.search}`
    if (nextPath !== currentPath) {
      window.history[replace ? 'replaceState' : 'pushState']({ page: next }, '', nextPath)
    }
    setActivePage(next)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  function handleNavClick(e, page) {
    if (!isPlainLeftClick(e)) return
    e.preventDefault()
    navigate(page)
  }

  useEffect(() => {
    window.history.replaceState({ page: getPage() }, '', window.location.href)
    setActivePage(getPage())
    const onPop = () => setActivePage(getPage())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('a1-theme-heritage', theme === 'a1Heritage')
    document.documentElement.classList.toggle('a1-theme-accessible', theme === 'a1Accessible')
    document.documentElement.classList.toggle('a1-theme-fresh', theme === 'fresh')
    document.documentElement.classList.toggle('a1-theme-dark', resolvedColorScheme === 'dark')
    document.documentElement.classList.toggle('a1-theme-light', colorMode === 'light')
    document.documentElement.classList.toggle('a1-reduce-motion', reducedMotion)
    document.documentElement.classList.toggle('a1-contrast-more', contrastMore)
  }, [theme, resolvedColorScheme, colorMode, reducedMotion, contrastMore])

  useEffect(() => { localStorage.setItem('a1-web-theme', theme) }, [theme])
  useEffect(() => { localStorage.setItem('a1-web-color-mode', colorMode) }, [colorMode])
  useEffect(() => { localStorage.setItem('a1-web-reduced-motion', reducedMotion) }, [reducedMotion])
  useEffect(() => { localStorage.setItem('a1-web-contrast-more', contrastMore) }, [contrastMore])
  useEffect(() => { localStorage.setItem('a1-web-locale', locale) }, [locale])

  // Keep the user-page label in sync with the page definition's name.
  useEffect(() => {
    const pageName = editorDefinition?.page?.name
    if (!pageName || !editorExampleId.startsWith(NEW_PAGE_ID)) return
    setUserPages((prev) => {
      const next = prev.map((p) => p.id === editorExampleId ? { ...p, label: pageName } : p)
      writeStored('a1-editor-user-pages', JSON.stringify(next))
      return next
    })
  }, [editorDefinition?.page?.name, editorExampleId])

  // Keep the editor URL pointed at the active page (`?page=editor&doc=<id>`) so it
  // can be copied and shared as a direct link to editing that page.
  useEffect(() => {
    if (activePage !== 'editor') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('doc') === editorExampleId) return
    params.set('page', 'editor')
    params.set('doc', editorExampleId)
    window.history.replaceState({ page: 'editor' }, '', `${window.location.pathname}?${params.toString()}`)
  }, [activePage, editorExampleId])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined

    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateSystemColorScheme = (event) => {
      setSystemColorScheme(event.matches ? 'dark' : 'light')
    }

    setSystemColorScheme(colorSchemeQuery.matches ? 'dark' : 'light')

    if (colorSchemeQuery.addEventListener) {
      colorSchemeQuery.addEventListener('change', updateSystemColorScheme)
      return () => colorSchemeQuery.removeEventListener('change', updateSystemColorScheme)
    }

    colorSchemeQuery.addListener(updateSystemColorScheme)
    return () => colorSchemeQuery.removeListener(updateSystemColorScheme)
  }, [])

  useEffect(() => {
    const title = PAGE_TITLES[activePage] ?? activePage
    document.title = activePage === 'home' ? title : `${title} — A1 Design System`
  }, [activePage])

  const navItems = [
    {
      id: 'resources',
      label: 'Resources',
      active: RESOURCE_PAGE_IDS.includes(activePage),
      items: RESOURCE_PAGE_IDS.map((id) => ({
        icon: RESOURCE_PAGE_ICONS[id],
        label: PAGE_TITLES[id],
        href: getPath(id),
        onClick: (e) => handleNavClick(e, id),
      })),
    },
    {
      id: 'foundations',
      label: PAGE_TITLES.foundations,
      active: activePage === 'foundations' || FOUNDATION_PAGE_IDS.includes(activePage),
      items: [
        {
          icon: 'foundation',
          label: 'Overview',
          href: getPath('foundations'),
          onClick: (e) => handleNavClick(e, 'foundations'),
        },
        { divider: true },
        ...foundations.map((foundation) => ({
          icon: foundation.icon,
          label: foundation.title,
          href: getPath(foundation.id),
          onClick: (e) => handleNavClick(e, foundation.id),
        })),
      ],
    },
    {
      id: 'components',
      label: PAGE_TITLES.components,
      active: COMPONENT_ROUTE_IDS.includes(activePage),
      items: [
        {
          icon: 'widgets',
          label: 'Overview',
          href: getPath('components'),
          onClick: (e) => handleNavClick(e, 'components'),
        },
        { divider: true },
        ...componentCategories.map((category) => ({
          icon: category.icon,
          label: category.title,
          href: getPath(`components-${category.id}`),
          onClick: (e) => handleNavClick(e, `components-${category.id}`),
          items: category.components.map((component) => ({
            label: component.title,
            href: getPath(`component-${component.id}`),
            onClick: (e) => handleNavClick(e, `component-${component.id}`),
          })),
        })),
      ],
    },
    ...['templates', 'editor'].map((id) => ({
      id,
      label: PAGE_TITLES[id],
      href: getPath(id),
      active: activePage === id,
      onClick: (e) => handleNavClick(e, id),
    })),
  ]

  const actions = [
    {
      id: 'settings',
      icon: 'settings',
      iconOnly: true,
      label: 'Settings',
      onClick: () => setSettingsOpen(true),
    },
  ]

  const logo = (
    <span className="a1-web-logo">
      <span className="a1-web-logo__mark" aria-hidden="true">A1</span>
      Design System
    </span>
  )

  if (IS_STANDALONE) {
    return (
      <LabelsProvider locale={locale === 'en' ? null : locale} labels={allLabels}>
        {activePage === 'editor-preview' ? <EditorPreviewPage /> : null}
      </LabelsProvider>
    )
  }

  return (
    <LabelsProvider locale={locale === 'en' ? null : locale} labels={allLabels}>
      <PageLayout
        className="a1-web-page-layout"
        stickyHeader
        viewportHeight
        sidebar={
          activePage === 'editor'
            ? <EditorSidebar
                activeExample={editorExampleId}
                activePageName={editorDefinition?.page?.name}
                isDirty={editorDirty}
                definition={editorDefinition}
                selectedNodeId={editorSelectedNodeId}
                userPages={userPages}
                onSelectNode={setEditorSelectedNodeId}
                onNodeMove={setEditorPendingMove}
                onRequestAdd={setEditorAddTarget}
                onNodeAction={setEditorPendingAction}
                onConvertNode={(nodeId, newType, newProps) => setEditorPendingConvert({ nodeId, newType, newProps })}
                onSelectExample={(id) => {
                  // Each "New page" gets a unique ID so it starts with a clean
                  // slate rather than inheriting a previous draft from localStorage.
                  const resolvedId = id === NEW_PAGE_ID
                    ? `${NEW_PAGE_ID}-${Date.now()}`
                    : id
                  if (id === NEW_PAGE_ID) {
                    const newPage = { id: resolvedId, label: 'Untitled' }
                    setUserPages((prev) => {
                      const next = [...prev, newPage]
                      writeStored('a1-editor-user-pages', JSON.stringify(next))
                      return next
                    })
                  }
                  setEditorExampleId(resolvedId)
                  localStorage.setItem('a1-editor-active-example', resolvedId)
                  setEditorView('edit')
                  setEditorDirty(false)
                  setEditorSelectedNodeId(null)
                  setEditorDefinition(null)
                }}
              />
            : COMPONENT_ROUTE_IDS.includes(activePage)
            ? getComponentsSidebar({ activePage, onNavigate: navigate, search: componentSearch, setSearch: setComponentSearch })
            : undefined
        }
        aside={
          activePage === 'editor'
            ? <div id="a1-web-editor-aside-slot" className="a1-web-config-aside" />
            : getComponentsAside({ activePage, detailTab })
        }
        header={
          <TopHeader
            logo={logo}
            logoHref={getPath('home')}
            navItems={navItems}
            actions={actions}
          />
        }
      >
        {activePage === 'home' && <Home onNavigate={navigate} />}
        {activePage === 'features' && <Features onNavigate={navigate} />}
        {activePage === 'get-started' && <GetStarted />}
        {activePage === 'foundations' && <Foundations onNavigate={navigate} />}
        {FOUNDATION_PAGE_IDS.includes(activePage) && (
          <FoundationDetail
            foundation={foundations.find((foundation) => foundation.id === activePage)}
            onNavigate={navigate}
            theme={theme}
            colorMode={colorMode}
          />
        )}
        {COMPONENT_ROUTE_IDS.includes(activePage) && (
          <Components
            activePage={activePage}
            onNavigate={navigate}
            search={componentSearch}
            setSearch={setComponentSearch}
            detailTab={detailTab}
            setDetailTab={setDetailTab}
          />
        )}
        {activePage === 'templates' && <Templates />}
        {activePage === 'editor' && (
          editorPageExists(editorExampleId) ? (
            <EditorPage
              key={editorExampleId}
              exampleId={editorExampleId}
              definition={editorExampleId.startsWith(NEW_PAGE_ID) ? makeBlankPage(editorExampleId) : EDITOR_EXAMPLES.find((e) => e.id === editorExampleId)?.definition}
              pages={[
                ...EDITOR_EXAMPLES.map((e) => ({ id: e.id, label: e.label })),
                ...userPages,
              ]}
              onDuplicatePage={handleDuplicatePage}
              onDeletePage={editorExampleId.startsWith(NEW_PAGE_ID) ? handleDeletePage : undefined}
              selectedNodeId={editorSelectedNodeId}
              onSelectNode={setEditorSelectedNodeId}
              onViewChange={setEditorView}
              onDirtyChange={setEditorDirty}
              onDefinitionChange={setEditorDefinition}
              pendingMove={editorPendingMove}
              onPendingMoveDone={() => setEditorPendingMove(null)}
              pendingAction={editorPendingAction}
              onPendingActionDone={() => setEditorPendingAction(null)}
              pendingConvert={editorPendingConvert}
              onPendingConvertDone={() => setEditorPendingConvert(null)}
              addTarget={editorAddTarget}
              onCancelAdd={() => setEditorAddTarget(null)}
              onRequestAdd={setEditorAddTarget}
            />
          ) : (
            <Section padding="xl" height="screen" align="center">
              <MessageEmptyState
                scale="page"
                icon="error"
                title="Page not found"
                description="This page isn’t available in this browser. Editor pages are stored locally, so a shared link only opens on the device where the page was created."
                action={(
                  <Button onClick={() => switchToEditorPage(DEFAULT_EXAMPLE_ID)}>
                    Go to default page
                  </Button>
                )}
              />
            </Section>
          )
        )}
        {activePage === 'editor-preview' && <EditorPreviewPage />}
        {activePage === 'projects' && <Projects />}
        {activePage === 'accessibility' && <Accessibility />}
        {activePage === 'releases' && <Releases />}
      </PageLayout>

      <Menu open={settingsOpen} onClose={() => setSettingsOpen(false)} aria-label="Settings">
        <MenuSection label="Theme">
          {themeOptions.length > 5 ? (
            <SelectField
              aria-label="Theme"
              size="compact"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {themeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </SelectField>
          ) : (
            <RadioGroup
              options={themeOptions}
              value={theme}
              onChange={setTheme}
              size="compact"
              aria-label="Theme"
            />
          )}
        </MenuSection>
        <MenuSection label="Color scheme">
          <SegmentedControl
            options={colorSchemeOptions}
            value={colorMode}
            onChange={setColorMode}
            aria-label="Color scheme"
            size="sm"
            fullWidth
          />
        </MenuSection>
        <MenuSection label="Accessibility">
          <Switch
            label="Reduce motion"
            checked={reducedMotion}
            onChange={setReducedMotion}
            size="compact"
          />
          <Switch
            label="Increase contrast"
            checked={contrastMore}
            onChange={setContrastMore}
            size="compact"
          />
        </MenuSection>
        <MenuSection label={<>Locale <span className="a1-web-alpha-badge">Alpha</span></>}>
          <SelectField
            aria-label="Locale"
            size="compact"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
          >
            {localeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </SelectField>
        </MenuSection>
        <MenuSection label="Editor">
          <Button
            variant="secondary"
            size="sm"
            icon="download"
            fullWidth
            onClick={handleExportAll}
          >
            Export all pages
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon="upload"
            fullWidth
            onClick={() => importInputRef.current?.click()}
          >
            Import pages
          </Button>
          <input
            ref={importInputRef}
            type="file"
            accept=".txt,text/plain"
            hidden
            onChange={handleImportFile}
          />
        </MenuSection>
        <MenuSection>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setTheme('a1Light')
              setColorMode('system')
              setReducedMotion(false)
              setContrastMore(false)
              setLocale('en')
            }}
          >
            Reset to defaults
          </Button>
        </MenuSection>
      </Menu>

      <Snackbar
        open={pageSnackbarOpen}
        onClose={() => setPageSnackbarOpen(false)}
        actionLabel="Undo"
        onAction={handleUndoDeletePage}
      >
        {deletedPage ? `“${deletedPage.page.label}” deleted` : 'Page deleted'}
      </Snackbar>

      <Snackbar open={!!editorMessage} onClose={() => setEditorMessage('')}>
        {editorMessage}
      </Snackbar>
    </LabelsProvider>
  )
}

createRoot(document.getElementById('root')).render(<App />)
