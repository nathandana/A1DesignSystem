import '../../../build/css/tokens.css'
import '../../../packages/react/src/themes.css'
import '../../../packages/react/src/color-scheme.css'
import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import {
  LabelsProvider,
  Menu,
  MenuSection,
  PageLayout,
  SegmentedControl,
  TopHeader,
} from '@gtivr4/a1-design-system-react'
import actionLabels from '../../../system/labels/action.json'
import { Home } from './pages/Home.jsx'
import { Features } from './pages/Features.jsx'
import { GetStarted } from './pages/GetStarted.jsx'
import { FoundationDetail, Foundations, foundations } from './pages/Foundations.jsx'
import { Components } from './pages/Components.jsx'
import { Projects } from './pages/Projects.jsx'
import './styles.css'

const FOUNDATION_PAGE_IDS = foundations.map((foundation) => foundation.id)

const PAGES = ['home', 'features', 'get-started', 'foundations', ...FOUNDATION_PAGE_IDS, 'components', 'projects']

const PAGE_TITLES = {
  home: 'A1 Design System',
  features: 'Features',
  'get-started': 'Get Started',
  foundations: 'Foundations',
  ...Object.fromEntries(foundations.map((foundation) => [foundation.id, foundation.title])),
  components: 'Components',
  projects: 'Projects',
}

const themeOptions = [
  { value: 'a1Light', label: 'Default' },
  { value: 'a1Heritage', label: 'Heritage' },
  { value: 'a1Accessible', label: 'Accessible' },
]

const colorSchemeOptions = [
  { value: 'light', icon: 'light_mode', ariaLabel: 'Light mode' },
  { value: 'dark', icon: 'dark_mode', ariaLabel: 'Dark mode' },
  { value: 'system', icon: 'desktop_windows', ariaLabel: 'System mode' },
]

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
  const [theme, setTheme] = useState('a1Light')
  const [colorMode, setColorMode] = useState('light')
  const [systemColorScheme, setSystemColorScheme] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )
  const [settingsOpen, setSettingsOpen] = useState(false)
  const resolvedColorScheme = colorMode === 'system' ? systemColorScheme : colorMode

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
    document.documentElement.classList.toggle('a1-theme-dark', resolvedColorScheme === 'dark')
  }, [theme, resolvedColorScheme])

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

  const navPages = ['features', 'get-started', 'foundations', 'components', 'projects']
  const navItems = navPages.map((id) => ({
    id,
    label: PAGE_TITLES[id],
    href: getPath(id),
    active: id === 'foundations' ? activePage === id || FOUNDATION_PAGE_IDS.includes(activePage) : activePage === id,
    onClick: (e) => handleNavClick(e, id),
    items: id === 'foundations'
      ? foundations.map((foundation) => ({
          icon: foundation.icon,
          label: foundation.title,
          href: getPath(foundation.id),
          onClick: (e) => handleNavClick(e, foundation.id),
        }))
      : undefined,
  }))

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

  return (
    <LabelsProvider labels={actionLabels}>
      <PageLayout
        stickyHeader
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
            onThemeChange={setTheme}
            colorMode={colorMode}
            onColorModeChange={setColorMode}
          />
        )}
        {activePage === 'components' && <Components />}
        {activePage === 'projects' && <Projects />}
      </PageLayout>

      <Menu open={settingsOpen} onClose={() => setSettingsOpen(false)} aria-label="Settings">
        <MenuSection label="Theme">
          <SegmentedControl
            options={themeOptions}
            value={theme}
            onChange={setTheme}
            aria-label="Theme"
            size="sm"
            fullWidth
          />
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
      </Menu>
    </LabelsProvider>
  )
}

createRoot(document.getElementById('root')).render(<App />)
