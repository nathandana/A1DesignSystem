import '../../../build/css/tokens.css'
import '../../../packages/react/src/themes.css'
import '../../../packages/react/src/color-scheme.css'
import { createRoot } from 'react-dom/client'
import { useEffect, useRef, useState } from 'react'
import {
  BottomSheet,
  Button,
  Heading,
  IconButton,
  LabelsProvider,
  Link,
  Menu,
  MenuSection,
  PageLayout,
  Paragraph,
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
import { Patterns } from './pages/Patterns.jsx'
import { patternToDefinition } from './patterns/patternDocument.js'
import { PatternWorkspaceSidebar } from './patterns/PatternWorkspaceSidebar.jsx'
import { Accessibility } from './pages/Accessibility.jsx'
import { Releases } from './pages/Releases.jsx'
import { TodoPage } from './pages/TodoPage.jsx'
import { Help } from './pages/Help.jsx'
import { EditorPage } from './pages/EditorPage.tsx'
import { EditorPreviewPage } from './pages/EditorPreviewPage.tsx'
import { ProjectsList } from './projects/ProjectsList.jsx'
import { AllPagesView } from './projects/AllPagesView.jsx'
import { ImageLibraryView } from './projects/ImageLibraryView.jsx'
import { ThemeEditor } from './pages/ThemeEditor.jsx'
import { ThemesList } from './pages/ThemesList.jsx'
import { RuleEditor } from './pages/RuleEditor.jsx'
import { ThemeWorkspaceSidebar } from './pages/ThemeWorkspaceSidebar.jsx'
import { getTheme, subscribeThemes } from './lib/themeStore.ts'
import { ProjectWorkspaceSidebar } from './projects/ProjectWorkspaceSidebar.jsx'
import { ImageLibraryProvider } from './editor/ImageLibraryContext.jsx'
import * as projectStore from './projects/projectStore.ts'
import { EDITOR_EXAMPLES, makeBlankPage } from './editor/examples/index.ts'
import { suppressHistoryFlush } from './editor/storage.ts'
import { AuthProvider, useAuth } from './lib/AuthContext.jsx'
import { supabaseConfigured } from './lib/supabase.js'
import { AccountPage } from './pages/AccountPage.jsx'
import { AuthGate } from './AuthGate.jsx'
import { startCloudSync, stopCloudSync } from './projects/cloudSync.js'
import { resetImageCache } from './lib/imageLibrary'
import { setSupabaseImageUser } from './lib/imageStore'
import { PostHogProvider } from 'posthog-js/react'
import { posthog, posthogEnabled, initPostHog } from './lib/posthog.js'
import './styles.css'

// True when this window was opened as a standalone preview (no app chrome).
const IS_STANDALONE = new URLSearchParams(window.location.search).has('standalone')

const FOUNDATION_PAGE_IDS = foundations.map((foundation) => foundation.id)
const RESOURCE_PAGE_IDS = ['features', 'get-started', 'todo', 'accessibility', 'releases']
const RESOURCE_PAGE_ICONS = {
  features: 'star',
  'get-started': 'rocket_launch',
  todo: 'checklist',
  accessibility: 'accessibility',
  releases: 'new_releases',
}
const COMPONENT_ROUTE_IDS = ['components', ...componentCategoryPageIds, ...componentPageIds]

const PAGES = ['home', 'features', 'get-started', 'foundations', ...FOUNDATION_PAGE_IDS, ...COMPONENT_ROUTE_IDS, 'patterns', 'editor', 'editor-preview', 'image-library', 'theme-editor', 'rules', 'projects', 'help', 'accessibility', 'releases', 'todo', 'account']

const PAGE_TITLES = {
  home: 'A1 Design System',
  features: 'Features',
  'get-started': 'Get Started',
  foundations: 'Foundations',
  ...Object.fromEntries(foundations.map((foundation) => [foundation.id, foundation.title])),
  ...componentPageTitles,
  patterns: 'Patterns',
  editor: 'Editor',
  'editor-preview': 'Editor Preview',
  'image-library': 'Image library',
  'theme-editor': 'Theme',
  'rules': 'Rules',
  projects: 'Projects',
  help: 'Help',
  accessibility: 'Accessibility',
  releases: 'Releases',
  todo: 'TODO',
  account: 'Account',
}

const themeOptions = [
  { value: 'a1Light', label: 'Default' },
  { value: 'a1Heritage', label: 'Heritage' },
  { value: 'crochet', label: 'Crochet' },
  { value: 'aperture', label: 'Aperture' },
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
  const { user: authUser } = useAuth()
  const [componentSearch, setComponentSearch] = useState('')
  const [detailTab, setDetailTab] = useState('configure')
  // ── Projects state ─────────────────────────────────────────────────────────
  // The editor is organised into isolated projects; `activeProjectId` + `openPageId`
  // are mirrored in the URL (`?page=editor&project=…&doc=…`) so links are shareable.
  const [projects, setProjects] = useState(() => projectStore.loadProjects())
  const [activeProjectId, setActiveProjectId] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('project') || projectStore.getActiveProjectId() || null
  })
  const [projectPages, setProjectPages] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const pid = params.get('project') || projectStore.getActiveProjectId()
    return pid ? projectStore.loadPages(pid) : []
  })
  const [openPageId, setOpenPageId] = useState(() => new URLSearchParams(window.location.search).get('doc') || null)

  // Pattern authoring reuses the main editor: `?page=editor&pattern=<id>` opens a
  // pattern as a document (no project context). Derived from the URL each render.
  const editorPatternId = activePage === 'editor' ? new URLSearchParams(window.location.search).get('pattern') : null

  const [editorView, setEditorView] = useState('edit')
  const [editorDirty, setEditorDirty] = useState(false)
  const [editorSelectedNodeId, setEditorSelectedNodeId] = useState(null)
  const [editorDefinition, setEditorDefinition] = useState(null)
  const [editorPendingMove, setEditorPendingMove] = useState(null)
  const [editorAddTarget, setEditorAddTarget] = useState(null)
  const [editorPendingAction, setEditorPendingAction] = useState(null) // { type: 'delete'|'ungroup', nodeId }
  const [editorPendingConvert, setEditorPendingConvert] = useState(null) // { nodeId, newType, newProps }
  // Set to a page id by "Make with AI" so that, when that page opens, the editor
  // lands on the AI tab with the prompt focused. Consumed (cleared) once handled.
  const [aiComposePageId, setAiComposePageId] = useState(null)
  // Theme editor: which saved theme is open, and which category pane is active.
  // Both are mirrored in the URL (`?page=theme-editor&theme=…&cat=…`) so browser
  // history steps through themes list → theme → category.
  const [activeThemeId, setActiveThemeId] = useState(() => new URLSearchParams(window.location.search).get('theme') || null)
  const [themeCategory, setThemeCategory] = useState(() => new URLSearchParams(window.location.search).get('cat') || 'color')
  // Opens the editor workspace SideNav as an overlay at md and below (where it's
  // collapsed). Toggled by the in-canvas sidebar button.
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // At xs/sm the right config panel becomes a BottomSheet instead of a side rail.
  const [isSmDown, setIsSmDown] = useState(() =>
    typeof window !== 'undefined' && !!window.matchMedia?.('(max-width: 640px)').matches
  )
  useEffect(() => {
    if (!window.matchMedia) return undefined
    const mq = window.matchMedia('(max-width: 640px)')
    const handler = (e) => setIsSmDown(e.matches)
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])
  // Bump on theme-store changes so the sidebar theme name stays live after a rename.
  const [, setThemesVersion] = useState(0)
  useEffect(() => subscribeThemes(() => setThemesVersion((v) => v + 1)), [])
  const [editorMessage, setEditorMessage] = useState('') // transient editor notice (no action)
  const importInputRef = useRef(null)
  const resolvedColorScheme = colorMode === 'system' ? systemColorScheme : colorMode

  const activeProject = projects.find((p) => p.id === activeProjectId) ?? null

  // The initial definition for an open page: a built-in example's definition, or
  // a blank page (seeded page content in localStorage overrides this anyway).
  function definitionForPage(pageId) {
    if (pageId === projectStore.LAYOUT_DOC_ID) {
      try { return JSON.parse(projectStore.loadProjectLayout(activeProjectId)) } catch { return null }
    }
    const example = EDITOR_EXAMPLES.find((e) => e.id === pageId)
    if (example) return example.definition
    const meta = projectPages.find((p) => p.id === pageId)
    return makeBlankPage(pageId, meta?.title || 'Untitled')
  }

  function refreshProjects() {
    setProjects(projectStore.loadProjects())
  }

  // Cloud sync: on sign-in pull the user's projects into local storage (then
  // refresh the list) and start pushing local changes up; on sign-out, stop.
  useEffect(() => {
    if (authUser) startCloudSync(authUser.id, { onHydrated: refreshProjects })
    else stopCloudSync()
    // Point the image library at the user's Supabase storage (or back to local)
    // and rebuild the URL cache so referenced Figures re-resolve.
    setSupabaseImageUser(authUser ? authUser.id : null)
    resetImageCache()
    // Attribute analytics to the signed-in user (per-user reports in PostHog).
    if (posthogEnabled) {
      if (authUser) posthog.identify(authUser.id, { email: authUser.email })
      else posthog.reset()
    }
  }, [authUser]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Project navigation ───────────────────────────────────────────────────────

  function openProject(id) {
    setActiveProjectId(id)
    projectStore.setActiveProjectId(id)
    setProjectPages(projectStore.loadPages(id))
    setOpenPageId(null)
    setEditorSelectedNodeId(null)
    setEditorDefinition(null)
    setEditorView('edit')
    navigate('editor')
  }

  function handleBackToProjects() {
    setActiveProjectId(null)
    projectStore.setActiveProjectId(null)
    setOpenPageId(null)
    setEditorSelectedNodeId(null)
    setEditorDefinition(null)
    navigate('editor')
  }

  // Top-nav "Editor" always lands on the Projects list (editor home).
  function handleEditorNav(e) {
    if (!isPlainLeftClick(e)) return
    e.preventDefault()
    handleBackToProjects()
  }

  // Top-nav Editor submenu entry — opens a project directly.
  function handleProjectNav(e, projectId) {
    if (!isPlainLeftClick(e)) return
    e.preventDefault()
    openProject(projectId)
  }

  function handleOpenPage(id) {
    setOpenPageId(id)
    setEditorSelectedNodeId(null)
    setEditorDefinition(null)
    setEditorView('edit')
  }

  // ── Project CRUD ─────────────────────────────────────────────────────────────

  function handleCreateProject(values) {
    const project = projectStore.createProject(values)
    // createProject only takes name/description/icon — persist any extra meta.
    if (values.meta && Object.keys(values.meta).length) {
      projectStore.updateProject(project.id, { meta: values.meta })
    }
    refreshProjects()
    openProject(project.id)
  }

  function handleImportProject(data) {
    try {
      const project = projectStore.importProjectJson(data)
      refreshProjects()
      openProject(project.id)
    } catch (err) {
      // Validation in the dialog gates this; this guards against unexpected shapes.
      console.error('Project import failed:', err)
    }
  }

  function handleRenameProject(id, patch) {
    projectStore.updateProject(id, patch)
    refreshProjects()
  }

  function handleDuplicateProject(id) {
    projectStore.duplicateProject(id)
    refreshProjects()
  }

  function handleDeleteProject(id) {
    projectStore.deleteProject(id)
    refreshProjects()
    if (activeProjectId === id) handleBackToProjects()
  }

  // ── Page CRUD (operate on the active project) ──────────────────────────────────

  function handleAddPage({ parentId = null, afterId = null } = {}) {
    if (!activeProjectId) return
    const { pages, page } = projectStore.addPage(activeProjectId, { parentId, afterId, title: 'Untitled' })
    setProjectPages(pages)
    handleOpenPage(page.id)
    refreshProjects()
  }

  // "Make with AI": add a blank page, open it, and flag it so the editor lands on
  // the AI tab with the prompt focused (consumed in EditorAsidePanel on mount).
  function handleAddPageWithAi() {
    if (!activeProjectId) return
    const { pages, page } = projectStore.addPage(activeProjectId, { parentId: null, afterId: null, title: 'Untitled' })
    setProjectPages(pages)
    setAiComposePageId(page.id)
    handleOpenPage(page.id)
    refreshProjects()
  }

  function handleDuplicateProjectPage(id) {
    if (!activeProjectId) return
    const result = projectStore.duplicatePage(activeProjectId, id)
    if (!result) return
    setProjectPages(result.pages)
    handleOpenPage(result.page.id)
    refreshProjects()
  }

  function handleDeleteProjectPage(id) {
    if (!activeProjectId) return
    const { pages, removedIds } = projectStore.deletePage(activeProjectId, id)
    setProjectPages(pages)
    if (removedIds.includes(openPageId)) {
      setOpenPageId(null)
      setEditorSelectedNodeId(null)
      setEditorDefinition(null)
    }
    setEditorMessage('Page deleted')
    refreshProjects()
  }

  function handleMoveProjectPage(move) {
    if (!activeProjectId) return
    const next = projectStore.applyPageMove(projectPages, move)
    if (!next) {
      setEditorMessage('Can’t move there — pages can be nested at most three levels deep.')
      return
    }
    projectStore.savePages(activeProjectId, next)
    setProjectPages(projectStore.loadPages(activeProjectId))
    refreshProjects()
  }

  function handleSetPageLevel(level) {
    if (!activeProjectId || !openPageId) return
    const next = projectStore.setPageLevel(projectPages, openPageId, level)
    projectStore.savePages(activeProjectId, next)
    setProjectPages(projectStore.loadPages(activeProjectId))
    refreshProjects()
  }

  // Open the project as a standalone prototype, starting at `pageId` (or the
  // project's first page). Page content resolves from localStorage in the new tab.
  function launchProjectPrototype(pageId) {
    const target = pageId ?? projectPages[0]?.id
    if (!target || !activeProjectId) return
    const url = `/?page=editor-preview&standalone&screen=${encodeURIComponent(target)}&project=${encodeURIComponent(activeProjectId)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // Export every project (and its pages' latest JSON) as one plain-text backup
  // file, so nothing is lost if local storage is cleared.
  function handleExportAll() {
    const content = projectStore.exportAllText()
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `a1-editor-projects-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  // Restore projects + pages from an "Export all" file, then reload so the editor
  // picks everything up cleanly. Suppress the open page's history flush first so
  // its stale in-memory state can't clobber the freshly-imported content.
  async function handleImportFile(event) {
    const file = event.target.files?.[0]
    event.target.value = '' // allow re-importing the same file later
    if (!file) return

    let text = ''
    try { text = await file.text() } catch { setEditorMessage('Could not read that file.'); return }

    const { projects: importedProjects } = projectStore.importAllText(text)
    if (importedProjects === 0) {
      setEditorMessage('No projects found in that file.')
      return
    }

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
    setSidebarOpen(false)
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
    const onPop = () => {
      setActivePage(getPage())
      const params = new URLSearchParams(window.location.search)
      const proj = params.get('project') || null
      setActiveProjectId(proj)
      setProjectPages(proj ? projectStore.loadPages(proj) : [])
      setOpenPageId(params.get('doc') || null)
      setActiveThemeId(params.get('theme') || null)
      setThemeCategory(params.get('cat') || 'color')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('a1-theme-heritage', theme === 'a1Heritage')
    document.documentElement.classList.toggle('a1-theme-accessible', theme === 'a1Accessible')
    document.documentElement.classList.toggle('a1-theme-fresh', theme === 'fresh')
    document.documentElement.classList.toggle('a1-theme-crochet', theme === 'crochet')
    document.documentElement.classList.toggle('a1-theme-aperture', theme === 'aperture')
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

  // Mirror the open page's definition metadata (name/description/icon) into its
  // project page record so the page tree and generated nav stay in sync as you
  // edit. Hierarchy (parentId/order) is owned by the tree, not the definition.
  useEffect(() => {
    const page = editorDefinition?.page
    if (!page || !activeProjectId || !openPageId) return
    setProjectPages((prev) => {
      const target = prev.find((p) => p.id === openPageId)
      if (!target) return prev
      const title = page.name || 'Untitled'
      const description = page.description || undefined
      const icon = page.icon ?? target.icon
      if (target.title === title && target.description === description && target.icon === icon) return prev
      const next = prev.map((p) => (p.id === openPageId ? { ...p, title, description, icon } : p))
      projectStore.savePages(activeProjectId, next)
      return next
    })
  }, [editorDefinition?.page?.name, editorDefinition?.page?.description, editorDefinition?.page?.icon, activeProjectId, openPageId])

  // Keep the editor URL pointed at the active project + page
  // (`?page=editor&project=<id>&doc=<id>`) so it is shareable. Each genuine
  // in-editor navigation (changing project or page) PUSHES a history entry so
  // the browser Back button steps through All Projects → project → page. The
  // very first sync after entering the editor (mount or resume from a stored
  // project) REPLACES instead, so we don't leave a spurious entry behind.
  const editorUrlSynced = useRef(false)
  useEffect(() => {
    if (activePage !== 'editor') return
    // Pattern authoring keeps its own `?page=editor&pattern=<id>` URL — don't
    // rewrite it to the project/page form (which would drop the pattern param).
    if (editorPatternId) return
    const params = new URLSearchParams()
    params.set('page', 'editor')
    if (activeProjectId) params.set('project', activeProjectId)
    if (openPageId) params.set('doc', openPageId)
    const next = `${window.location.pathname}?${params.toString()}`
    if (`${window.location.pathname}${window.location.search}` === next) {
      editorUrlSynced.current = true
      return
    }
    if (editorUrlSynced.current) {
      window.history.pushState({ page: 'editor' }, '', next)
    } else {
      window.history.replaceState({ page: 'editor' }, '', next)
    }
    editorUrlSynced.current = true
  }, [activePage, activeProjectId, openPageId, editorPatternId])

  // Keep the theme editor URL pointed at the open theme + category
  // (`?page=theme-editor&theme=<id>&cat=<category>`) so Back/Forward steps
  // through Themes list → theme → category. First sync on entry REPLACES; each
  // genuine change (open a theme, switch category) PUSHES a history entry.
  const themeUrlSynced = useRef(false)
  useEffect(() => {
    if (activePage !== 'theme-editor') { themeUrlSynced.current = false; return }
    const params = new URLSearchParams()
    params.set('page', 'theme-editor')
    if (activeThemeId) {
      params.set('theme', activeThemeId)
      params.set('cat', themeCategory)
    }
    const next = `${window.location.pathname}?${params.toString()}`
    if (`${window.location.pathname}${window.location.search}` === next) {
      themeUrlSynced.current = true
      return
    }
    if (themeUrlSynced.current) {
      window.history.pushState({ page: 'theme-editor' }, '', next)
    } else {
      window.history.replaceState({ page: 'theme-editor' }, '', next)
    }
    themeUrlSynced.current = true
  }, [activePage, activeThemeId, themeCategory])

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
    {
      id: 'editor',
      label: PAGE_TITLES.editor,
      active: activePage === 'editor' || activePage === 'help' || activePage === 'patterns' || activePage === 'image-library' || activePage === 'theme-editor' || activePage === 'rules',
      items: [
        {
          icon: 'folder',
          label: 'Projects',
          active: activePage === 'editor',
          items: [
            {
              icon: 'grid_view',
              label: 'All projects',
              href: getPath('editor'),
              onClick: handleEditorNav,
            },
            ...(projects.length ? [{ divider: true }] : []),
            ...projects.map((project) => ({
              icon: project.icon || 'folder',
              label: project.name,
              href: `/?page=editor&project=${project.id}`,
              active: activePage === 'editor' && activeProjectId === project.id,
              onClick: (e) => handleProjectNav(e, project.id),
            })),
          ],
        },
        {
          icon: 'dashboard_customize',
          label: 'Patterns',
          href: getPath('patterns'),
          active: activePage === 'patterns',
          onClick: (e) => handleNavClick(e, 'patterns'),
        },
        {
          icon: 'photo_library',
          label: 'Image library',
          href: getPath('image-library'),
          active: activePage === 'image-library',
          onClick: (e) => handleNavClick(e, 'image-library'),
        },
        {
          icon: 'palette',
          label: 'Theme',
          href: getPath('theme-editor'),
          active: activePage === 'theme-editor',
          onClick: (e) => handleNavClick(e, 'theme-editor'),
        },
        {
          icon: 'gavel',
          label: 'Rules',
          href: getPath('rules'),
          active: activePage === 'rules',
          onClick: (e) => handleNavClick(e, 'rules'),
        },
        {
          icon: 'help',
          label: 'Editor help',
          href: getPath('help'),
          active: activePage === 'help',
          onClick: (e) => handleNavClick(e, 'help'),
        },
      ],
    },
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
      <span className="a1-web-logo__mark" aria-hidden="true">A1:Design</span>
    </span>
  )

  if (IS_STANDALONE) {
    return (
      <LabelsProvider locale={locale === 'en' ? null : locale} labels={allLabels}>
        {activePage === 'editor-preview' ? <EditorPreviewPage /> : null}
      </LabelsProvider>
    )
  }

  const patternDef = editorPatternId ? patternToDefinition(editorPatternId) : null

  // The right-side config panel (editor / theme / component configurators). At
  // md+ it's the PageLayout aside rail; at xs/sm it moves into a BottomSheet.
  const asideEl =
    (activePage === 'editor' && editorPatternId) || (activePage === 'editor' && activeProject && openPageId)
      ? <div id="a1-web-editor-aside-slot" className="a1-web-config-aside" />
      : activePage === 'theme-editor' && activeThemeId
      ? <div id="a1-web-theme-aside-slot" className="a1-web-config-aside" />
      : getComponentsAside({ activePage, detailTab })

  return (
    <LabelsProvider locale={locale === 'en' ? null : locale} labels={allLabels}>
      <ImageLibraryProvider>
      <PageLayout
        className="a1-web-page-layout"
        stickyHeader
        viewportHeight
        sidebar={
          activePage === 'editor' && editorPatternId
            ? <PatternWorkspaceSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                patternId={editorPatternId}
                definition={editorDefinition}
                selectedNodeId={editorSelectedNodeId}
                onSelectNode={setEditorSelectedNodeId}
                onRequestAdd={setEditorAddTarget}
                onNodeAction={setEditorPendingAction}
                onNodeMove={setEditorPendingMove}
                onConvertNode={(nodeId, newType, newProps) => setEditorPendingConvert({ nodeId, newType, newProps })}
              />
            : activePage === 'editor' && activeProject
            ? <ProjectWorkspaceSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                project={activeProject}
                onBackToProjects={handleBackToProjects}
                pages={projectPages}
                activePageId={openPageId}
                hasOpenPage={!!openPageId}
                onSelectPage={handleOpenPage}
                onAddPage={handleAddPage}
                onAddPageWithAi={handleAddPageWithAi}
                onDuplicatePage={handleDuplicateProjectPage}
                onDeletePage={handleDeleteProjectPage}
                onMovePage={handleMoveProjectPage}
                definition={editorDefinition}
                selectedNodeId={editorSelectedNodeId}
                onSelectNode={setEditorSelectedNodeId}
                onNodeMove={setEditorPendingMove}
                onRequestAdd={setEditorAddTarget}
                onNodeAction={setEditorPendingAction}
                onConvertNode={(nodeId, newType, newProps) => setEditorPendingConvert({ nodeId, newType, newProps })}
              />
            : activePage === 'theme-editor' && activeThemeId
            ? <ThemeWorkspaceSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                themeName={getTheme(activeThemeId)?.name}
                category={themeCategory}
                onSelectCategory={setThemeCategory}
                onBackToThemes={() => setActiveThemeId(null)}
              />
            : COMPONENT_ROUTE_IDS.includes(activePage)
            ? getComponentsSidebar({ activePage, onNavigate: navigate, search: componentSearch, setSearch: setComponentSearch })
            : undefined
        }
        aside={isSmDown ? undefined : asideEl}
        header={
          <TopHeader
            className="a1-web-app-header"
            logo={logo}
            logoHref={getPath('home')}
            navItems={navItems}
            actions={actions}
          />
        }
      >
        {((activePage === 'editor' && (editorPatternId || activeProject)) || (activePage === 'theme-editor' && activeThemeId)) && (
          <IconButton
            className="a1-web-sidebar-toggle"
            icon="view_sidebar"
            label="Open sidebar"
            size='sm'
            variant="secondary"
            onClick={() => setSidebarOpen(true)}
          />
        )}
        {activePage === 'home' && <Home onNavigate={navigate} />}
        {activePage === 'features' && <Features onNavigate={navigate} />}
        {activePage === 'get-started' && <GetStarted onNavigate={navigate} />}
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
        {activePage === 'patterns' && <Patterns onNavigate={navigate} />}
        {activePage === 'rules' && <RuleEditor onNavigate={navigate} />}
        {activePage === 'editor' && editorPatternId && (
          patternDef ? (
            <EditorPage
              key={`pattern-${editorPatternId}`}
              documentKind="pattern"
              patternId={editorPatternId}
              projects={projects}
              exampleId={`pattern-${editorPatternId}`}
              definition={patternDef}
              selectedNodeId={editorSelectedNodeId}
              onSelectNode={setEditorSelectedNodeId}
              onViewChange={setEditorView}
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
            <Section padding="lg" gap="sm">
              <Heading as="h1" size="lg">Pattern not found</Heading>
              <Paragraph color="muted">No pattern with id "{editorPatternId}".</Paragraph>
              <Link href={getPath('patterns')}>Back to patterns</Link>
            </Section>
          )
        )}
        {activePage === 'editor' && !editorPatternId && (
          !activeProject ? (
            <ProjectsList
              projects={projects}
              onOpenProject={openProject}
              onCreateProject={handleCreateProject}
              onRenameProject={handleRenameProject}
              onDuplicateProject={handleDuplicateProject}
              onDeleteProject={handleDeleteProject}
              onImportProject={handleImportProject}
              onOpenImageLibrary={() => navigate('image-library')}
              onNavigateHome={() => navigate('home')}
              onOpenHelp={() => navigate('help')}
            />
          ) : openPageId === projectStore.LAYOUT_DOC_ID ? (
            <EditorPage
              key="__layout__"
              exampleId={projectStore.LAYOUT_DOC_ID}
              definition={definitionForPage(projectStore.LAYOUT_DOC_ID)}
              documentKind="layout"
              projectId={activeProjectId}
              projectName={activeProject.name}
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
          ) : !openPageId || !projectPages.some((p) => p.id === openPageId) ? (
            <AllPagesView
              project={activeProject}
              pages={projectPages}
              onEditLayout={() => handleOpenPage(projectStore.LAYOUT_DOC_ID)}
              onOpenPage={handleOpenPage}
              onAddPage={handleAddPage}
              onLaunchPrototype={() => launchProjectPrototype()}
              onRenameProject={handleRenameProject}
              onDeleteProject={handleDeleteProject}
              onNavigateHome={() => navigate('home')}
              onBackToProjects={handleBackToProjects}
            />
          ) : (
            <EditorPage
              key={openPageId}
              exampleId={openPageId}
              definition={definitionForPage(openPageId)}
              pages={projectPages.map((p) => ({ id: p.id, label: p.title }))}
              projectId={activeProjectId}
              projectName={activeProject.name}
              projectPages={projectPages}
              onNavigateToPage={handleOpenPage}
              composeWithAi={openPageId === aiComposePageId}
              onAiComposeConsumed={() => setAiComposePageId(null)}
              pageLevel={projectStore.getPageLevel(projectPages, openPageId)}
              availableLevels={projectStore.availableLevels(projectPages, openPageId)}
              onSetPageLevel={handleSetPageLevel}
              onDuplicatePage={() => handleDuplicateProjectPage(openPageId)}
              onDeletePage={() => handleDeleteProjectPage(openPageId)}
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
          )
        )}
        {activePage === 'editor-preview' && <EditorPreviewPage />}
        {activePage === 'image-library' && (
          <ImageLibraryView
            projects={projects}
            onBackToProjects={() => navigate('editor')}
            onNavigateHome={() => navigate('home')}
          />
        )}
        {activePage === 'theme-editor' && (
          !activeThemeId
            ? <ThemesList
                onOpenTheme={(id) => { setActiveThemeId(id); setThemeCategory('color') }}
                onNavigateHome={() => navigate('home')}
              />
            : <ThemeEditor
                themeId={activeThemeId}
                category={themeCategory}
                onNavigate={navigate}
                onBackToThemes={() => setActiveThemeId(null)}
              />
        )}
        {activePage === 'projects' && (
          <ProjectsList
            projects={projects}
            onOpenProject={openProject}
            onCreateProject={handleCreateProject}
            onRenameProject={handleRenameProject}
            onDuplicateProject={handleDuplicateProject}
            onDeleteProject={handleDeleteProject}
            onImportProject={handleImportProject}
            onOpenImageLibrary={() => navigate('image-library')}
            onNavigateHome={() => navigate('home')}
            onOpenHelp={() => navigate('help')}
          />
        )}
        {activePage === 'account' && <AccountPage onNavigate={navigate} />}
        {activePage === 'accessibility' && <Accessibility onNavigate={navigate} />}
        {activePage === 'help' && <Help onNavigate={navigate} />}
        {activePage === 'releases' && <Releases onNavigate={navigate} />}
        {activePage === 'todo' && <TodoPage onNavigate={navigate} />}

        {/* xs/sm: the config panel as a bottom sheet. Rendered last so its
            in-flow spacer reserves space at the bottom, not the top. */}
        {isSmDown && asideEl && (
          <BottomSheet className="a1-web-config-sheet" title="Configure" detents={[0.55, 0.95]} defaultDetent={0}>
            {asideEl}
          </BottomSheet>
        )}
      </PageLayout>

      <Menu open={settingsOpen} onClose={() => setSettingsOpen(false)} aria-label="Settings">
        {supabaseConfigured && (
          <MenuSection label="Account">
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              icon="account_circle"
              onClick={() => { setSettingsOpen(false); navigate('account') }}
            >
              {authUser ? authUser.email : 'Sign in'}
            </Button>
          </MenuSection>
        )}
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

      <Snackbar open={!!editorMessage} onClose={() => setEditorMessage('')}>
        {editorMessage}
      </Snackbar>
      </ImageLibraryProvider>
    </LabelsProvider>
  )
}

// No-op unless VITE_POSTHOG_KEY is set.
initPostHog()

const tree = (
  <AuthProvider>
    <AuthGate>
      <App />
    </AuthGate>
  </AuthProvider>
)

createRoot(document.getElementById('root')).render(
  posthogEnabled ? <PostHogProvider client={posthog}>{tree}</PostHogProvider> : tree,
)
