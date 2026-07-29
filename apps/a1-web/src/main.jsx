import '../../../build/css/tokens.css'
import '../../../packages/react/src/themes.css'
import '../../../packages/react/src/color-scheme.css'
import '../../../packages/react/src/utilities/spacing.css'
import '../../../packages/react/src/utilities/width.css'
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
  SearchField,
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
import treeMenuLabels  from '../../../system/labels/tree-menu.json'
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
    ...treeMenuLabels.label,
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
import { Presentation } from './pages/Presentation.jsx'
import { SystemDashboard } from './pages/SystemDashboard.jsx'
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
import {
  allComponents,
  componentExamples,
  getComponentExamplePath,
  rankComponentsForSearch,
  DETAIL_TAB_IDS,
} from './pages/components/utils.js'
import { Patterns } from './pages/Patterns.jsx'
import { JsonPlayground, JsonPlaygroundSidebar, formatPlaygroundJson, parsePlaygroundJson } from './pages/JsonPlayground.jsx'
import {
  acknowledgeFigmaPageCreate,
  acknowledgePlaygroundHandoff,
  consumePlaygroundHandoff,
  isLocalBridgeFeatureEnabled,
  listenForFigmaPageCreate,
  listenForPlaygroundHandoff,
  registerFigmaWorkspace,
} from './lib/localCodex.ts'
import { patternToDefinition } from './patterns/patternDocument.js'
import { getAllPatterns, subscribePatterns } from './patterns/patternStore.js'
import { PatternWorkspaceSidebar } from './patterns/PatternWorkspaceSidebar.jsx'
import { Accessibility } from './pages/Accessibility.jsx'
import { Releases, ReleasesSidebar } from './pages/Releases.jsx'
import { Backlog } from './pages/Backlog.jsx'
import { BacklogTicketPage } from './pages/BacklogTicketPage.jsx'
import { VirtualTeam } from './pages/VirtualTeam.jsx'
import { Labs, getLabsSidebar } from './pages/Labs.jsx'
import { About } from './pages/About.jsx'
import { KitchenSink } from './pages/KitchenSink.jsx'
import { Blog } from './pages/Blog.jsx'
import { BlogArticle } from './pages/BlogArticle.jsx'
import { BLOG_POSTS } from './pages/blogPosts.js'
import { Help } from './pages/Help.jsx'
import { HelpAssistantMenu } from './help/HelpAssistantMenu.jsx'
import { ProductTour } from './onboarding/ProductTour.jsx'
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
import { Admin } from './pages/Admin.jsx'
import { AuthGate } from './AuthGate.jsx'
import { AccessProvider, useAccess } from './access/AccessContext.jsx'
import { PageAccessBoundary, accessRoleLabel } from './access/PageAccessBoundary.jsx'
import { startCloudSync, stopCloudSync } from './projects/cloudSync.js'
import { importFigmaBridgeImages, resetImageCache } from './lib/imageLibrary'
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
import { themeClassName, themeOptions, settingsThemeOptions, settingsThemeValues, VALID_THEMES } from './lib/appThemes.ts'
import './styles.css'

// True when this window was opened as a standalone preview (no app chrome).
const IS_STANDALONE = new URLSearchParams(window.location.search).has('standalone')
  || /^\/p(?:\/|$)/.test(window.location.pathname)

const FOUNDATION_PAGE_IDS = foundations.map((foundation) => foundation.id)
const BLOG_ARTICLE_SLUG = BLOG_POSTS[0]?.slug || 'search-shortcuts-and-walkthroughs'
const EXPLORE_PAGE_IDS = ['dashboard', 'features', 'get-started', 'presentation', 'blog', 'labs', 'backlog', 'accessibility', 'releases', 'about', ...(import.meta.env.DEV ? ['virtual-team'] : [])]
const PAGE_ICONS = {
  dashboard: 'monitoring',
  features: 'star',
  'get-started': 'rocket_launch',
  presentation: 'slideshow',
  blog: 'article',
  labs: 'science',
  help: 'help',
  backlog: 'task_alt',
  'virtual-team': 'groups',
  accessibility: 'accessibility',
  releases: 'new_releases',
  about: 'info',
  'kitchen-sink': 'dashboard_customize',
  'label-editor': 'translate',
  admin: 'admin_panel_settings',
  playground: 'code',
}
const COMPONENT_ROUTE_IDS = ['components', ...componentCategoryPageIds, ...componentPageIds]

const PAGES = ['home', 'dashboard', 'features', 'get-started', 'presentation', 'blog', 'blog-article', 'labs', 'foundations', ...FOUNDATION_PAGE_IDS, ...COMPONENT_ROUTE_IDS, 'patterns', 'playground', 'editor', 'editor-preview', 'image-library', 'custom-icons', 'data', 'theme-editor', 'rules', 'label-editor', 'priority-guide', 'projects', 'help', 'accessibility', 'releases', 'backlog', ...(import.meta.env.DEV ? ['virtual-team'] : []), 'backlog-ticket', 'about', 'kitchen-sink', 'account', 'admin']

const PAGE_TITLES = {
  home: 'A1 Design System',
  dashboard: 'Dashboard',
  features: 'Features',
  'get-started': 'Get started',
  presentation: 'Presentation',
  blog: 'Blog',
  'blog-article': 'Search, shortcuts, and walkthroughs',
  labs: 'Labs',
  foundations: 'Foundations',
  ...Object.fromEntries(foundations.map((foundation) => [foundation.id, foundation.title])),
  ...componentPageTitles,
  patterns: 'Patterns',
  playground: 'JSON playground',
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
  admin: 'Administration',
}

