import '../../../build/css/tokens.css'
import '../../../packages/react/src/themes.css'
import '../../../packages/react/src/color-scheme.css'
import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import {
  Button,
  LabelsProvider,
  Menu,
  MenuSection,
  PageLayout,
  RadioGroup,
  SegmentedControl,
  SelectField,
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
  componentCategories,
  componentCategoryPageIds,
  componentPageIds,
  componentPageTitles,
} from './pages/Components.jsx'
import { Projects } from './pages/Projects.jsx'
import { Templates } from './pages/Templates.jsx'
import { Accessibility } from './pages/Accessibility.jsx'
import { Releases } from './pages/Releases.jsx'
import './styles.css'

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

const PAGES = ['home', 'features', 'get-started', 'foundations', ...FOUNDATION_PAGE_IDS, ...COMPONENT_ROUTE_IDS, 'templates', 'projects', 'accessibility', 'releases']

const PAGE_TITLES = {
  home: 'A1 Design System',
  features: 'Features',
  'get-started': 'Get Started',
  foundations: 'Foundations',
  ...Object.fromEntries(foundations.map((foundation) => [foundation.id, foundation.title])),
  ...componentPageTitles,
  templates: 'Templates',
  projects: 'Projects',
  accessibility: 'Accessibility',
  releases: 'Releases',
}

const themeOptions = [
  { value: 'a1Light', label: 'Default' },
  { value: 'a1Heritage', label: 'Heritage' },
  { value: 'a1Accessible', label: 'Accessible' },
  { value: 'catlympics', label: 'Catlympics' },
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
    document.documentElement.classList.toggle('a1-theme-catlympics', theme === 'catlympics')
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
    ...['templates'].map((id) => ({
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

  return (
    <LabelsProvider locale={locale === 'en' ? null : locale} labels={allLabels}>
      <PageLayout
        stickyHeader
        viewportHeight
        sidebar={COMPONENT_ROUTE_IDS.includes(activePage) ? getComponentsSidebar({
          activePage,
          onNavigate: navigate,
          search: componentSearch,
          setSearch: setComponentSearch,
        }) : undefined}
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
          />
        )}
        {activePage === 'templates' && <Templates />}
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
    </LabelsProvider>
  )
}

createRoot(document.getElementById('root')).render(<App />)
