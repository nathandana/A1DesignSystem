import {
  Accordion,
  Button,
  Code,
  Divider,
  Stack,
  TextField,
  TopHeader,
} from '@gtivr4/a1-design-system-react'
import { Choice } from './configKit.jsx'
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'

// TopHeader is a layout shell that owns its own surface, border, and sticky
// positioning — it is never placed inside a Section. The detail page reads
// `bareDisplay` to render the preview directly and to hide the Section-related
// Display controls.
export const bareDisplay = true

const NAV_ICON_POSITION_OPTIONS = ['start', 'above', 'hidden']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeJsString(value) {
  return String(value ?? '')
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'")
    .replaceAll('\n', '\\n')
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function createNavItem(label) {
  return { id: uid('nav-item'), label, isLink: true, href: '#', icon: '', active: false }
}

function createAction(label, icon) {
  return { id: uid('action'), label, icon, badge: '' }
}

function normalizeNavItems(items) {
  return Array.isArray(items) && items.length > 0 ? items : [createNavItem('Home')]
}

function normalizeActions(actions) {
  return Array.isArray(actions) ? actions : []
}

export function getDefaultConfig() {
  return {
    logoText: 'A1 Design System',
    navIconPosition: 'start',
    loginLabel: '',
    navItems: [
      { id: 'nav-products', label: 'Products', isLink: true, href: '#', icon: '', active: true },
      { id: 'nav-solutions', label: 'Solutions', isLink: true, href: '#', icon: '', active: false },
      { id: 'nav-pricing', label: 'Pricing', isLink: true, href: '#', icon: '', active: false },
    ],
    actions: [
      { id: 'action-search', label: 'Search', icon: 'search', badge: '' },
      { id: 'action-notifications', label: 'Notifications', icon: 'notifications', badge: '3' },
    ],
    openNavItems: [],
    openActions: [],
  }
}

export function Preview({ config, utilityClass = '' }) {
  const navItems = normalizeNavItems(config.navItems).map((item) => ({
    id: item.id,
    label: item.label || 'Untitled',
    href: item.isLink ? (item.href || '#') : undefined,
    icon: item.icon || undefined,
    active: item.active,
    onClick: (event) => event.preventDefault(),
  }))

  const actions = normalizeActions(config.actions).map((action) => ({
    id: action.id,
    icon: action.icon || 'circle',
    label: action.label || 'Action',
    badge: action.badge || undefined,
    onClick: () => {},
  }))

  return (
    <div className="a1-web-top-header-preview">
      <TopHeader
        className={utilityClass || undefined}
        logoText={config.logoText || undefined}
        navItems={navItems}
        actions={actions}
        navIconPosition={config.navIconPosition}
        loginButton={config.loginLabel ? { label: config.loginLabel } : undefined}
      />
    </div>
  )
}

export function Controls({ config, setConfig }) {
  const navItems = normalizeNavItems(config.navItems)
  const actions = normalizeActions(config.actions)
  const openNavItems = Array.isArray(config.openNavItems) ? config.openNavItems : []
  const openActions = Array.isArray(config.openActions) ? config.openActions : []

  function updateNavItem(id, patch) {
    setConfig((current) => ({
      ...current,
      navItems: normalizeNavItems(current.navItems).map((item) => (
        item.id === id ? { ...item, ...patch } : item
      )),
    }))
  }

  function updateAction(id, patch) {
    setConfig((current) => ({
      ...current,
      actions: normalizeActions(current.actions).map((action) => (
        action.id === id ? { ...action, ...patch } : action
      )),
    }))
  }

  function toggleOpen(key, id, open) {
    setConfig((current) => {
      const list = Array.isArray(current[key]) ? current[key] : []
      return {
        ...current,
        [key]: open
          ? Array.from(new Set([...list, id]))
          : list.filter((itemId) => itemId !== id),
      }
    })
  }

  function removeNavItem(id) {
    setConfig((current) => {
      const next = normalizeNavItems(current.navItems).filter((item) => item.id !== id)
      return {
        ...current,
        navItems: next.length > 0 ? next : normalizeNavItems(current.navItems),
        openNavItems: (current.openNavItems ?? []).filter((itemId) => itemId !== id),
      }
    })
  }

  function removeAction(id) {
    setConfig((current) => ({
      ...current,
      actions: normalizeActions(current.actions).filter((action) => action.id !== id),
      openActions: (current.openActions ?? []).filter((itemId) => itemId !== id),
    }))
  }

  function addNavItem() {
    setConfig((current) => {
      const list = normalizeNavItems(current.navItems)
      const next = createNavItem(`Item ${list.length + 1}`)
      return {
        ...current,
        navItems: [...list, next],
        openNavItems: Array.from(new Set([...(current.openNavItems ?? []), next.id])),
      }
    })
  }

  function addAction() {
    setConfig((current) => {
      const list = normalizeActions(current.actions)
      const next = createAction('Action', 'star')
      return {
        ...current,
        actions: [...list, next],
        openActions: Array.from(new Set([...(current.openActions ?? []), next.id])),
      }
    })
  }

  return (
    <Stack gap="lg">
      <TextField
        label="Logo text"
        hint="Leave empty to hide the logo."
        size="compact"
        value={config.logoText}
        onChange={(event) => setConfig((current) => ({ ...current, logoText: event.target.value }))}
      />
      <Choice prop="navIconPosition"
        label="Nav icon position"
        size="compact"
        hideIndicator
        columns={3}
        value={config.navIconPosition}
        onChange={(navIconPosition) => setConfig((current) => ({ ...current, navIconPosition }))}
        options={NAV_ICON_POSITION_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <TextField
        label="Login button label"
        hint="Leave empty to hide the login button."
        size="compact"
        value={config.loginLabel}
        onChange={(event) => setConfig((current) => ({ ...current, loginLabel: event.target.value }))}
      />

      <Stack gap="sm">
        {navItems.map((item, index) => {
          const label = item.label || 'Untitled item'
          return (
            <Accordion
              key={item.id}
              label={`${index + 1}. ${label}${item.active ? ' (active)' : ''}`}
              size="sm"
              open={openNavItems.includes(item.id)}
              onChange={(open) => toggleOpen('openNavItems', item.id, open)}
            >
              <Stack gap="md">
                <TextField
                  label="Label"
                  size="compact"
                  value={item.label}
                  onChange={(event) => updateNavItem(item.id, { label: event.target.value })}
                />

                <Choice
                  label="Behavior"
                  size="compact"
                  hideIndicator
                  columns={2}
                  value={item.isLink ? 'link' : 'button'}
                  onChange={(value) => updateNavItem(item.id, { isLink: value === 'link' })}
                  options={[
                    { label: 'Link', value: 'link' },
                    { label: 'Button', value: 'button' },
                  ]}
                />

                {item.isLink && (
                  <TextField
                    label="Href"
                    size="compact"
                    value={item.href}
                    onChange={(event) => updateNavItem(item.id, { href: event.target.value })}
                  />
                )}

                <Toggle
                  label="Icon"
                  value={!!item.icon}
                  onChange={(checked) => updateNavItem(item.id, { icon: checked ? (item.icon || 'widgets') : '' })}
                />

                {item.icon && (
                  <IconSelect
                    value={item.icon}
                    onChange={(icon) => updateNavItem(item.id, { icon })}
                  />
                )}

                <Toggle label="Active" value={item.active} onChange={(active) => updateNavItem(item.id, { active })} />

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  icon="delete"
                  disabled={navItems.length <= 1}
                  onClick={() => removeNavItem(item.id)}
                >
                  Remove item
                </Button>
              </Stack>
            </Accordion>
          )
        })}
      </Stack>

      <Button type="button" variant="secondary" size="sm" icon="add" onClick={addNavItem}>
        Add nav item
      </Button>

      <Divider />

      <Stack gap="sm">
        {actions.map((action, index) => {
          const label = action.label || 'Untitled action'
          return (
            <Accordion
              key={action.id}
              label={`Action ${index + 1}: ${label}`}
              size="sm"
              open={openActions.includes(action.id)}
              onChange={(open) => toggleOpen('openActions', action.id, open)}
            >
              <Stack gap="md">
                <TextField
                  label="Label"
                  hint="Used as the icon button's accessible name."
                  size="compact"
                  value={action.label}
                  onChange={(event) => updateAction(action.id, { label: event.target.value })}
                />

                <IconSelect
                  value={action.icon || 'star'}
                  onChange={(icon) => updateAction(action.id, { icon })}
                />

                <TextField
                  label="Badge"
                  size="compact"
                  value={action.badge}
                  onChange={(event) => updateAction(action.id, { badge: event.target.value })}
                />

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  icon="delete"
                  onClick={() => removeAction(action.id)}
                >
                  Remove action
                </Button>
              </Stack>
            </Accordion>
          )
        })}
      </Stack>

      <Button type="button" variant="secondary" size="sm" icon="add" onClick={addAction}>
        Add action
      </Button>
    </Stack>
  )
}

function navItemSnippet(item) {
  const props = [
    `id: '${escapeJsString(item.id)}'`,
    `label: '${escapeJsString(item.label || 'Untitled')}'`,
    item.isLink ? `href: '${escapeJsString(item.href || '#')}'` : null,
    item.icon ? `icon: '${escapeJsString(item.icon)}'` : null,
    item.active ? 'active: true' : null,
  ].filter(Boolean).join(', ')
  return `    { ${props} },`
}

function actionSnippet(action) {
  const props = [
    `id: '${escapeJsString(action.id)}'`,
    `icon: '${escapeJsString(action.icon || 'star')}'`,
    `label: '${escapeJsString(action.label || 'Action')}'`,
    action.badge ? `badge: '${escapeJsString(action.badge)}'` : null,
  ].filter(Boolean).join(', ')
  return `    { ${props} },`
}

function buildTopHeaderSnippet(config, utilityClass = '') {
  const navItems = normalizeNavItems(config.navItems)
  const actions = normalizeActions(config.actions)

  const props = [
    utilityClass ? `  className="${escapeJsString(utilityClass)}"` : null,
    config.logoText ? `  logoText="${escapeJsString(config.logoText)}"` : null,
    config.navIconPosition && config.navIconPosition !== 'start'
      ? `  navIconPosition="${config.navIconPosition}"`
      : null,
    config.loginLabel ? `  loginButton={{ label: '${escapeJsString(config.loginLabel)}' }}` : null,
    `  navItems={[\n${navItems.map(navItemSnippet).join('\n')}\n  ]}`,
    actions.length > 0 ? `  actions={[\n${actions.map(actionSnippet).join('\n')}\n  ]}` : null,
  ].filter(Boolean).join('\n')

  return `<TopHeader\n${props}\n/>`
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildTopHeaderSnippet(config, utilityClass)}</Code>
}