const colorSchemeOptions = [
  { value: 'light', icon: 'light_mode', ariaLabel: 'Light mode', labelKey: 'app.settings.lightMode' },
  { value: 'dark', icon: 'dark_mode', ariaLabel: 'Dark mode', labelKey: 'app.settings.darkMode' },
  { value: 'system', icon: 'desktop_windows', ariaLabel: 'System mode', labelKey: 'app.settings.systemMode' },
]

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

// Resolve the active component detail tab from the URL: an example segment
// (`/components/x/<slug>`) wins, otherwise a `?tab=` query param naming a
// standard tab, otherwise the default Configure tab. This makes every tab
// deep-linkable and bookmarkable.
function getComponentTab(pathname = window.location.pathname, search = window.location.search) {
  const example = getComponentExampleTab(pathname)
  if (example) return example
  const tab = new URLSearchParams(search).get('tab')
  return DETAIL_TAB_IDS.includes(tab) ? tab : 'configure'
}

// Build the URL for a component + tab. Example tabs use their path segment; a
// standard non-default tab is carried as `?tab=`; Configure (the default) stays
// clean with no query string.
function componentPathWithTab(componentId, tab) {
  if (tab && tab.startsWith('example:')) {
    return getComponentExamplePath(componentId, tab.slice('example:'.length))
  }
  const base = `/components/${componentRouteSlug(componentId)}`
  return tab && tab !== 'configure' && DETAIL_TAB_IDS.includes(tab) ? `${base}?tab=${tab}` : base
}

