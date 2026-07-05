import '../../../build/css/tokens.css'
import '../../../packages/react/src/themes.css'
import '../../../packages/react/src/color-scheme.css'
import '../../../packages/react/src/utilities/spacing.css'
import '../../../packages/react/src/utilities/width.css'
import './priorityGuide/wireframe-redacted.css'
import { createRoot } from 'react-dom/client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  BottomSheet,
  Button,
  Heading,
  IconButton,
  LabelsProvider,
  Link,
  Menu,
  MenuItem,
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
import appLabels       from '../../../system/labels/app.json'
import actionLabels    from '../../../system/labels/action.json'
import backlogLabels   from '../../../system/labels/backlog.json'
import calendarLabels  from '../../../system/labels/calendar.json'
import codeLabels      from '../../../system/labels/code.json'
import fieldLabels     from '../../../system/labels/field.json'
import statusBarLabels from '../../../system/labels/status-bar.json'
import {
  getLabels,
  hydrateLabels,
  subscribeLabels,
  subscribeRemoteLabels,
  buildLabelsObject,
  buildProjectLabelsObject,
  deepMergeLabels,
} from './labels/labelStore.js'

const SYSTEM_LABELS = {
  label: {
    ...appLabels.label,
    ...actionLabels.label,
    ...backlogLabels.label,
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
  componentRouteSlug,
  componentIdFromRouteSlug,
  getComponentExampleBySlug,
} from './pages/Components.jsx'
import { Patterns } from './pages/Patterns.jsx'
import { patternToDefinition } from './patterns/patternDocument.js'
import { getAllPatterns, subscribePatterns } from './patterns/patternStore.js'
import { PatternWorkspaceSidebar } from './patterns/PatternWorkspaceSidebar.jsx'
import { Accessibility } from './pages/Accessibility.jsx'
import { Releases } from './pages/Releases.jsx'
import { Backlog } from './pages/Backlog.jsx'
import { BacklogTicketPage } from './pages/BacklogTicketPage.jsx'
import { VirtualTeam } from './pages/VirtualTeam.jsx'
import { About } from './pages/About.jsx'
import { KitchenSink } from './pages/KitchenSink.jsx'
import { Blog } from './pages/Blog.jsx'
import { BlogArticle } from './pages/BlogArticle.jsx'
import { BLOG_POSTS } from './pages/blogPosts.js'
import { Help } from './pages/Help.jsx'
import { HelpAssistantMenu } from './help/HelpAssistantMenu.jsx'
import { EditorPage } from './pages/EditorPage.tsx'
import { EditorPreviewPage } from './pages/EditorPreviewPage.tsx'
import { ProjectsList } from './projects/ProjectsList.jsx'
import { AllPagesView } from './projects/AllPagesView.jsx'
import { ImageLibraryView } from './image-library/ImageLibraryView.jsx'
import { CustomIconsView } from './projects/CustomIconsView.jsx'
import { ThemeEditor } from './pages/ThemeEditor.jsx'
import { ThemesList } from './pages/ThemesList.jsx'
import { RuleEditor } from './pages/RuleEditor.jsx'
import { listAllRules, subscribeRules } from './rules/ruleStore.ts'
import { ThemeWorkspaceSidebar } from './pages/ThemeWorkspaceSidebar.jsx'
import { getTheme, subscribeThemes } from './lib/themeStore.ts'
import { ProjectWorkspaceSidebar } from './projects/ProjectWorkspaceSidebar.jsx'
import { ImageLibraryProvider } from './editor/ImageLibraryContext.jsx'
import { CustomIconFontProvider } from './editor/CustomIconFontProvider.jsx'
import * as projectStore from './projects/projectStore.ts'
import { EDITOR_EXAMPLES, makeBlankPage } from './editor/examples/index.ts'
import { AuthProvider, useAuth } from './lib/AuthContext.jsx'
import { TProvider } from './labels/useT.js'
import { AccountPage } from './pages/AccountPage.jsx'
import { AuthGate } from './AuthGate.jsx'
import { startCloudSync, stopCloudSync } from './projects/cloudSync.js'
import { resetImageCache } from './lib/imageLibrary'
import { setSupabaseImageUser } from './lib/imageStore'
import { setHistoryUser } from './services/historyDb'
import { BacklogProvider } from './backlog/BacklogContext.jsx'
import { useBacklog } from './backlog/BacklogContext.jsx'
import { DataSourcesProvider } from './data/DataSourcesContext.jsx'
import { DataSourcesView } from './data/DataSourcesView.jsx'
import { LabelEditor } from './pages/LabelEditor.jsx'
import { PriorityGuideEditor } from './pages/PriorityGuideEditor.jsx'
import { GlobalSearchDialog } from './search/GlobalSearchDialog.jsx'
import { PostHogProvider } from 'posthog-js/react'
import { posthog, posthogEnabled, initPostHog } from './lib/posthog.js'
import './styles.css'

// True when this window was opened as a standalone preview (no app chrome).
const IS_STANDALONE = new URLSearchParams(window.location.search).has('standalone')

const FOUNDATION_PAGE_IDS = foundations.map((foundation) => foundation.id)
const BLOG_ARTICLE_SLUG = BLOG_POSTS[0]?.slug || 'search-shortcuts-and-walkthroughs'
const EXPLORE_PAGE_IDS = ['features', 'get-started', 'blog', 'backlog', 'accessibility', 'releases', 'about', ...(import.meta.env.DEV ? ['virtual-team'] : [])]
const PAGE_ICONS = {
  features: 'star',
  'get-started': 'rocket_launch',
  blog: 'article',
  help: 'help',
  backlog: 'task_alt',
  'virtual-team': 'groups',
  accessibility: 'accessibility',
  releases: 'new_releases',
  about: 'info',
  'kitchen-sink': 'dashboard_customize',
  'label-editor': 'translate',
}
const COMPONENT_ROUTE_IDS = ['components', ...componentCategoryPageIds, ...componentPageIds]

const PAGES = ['home', 'features', 'get-started', 'blog', 'blog-article', 'foundations', ...FOUNDATION_PAGE_IDS, ...COMPONENT_ROUTE_IDS, 'patterns', 'editor', 'editor-preview', 'image-library', 'custom-icons', 'data', 'theme-editor', 'rules', 'label-editor', 'priority-guide', 'projects', 'help', 'accessibility', 'releases', 'backlog', ...(import.meta.env.DEV ? ['virtual-team'] : []), 'backlog-ticket', 'about', 'kitchen-sink', 'account']

const PAGE_TITLES = {
  home: 'A1 Design System',
  features: 'Features',
  'get-started': 'Get started',
  blog: 'Blog',
  'blog-article': 'Search, shortcuts, and walkthroughs',
  foundations: 'Foundations',
  ...Object.fromEntries(foundations.map((foundation) => [foundation.id, foundation.title])),
  ...componentPageTitles,
  patterns: 'Patterns',
  editor: 'Editor',
  'editor-preview': 'Editor Preview',
  'image-library': 'Image library',
  'custom-icons': 'Custom icons',
  data: 'Data sources',
  'theme-editor': 'Theme',
  'rules': 'Rules',
  'label-editor': 'Label editor',
  'priority-guide': 'Priority guides',
  projects: 'Projects',
  help: 'Help',
  accessibility: 'Accessibility',
  releases: 'Releases',
  backlog: 'Backlog',
  'virtual-team': 'Virtual team',
  'backlog-ticket': 'Backlog',
  about: 'About',
  'kitchen-sink': 'Kitchen sink',
  account: 'Account',
}

const themeOptions = [
  { value: 'a1Light', label: 'Default' },
  { value: 'a1Heritage', label: 'Heritage' },
  { value: 'crochet', label: 'Crochet' },
  { value: 'aperture', label: 'Aperture' },
  { value: 'marshmallow', label: 'Marshmallow' },
  { value: 'a1Accessible', label: 'Accessible' },
  { value: 'fresh', label: 'Fresh' },
  { value: 'wireframe', label: 'Wireframe' },
  { value: 'wireframe-redacted', label: 'Wireframe (redacted)' },
]
const settingsThemeOptions = themeOptions.filter((option) => !['crochet', 'marshmallow'].includes(option.value))

const colorSchemeOptions = [
  { value: 'light', icon: 'light_mode', ariaLabel: 'Light mode', labelKey: 'app.settings.lightMode' },
  { value: 'dark', icon: 'dark_mode', ariaLabel: 'Dark mode', labelKey: 'app.settings.darkMode' },
  { value: 'system', icon: 'desktop_windows', ariaLabel: 'System mode', labelKey: 'app.settings.systemMode' },
]

const VALID_THEMES = themeOptions.map((o) => o.value)
const VALID_COLOR_MODES = colorSchemeOptions.map((o) => o.value)

function getComponentExampleTab(pathname = window.location.pathname) {
  const path = pathname.split(/[?#]/)[0].replace(/^\/|\/$/g, '')
  const parts = path.split('/')
  if (parts[0] !== 'components' || parts.length < 3) return null
  const [, componentSlug, exampleSlug] = parts
  const componentId = componentIdFromRouteSlug(componentSlug)
  const example = getComponentExampleBySlug(componentId, exampleSlug)
  return example ? `example:${example.id}` : null
}

function getPage(search = window.location.search, pathname = window.location.pathname) {
  // Path-based routing — read from the URL pathname first.
  const path = pathname.replace(/^\/|\/$/g, '') // strip leading/trailing slash
  if (!path) return 'home'
  if (path === 'blog') return 'blog'
  if (path.startsWith('blog/')) return 'blog-article'

  // /foundations → 'foundations', /foundations/color → 'foundation-color'
  if (path === 'foundations') return 'foundations'
  if (path.startsWith('foundations/')) {
    const id = `foundation-${path.slice('foundations/'.length)}`
    if (PAGES.includes(id)) return id
    return 'foundations'
  }

  // /components → 'components', /components/layout → 'components-layout',
  // /components/button → 'component-button'
  if (path === 'components') return 'components'
  if (path.startsWith('components/')) {
    const suffix = path.slice('components/'.length)
    const [componentSlug, exampleSlug] = suffix.split('/')
    const componentId = componentIdFromRouteSlug(componentSlug)
    if (componentSlug && exampleSlug && getComponentExampleBySlug(componentId, exampleSlug)) {
      const id = `component-${componentId}`
      if (PAGES.includes(id)) return id
    }
    if (PAGES.includes(`components-${suffix}`)) return `components-${suffix}`
    if (PAGES.includes(`component-${componentId}`)) return `component-${componentId}`
    return 'components'
  }

  // /backlog/A1-{n} → 'backlog-ticket'
  if (/^backlog\/A1-\d+$/i.test(path)) return 'backlog-ticket'

  // Direct match: /backlog → 'backlog', /editor → 'editor', etc.
  if (PAGES.includes(path)) return path

  // Legacy fallback: honour ?page= query param so old bookmarks still work.
  const paramPage = new URLSearchParams(search).get('page')
  if (paramPage && PAGES.includes(paramPage)) return paramPage

  return 'home'
}

function getPath(page) {
  if (!page || page === 'home') return '/'
  if (page === 'blog-article') return `/blog/${BLOG_ARTICLE_SLUG}`
  if (page.startsWith('foundation-')) return `/foundations/${page.slice('foundation-'.length)}`
  if (page.startsWith('components-')) return `/components/${page.slice('components-'.length)}`
  if (page.startsWith('component-')) return `/components/${componentRouteSlug(page.slice('component-'.length))}`
  if (page === 'backlog-ticket') return '/backlog'
  return `/${page}`
}

function isPlainLeftClick(e) {
  return e.button === 0 && !e.metaKey && !e.altKey && !e.ctrlKey && !e.shiftKey
}

function isVisibleFocusableSearch(el) {
  if (!(el instanceof HTMLElement)) return false
  if (el.matches('[disabled], [aria-disabled="true"]')) return false
  if (el.getAttribute('tabindex') === '-1') return false
  const style = window.getComputedStyle(el)
  if (style.display === 'none' || style.visibility === 'hidden') return false
  const rect = el.getBoundingClientRect()
  return rect.width > 0 && rect.height > 0
}

function focusPageSearchTarget() {
  const candidates = Array.from(document.querySelectorAll('[data-a1-page-search]'))
  const target = candidates.find(isVisibleFocusableSearch)
  if (!target) return false
  target.focus({ preventScroll: true })
  target.select?.()
  target.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  return true
}

const PAGE_TITLE_LABEL_KEYS = {
  home: 'app.page.home',
  features: 'app.page.features',
  'get-started': 'app.page.getStarted',
  blog: 'app.page.blog',
  'blog-article': 'app.page.blogArticle',
  foundations: 'app.nav.foundations',
  components: 'app.nav.components',
  patterns: 'app.page.patterns',
  editor: 'app.page.editor',
  'editor-preview': 'app.page.editorPreview',
  'image-library': 'app.page.imageLibrary',
  'custom-icons': 'app.page.customIcons',
  data: 'app.page.dataSources',
  'theme-editor': 'app.page.theme',
  rules: 'app.page.rules',
  'label-editor': 'app.page.labels',
  'priority-guide': 'app.page.priorityGuide',
  projects: 'app.page.projects',
  help: 'app.page.help',
  accessibility: 'app.page.accessibility',
  releases: 'app.page.releases',
  backlog: 'app.page.backlog',
  'virtual-team': 'app.page.virtualTeam',
  'backlog-ticket': 'app.page.backlog',
  about: 'app.page.about',
  account: 'app.page.account',
}

function resolveLabel(labels, locale, key, fallback) {
  if (!key || !labels) return fallback ?? key
  const parts = key.split('.')
  let node = labels.label
  for (const part of parts) {
    if (node == null || typeof node !== 'object') return fallback ?? key
    node = node[part]
  }
  if (node == null) return fallback ?? key
  if (locale && node.locale?.[locale] != null) return node.locale[locale]
  return node.$value ?? fallback ?? key
}


function App() {
  const [activePage, setActivePage] = useState(() => getPage())
  const [theme, setTheme] = useState(() => {
    // A standalone preview may force a theme via `?theme=` (e.g. the Priority
    // Guide editor's "Preview as wireframe"). It wins so the single authoritative
    // theme effect applies it — without fighting a second class toggle.
    if (IS_STANDALONE) {
      const forced = new URLSearchParams(window.location.search).get('theme')
      if (VALID_THEMES.includes(forced)) return forced
    }
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
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false)
  const [helpAssistantOpen, setHelpAssistantOpen] = useState(false)
  const helpAssistantAnchorRef = useRef(null)
  const [helpQuery, setHelpQuery] = useState(() => new URLSearchParams(window.location.search).get('q') || '')
  const [skipMenuOpen, setSkipMenuOpen] = useState(false)
  const skipMenuAnchorRef = useRef(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsAnchorRef = useRef(null)
  const { user: authUser, signOut } = useAuth()
  const backlog = useBacklog()
  const [componentSearch, setComponentSearch] = useState('')
  const [detailTab, setDetailTab] = useState(() => getComponentExampleTab() ?? 'configure')
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
  const editorSearchParams = new URLSearchParams(window.location.search)
  const editorPatternId = activePage === 'editor' ? editorSearchParams.get('pattern') : null
  const patternSourceProjectId = editorPatternId ? editorSearchParams.get('sourceProject') : null
  const patternSourceDocId = editorPatternId ? editorSearchParams.get('sourceDoc') : null
  const patternSourceNodeId = editorPatternId ? editorSearchParams.get('sourceNode') : null
  const patternSourceHref = patternSourceDocId
    ? `/editor?${new URLSearchParams({
        ...(patternSourceProjectId ? { project: patternSourceProjectId } : {}),
        doc: patternSourceDocId,
        ...(patternSourceNodeId ? { sourceNode: patternSourceNodeId } : {}),
      }).toString()}`
    : null

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
  const [patternsVersion, setPatternsVersion] = useState(0)
  useEffect(() => subscribePatterns(() => setPatternsVersion((v) => v + 1)), [])
  const [rulesVersion, setRulesVersion] = useState(0)
  useEffect(() => subscribeRules(() => setRulesVersion((v) => v + 1)), [])
  const [editorMessage, setEditorMessage] = useState('') // transient editor notice (no action)
  const resolvedColorScheme = colorMode === 'system' ? systemColorScheme : colorMode

  const activeProject = projects.find((p) => p.id === activeProjectId) ?? null

  useEffect(() => {
    if (!skipMenuOpen) return undefined
    const closeSkipMenu = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setSkipMenuOpen(false)
      skipMenuAnchorRef.current?.focus()
    }
    window.addEventListener('keydown', closeSkipMenu, true)
    return () => window.removeEventListener('keydown', closeSkipMenu, true)
  }, [skipMenuOpen])

  // ── Reactive label resolution: system defaults → workspace overrides → project overrides ──
  const [workspaceLabelsObj, setWorkspaceLabelsObj] = useState(() =>
    buildLabelsObject(getLabels().items)
  )
  useEffect(() => {
    const unsubscribeLocal = subscribeLabels((incoming) => {
      setWorkspaceLabelsObj(buildLabelsObject(incoming.items))
    })
    hydrateLabels().then((incoming) => {
      setWorkspaceLabelsObj(buildLabelsObject(incoming.items))
    })
    const unsubscribeRemote = subscribeRemoteLabels()
    return () => {
      unsubscribeLocal()
      unsubscribeRemote()
    }
  }, [])
  const allLabels = useMemo(() => {
    const projectLabels = activeProject?.labelOverrides
      ? buildProjectLabelsObject(activeProject.labelOverrides)
      : { label: {} }
    return {
      label: deepMergeLabels(SYSTEM_LABELS.label, workspaceLabelsObj.label, projectLabels.label),
    }
  }, [workspaceLabelsObj, activeProject])
  const labelLocale = locale === 'en' ? null : locale
  const t = useCallback((key, fallback) => resolveLabel(allLabels, labelLocale, key, fallback), [allLabels, labelLocale])
  const pageTitle = (page) => t(PAGE_TITLE_LABEL_KEYS[page], PAGE_TITLES[page] ?? page)

  const globalSearchEntries = useMemo(() => {
    const entries = []
    const addPage = (id, description, keywords = []) => {
      entries.push({
        id: `page-${id}`,
        title: pageTitle(id),
        category: 'Pages',
        description,
        icon: PAGE_ICONS[id] || 'article',
        keywords: [id, PAGE_TITLES[id], ...keywords],
        onSelect: () => navigate(id),
      })
    }

    addPage('home', 'Start page for A1 tools, packages, and product areas.', ['overview'])
    addPage('features', 'Current A1 feature set and product capabilities.', ['tools', 'capabilities'])
    addPage('get-started', 'Setup paths and first steps for using A1.', ['install', 'docs'])
    addPage('blog', 'Release newsletters, demos, and walkthroughs from A1.', ['posts', 'video', 'walkthrough', 'global search', 'newsletter'])
    BLOG_POSTS.forEach((post) => {
      entries.push({
        id: `blog-${post.slug}`,
        title: post.title,
        category: 'Blog',
        description: post.description,
        icon: 'article',
        keywords: ['blog', 'newsletter', 'release', post.version, ...(post.keywords || [])],
        onSelect: () => navigate('blog-article', { path: `/blog/${post.slug}` }),
      })
    })
    addPage('foundations', 'Tokens, themes, accessibility, layout, and design standards.', ['tokens', 'color', 'type'])
    addPage('components', 'Browse and configure A1 design system components.', ['component library', 'ui'])
    addPage('patterns', 'Reusable page and project patterns.', ['templates', 'sections'])
    addPage('editor', 'Create and edit projects with the governed JSON page model.', ['projects', 'pages', 'builder'])
    addPage('image-library', 'Manage reusable image assets for projects.', ['assets', 'media', 'dam'])
    addPage('custom-icons', 'Create and manage custom project icons.', ['symbols', 'iconography'])
    addPage('data', 'Plug and play data sets for projects.', ['datasets', 'sources'])
    addPage('theme-editor', 'Create and adjust custom themes.', ['color', 'tokens', 'brand'])
    addPage('rules', 'Define and review UI, component, and product rules.', ['governance', 'standards'])
    addPage('label-editor', 'Shared labels and translations.', ['locale', 'copy', 'language'])
    addPage('backlog', 'Plan, prioritize, and review A1 work.', ['tickets', 'issues', 'roadmap'])
    addPage('help', 'Guidance for using A1.', ['docs', 'support'])
    addPage('accessibility', 'Accessibility reports, standards, and checks.', ['a11y', 'wcag', 'contrast'])
    addPage('releases', 'Release notes and shipped changes.', ['changelog', 'updates'])
    addPage('about', 'About A1 Design System.', ['system'])
    addPage('kitchen-sink', 'A single page previewing as many A1 components as possible.', ['gallery', 'showcase', 'sticker sheet', 'preview', 'all components'])
    if (import.meta.env.DEV) addPage('virtual-team', 'Local review assistants for backlog and design work.', ['ai', 'persona'])

    foundations.forEach((foundation) => {
      entries.push({
        id: `foundation-${foundation.id}`,
        title: foundation.title,
        category: 'Foundations',
        description: foundation.body,
        icon: foundation.icon,
        keywords: [foundation.id, 'foundation', 'token', 'standard'],
        onSelect: () => navigate(foundation.id),
      })
    })

    componentCategories.forEach((category) => {
      entries.push({
        id: `component-category-${category.id}`,
        title: category.title,
        category: 'Component categories',
        description: category.body,
        icon: category.icon,
        keywords: [category.id, 'components'],
        onSelect: () => navigate(`components-${category.id}`),
      })
      category.components.forEach((component) => {
        entries.push({
          id: `component-${component.id}`,
          title: component.title,
          category: 'Components',
          description: component.body,
          icon: component.icon,
          keywords: [
            component.id,
            category.title,
            category.id,
            component.id === 'button' ? 'cta call to action submit action' : '',
            component.id === 'data-table' ? 'grid table rows columns spreadsheet list' : '',
            component.id === 'search-field' ? 'find query lookup' : '',
          ],
          onSelect: () => navigate(`component-${component.id}`),
        })
      })
    })

    projects.forEach((project) => {
      entries.push({
        id: `project-${project.id}`,
        title: project.name,
        category: 'Projects',
        description: project.description || 'Project workspace.',
        icon: project.icon || 'folder',
        keywords: ['project', project.name, project.description],
        onSelect: () => openProject(project.id),
      })
      projectStore.loadPages(project.id).forEach((page) => {
        entries.push({
          id: `project-page-${project.id}-${page.id}`,
          title: page.title || 'Untitled',
          category: 'Project pages',
          description: project.name,
          icon: page.icon || 'article',
          keywords: ['page', 'screen', 'editor', project.name, page.description],
          onSelect: () => {
            openProject(project.id)
            handleOpenPage(page.id)
          },
        })
      })
    })

    getAllPatterns().forEach((pattern) => {
      entries.push({
        id: `pattern-${pattern.pattern.id}`,
        title: pattern.pattern.name,
        category: 'Patterns',
        description: pattern.pattern.description || 'Reusable pattern.',
        icon: 'dashboard_customize',
        keywords: ['pattern', pattern.pattern.category, pattern.pattern.name],
        onSelect: () => navigate('patterns'),
      })
    })

    listAllRules().forEach((rule) => {
      entries.push({
        id: `rule-${rule.id}`,
        title: rule.requirement,
        category: 'Rules',
        description: rule.component,
        icon: 'gavel',
        badge: rule.source === 'builtin' ? 'Built-in' : 'User rule',
        keywords: ['rule', rule.component, rule.do, rule.dont, ...(rule.appliesTo || [])],
        onSelect: () => navigate('rules'),
      })
    })

    getLabels().items.forEach((label) => {
      entries.push({
        id: `label-${label.key}`,
        title: label.key,
        category: 'Labels',
        description: label.en || 'Workspace label.',
        icon: 'translate',
        keywords: ['label', 'translation', 'locale', ...Object.values(label).filter((value) => typeof value === 'string')],
        onSelect: () => navigate('label-editor'),
      })
    })

    backlog?.items?.forEach((item) => {
      entries.push({
        id: `ticket-${item.id}`,
        title: `A1-${item.number} ${item.title}`,
        category: 'Backlog',
        description: item.description || item.status,
        icon: 'task_alt',
        badge: item.priority,
        keywords: ['ticket', 'issue', 'backlog', item.type, item.status, item.size, item.scope],
        onSelect: () => navigate('backlog-ticket', { path: `/backlog/A1-${item.number}` }),
      })
    })

    return entries
  }, [backlog?.items, locale, patternsVersion, projects, rulesVersion, allLabels])

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
    // Tag shared edit-history entries with the signed-in user.
    setHistoryUser(authUser ?? null)
    // (The backlog points itself at the right store via BacklogProvider, which
    // owns its own auth wiring.)
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

  function handleUpdateProjectLabels(projectId, labelOverrides) {
    projectStore.updateProject(projectId, { labelOverrides })
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
    const url = `/editor-preview?standalone&screen=${encodeURIComponent(target)}&project=${encodeURIComponent(activeProjectId)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function resetRouteScroll() {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    requestAnimationFrame(() => {
      const main = document.querySelector('.a1-page-layout__main-scroll')
      if (main instanceof HTMLElement) {
        main.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      }
    })
  }

  function navigate(page, { replace = false, path: pathOverride = null } = {}) {
    const next = PAGES.includes(page) ? page : 'home'
    const nextPath = pathOverride ?? getPath(next)
    const currentPath = `${window.location.pathname}${window.location.search}`
    if (nextPath !== currentPath) {
      window.history[replace ? 'replaceState' : 'pushState']({ page: next }, '', nextPath)
    }
    setActivePage(next)
    if (next.startsWith('component-')) {
      setDetailTab(getComponentExampleTab(nextPath) ?? 'configure')
    }
    setSidebarOpen(false)
    resetRouteScroll()
  }

  function openHelpPage(query = '') {
    const nextQuery = String(query ?? '').trim()
    setHelpQuery(nextQuery)
    const nextPath = nextQuery ? `/help?q=${encodeURIComponent(nextQuery)}` : '/help'
    navigate('help', { path: nextPath })
  }

  function openHelpAssistant(anchor = null) {
    helpAssistantAnchorRef.current = anchor
      ?? document.querySelector('.a1-web-app-header button[aria-label="Help"]')
      ?? document.querySelector('.a1-web-app-header a[aria-label="Help"]')
      ?? null
    setHelpAssistantOpen(true)
  }

  function focusMainContent() {
    const main = document.querySelector('.a1-page-layout__main-scroll')
    if (main instanceof HTMLElement) main.focus()
  }

  function handleNavClick(e, page) {
    if (!isPlainLeftClick(e)) return
    e.preventDefault()
    navigate(page)
  }

  useEffect(() => {
    // Canonicalize the initial URL. Old ?page= bookmarks are preserved by getPage()'s
    // legacy fallback, then replaced with the new path format here so the address bar
    // updates without a page reload.
    const page = getPage()
    const search = new URLSearchParams(window.location.search)
    search.delete('page')
    const extra = search.toString()
    // For pages whose path encodes extra info (backlog-ticket = /backlog/A1-{n}),
    // preserve the current pathname rather than collapsing to the base page path.
    const canonicalBase = page === 'backlog-ticket' || getComponentExampleTab()
      ? window.location.pathname
      : getPath(page)
    const canonicalUrl = extra ? `${canonicalBase}?${extra}` : canonicalBase
    window.history.replaceState({ page }, '', canonicalUrl)
    setActivePage(page)
    setDetailTab(getComponentExampleTab() ?? 'configure')
      const onPop = () => {
      setActivePage(getPage())
      setDetailTab(getComponentExampleTab() ?? 'configure')
      setHelpQuery(new URLSearchParams(window.location.search).get('q') || '')
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
    document.documentElement.classList.toggle('a1-theme-marshmallow', theme === 'marshmallow')
    document.documentElement.classList.toggle('a1-theme-wireframe', theme === 'wireframe')
    document.documentElement.classList.toggle('a1-theme-wireframe-redacted', theme === 'wireframe-redacted')
    document.documentElement.classList.toggle('a1-theme-dark', resolvedColorScheme === 'dark')
    document.documentElement.classList.toggle('a1-theme-light', colorMode === 'light')
    document.documentElement.classList.toggle('a1-reduce-motion', reducedMotion)
    document.documentElement.classList.toggle('a1-contrast-more', contrastMore)
  }, [theme, resolvedColorScheme, colorMode, reducedMotion, contrastMore])

  // Don't persist a standalone preview's forced theme — it must not leak into the
  // main app window's stored preference.
  useEffect(() => { if (!IS_STANDALONE) localStorage.setItem('a1-web-theme', theme) }, [theme])
  useEffect(() => { localStorage.setItem('a1-web-color-mode', colorMode) }, [colorMode])
  useEffect(() => { localStorage.setItem('a1-web-reduced-motion', reducedMotion) }, [reducedMotion])
  useEffect(() => { localStorage.setItem('a1-web-contrast-more', contrastMore) }, [contrastMore])
  useEffect(() => { localStorage.setItem('a1-web-locale', locale) }, [locale])

  useEffect(() => {
    let goTimer = null
    let awaitingGoTarget = false
    const goTargets = {
      a: 'accessibility',
      b: 'backlog',
      c: 'components',
      d: 'data',
      e: 'editor',
      f: 'foundations',
      h: 'home',
      l: 'label-editor',
      p: 'patterns',
      r: 'rules',
      t: 'theme-editor',
    }

    const clearGoTarget = () => {
      awaitingGoTarget = false
      if (goTimer) window.clearTimeout(goTimer)
      goTimer = null
    }

    const handleGlobalShortcut = (event) => {
      if (event.defaultPrevented) return
      const target = event.target
      const isTyping = target instanceof HTMLElement && (
        target.isContentEditable
        || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      )
      if (isTyping) {
        clearGoTarget()
        return
      }

      const opensCommandSearch = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'
      const opensShortcutMenu = (event.metaKey || event.ctrlKey) && event.key === '/'
      const opensSlashSearch = !event.metaKey && !event.ctrlKey && !event.altKey && event.key === '/'
      const opensPageSearch = !event.metaKey && !event.ctrlKey && !event.altKey && event.key === "'"
      if (opensShortcutMenu) {
        event.preventDefault()
        clearGoTarget()
        setSkipMenuOpen((open) => {
          if (!open) window.requestAnimationFrame(() => skipMenuAnchorRef.current?.focus())
          return !open
        })
        return
      }

      if (opensPageSearch) {
        if (focusPageSearchTarget()) {
          event.preventDefault()
          clearGoTarget()
        }
        return
      }

      if (opensCommandSearch || opensSlashSearch) {
        event.preventDefault()
        clearGoTarget()
        setGlobalSearchOpen(true)
        return
      }

      if (event.altKey && !event.metaKey && !event.ctrlKey && event.key.toLowerCase() === 'm') {
        event.preventDefault()
        clearGoTarget()
        focusMainContent()
        return
      }

      if (!event.metaKey && !event.ctrlKey && !event.altKey && event.key === '?') {
        event.preventDefault()
        clearGoTarget()
        openHelpAssistant()
        return
      }

      // "!" opens the "New ticket" dialog from anywhere (A1-393). The dialog is
      // owned by BacklogProvider above <App />, so openCreate works app-wide.
      if (!event.metaKey && !event.ctrlKey && !event.altKey && event.key === '!') {
        event.preventDefault()
        clearGoTarget()
        backlog?.openCreate({ kind: 'general' })
        return
      }

      if (awaitingGoTarget) {
        const targetPage = goTargets[event.key.toLowerCase()]
        if (targetPage) {
          event.preventDefault()
          clearGoTarget()
          navigate(targetPage)
          return
        }
        if (event.key.toLowerCase() === 'm') {
          event.preventDefault()
          clearGoTarget()
          focusMainContent()
          return
        }
        clearGoTarget()
      }

      if (!event.metaKey && !event.ctrlKey && !event.altKey && event.key.toLowerCase() === 'g') {
        event.preventDefault()
        awaitingGoTarget = true
        if (goTimer) window.clearTimeout(goTimer)
        goTimer = window.setTimeout(clearGoTarget, 1500)
      }
    }

    window.addEventListener('keydown', handleGlobalShortcut)
    return () => {
      clearGoTarget()
      window.removeEventListener('keydown', handleGlobalShortcut)
    }
  }, [])

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
  // (`/editor?project=<id>&doc=<id>`) so it is shareable. Each genuine
  // in-editor navigation (changing project or page) PUSHES a history entry so
  // the browser Back button steps through All Projects → project → page. The
  // very first sync after entering the editor (mount or resume from a stored
  // project) REPLACES instead, so we don't leave a spurious entry behind.
  const editorUrlSynced = useRef(false)
  useEffect(() => {
    if (activePage !== 'editor') return
    // Pattern authoring keeps its own `/editor?pattern=<id>` URL — don't
    // rewrite it to the project/page form (which would drop the pattern param).
    if (editorPatternId) return
    const params = new URLSearchParams()
    if (activeProjectId) params.set('project', activeProjectId)
    if (openPageId) params.set('doc', openPageId)
    const search = params.toString()
    const next = search ? `/editor?${search}` : '/editor'
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
    if (activeThemeId) {
      params.set('theme', activeThemeId)
      params.set('cat', themeCategory)
    }
    const search = params.toString()
    const next = search ? `/theme-editor?${search}` : '/theme-editor'
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
    const title = pageTitle(activePage)
    document.title = activePage === 'home' ? title : `${title} — A1 Design System`
  }, [activePage, locale, allLabels])

  const FOUNDATION_GROUPS = [
    { label: t('app.foundationGroup.visualize', 'Visualize'), icon: 'visibility', ids: ['foundation-color-visualization', 'foundation-system-map'] },
    { label: t('app.foundationGroup.visual', 'Visual'), icon: 'palette', ids: ['foundation-color', 'foundation-elevation', 'foundation-motion', 'foundation-shape', 'foundation-size', 'foundation-type-scale'] },
    { label: t('app.foundationGroup.content', 'Content'), icon: 'article', ids: ['foundation-iconography', 'foundation-labels'] },
    { label: t('app.foundationGroup.layout', 'Layout'), icon: 'dashboard', ids: ['foundation-responsive', 'foundation-utilities', 'foundation-z-index'] },
    { label: t('app.foundationGroup.standards', 'Standards'), icon: 'verified', ids: ['foundation-accessibility', 'foundation-prop-conventions'] },
  ]

  const navItems = [
    {
      id: 'home',
      label: pageTitle('home'),
      icon: 'home',
      active: activePage === 'home',
      href: getPath('home'),
      onClick: (e) => handleNavClick(e, 'home'),
      mobileOnly: true,
    },
    {
      id: 'explore',
      icon: 'menu_book',
      label: t('app.nav.explore', 'Explore'),
      active: EXPLORE_PAGE_IDS.includes(activePage) || activePage === 'blog-article',
      items: [...EXPLORE_PAGE_IDS]
        .sort((a, b) => pageTitle(a).localeCompare(pageTitle(b)))
        .map((id) => ({
          icon: PAGE_ICONS[id],
          label: pageTitle(id),
          href: getPath(id),
          onClick: (e) => handleNavClick(e, id),
        })),
    },
    {
      id: 'foundations',
      icon: 'foundation',
      label: pageTitle('foundations'),
      active: activePage === 'foundations' || FOUNDATION_PAGE_IDS.includes(activePage),
      items: [
        {
          icon: 'foundation',
          label: t('app.nav.overview', 'Overview'),
          href: getPath('foundations'),
          onClick: (e) => handleNavClick(e, 'foundations'),
        },
        { divider: true },
        ...FOUNDATION_GROUPS.map(({ label, icon, ids }) => ({
          icon,
          label,
          items: ids
            .map((id) => foundations.find((f) => f.id === id))
            .filter(Boolean)
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((foundation) => ({
              icon: foundation.icon,
              label: foundation.title,
              href: getPath(foundation.id),
              onClick: (e) => handleNavClick(e, foundation.id),
            })),
        })),
      ],
    },
    {
      id: 'components',
      icon: 'widgets',
      label: pageTitle('components'),
      active: COMPONENT_ROUTE_IDS.includes(activePage) || activePage === 'kitchen-sink',
      items: [
        {
          icon: 'widgets',
          label: t('app.nav.overview', 'Overview'),
          href: getPath('components'),
          onClick: (e) => handleNavClick(e, 'components'),
        },
        {
          icon: PAGE_ICONS['kitchen-sink'],
          label: pageTitle('kitchen-sink'),
          href: getPath('kitchen-sink'),
          onClick: (e) => handleNavClick(e, 'kitchen-sink'),
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
      icon: 'design_services',
      label: t('app.nav.editors', 'Editors'),
      active: activePage === 'editor' || activePage === 'patterns' || activePage === 'image-library' || activePage === 'custom-icons' || activePage === 'data' || activePage === 'theme-editor' || activePage === 'rules' || activePage === 'label-editor' || activePage === 'priority-guide',
      items: [
        {
          icon: 'folder',
          label: pageTitle('projects'),
          active: activePage === 'editor',
          items: [
            {
              icon: 'grid_view',
              label: t('app.nav.allProjects', 'All projects'),
              href: getPath('editor'),
              onClick: handleEditorNav,
            },
            ...(projects.length ? [{ divider: true }] : []),
            ...projects.map((project) => ({
              icon: project.icon || 'folder',
              label: project.name,
              href: `/editor?project=${project.id}`,
              active: activePage === 'editor' && activeProjectId === project.id,
              onClick: (e) => handleProjectNav(e, project.id),
            })),
          ],
        },
        {
          icon: 'dashboard_customize',
          label: pageTitle('patterns'),
          href: getPath('patterns'),
          active: activePage === 'patterns',
          onClick: (e) => handleNavClick(e, 'patterns'),
        },
        {
          icon: 'photo_library',
          label: pageTitle('image-library'),
          href: getPath('image-library'),
          active: activePage === 'image-library',
          onClick: (e) => handleNavClick(e, 'image-library'),
        },
        {
          icon: 'font_download',
          label: pageTitle('custom-icons'),
          href: getPath('custom-icons'),
          active: activePage === 'custom-icons',
          onClick: (e) => handleNavClick(e, 'custom-icons'),
        },
        {
          icon: 'table_chart',
          label: pageTitle('data'),
          href: getPath('data'),
          active: activePage === 'data',
          onClick: (e) => handleNavClick(e, 'data'),
        },
        {
          icon: 'palette',
          label: pageTitle('theme-editor'),
          href: getPath('theme-editor'),
          active: activePage === 'theme-editor',
          onClick: (e) => handleNavClick(e, 'theme-editor'),
        },
        {
          icon: 'gavel',
          label: pageTitle('rules'),
          href: getPath('rules'),
          active: activePage === 'rules',
          onClick: (e) => handleNavClick(e, 'rules'),
        },
        {
          icon: 'translate',
          label: pageTitle('label-editor'),
          href: getPath('label-editor'),
          active: activePage === 'label-editor',
          onClick: (e) => handleNavClick(e, 'label-editor'),
        },
        {
          icon: 'list_alt',
          label: pageTitle('priority-guide'),
          href: getPath('priority-guide'),
          active: activePage === 'priority-guide',
          onClick: (e) => handleNavClick(e, 'priority-guide'),
        },
      ],
    },
  ]

  const actions = [
    {
      id: 'global-search',
      icon: 'search',
      iconOnly: true,
      label: t('app.action.globalSearch', 'Search A1'),
      onClick: () => setGlobalSearchOpen(true),
    },
    {
      id: 'help',
      icon: PAGE_ICONS.help,
      iconOnly: true,
      label: pageTitle('help'),
      active: activePage === 'help',
      onClick: (event) => {
        openHelpAssistant(event.currentTarget)
      },
    },
    { id: 'action-divider', divider: true },
    {
      id: 'new-ticket',
      icon: 'flag',
      iconOnly: true,
      label: t('app.action.createTicket', 'Create a ticket'),
      onClick: () => backlog?.openCreate({ kind: 'general' }),
    },
    {
      id: 'settings',
      icon: 'settings',
      iconOnly: true,
      label: t('app.action.settings', 'Settings'),
      onClick: (event) => {
        settingsAnchorRef.current = event.currentTarget
        setSettingsOpen(true)
      },
    },
  ]

  const logo = (
    <span className="a1-web-logo">
      <span className="a1-web-logo__mark" aria-hidden="true">A1:Design</span>
    </span>
  )

  if (IS_STANDALONE) {
    return (
      <TProvider value={t}>
      <LabelsProvider locale={labelLocale} labels={allLabels}>
        <CustomIconFontProvider projectId={activeProjectId}>
          {activePage === 'editor-preview' ? <EditorPreviewPage /> : null}
        </CustomIconFontProvider>
      </LabelsProvider>
      </TProvider>
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
      : activePage === 'backlog'
      ? <div id="a1-web-backlog-aside-slot" className="a1-web-config-aside" />
      : activePage === 'foundation-color-visualization'
      ? <div id="a1-web-color-visualization-aside-slot" className="a1-web-config-aside" />
      : getComponentsAside({ activePage, detailTab })

  function runSkipMenuAction(action) {
    setSkipMenuOpen(false)
    action?.()
  }

  return (
    <TProvider value={t}>
    <LabelsProvider locale={labelLocale} labels={allLabels}>
      <CustomIconFontProvider projectId={activeProjectId} includeAll={activePage === 'custom-icons'}>
      <ImageLibraryProvider>
      <button
        ref={skipMenuAnchorRef}
        type="button"
        className="a1-web-skip-menu-trigger"
        data-open={skipMenuOpen ? 'true' : undefined}
        aria-haspopup="menu"
        aria-expanded={skipMenuOpen ? 'true' : 'false'}
        aria-label="Keyboard menu. Shortcut: Cmd or Ctrl plus slash"
        title="Shortcut: Cmd/Ctrl+/"
        onFocus={() => setSkipMenuOpen(true)}
        onClick={() => setSkipMenuOpen((open) => !open)}
      >
        Keyboard menu
      </button>
      <Menu
        className="a1-web-keyboard-menu"
        open={skipMenuOpen}
        onClose={() => setSkipMenuOpen(false)}
        anchorRef={skipMenuAnchorRef}
        aria-label="Keyboard shortcuts"
        trapFocus={false}
        modalOnMobile={false}
      >
        <MenuSection label="Jump">
          <MenuItem icon="keyboard_return" shortcut="Shortcut: Alt+M" onClick={() => runSkipMenuAction(focusMainContent)}>
            Skip to main content
          </MenuItem>
          <MenuItem icon="manage_search" shortcut="Shortcut: '" onClick={() => runSkipMenuAction(focusPageSearchTarget)}>
            Page search
          </MenuItem>
          <MenuItem icon="search" shortcut="Shortcut: / or Cmd/Ctrl+K" onClick={() => runSkipMenuAction(() => setGlobalSearchOpen(true))}>
            Search A1
          </MenuItem>
          <MenuItem icon="add_task" shortcut="Shortcut: !" onClick={() => runSkipMenuAction(() => backlog?.openCreate({ kind: 'general' }))}>
            New ticket
          </MenuItem>
          <MenuItem icon="keyboard" shortcut="Shortcut: Cmd/Ctrl+/" onClick={() => skipMenuAnchorRef.current?.focus()}>
            Show all shortcuts
          </MenuItem>
        </MenuSection>
        <MenuSection label="Primary pages">
          <MenuItem icon="home" shortcut="Shortcut: G then H" onClick={() => runSkipMenuAction(() => navigate('home'))}>
            Home
          </MenuItem>
          <MenuItem icon="category" shortcut="Shortcut: G then C" onClick={() => runSkipMenuAction(() => navigate('components'))}>
            Components
          </MenuItem>
          <MenuItem icon="foundation" shortcut="Shortcut: G then F" onClick={() => runSkipMenuAction(() => navigate('foundations'))}>
            Foundations
          </MenuItem>
          <MenuItem icon="edit" shortcut="Shortcut: G then E" onClick={() => runSkipMenuAction(() => navigate('editor'))}>
            Editor
          </MenuItem>
          <MenuItem icon="view_quilt" shortcut="Shortcut: G then P" onClick={() => runSkipMenuAction(() => navigate('patterns'))}>
            Patterns
          </MenuItem>
          <MenuItem icon="task_alt" shortcut="Shortcut: G then B" onClick={() => runSkipMenuAction(() => navigate('backlog'))}>
            Backlog
          </MenuItem>
        </MenuSection>
        <MenuSection label="Tools and help">
          <MenuItem icon="rule" shortcut="Shortcut: G then R" onClick={() => runSkipMenuAction(() => navigate('rules'))}>
            Rules
          </MenuItem>
          <MenuItem icon="translate" shortcut="Shortcut: G then L" onClick={() => runSkipMenuAction(() => navigate('label-editor'))}>
            Labels
          </MenuItem>
          <MenuItem icon="database" shortcut="Shortcut: G then D" onClick={() => runSkipMenuAction(() => navigate('data'))}>
            Data sources
          </MenuItem>
          <MenuItem icon="palette" shortcut="Shortcut: G then T" onClick={() => runSkipMenuAction(() => navigate('theme-editor'))}>
            Theme editor
          </MenuItem>
          <MenuItem icon="accessibility" shortcut="Shortcut: G then A" onClick={() => runSkipMenuAction(() => navigate('accessibility'))}>
            Accessibility
          </MenuItem>
          <MenuItem icon="help" shortcut="Shortcut: ?" onClick={() => runSkipMenuAction(() => openHelpAssistant())}>
            Help
          </MenuItem>
        </MenuSection>
      </Menu>
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
            ? getComponentsSidebar({
                activePage,
                detailTab,
                onNavigate: navigate,
                onSelectDetailTab: setDetailTab,
                search: componentSearch,
                setSearch: setComponentSearch,
              })
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
        {/* The editor renders its own sidebar toggle inline in its toolbar row
            (see EditorPage's onOpenSidebar); the theme editor still uses this
            content-column toggle. */}
        {activePage === 'theme-editor' && activeThemeId && (
          <IconButton
            className="a1-web-sidebar-toggle"
            icon="view_sidebar"
            label={t('app.action.openSidebar', 'Open sidebar')}
            size='sm'
            variant="secondary"
            onClick={() => setSidebarOpen(true)}
          />
        )}
        {activePage === 'home' && <Home onNavigate={navigate} />}
        {activePage === 'features' && <Features onNavigate={navigate} />}
        {activePage === 'get-started' && <GetStarted onNavigate={navigate} />}
        {activePage === 'blog' && <Blog onNavigate={navigate} />}
        {activePage === 'blog-article' && <BlogArticle onNavigate={navigate} />}
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
            projectId={activeProjectId}
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
              patternSourceHref={patternSourceHref}
              patternSourceLabel={patternSourceHref ? 'Back to source page' : null}
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
              sidebarOpen={sidebarOpen}
              onOpenSidebar={() => setSidebarOpen(true)}
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
              onOpenHelp={() => openHelpPage()}
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
              sidebarOpen={sidebarOpen}
              onOpenSidebar={() => setSidebarOpen(true)}
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
              sidebarOpen={sidebarOpen}
              onOpenSidebar={() => setSidebarOpen(true)}
            />
          )
        )}
        {activePage === 'editor-preview' && <EditorPreviewPage />}
        {activePage === 'image-library' && (
          <ImageLibraryView
            projects={projects}
            onNavigateHome={() => navigate('home')}
          />
        )}
        {activePage === 'custom-icons' && (
          <CustomIconsView
            projects={projects}
            onNavigate={navigate}
          />
        )}
        {activePage === 'data' && (
          <DataSourcesView
            projects={projects}
            onNavigate={navigate}
          />
        )}
        {activePage === 'label-editor' && (
          <LabelEditor
            onNavigate={navigate}
            projects={projects}
            activeProjectId={activeProjectId}
            onUpdateProjectLabels={handleUpdateProjectLabels}
          />
        )}
        {activePage === 'priority-guide' && (
          <PriorityGuideEditor onNavigate={navigate} />
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
            onOpenHelp={() => openHelpPage()}
          />
        )}
        {activePage === 'account' && <AccountPage onNavigate={navigate} />}
        {activePage === 'accessibility' && <Accessibility onNavigate={navigate} />}
        {activePage === 'help' && <Help onNavigate={navigate} initialQuery={helpQuery} />}
        {activePage === 'releases' && <Releases onNavigate={navigate} />}
        {activePage === 'backlog' && <Backlog onNavigate={navigate} />}
        {import.meta.env.DEV && activePage === 'virtual-team' && (
          <VirtualTeam onNavigate={navigate} onOpenProject={openProject} />
        )}
        {activePage === 'backlog-ticket' && <BacklogTicketPage key={window.location.pathname} onNavigate={navigate} />}
        {activePage === 'about' && <About onNavigate={navigate} />}
        {activePage === 'kitchen-sink' && <KitchenSink onNavigate={navigate} />}

        {/* xs/sm: the config panel as a bottom sheet. Rendered last so its
            in-flow spacer reserves space at the bottom, not the top. */}
        {isSmDown && asideEl && (
          <BottomSheet className="a1-web-config-sheet" title={activePage === 'backlog' ? t('app.action.filters', 'Filters') : t('app.action.configure', 'Configure')} detents={[0.55, 0.95]} defaultDetent={0}>
            {asideEl}
          </BottomSheet>
        )}
      </PageLayout>

      <GlobalSearchDialog
        open={globalSearchOpen}
        entries={globalSearchEntries}
        onClose={() => setGlobalSearchOpen(false)}
      />

      <HelpAssistantMenu
        open={helpAssistantOpen}
        anchorRef={helpAssistantAnchorRef}
        onClose={() => setHelpAssistantOpen(false)}
        onOpenHelp={openHelpPage}
      />

      <Menu open={settingsOpen} onClose={() => setSettingsOpen(false)} anchorRef={settingsAnchorRef} aria-label="Settings">
        <MenuSection label={t('app.page.theme', 'Theme')}>
          {settingsThemeOptions.length > 5 ? (
            <SelectField
              aria-label={t('app.page.theme', 'Theme')}
              size="compact"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {settingsThemeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </SelectField>
          ) : (
            <RadioGroup
              options={settingsThemeOptions}
              value={theme}
              onChange={setTheme}
              size="compact"
              aria-label={t('app.page.theme', 'Theme')}
            />
          )}
        </MenuSection>
        <MenuSection label={t('app.settings.colorScheme', 'Color scheme')}>
          <SegmentedControl
            options={colorSchemeOptions.map((option) => ({
              ...option,
              ariaLabel: t(option.labelKey, option.ariaLabel),
            }))}
            value={colorMode}
            onChange={setColorMode}
            aria-label={t('app.settings.colorScheme', 'Color scheme')}
            size="sm"
            fullWidth
          />
        </MenuSection>
        <MenuSection label={t('app.page.accessibility', 'Accessibility')}>
          <Switch
            label={t('app.settings.reduceMotion', 'Reduce motion')}
            checked={reducedMotion}
            onChange={setReducedMotion}
            size="compact"
          />
          <Switch
            label={t('app.settings.increaseContrast', 'Increase contrast')}
            checked={contrastMore}
            onChange={setContrastMore}
            size="compact"
          />
        </MenuSection>
        <MenuSection label={<>{t('app.settings.locale', 'Locale')} <span className="a1-web-alpha-badge">{t('app.settings.alpha', 'Alpha')}</span></>}>
          <SelectField
            aria-label={t('app.settings.locale', 'Locale')}
            size="compact"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
          >
            {localeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </SelectField>
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
            {t('app.action.resetToDefaults', 'Reset to defaults')}
          </Button>
        </MenuSection>
        <MenuSection label={t('app.page.account', 'Account')}>
          {authUser && (
            <MenuItem icon="account_circle" onClick={() => { setSettingsOpen(false); navigate('account') }}>
              {authUser.email}
            </MenuItem>
          )}
          <MenuItem
            icon={authUser ? 'manage_accounts' : 'login'}
            onClick={() => { setSettingsOpen(false); navigate('account') }}
          >
            {authUser ? t('app.page.account', 'Account') : t('app.action.signIn', 'Sign in')}
          </MenuItem>
          {authUser && (
            <MenuItem icon="logout" onClick={() => { setSettingsOpen(false); signOut() }}>
              {t('app.action.signOut', 'Sign out')}
            </MenuItem>
          )}
        </MenuSection>
      </Menu>

      <Snackbar open={!!editorMessage} onClose={() => setEditorMessage('')}>
        {editorMessage}
      </Snackbar>
      </ImageLibraryProvider>
      </CustomIconFontProvider>
    </LabelsProvider>
    </TProvider>
  )
}

// No-op unless VITE_POSTHOG_KEY is set.
initPostHog()

const tree = (
  <AuthProvider>
    <AuthGate>
      <BacklogProvider>
        <DataSourcesProvider>
          <App />
        </DataSourcesProvider>
      </BacklogProvider>
    </AuthGate>
  </AuthProvider>
)

createRoot(document.getElementById('root')).render(
  posthogEnabled ? <PostHogProvider client={posthog}>{tree}</PostHogProvider> : tree,
)