function getPage(search = window.location.search, pathname = window.location.pathname) {
  // Path-based routing — read from the URL pathname first.
  const path = pathname.replace(/^\/|\/$/g, '') // strip leading/trailing slash
  if (!path) return 'home'
  if (path === 'blog') return 'blog'
  if (path.startsWith('blog/')) return 'blog-article'
  if (path === 'labs' || path.startsWith('labs/')) return 'labs'

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

  // /p/{published-project-slug}[/page-id] → standalone published prototype
  if (/^p\/[^/]+(?:\/[^/]+)?$/.test(path)) return 'editor-preview'

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

function getBaselineRoutes() {
  const routes = []
  const paths = new Set()
  const addRoute = (id, path) => {
    if (!id || !path || paths.has(path)) return
    paths.add(path)
    routes.push({ id, path })
  }

  for (const page of PAGES) {
    if (['blog-article', 'backlog-ticket', 'virtual-team'].includes(page)) continue
    addRoute(page, getPath(page))
  }

  for (const post of BLOG_POSTS) {
    addRoute(`blog-${post.slug}`, `/blog/${post.slug}`)
  }

  for (const [componentId, examples] of Object.entries(componentExamples)) {
    for (const example of examples) {
      addRoute(
        `component-${componentId}-example-${example.id}`,
        getComponentExamplePath(componentId, example.id),
      )
    }
  }

  // Dynamic route families use deterministic missing-data states in baseline QA.
  // Live entity data is tested separately from this release-blocking UI contract.
  addRoute('backlog-ticket-not-found', '/backlog/A1-0')
  addRoute('published-project-not-found', '/p/a1-web-baseline-missing')

  return routes
}

const baselineRouteManifest = document.createElement('script')
baselineRouteManifest.id = 'a1-web-baseline-routes'
baselineRouteManifest.type = 'application/json'
baselineRouteManifest.textContent = JSON.stringify(getBaselineRoutes())
document.head.append(baselineRouteManifest)

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
  dashboard: 'app.page.dashboard',
  features: 'app.page.features',
  'get-started': 'app.page.getStarted',
  blog: 'app.page.blog',
  'blog-article': 'app.page.blogArticle',
  labs: 'app.page.labs',
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
  admin: 'app.page.admin',
  'foundation-content-standards': 'app.contentStandards.title',
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

function formatTourProgress(template, current, total) {
  return template
    .replace('{current}', String(current))
    .replace('{total}', String(total))
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
    return settingsThemeValues.includes(stored) ? stored : 'a1Light'
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
  const [productTourOpen, setProductTourOpen] = useState(false)
  const helpAssistantAnchorRef = useRef(null)
  const [helpQuery, setHelpQuery] = useState(() => new URLSearchParams(window.location.search).get('q') || '')
  const [skipMenuOpen, setSkipMenuOpen] = useState(false)
  const skipMenuAnchorRef = useRef(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsAnchorRef = useRef(null)
  const { user: authUser, signOut } = useAuth()
  const { canAccessPage, canUseFeature, role: accessRole } = useAccess()
  const backlog = useBacklog()
  const [componentMenuSearch, setComponentMenuSearch] = useState('')
  const [componentSearch, setComponentSearch] = useState('')
  const [detailTab, setDetailTab] = useState(() => getComponentTab())
  const [releaseMode, setReleaseMode] = useState('simplified')
  const [releaseSource, setReleaseSource] = useState('a1-web')
  const [releaseSearch, setReleaseSearch] = useState('')
  const [selectedReleaseId, setSelectedReleaseId] = useState(null)
  const canViewDetailedReleases = canUseFeature('detailedReleaseNotes')
  const effectiveReleaseMode = canViewDetailedReleases ? releaseMode : 'simplified'
  // ── Projects state ─────────────────────────────────────────────────────────
  // The editor is organised into isolated projects; `activeProjectId` + `openPageId`
  // are mirrored in the URL (`?page=editor&project=…&doc=…`) so links are shareable.
  const [projects, setProjects] = useState(() => projectStore.loadProjects())
  const [archivedProjects, setArchivedProjects] = useState(() => projectStore.loadArchivedProjects())
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

  // Keep the local Figma bridge aware of every project while A1 is open—not
  // just while the page editor happens to be mounted. The bridge receives this
  // volatile snapshot only on loopback, which lets the plugin populate its
  // Page Editor and pull the selected page's current JSON on demand.
  useEffect(() => {
    if (IS_STANDALONE || !isLocalBridgeFeatureEnabled()) return undefined
    const registerFigmaWorkspaceSnapshot = () => {
      const workspace = {
        projects: projectStore.loadProjects().map((project) => ({
          id: project.id,
          name: project.name,
          pages: projectStore.loadPages(project.id).map((page) => {
            const link = projectStore.getFigmaPageLink(project.id, page.id)
              ?? projectStore.saveFigmaPageLink(project.id, { pageId: page.id, mode: 'manual' })
            return {
              id: page.id,
              title: page.title,
              json: projectStore.resolvePageJson(page.id) ?? '',
              link: link ? {
                linkId: link.id,
                projectId: project.id,
                pageId: page.id,
                mode: link.mode,
                figmaFileKey: link.figmaFileKey,
                figmaPageId: link.figmaPageId,
                figmaRootNodeId: link.figmaRootNodeId,
              } : null,
            }
          }),
        })),
      }
      registerFigmaWorkspace(workspace).catch(() => {})
    }
    registerFigmaWorkspaceSnapshot()
    const interval = window.setInterval(registerFigmaWorkspaceSnapshot, 15_000)
    window.addEventListener('a1:figma-workspace-changed', registerFigmaWorkspaceSnapshot)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('a1:figma-workspace-changed', registerFigmaWorkspaceSnapshot)
    }
  }, [])

  // A Figma frame can be explicitly sent to an existing local A1 project as a
  // new page. Keep this separate from ordinary linked-page edits: this creates
  // the page once, then persists the new Figma/A1 link for subsequent syncs.
  useEffect(() => {
    if (IS_STANDALONE || !isLocalBridgeFeatureEnabled()) return undefined
    let cancelled = false
    let inFlight = false
    const receiveCreatedPage = async () => {
      if (cancelled || inFlight) return
      inFlight = true
      try {
        const handoff = await listenForFigmaPageCreate()
        if (!handoff || cancelled) return
        const project = projectStore.loadProjects().find((entry) => entry.id === handoff.projectId)
        if (!project) {
          console.warn('Discarding a Figma page creation request for a project that is no longer available.', handoff.projectId)
          await acknowledgeFigmaPageCreate(handoff.id)
          return
        }
        // Acknowledge retries safely if the prior localStorage write completed
        // but the bridge acknowledgement was interrupted.
        if (project.figmaPageLinks?.some((link) => link.id === handoff.figma.linkId)) {
          await acknowledgeFigmaPageCreate(handoff.id)
          return
        }
        await importFigmaBridgeImages(handoff.assets)
        const { page } = projectStore.addPageFromJson(handoff.projectId, {
          title: handoff.title || 'Untitled',
          json: handoff.json,
        })
        projectStore.saveFigmaPageLink(handoff.projectId, {
          id: handoff.figma.linkId,
          pageId: page.id,
          mode: 'manual',
          figmaFileKey: handoff.figma.figmaFileKey || undefined,
          figmaPageId: handoff.figma.figmaPageId || undefined,
          figmaRootNodeId: handoff.figma.figmaRootNodeId || undefined,
        })
        if (activeProjectId === handoff.projectId) setProjectPages(projectStore.loadPages(handoff.projectId))
        setProjects(projectStore.loadProjects())
        window.dispatchEvent(new Event('a1:figma-workspace-changed'))
        await acknowledgeFigmaPageCreate(handoff.id)
      } catch {
        // The loopback bridge is optional. Retain its queued message for the
        // next poll if A1 cannot commit it yet.
      } finally {
        inFlight = false
      }
    }
    receiveCreatedPage()
    const interval = window.setInterval(receiveCreatedPage, 1200)
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [activeProjectId])

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

  useEffect(() => {
    if (activePage !== 'playground' || !isLocalBridgeFeatureEnabled()) return undefined
    let cancelled = false
    let receivedId = null
    let timer = null

    const listen = async () => {
      try {
        const handoff = await listenForPlaygroundHandoff()
        if (!handoff || cancelled || handoff.id === receivedId) return
        receivedId = handoff.id
        setPlaygroundHandoffError('')
        await importFigmaBridgeImages(handoff.assets)
        setPlaygroundLiveView(handoff.live === true)
        setPlaygroundJson(formatPlaygroundJson(handoff.json))
        await acknowledgePlaygroundHandoff(handoff.id)
      } catch (error) {
        // The bridge is optional until a Figma handoff is requested. Preserve
        // the current Playground JSON instead of surfacing background polling.
      } finally {
        if (!cancelled) timer = window.setTimeout(listen, 1200)
      }
    }

    listen()
    return () => {
      cancelled = true
      if (timer) window.clearTimeout(timer)
    }
  }, [activePage])
  // Bump on theme-store changes so the sidebar theme name stays live after a rename.
  const [, setThemesVersion] = useState(0)
  useEffect(() => subscribeThemes(() => setThemesVersion((v) => v + 1)), [])
  const [patternsVersion, setPatternsVersion] = useState(0)
  useEffect(() => subscribePatterns(() => setPatternsVersion((v) => v + 1)), [])
  const [rulesVersion, setRulesVersion] = useState(0)
  useEffect(() => subscribeRules(() => setRulesVersion((v) => v + 1)), [])
  const [editorMessage, setEditorMessage] = useState('') // transient editor notice (no action)
  const [playgroundJson, setPlaygroundJson] = useState(() => formatPlaygroundJson(new URLSearchParams(window.location.search).get('json') || ''))
  const [playgroundHandoffError, setPlaygroundHandoffError] = useState('')
  const [playgroundLiveView, setPlaygroundLiveView] = useState(false)
  const playgroundResult = useMemo(() => parsePlaygroundJson(playgroundJson), [playgroundJson])
  const playgroundError = playgroundHandoffError || playgroundResult.error
  const resolvedColorScheme = colorMode === 'system' ? systemColorScheme : colorMode

  const activeProject = projects.find((p) => p.id === activeProjectId) ?? null

  useEffect(() => {
    const handoffId = new URLSearchParams(window.location.search).get('handoff')
    if (!handoffId || !isLocalBridgeFeatureEnabled()) return undefined
    let cancelled = false
    consumePlaygroundHandoff(handoffId)
      .then(async (handoff) => {
        if (!cancelled) {
          await importFigmaBridgeImages(handoff.assets)
          setPlaygroundLiveView(handoff.live === true)
          setPlaygroundJson(formatPlaygroundJson(handoff.json))
        }
      })
      .catch((error) => {
        if (!cancelled) setPlaygroundHandoffError(error instanceof Error ? error.message : 'Could not load the Playground handoff.')
      })
    return () => { cancelled = true }
  }, [])

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
  const productTourLabels = useMemo(() => ({
    dialogLabel: t('app.tour.dialogLabel', 'Product tour'),
    close: t('app.tour.close', 'Close tour'),
    skip: t('app.tour.skip', 'Skip tour'),
    previous: t('app.tour.previous', 'Previous'),
    next: t('app.tour.next', 'Next'),
    done: t('app.tour.done', 'Done'),
    progress: (current, total) => formatTourProgress(t('app.tour.progress', 'Step {current} of {total}'), current, total),
  }), [t])
  const productTourSteps = useMemo(() => [
    {
      target: '[data-a1-tour="navigation"]',
      title: t('app.tour.navigationTitle', 'Find your way'),
      description: t('app.tour.navigationDescription', 'Use the top navigation to explore the system, open the editors, and return home from anywhere.'),
    },
    {
      target: '[data-a1-tour="navigation"] .a1-top-header__end',
      title: t('app.tour.toolsTitle', 'Search and get help'),
      description: t('app.tour.toolsDescription', 'Search A1 for a page or component, or open Ask Help for answers and related guides.'),
    },
    {
      target: '.a1-page-layout__main-scroll',
      title: t('app.tour.workspaceTitle', 'Work in context'),
      description: t('app.tour.workspaceDescription', 'Each page keeps its tools and guidance close at hand. Start with the editor when you are ready to build.'),
    },
  ], [t])

  useEffect(() => {
    backlog?.setLabelResolver?.(t)
    return () => backlog?.setLabelResolver?.(null)
  }, [backlog?.setLabelResolver, t])

  const globalSearchEntries = useMemo(() => {
    const entries = []
    const addPage = (id, description, keywords = []) => {
      if (!canAccessPage(id)) return
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
    addPage('dashboard', 'Live dashboard for A1 health, backlog, components, tokens, rules, labels, and system flow.', ['health', 'metrics', 'charts', 'data viz', 'counts'])
    addPage('features', 'Current A1 feature set and product capabilities.', ['tools', 'capabilities'])
    addPage('get-started', 'Setup paths and first steps for using A1.', ['install', 'docs'])
    addPage('presentation', 'Focused walkthrough deck about A1, AI, and software creation.', ['slides', 'walkthrough', 'presentation', 'ai', 'designer', 'engineer'])
    addPage('blog', 'Release newsletters, demos, and walkthroughs from A1.', ['posts', 'video', 'walkthrough', 'global search', 'newsletter'])
    addPage('labs', 'Experiments for patterns, proposed components, and interaction studies.', ['experiments', 'prototypes', 'patterns', 'component proposals'])
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
    addPage('playground', 'Paste larger A1 JSON definitions and preview the real renderer.', ['json', 'preview', 'render', 'testing'])
    addPage('editor', 'Create and edit projects with the governed JSON page model.', ['projects', 'pages', 'builder'])
    addPage('image-library', 'Manage reusable image assets for projects.', ['assets', 'media', 'dam'])
    addPage('custom-icons', 'Create and manage custom project icons.', ['symbols', 'iconography'])
    addPage('data', 'Plug and play data sets for projects.', ['datasets', 'sources'])
    addPage('theme-editor', 'Create and adjust custom themes.', ['color', 'tokens', 'brand'])
    addPage('rules', 'Define and review UI, component, and product rules.', ['governance', 'standards'])
    addPage('label-editor', 'Shared labels and translations.', ['locale', 'copy', 'language'])
    addPage('admin', t('app.access.adminDescription', 'Review access and open administrator-only preview tools.'), ['roles', 'permissions', 'rbac'])
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
        title: t(foundation.titleLabelKey, foundation.title),
        category: 'Foundations',
        description: t(foundation.bodyLabelKey, foundation.body),
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

    if (canAccessPage('patterns')) getAllPatterns().forEach((pattern) => {
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

    if (canAccessPage('rules')) listAllRules().forEach((rule) => {
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

    if (canAccessPage('label-editor')) getLabels().items.forEach((label) => {
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

    if (canAccessPage('backlog')) backlog?.items?.forEach((item) => {
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
  }, [allLabels, backlog?.items, canAccessPage, locale, patternsVersion, projects, rulesVersion])

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
    setArchivedProjects(projectStore.loadArchivedProjects())
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

  // "Delete" is a soft delete: archive the project (hidden from the list, restorable)
  // rather than removing it, so it reliably disappears and can be recovered.
  function handleDeleteProject(id) {
    projectStore.archiveProject(id)
    refreshProjects()
    if (activeProjectId === id) handleBackToProjects()
  }

  function handleRestoreProject(id) {
    projectStore.unarchiveProject(id)
    refreshProjects()
  }

  // Permanent delete — only offered for already-archived projects.
  function handleDeleteProjectPermanent(id) {
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

  function handlePublishProject(id) {
    projectStore.publishProject(id)
    refreshProjects()
  }

  function handleUnpublishProject(id) {
    projectStore.unpublishProject(id)
    refreshProjects()
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
    let nextPath = pathOverride ?? getPath(next)
    let nextTab = null
    if (next.startsWith('component-')) {
      const componentId = next.slice('component-'.length)
      if (pathOverride) {
        // An explicit destination (e.g. an example link) decides the tab.
        const url = new URL(pathOverride, window.location.origin)
        nextTab = getComponentTab(url.pathname, url.search)
      } else {
        // Plain component navigation (tree menu, search): keep the current
        // standard tab so switching components stays on the same tab, and
        // reflect it in the URL so the destination is deep-linkable.
        nextTab = DETAIL_TAB_IDS.includes(detailTab) ? detailTab : 'configure'
        nextPath = componentPathWithTab(componentId, nextTab)
      }
    }
    const currentPath = `${window.location.pathname}${window.location.search}`
    if (nextPath !== currentPath) {
      window.history[replace ? 'replaceState' : 'pushState']({ page: next }, '', nextPath)
    }
    setActivePage(next)
    if (next.startsWith('component-')) {
      setDetailTab(nextTab ?? 'configure')
    }
    setSidebarOpen(false)
    resetRouteScroll()
  }

  // Select a component detail tab: update state and keep the URL in sync so the
  // tab is deep-linkable (replaceState — a tab switch is not a new history entry).
  function selectDetailTab(nextTab) {
    setDetailTab(nextTab)
    if (!activePage.startsWith('component-')) return
    const componentId = activePage.slice('component-'.length)
    const path = componentPathWithTab(componentId, nextTab)
    const currentPath = `${window.location.pathname}${window.location.search}`
    if (path !== currentPath) {
      window.history.replaceState({ page: activePage }, '', path)
    }
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

  function startProductTour() {
    setHelpAssistantOpen(false)
    setProductTourOpen(true)
  }

  function dismissProductTour() {
    setProductTourOpen(false)
  }

  function completeProductTour() {
    setProductTourOpen(false)
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

  function handleComponentMenuNav(e, page) {
    const shouldClearSearch = isPlainLeftClick(e)
    handleNavClick(e, page)
    if (shouldClearSearch) setComponentMenuSearch('')
  }

  function handleComponentMenuSearchSubmit(value, onClose) {
    const query = String(value ?? '').trim()
    if (!query) return
    const first = rankComponentsForSearch(allComponents, query)[0]
    if (!first) return
    navigate(`component-${first.id}`)
    setComponentMenuSearch('')
    onClose?.()
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
    const isPublishedPreview = page === 'editor-preview' && /^\/p(?:\/|$)/.test(window.location.pathname)
    const canonicalBase = page === 'backlog-ticket' || isPublishedPreview || getComponentExampleTab() || (page === 'labs' && /^\/labs\//.test(window.location.pathname))
      ? window.location.pathname
      : getPath(page)
    const canonicalUrl = extra ? `${canonicalBase}?${extra}` : canonicalBase
    window.history.replaceState({ page }, '', canonicalUrl)
    setActivePage(page)
    setDetailTab(getComponentTab())
      const onPop = () => {
      setActivePage(getPage())
      setDetailTab(getComponentTab())
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
    const themeClasses = themeOptions.map((option) => themeClassName(option.value)).filter(Boolean)
    for (const className of themeClasses) {
      document.documentElement.classList.toggle(className, className === themeClassName(theme))
    }
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
      if (canUseFeature('backlog') && !event.metaKey && !event.ctrlKey && !event.altKey && event.key === '!') {
        event.preventDefault()
        clearGoTarget()
        backlog?.openCreate({ kind: 'general' })
        return
      }

      if (awaitingGoTarget) {
        const targetPage = goTargets[event.key.toLowerCase()]
        if (targetPage && canAccessPage(targetPage)) {
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
  }, [backlog, canAccessPage, canUseFeature])

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
    { label: t('app.foundationGroup.content', 'Content'), icon: 'article', ids: ['foundation-content-standards', 'foundation-iconography', 'foundation-labels'] },
    { label: t('app.foundationGroup.figma', 'Figma'), icon: 'design_services', ids: ['foundation-figma-components', 'foundation-figma-plugin'] },
    { label: t('app.foundationGroup.layout', 'Layout'), icon: 'dashboard', ids: ['foundation-responsive', 'foundation-utilities', 'foundation-z-index'] },
    { label: t('app.foundationGroup.standards', 'Standards'), icon: 'verified', ids: ['foundation-accessibility', 'foundation-prop-conventions'] },
    { label: t('app.foundationGroup.visual', 'Visual'), icon: 'palette', ids: ['foundation-color', 'foundation-elevation', 'foundation-motion', 'foundation-shape', 'foundation-size', 'foundation-type-scale'] },
    { label: t('app.foundationGroup.visualize', 'Visualize'), icon: 'visibility', ids: ['foundation-color-visualization', 'foundation-system-map'] },
  ]

  const componentMenuSearchQuery = componentMenuSearch.trim()
  const componentMenuSearchLabel = t('app.nav.searchComponents', 'Search components')
  const componentMenuMatches = useMemo(
    () => componentMenuSearchQuery
      ? rankComponentsForSearch(allComponents, componentMenuSearchQuery).slice(0, 12)
      : [],
    [componentMenuSearchQuery],
  )
  const componentMenuItems = componentMenuSearchQuery
    ? [
        {
          icon: 'widgets',
          label: t('app.nav.overview', 'Overview'),
          href: getPath('components'),
          onClick: (e) => handleComponentMenuNav(e, 'components'),
        },
        {
          icon: PAGE_ICONS['kitchen-sink'],
          label: pageTitle('kitchen-sink'),
          href: getPath('kitchen-sink'),
          onClick: (e) => handleComponentMenuNav(e, 'kitchen-sink'),
        },
        ...(componentMenuMatches.length ? [{ divider: true }] : []),
        ...componentMenuMatches.map((component) => {
          const page = `component-${component.id}`
          return {
            icon: component.icon,
            label: component.title,
            href: getPath(page),
            active: activePage === page,
            onClick: (e) => handleComponentMenuNav(e, page),
          }
        }),
      ]
    : [
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
          active: activePage === `components-${category.id}`,
          onClick: (e) => handleNavClick(e, `components-${category.id}`),
          items: category.components.map((component) => {
            const page = `component-${component.id}`
            return {
              label: component.title,
              href: getPath(page),
              active: activePage === page,
              onClick: (e) => handleNavClick(e, page),
            }
          }),
        })),
      ]

  const explorePageIds = EXPLORE_PAGE_IDS.filter(canAccessPage)

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
      active: explorePageIds.includes(activePage) || activePage === 'blog-article',
      items: [...explorePageIds]
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
        ...[...FOUNDATION_GROUPS]
          .sort((a, b) => a.label.localeCompare(b.label, locale))
          .map(({ label, icon, ids }) => ({
            icon,
            label,
            items: ids
              .map((id) => foundations.find((f) => f.id === id))
              .filter(Boolean)
              .sort((a, b) => t(a.titleLabelKey, a.title).localeCompare(t(b.titleLabelKey, b.title), locale))
              .map((foundation) => ({
                icon: foundation.icon,
                label: t(foundation.titleLabelKey, foundation.title),
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
      menuHeader: ({ onClose }) => (
        <SearchField
          data-1p-ignore="true"
          data-bwignore="true"
          data-form-type="other"
          data-lpignore="true"
          aria-label={componentMenuSearchLabel}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          name="a1-components-main-menu-search"
          size="compact"
          spellCheck={false}
          value={componentMenuSearch}
          onChange={(event) => setComponentMenuSearch(event.target.value)}
          onSearch={(value) => handleComponentMenuSearchSubmit(value, onClose)}
        />
      ),
      items: componentMenuItems,
    },
    {
      id: 'editor',
      icon: 'design_services',
      label: t('app.nav.editors', 'Editors'),
      active: activePage === 'editor' || activePage === 'patterns' || activePage === 'playground' || activePage === 'image-library' || activePage === 'custom-icons' || activePage === 'data' || activePage === 'theme-editor' || activePage === 'rules' || activePage === 'label-editor' || activePage === 'priority-guide' || activePage === 'admin',
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
        ...(canAccessPage('patterns') ? [{
          icon: 'dashboard_customize',
          label: pageTitle('patterns'),
          href: getPath('patterns'),
          active: activePage === 'patterns',
          onClick: (e) => handleNavClick(e, 'patterns'),
        }] : []),
        {
          icon: 'code',
          label: pageTitle('playground'),
          href: getPath('playground'),
          active: activePage === 'playground',
          onClick: (e) => handleNavClick(e, 'playground'),
        },
        ...(canAccessPage('image-library') ? [{
          icon: 'photo_library',
          label: pageTitle('image-library'),
          href: getPath('image-library'),
          active: activePage === 'image-library',
          onClick: (e) => handleNavClick(e, 'image-library'),
        }] : []),
        ...(canAccessPage('custom-icons') ? [{
          icon: 'font_download',
          label: pageTitle('custom-icons'),
          href: getPath('custom-icons'),
          active: activePage === 'custom-icons',
          onClick: (e) => handleNavClick(e, 'custom-icons'),
        }] : []),
        ...(canAccessPage('data') ? [{
          icon: 'table_chart',
          label: pageTitle('data'),
          href: getPath('data'),
          active: activePage === 'data',
          onClick: (e) => handleNavClick(e, 'data'),
        }] : []),
        ...(canAccessPage('theme-editor') ? [{
          icon: 'palette',
          label: pageTitle('theme-editor'),
          href: getPath('theme-editor'),
          active: activePage === 'theme-editor',
          onClick: (e) => handleNavClick(e, 'theme-editor'),
        }] : []),
        ...(canAccessPage('rules') ? [{
          icon: 'gavel',
          label: pageTitle('rules'),
          href: getPath('rules'),
          active: activePage === 'rules',
          onClick: (e) => handleNavClick(e, 'rules'),
        }] : []),
        ...(canAccessPage('label-editor') ? [{
          icon: 'translate',
          label: pageTitle('label-editor'),
          href: getPath('label-editor'),
          active: activePage === 'label-editor',
          onClick: (e) => handleNavClick(e, 'label-editor'),
        }] : []),
        ...(canAccessPage('priority-guide') ? [{
          icon: 'list_alt',
          label: pageTitle('priority-guide'),
          href: getPath('priority-guide'),
          active: activePage === 'priority-guide',
          onClick: (e) => handleNavClick(e, 'priority-guide'),
        }] : []),
        ...(canAccessPage('admin') ? [{
          icon: PAGE_ICONS.admin,
          label: pageTitle('admin'),
          href: getPath('admin'),
          active: activePage === 'admin',
          onClick: (e) => handleNavClick(e, 'admin'),
        }] : []),
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
    ...(canUseFeature('backlog') ? [
      { id: 'action-divider', divider: true },
      {
      id: 'new-ticket',
      icon: 'flag',
      iconOnly: true,
      label: t('app.action.createTicket', 'Create a ticket'),
      onClick: () => backlog?.openCreate({ kind: 'general' }),
      },
    ] : []),
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
      <img src="/a1-logo.svg" width="36" height="36" alt="" aria-hidden="true" />
      <span className="a1-sr-only">{t('app.page.home', 'Home')}</span>
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
  const pageAccessAllowed = canAccessPage(activePage)

  // Live view is a presentation surface fed by the Figma plugin, not an A1 Web
  // workspace. Keep the renderer and its providers, but remove every piece of
  // application chrome so the composition is the only thing on screen.
  if (activePage === 'playground' && playgroundLiveView) {
    return (
      <TProvider value={t}>
        <LabelsProvider locale={labelLocale} labels={allLabels}>
          <CustomIconFontProvider projectId={activeProjectId}>
            <ImageLibraryProvider>
              <main className="a1-web-live-playground" aria-label="Live Figma preview">
                <JsonPlayground result={playgroundResult} />
              </main>
            </ImageLibraryProvider>
          </CustomIconFontProvider>
        </LabelsProvider>
      </TProvider>
    )
  }

  // Config/filter panels. At md+ they use the PageLayout aside rail; at xs/sm
  // they move into a BottomSheet. Backlog places its filter rail on the start
  // side so it reads like navigation rather than a right-side configurator.
  const asideEl = pageAccessAllowed
    ? (activePage === 'editor' && editorPatternId) || (activePage === 'editor' && activeProject && openPageId)
      ? <div id="a1-web-editor-aside-slot" className="a1-web-config-aside" />
      : activePage === 'theme-editor' && activeThemeId
      ? <div id="a1-web-theme-aside-slot" className="a1-web-config-aside" />
      : activePage === 'backlog'
      ? <div id="a1-web-backlog-aside-slot" className="a1-web-config-aside a1-web-config-aside--start" />
      : activePage === 'foundation-color-visualization'
      ? <div id="a1-web-color-visualization-aside-slot" className="a1-web-config-aside" />
      : getComponentsAside({ activePage, detailTab })
    : undefined

  function runSkipMenuAction(action) {
    setSkipMenuOpen(false)
    action?.()
  }

  if (activePage === 'presentation') {
    return (
      <TProvider value={t}>
        <LabelsProvider locale={labelLocale} labels={allLabels}>
          <Presentation onNavigate={navigate} />
        </LabelsProvider>
      </TProvider>
    )
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
          {canUseFeature('backlog') ? (
            <MenuItem icon="add_task" shortcut="Shortcut: !" onClick={() => runSkipMenuAction(() => backlog?.openCreate({ kind: 'general' }))}>
              New ticket
            </MenuItem>
          ) : null}
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
          {canAccessPage('patterns') ? (
            <MenuItem icon="view_quilt" shortcut="Shortcut: G then P" onClick={() => runSkipMenuAction(() => navigate('patterns'))}>
              Patterns
            </MenuItem>
          ) : null}
          {canAccessPage('backlog') ? (
            <MenuItem icon="task_alt" shortcut="Shortcut: G then B" onClick={() => runSkipMenuAction(() => navigate('backlog'))}>
              Backlog
            </MenuItem>
          ) : null}
        </MenuSection>
        <MenuSection label="Tools and help">
          {canAccessPage('rules') ? (
            <MenuItem icon="rule" shortcut="Shortcut: G then R" onClick={() => runSkipMenuAction(() => navigate('rules'))}>
              Rules
            </MenuItem>
          ) : null}
          {canAccessPage('label-editor') ? (
            <MenuItem icon="translate" shortcut="Shortcut: G then L" onClick={() => runSkipMenuAction(() => navigate('label-editor'))}>
              Labels
            </MenuItem>
          ) : null}
          {canAccessPage('data') ? (
            <MenuItem icon="database" shortcut="Shortcut: G then D" onClick={() => runSkipMenuAction(() => navigate('data'))}>
              Data sources
            </MenuItem>
          ) : null}
          {canAccessPage('theme-editor') ? (
            <MenuItem icon="palette" shortcut="Shortcut: G then T" onClick={() => runSkipMenuAction(() => navigate('theme-editor'))}>
              Theme editor
            </MenuItem>
          ) : null}
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
        sidebar={pageAccessAllowed
          ? activePage === 'editor' && editorPatternId
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
            : activePage === 'playground' && !playgroundLiveView
            ? <JsonPlaygroundSidebar
                json={playgroundJson}
                onJsonChange={(next) => {
                  setPlaygroundHandoffError('')
                  setPlaygroundLiveView(false)
                  setPlaygroundJson(next)
                }}
                error={playgroundError}
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
            : activePage === 'backlog' && !isSmDown
            ? asideEl
            : activePage === 'releases'
            ? <ReleasesSidebar
                mode={effectiveReleaseMode}
                allowDetailed={canViewDetailedReleases}
                sourceId={releaseSource}
                onSourceChange={setReleaseSource}
                search={releaseSearch}
                onSearchChange={setReleaseSearch}
                selectedReleaseId={selectedReleaseId}
                onSelectRelease={(id) => { setSelectedReleaseId(id); setSidebarOpen(false) }}
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
            : activePage === 'labs'
            ? getLabsSidebar({ onNavigate: navigate })
            : COMPONENT_ROUTE_IDS.includes(activePage)
            ? getComponentsSidebar({
                activePage,
                detailTab,
                onNavigate: navigate,
                onSelectDetailTab: selectDetailTab,
                search: componentSearch,
                setSearch: setComponentSearch,
              })
            : undefined
          : undefined
        }
        aside={isSmDown || activePage === 'backlog' ? undefined : asideEl}
        header={
          <TopHeader
            className="a1-web-app-header"
            data-a1-tour="navigation"
            logo={logo}
            logoHref={getPath('home')}
            navItems={navItems}
            actions={actions}
          />
        }
      >
        <PageAccessBoundary page={activePage} onNavigate={navigate}>
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
        {activePage === 'playground' && !playgroundLiveView && (
          <IconButton
            className="a1-web-sidebar-toggle"
            icon="code"
            label="Open JSON panel"
            size="sm"
            variant="secondary"
            onClick={() => setSidebarOpen(true)}
          />
        )}
        {activePage === 'home' && <Home onNavigate={navigate} />}
        {activePage === 'dashboard' && <SystemDashboard onNavigate={navigate} />}
        {activePage === 'features' && <Features onNavigate={navigate} />}
        {activePage === 'get-started' && <GetStarted onNavigate={navigate} />}
        {activePage === 'blog' && <Blog onNavigate={navigate} />}
        {activePage === 'blog-article' && <BlogArticle onNavigate={navigate} />}
        {activePage === 'labs' && <Labs onNavigate={navigate} />}
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
            setDetailTab={selectDetailTab}
          />
        )}
        {activePage === 'patterns' && <Patterns onNavigate={navigate} />}
        {activePage === 'playground' && <JsonPlayground result={playgroundResult} />}
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
              archivedProjects={archivedProjects}
              onRestoreProject={handleRestoreProject}
              onDeleteProjectPermanent={handleDeleteProjectPermanent}
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
              projectTheme={activeProject.theme}
              colorMode={colorMode}
              resolvedColorScheme={resolvedColorScheme}
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
              onPublishProject={handlePublishProject}
              onUnpublishProject={handleUnpublishProject}
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
              projectTheme={activeProject.theme}
              colorMode={colorMode}
              resolvedColorScheme={resolvedColorScheme}
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
                onSelectCategory={setThemeCategory}
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
            archivedProjects={archivedProjects}
            onRestoreProject={handleRestoreProject}
            onDeleteProjectPermanent={handleDeleteProjectPermanent}
            onImportProject={handleImportProject}
            onOpenImageLibrary={() => navigate('image-library')}
            onNavigateHome={() => navigate('home')}
            onOpenHelp={() => openHelpPage()}
          />
        )}
        {activePage === 'account' && <AccountPage onNavigate={navigate} />}
        {activePage === 'admin' && <Admin onNavigate={navigate} />}
        {activePage === 'accessibility' && <Accessibility onNavigate={navigate} />}
        {activePage === 'help' && <Help onNavigate={navigate} initialQuery={helpQuery} />}
        {activePage === 'releases' && (
          <Releases
            onNavigate={navigate}
            mode={effectiveReleaseMode}
            onModeChange={setReleaseMode}
            allowDetailed={canViewDetailedReleases}
            sourceId={releaseSource}
            onSourceChange={setReleaseSource}
            search={releaseSearch}
            selectedReleaseId={selectedReleaseId}
            onSelectRelease={setSelectedReleaseId}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
        )}
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
        </PageAccessBoundary>
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
        onStartTour={startProductTour}
        tourLabel={t('app.tour.start', 'Take a tour')}
      />

      <ProductTour
        open={productTourOpen}
        steps={productTourSteps}
        labels={productTourLabels}
        onDismiss={dismissProductTour}
        onComplete={completeProductTour}
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
              {authUser.email} · {accessRoleLabel(t, accessRole)}
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
      <AccessProvider>
        <BacklogProvider>
          <DataSourcesProvider>
            <App />
          </DataSourcesProvider>
        </BacklogProvider>
      </AccessProvider>
    </AuthGate>
  </AuthProvider>
)

createRoot(document.getElementById('root')).render(
  posthogEnabled ? <PostHogProvider client={posthog}>{tree}</PostHogProvider> : tree,
)
