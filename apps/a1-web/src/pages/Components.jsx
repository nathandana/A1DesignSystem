import { useMemo, useState } from 'react'
import {
  Breadcrumb,
  Button,
  Card,
  DataTable,
  Grid,
  Heading,
  Icon,
  List,
  ListItem,
  MessageBadge,
  Paragraph,
  Section,
  SelectField,
  SideNav,
  SideNavGroup,
  SideNavItem,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
} from '@gtivr4/a1-design-system-react'
import buttonRules from '../../../../system/rules/button.yaml?raw'
import cardRules from '../../../../system/rules/card.yaml?raw'
import pageLayoutRules from '../../../../system/rules/page-layout.yaml?raw'
import sideNavRules from '../../../../system/rules/side-nav.yaml?raw'
import messageBadgeRules from '../../../../system/rules/message-badge.yaml?raw'

const LAST_UPDATED = '2026-06-06'
const PACKAGE_COLUMNS = ['React', 'HTML/CSS base', 'HTML/CSS pure', 'React Native', 'Pure example']
const ICON_OPTIONS = ['widgets', 'check', 'add', 'edit', 'settings', 'download', 'star', 'near_me', 'touch_app']

// Mirrors the "A1 Web menu hierarchy" section in system/ai/components.md.
export const componentCategories = [
  {
    id: 'typography',
    title: 'Typography',
    icon: 'title',
    body: 'Text primitives for hierarchy, prose, lists, separators, and inline semantic text.',
    components: [
      { id: 'heading', title: 'Heading', body: 'Semantic headings with display and heading scales.' },
      { id: 'paragraph', title: 'Paragraph', body: 'Body copy with responsive sizing, alignment, and muted states.' },
      { id: 'blockquote', title: 'Blockquote', body: 'Editorial quotation patterns with accent, pull, and ruled variants.' },
      { id: 'list', title: 'List', body: 'Ordered and unordered lists with tokenized rhythm and icons.' },
      { id: 'divider', title: 'Divider', body: 'Horizontal and vertical separation for content groups.' },
      { id: 'inline', title: 'Inline', body: 'Code, keyboard, mark, and other inline text treatments.' },
    ],
  },
  {
    id: 'navigation',
    title: 'Navigation',
    icon: 'near_me',
    body: 'Wayfinding components for global, local, tabbed, and breadcrumb navigation.',
    components: [
      { id: 'link', title: 'Link', body: 'Accessible text links with semantic color and focus states.' },
      { id: 'breadcrumb', title: 'Breadcrumb', body: 'Hierarchical location trails for deep content.' },
      { id: 'side-nav', title: 'Side Nav', body: 'Responsive nested navigation for app shells.' },
      { id: 'top-header', title: 'Top Header', body: 'Global header with nav, actions, menus, and mobile drawer.' },
      { id: 'tabs', title: 'Tabs', body: 'Tabbed navigation for related content panels.' },
      { id: 'page-nav', title: 'Page Nav', body: 'In-page navigation for long-form content.' },
    ],
  },
  {
    id: 'actions',
    title: 'Actions',
    icon: 'touch_app',
    body: 'Controls that trigger commands, choices, and mode changes.',
    components: [
      { id: 'button', title: 'Button', body: 'Primary, secondary, tertiary, destructive, and success actions.' },
      { id: 'icon-button', title: 'Icon Button', body: 'Compact icon-only actions with accessible labels.' },
      { id: 'switch', title: 'Switch', body: 'Binary on/off settings and preferences.' },
      { id: 'segmented-control', title: 'Segmented Control', body: 'Small sets of mutually exclusive choices.' },
    ],
  },
  {
    id: 'inputs',
    title: 'Inputs',
    icon: 'edit_note',
    body: 'Form controls for collecting, validating, and grouping user input.',
    components: [
      { id: 'field', title: 'Field', body: 'Text, email, password, number, date, and related field patterns.' },
      { id: 'textarea', title: 'Textarea', body: 'Multi-line text entry with labels, hints, and validation.' },
      { id: 'select', title: 'Select', body: 'Native option selection with A1 field styling.' },
      { id: 'checkbox-group', title: 'Checkbox Group', body: 'Multi-select form choices grouped by fieldset.' },
      { id: 'radio-group', title: 'Radio Group', body: 'Single-select form choices grouped by fieldset.' },
      { id: 'fieldset', title: 'Fieldset', body: 'Semantic grouping for related form controls.' },
      { id: 'inline-editable', title: 'Inline Editable', body: 'Editable text that stays in reading context.' },
    ],
  },
  {
    id: 'feedback',
    title: 'Feedback',
    icon: 'campaign',
    body: 'Status, alert, notification, and empty-state components.',
    components: [
      { id: 'banner', title: 'Banner', body: 'Prominent page-level messages.' },
      { id: 'message', title: 'Message', body: 'Badges, banners, and empty-state messaging.' },
      { id: 'notification', title: 'Notification', body: 'Compact count and status indicators.' },
      { id: 'snackbar', title: 'Snackbar', body: 'Transient confirmations and alerts.' },
      { id: 'empty-state', title: 'Empty State', body: 'Guidance for blank or unavailable content.' },
      { id: 'system-banner', title: 'System Banner', body: 'System-wide operational announcements.' },
    ],
  },
  {
    id: 'layout',
    title: 'Layout',
    icon: 'dashboard',
    body: 'Composition primitives for page sections, grids, cards, spacing, and app shells.',
    components: [
      { id: 'section', title: 'Section', body: 'Full-width content bands with surfaces, padding, and alignment.' },
      { id: 'card', title: 'Card', body: 'Grouped content and navigation surfaces.' },
      { id: 'stack', title: 'Stack', body: 'One-dimensional spacing and alignment.' },
      { id: 'cluster', title: 'Cluster', body: 'Wrapping inline groups with tokenized gaps.' },
      { id: 'grid', title: 'Grid', body: 'Responsive grid layouts and bento arrangements.' },
      { id: 'bleed', title: 'Bleed', body: 'Content that reaches beyond a parent inset.' },
      { id: 'inset', title: 'Inset', body: 'Tokenized inner spacing wrappers.' },
      { id: 'spacer', title: 'Spacer', body: 'Explicit responsive spacing blocks.' },
      { id: 'page-layout', title: 'Page Layout', body: 'Header, sidebar, aside, main, and footer app shell layout.' },
      { id: 'button-container', title: 'Button Container', body: 'Responsive action grouping and alignment.' },
      { id: 'figure', title: 'Figure', body: 'Images or media with accessible captions.' },
    ],
  },
  {
    id: 'overlay',
    title: 'Overlay',
    icon: 'web_asset',
    body: 'Layered UI surfaces for dialogs and anchored menus.',
    components: [
      { id: 'dialog', title: 'Dialog', body: 'Modal interactions with focus management.' },
      { id: 'menu', title: 'Menu', body: 'Anchored command and navigation menus.' },
    ],
  },
  {
    id: 'data',
    title: 'Data',
    icon: 'table',
    body: 'Components for tabular information, filtering, and pagination.',
    components: [
      { id: 'data-table', title: 'Data Table', body: 'Sortable, selectable, responsive tabular data.' },
      { id: 'pagination', title: 'Pagination', body: 'Paged navigation for long result sets.' },
    ],
  },
  {
    id: 'media-iconography',
    title: 'Media and iconography',
    icon: 'insert_photo',
    body: 'Visual primitives for symbols and supporting media.',
    components: [
      { id: 'icon', title: 'Icon', body: 'Material Symbols wrapper with A1 sizing and color.' },
    ],
  },
  {
    id: 'disclosure',
    title: 'Disclosure',
    icon: 'unfold_more',
    body: 'Expandable content patterns.',
    components: [
      { id: 'accordion', title: 'Accordion', body: 'Expandable sections for progressive disclosure.' },
    ],
  },
]

const PACKAGE_COVERAGE = {
  heading: ['React', 'HTML/CSS base', 'HTML/CSS pure', 'React Native', 'Pure example'],
  paragraph: ['React', 'HTML/CSS base', 'HTML/CSS pure', 'React Native', 'Pure example'],
  blockquote: ['React', 'HTML/CSS base', 'HTML/CSS pure', 'React Native', 'Pure example'],
  list: ['React', 'HTML/CSS base', 'HTML/CSS pure', 'React Native', 'Pure example'],
  divider: ['React', 'HTML/CSS base', 'HTML/CSS pure', 'Pure example'],
  inline: ['React', 'HTML/CSS base', 'HTML/CSS pure'],
  link: ['React', 'HTML/CSS base', 'HTML/CSS pure', 'React Native', 'Pure example'],
  breadcrumb: ['React', 'HTML/CSS base'],
  'side-nav': ['React', 'HTML/CSS base', 'React Native'],
  'top-header': ['React', 'HTML/CSS base', 'HTML/CSS pure', 'Pure example'],
  tabs: ['React'],
  'page-nav': ['React'],
  button: ['React', 'HTML/CSS base', 'HTML/CSS pure', 'React Native', 'Pure example'],
  'icon-button': ['React', 'HTML/CSS base', 'HTML/CSS pure', 'React Native', 'Pure example'],
  switch: ['React', 'HTML/CSS base'],
  'segmented-control': ['React'],
  field: ['React', 'HTML/CSS base', 'HTML/CSS pure', 'Pure example'],
  textarea: ['React', 'HTML/CSS base', 'HTML/CSS pure', 'Pure example'],
  select: ['React', 'HTML/CSS base', 'HTML/CSS pure', 'Pure example'],
  'checkbox-group': ['React', 'HTML/CSS base', 'HTML/CSS pure', 'Pure example'],
  'radio-group': ['React', 'HTML/CSS base', 'HTML/CSS pure', 'Pure example'],
  fieldset: ['React', 'HTML/CSS base', 'HTML/CSS pure', 'Pure example'],
  'inline-editable': ['React'],
  banner: ['React', 'HTML/CSS base', 'React Native'],
  message: ['React', 'HTML/CSS base', 'React Native'],
  notification: ['React', 'HTML/CSS base'],
  snackbar: ['React', 'React Native'],
  'empty-state': ['React', 'HTML/CSS base', 'React Native'],
  'system-banner': ['React', 'HTML/CSS base'],
  section: ['React', 'HTML/CSS base', 'HTML/CSS pure', 'React Native', 'Pure example'],
  card: ['React', 'HTML/CSS base', 'React Native'],
  stack: ['React', 'HTML/CSS base'],
  cluster: ['React', 'HTML/CSS base'],
  grid: ['React', 'HTML/CSS base'],
  bleed: ['React', 'HTML/CSS base'],
  inset: ['React', 'HTML/CSS base'],
  spacer: ['React', 'HTML/CSS base'],
  'page-layout': ['React', 'HTML/CSS base'],
  'button-container': ['React', 'HTML/CSS base', 'React Native'],
  figure: ['React', 'HTML/CSS base', 'HTML/CSS pure'],
  dialog: ['React', 'React Native'],
  menu: ['React'],
  'data-table': ['React', 'HTML/CSS base', 'HTML/CSS pure', 'Pure example'],
  pagination: ['React', 'React Native'],
  icon: ['React', 'HTML/CSS base', 'HTML/CSS pure', 'Pure example'],
  accordion: ['React', 'HTML/CSS base', 'HTML/CSS pure', 'Pure example'],
}

const ruleSourceFiles = [
  { file: 'system/rules/button.yaml', raw: buttonRules },
  { file: 'system/rules/card.yaml', raw: cardRules },
  { file: 'system/rules/page-layout.yaml', raw: pageLayoutRules },
  { file: 'system/rules/side-nav.yaml', raw: sideNavRules },
  { file: 'system/rules/message-badge.yaml', raw: messageBadgeRules },
]

export const componentCategoryPageIds = componentCategories.map((category) => `components-${category.id}`)
export const componentPageIds = componentCategories.flatMap((category) =>
  category.components.map((component) => `component-${component.id}`)
)

export const componentPageTitles = {
  components: 'Components',
  ...Object.fromEntries(componentCategories.map((category) => [`components-${category.id}`, category.title])),
  ...Object.fromEntries(componentCategories.flatMap((category) =>
    category.components.map((component) => [`component-${component.id}`, component.title])
  )),
}

const allComponents = componentCategories.flatMap((category) =>
  category.components.map((component) => ({
    ...component,
    categoryId: category.id,
    categoryTitle: category.title,
    categoryIcon: category.icon,
    updated: LAST_UPDATED,
    packages: PACKAGE_COVERAGE[component.id] ?? ['React'],
  }))
)

function getComponentPath(id) {
  return id === 'components' ? '/?page=components' : `/?page=${id}`
}

function getComponentEntry(activePage) {
  for (const category of componentCategories) {
    if (activePage === `components-${category.id}`) return { category }
    const component = category.components.find((item) => activePage === `component-${item.id}`)
    if (component) return { category, component: { ...component, categoryId: category.id, categoryTitle: category.title, categoryIcon: category.icon } }
  }
  return {}
}

function navigateCard(event, onNavigate, page) {
  event.preventDefault()
  onNavigate?.(page)
}

function navigateBreadcrumb(event, onNavigate, page) {
  if (!onNavigate) return
  event.preventDefault()
  onNavigate(page)
}

function getBreadcrumbItems({ category, component }, onNavigate) {
  const homeItem = {
    href: '/',
    label: 'Home',
    onClick: (event) => navigateBreadcrumb(event, onNavigate, 'home'),
  }

  const componentsItem = component || category
    ? {
        href: getComponentPath('components'),
        label: 'Components',
        onClick: (event) => navigateBreadcrumb(event, onNavigate, 'components'),
      }
    : { label: 'Components' }

  if (component) {
    return [
      homeItem,
      componentsItem,
      {
        href: getComponentPath(`components-${category.id}`),
        label: category.title,
        onClick: (event) => navigateBreadcrumb(event, onNavigate, `components-${category.id}`),
      },
      { label: component.title },
    ]
  }

  if (category) return [homeItem, componentsItem, { label: category.title }]

  return [homeItem, componentsItem]
}

function titleToRuleName(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function parseRuleSource({ file, raw }) {
  const rules = []
  let current = null

  for (const rawLine of raw.split('\n')) {
    const line = rawLine.trim()
    if (line.startsWith('- id:')) {
      if (current) rules.push(current)
      current = { id: line.slice(5).trim(), file }
      continue
    }
    if (!current) continue

    for (const key of ['component', 'requirement', 'title', 'description', 'do', 'dont']) {
      if (line.startsWith(`${key}:`)) {
        const value = line.slice(key.length + 1).trim()
        if (value && value !== '>' && value !== '|') current[key] = value.replace(/^['"]|['"]$/g, '')
      }
    }
  }

  if (current) rules.push(current)
  return rules
}

const parsedRules = ruleSourceFiles.flatMap(parseRuleSource)

function getRulesForComponent(component) {
  const ruleName = titleToRuleName(component.title)
  const compactTitle = component.title.toLowerCase().replace(/\s+/g, '')

  return parsedRules.filter((rule) => {
    const haystack = `${rule.id} ${rule.component ?? ''} ${rule.requirement ?? ''} ${rule.title ?? ''}`.toLowerCase()
    return haystack.includes(ruleName) || haystack.includes(compactTitle)
  })
}

function PackageBadges({ packages }) {
  const displayPackages = ['React', 'React Native', 'Pure']
  const supportedPackages = displayPackages.filter(pkg => packages.includes(pkg))
  
  return (
    <Stack direction="row" gap="sm" wrap>
      {supportedPackages.map((pkg) => (
        <MessageBadge key={pkg} subtle icon="check" status="neutral">
          {pkg}
        </MessageBadge>
      ))}
        <MessageBadge subtle icon="info" status="info">
          Updated: {LAST_UPDATED}
        </MessageBadge>
    </Stack>
  )
}

function ComponentTree({ activePage, onNavigate, search }) {
  const query = search.trim().toLowerCase()
  const visibleCategories = componentCategories
    .map((category) => ({
      ...category,
      components: category.components.filter((component) =>
        !query ||
        component.title.toLowerCase().includes(query) ||
        component.body.toLowerCase().includes(query) ||
        category.title.toLowerCase().includes(query)
      ),
    }))
    .filter((category) => !query || category.components.length > 0)

  return (
    <SideNav className="a1-web-components-tree" header="Component tree" defaultCollapsed={false}>
      <SideNavItem
        as="a"
        href={getComponentPath('components')}
        icon="widgets"
        label="Overview"
        active={activePage === 'components'}
        onClick={(event) => navigateCard(event, onNavigate, 'components')}
      />
      {visibleCategories.map((category) => (
        <SideNavGroup
          key={category.id}
          icon={category.icon}
          label={category.title}
          defaultOpen={!query || activePage === `components-${category.id}` || category.components.some((component) => activePage === `component-${component.id}`)}
        >
          <SideNavItem
            as="a"
            href={getComponentPath(`components-${category.id}`)}
            label="Category overview"
            active={activePage === `components-${category.id}`}
            onClick={(event) => navigateCard(event, onNavigate, `components-${category.id}`)}
          />
          {category.components.map((component) => (
            <SideNavItem
              key={component.id}
              as="a"
              href={getComponentPath(`component-${component.id}`)}
              label={component.title}
              active={activePage === `component-${component.id}`}
              onClick={(event) => navigateCard(event, onNavigate, `component-${component.id}`)}
            />
          ))}
        </SideNavGroup>
      ))}
    </SideNav>
  )
}

function ComponentDocsShell({ aside, children }) {
  return (
    <div className={aside ? 'a1-web-components-shell a1-web-components-shell--with-aside' : 'a1-web-components-shell'}>
      <div className="a1-web-components-shell__main">
        {children}
      </div>
      {aside && (
        <aside className="a1-web-components-shell__aside" aria-label="Configure component">
          {aside}
        </aside>
      )}
    </div>
  )
}

function ComponentsSidebar({ activePage, onNavigate, search, setSearch }) {
  return (
    <>
      <div className="a1-web-components-sidebar-search">
        <TextField
          label="Search components"
          size="compact"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <ComponentTree activePage={activePage} onNavigate={onNavigate} search={search} />
    </>
  )
}

function OverviewTable({ onNavigate }) {
  const columns = [
    { key: 'component', label: 'Component', type: 'link', sortable: true, sortAccessor: (row) => row.component.label },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'updated', label: 'Last updated', sortable: true },
    { key: 'packages', label: 'Packages' },
    { key: 'actions', label: 'Open', type: 'actions' },
  ]

  const rows = allComponents.map((component) => ({
    id: component.id,
    component: {
      href: getComponentPath(`component-${component.id}`),
      label: component.title,
      icon: 'arrow_forward',
    },
    category: component.categoryTitle,
    updated: component.updated,
    packages: component.packages.join(', '),
    actions: [{
      label: 'Open',
      icon: 'open_in_new',
      onClick: () => onNavigate?.(`component-${component.id}`),
    }],
  }))

  return (
    <DataTable
      caption="All A1 components"
      columns={columns}
      rows={rows}
      density="compact"
      zebra
      scrollable
      defaultSort={{ key: 'category', direction: 'asc' }}
    />
  )
}

function CategoryPage({ category, onNavigate }) {
  return (
    <Stack gap="lg">
      <Stack direction="column" gap="sm">
        <MessageBadge subtle icon={category.icon}>Component category</MessageBadge>
        <Heading as="h2" type="display" size={{ xs: 'lg', md: 'xl' }}>
          {category.title}
        </Heading>
        <Paragraph size="md" color="muted">{category.body}</Paragraph>
      </Stack>

      <div className="a1-web-components-placeholder">
        <Heading as="h3" size="md">Description and general rules</Heading>
        <Paragraph size="sm" color="muted">
          Placeholder for category-level guidance, decision rules, shared anatomy, and usage patterns that apply across {category.title.toLowerCase()} components.
        </Paragraph>
      </div>

      <Grid columns={{ xs: 1, sm: 2, lg: 3 }} gap="md">
        {category.components.map((component) => (
          <Card
            key={component.id}
            variant="navigation"
            href={getComponentPath(`component-${component.id}`)}
            onClick={(event) => navigateCard(event, onNavigate, `component-${component.id}`)}
          >
            <Stack direction="column" gap="sm">
              <Heading as="h3" size="md">{component.title}</Heading>
              <Paragraph size="sm" color="muted">{component.body}</Paragraph>
              <MessageBadge subtle>{LAST_UPDATED}</MessageBadge>
            </Stack>
          </Card>
        ))}
      </Grid>
    </Stack>
  )
}

function ComponentPreview({ component, config }) {
  return (
    <div className="a1-web-component-preview">
      <Stack direction="column" gap="md" align="center">
        <Icon name={config.icon} />
        <Heading as="h3" size={config.size === 'lg' ? 'lg' : 'md'}>{config.label || component.title}</Heading>
        <Paragraph size="sm" color="muted">
          {component.body}
        </Paragraph>
        <Button variant={config.variant} size={config.size === 'compact' ? 'sm' : 'md'} icon={config.showIcon ? config.icon : undefined}>
          {config.label || component.title}
        </Button>
      </Stack>
    </div>
  )
}

function ConfigureAside({ config, setConfig }) {
  return (
    <Stack gap="md">
      <Heading as="h2" size="sm">Configure</Heading>
      <TextField
        label="Label"
        size="compact"
        value={config.label}
        onChange={(event) => setConfig((current) => ({ ...current, label: event.target.value }))}
      />
      <SelectField
        label="Icon"
        size="compact"
        value={config.icon}
        onChange={(event) => setConfig((current) => ({ ...current, icon: event.target.value }))}
      >
        {ICON_OPTIONS.map((icon) => (
          <option key={icon} value={icon}>{icon}</option>
        ))}
      </SelectField>
      <SelectField
        label="Size"
        size="compact"
        value={config.size}
        onChange={(event) => setConfig((current) => ({ ...current, size: event.target.value }))}
      >
        <option value="compact">Compact</option>
        <option value="default">Default</option>
        <option value="lg">Large</option>
      </SelectField>
      <SelectField
        label="Variant"
        size="compact"
        value={config.variant}
        onChange={(event) => setConfig((current) => ({ ...current, variant: event.target.value }))}
      >
        <option value="primary">Primary</option>
        <option value="secondary">Secondary</option>
        <option value="tertiary">Tertiary</option>
      </SelectField>
      <Switch
        label="Show icon"
        size="compact"
        checked={config.showIcon}
        onChange={(checked) => setConfig((current) => ({ ...current, showIcon: checked }))}
      />
    </Stack>
  )
}

function RulesPanel({ component }) {
  const rules = getRulesForComponent(component)

  if (rules.length === 0) {
    return (
      <div className="a1-web-components-placeholder">
        <Heading as="h3" size="md">Rules are not documented yet</Heading>
        <Paragraph size="sm" color="muted">
          No matching YAML rule file exists for {component.title}. Add a rule file in `system/rules` to populate this tab.
        </Paragraph>
      </div>
    )
  }

  return (
    <Stack gap="md">
      {rules.map((rule) => (
        <Card key={rule.id}>
          <Stack direction="column" gap="sm">
            <MessageBadge subtle>{rule.file}</MessageBadge>
            <Heading as="h3" size="md">{rule.title || rule.id}</Heading>
            <Paragraph size="sm" color="muted">{rule.requirement || rule.description}</Paragraph>
          </Stack>
        </Card>
      ))}
    </Stack>
  )
}

function CodeSnippets({ component }) {
  const [packageTab, setPackageTab] = useState('react')
  const reactName = component.title.replace(/\s+/g, '')

  const snippets = {
    react: `<${reactName}>${component.title}</${reactName}>`,
    native: `<${reactName}>${component.title}</${reactName}>`,
    pure: `<div class="a1-${component.id}">${component.title}</div>`,
  }

  return (
    <Tabs value={packageTab} onChange={setPackageTab} variant="line">
      <TabList>
        <Tab value="react">React</Tab>
        <Tab value="native">Native</Tab>
        <Tab value="pure">Pure</Tab>
      </TabList>
      {Object.entries(snippets).map(([key, snippet]) => (
        <TabPanel key={key} value={key}>
          <pre className="a1-web-code-block"><code>{snippet}</code></pre>
        </TabPanel>
      ))}
    </Tabs>
  )
}

function ComponentDetailPage({ component, category, activePage, onNavigate, search, setSearch }) {
  const [tab, setTab] = useState('overview')
  const [config, setConfig] = useState({
    label: component.title,
    icon: category.icon,
    size: 'default',
    variant: 'primary',
    showIcon: true,
  })

  return (
    <ComponentDocsShell
      aside={tab === 'configure' ? <ConfigureAside config={config} setConfig={setConfig} /> : null}
    >
      <Tabs value={tab} onChange={setTab} variant="line">
          <TabList>
            <Tab value="overview">Overview</Tab>
            <Tab value="anatomy">Anatomy</Tab>
            <Tab value="rules">Rules</Tab>
            <Tab value="configure">Configure</Tab>
            <Tab value="code">Code snippet</Tab>
            <Tab value="properties">Properties</Tab>
            <Tab value="accessibility">Accessibility</Tab>
          </TabList>

          <TabPanel value="overview">
            <Stack gap="md">
              <Heading as="h3" size="md">Basic function</Heading>
              <Paragraph color="muted">{component.body}</Paragraph>
              <Paragraph size="sm" color="muted">
                Last updated {LAST_UPDATED}. This page is ready for examples, package-specific API notes, and production usage guidance.
              </Paragraph>
            </Stack>
          </TabPanel>

          <TabPanel value="anatomy">
            <Grid columns={{ xs: 1, md: 3 }} gap="md">
              {['Container', 'Content', 'Interactive states'].map((part) => (
                <Card key={part}>
                  <Stack direction="column" gap="sm">
                    <Heading as="h3" size="md">{part}</Heading>
                    <Paragraph size="sm" color="muted">
                      Placeholder anatomy notes for {component.title}. Add sizing, element labels, and pointer callouts here.
                    </Paragraph>
                  </Stack>
                </Card>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value="rules">
            <RulesPanel component={component} />
          </TabPanel>

          <TabPanel value="configure">
            <Stack gap="md">
              <Heading as="h3" size="md">Configurable preview</Heading>
              <ComponentPreview component={component} config={config} />
            </Stack>
          </TabPanel>

          <TabPanel value="code">
            <CodeSnippets component={component} />
          </TabPanel>

          <TabPanel value="properties">
            <DataTable
              caption={`${component.title} properties`}
              density="compact"
              columns={[
                { key: 'name', label: 'Property', sortable: true },
                { key: 'type', label: 'Type' },
                { key: 'description', label: 'Description' },
              ]}
              rows={[
                { id: 'children', name: 'children', type: 'ReactNode', description: 'Visible content or composed child elements.' },
                { id: 'className', name: 'className', type: 'string', description: 'Additional CSS class names for local layout hooks.' },
                { id: 'size', name: 'size', type: 'option', description: 'Component density or scale when supported.' },
                { id: 'icon', name: 'icon', type: 'Material Symbol', description: 'Optional icon name when the component supports icons.' },
              ]}
            />
          </TabPanel>

          <TabPanel value="accessibility">
            <div className="a1-web-components-placeholder">
              <Heading as="h3" size="md">Accessibility report</Heading>
              <Paragraph size="sm" color="muted">
                Future area for automated accessibility results, manual checks, keyboard behavior, and screen reader notes.
              </Paragraph>
            </div>
          </TabPanel>
        </Tabs>
    </ComponentDocsShell>
  )
}

export function Components({ activePage = 'components', onNavigate, search, setSearch }) {
  const { category, component } = getComponentEntry(activePage)
  const breadcrumbItems = getBreadcrumbItems({ category, component }, onNavigate)
  const currentComponent = component
    ? allComponents.find((item) => item.id === component.id) ?? component
    : null

  const overviewStats = useMemo(() => ([
    { label: 'Components', value: allComponents.length },
    { label: 'Categories', value: componentCategories.length },
    { label: 'Rule files', value: ruleSourceFiles.length },
  ]), [])

  return (
    <>
      <Section padding="sm" surface="panel" gradient="accent" gradientPosition="top-right" contentWidth="xl">
        <Stack direction="column" gap="sm">
          <Breadcrumb items={breadcrumbItems} />
          <Heading as="h1" id="components-heading" type="display" size={{ xs: 'xl', md: 'xxl' }} textWrap="balance">
            {component?.title ?? category?.title ?? 'Components'}
          </Heading>
          <Paragraph size="lg" color="muted">
            {component?.body ?? category?.body ?? 'Browse A1 components by category, package support, implementation rules, and configurable examples.'}
          </Paragraph>
          {currentComponent && (
            <PackageBadges packages={PACKAGE_COVERAGE[currentComponent.id] ?? ['React']} />
          )}
        </Stack>
      </Section>

      {currentComponent ? (
        <ComponentDetailPage
          component={currentComponent}
          category={category}
          activePage={activePage}
          onNavigate={onNavigate}
          search={search}
          setSearch={setSearch}
        />
      ) : (
        <ComponentDocsShell>
          {category && (
            <CategoryPage category={category} onNavigate={onNavigate} />
          )}

          {!category && (
            <Stack gap="lg">
              <Grid columns={{ xs: 1, sm: 3 }} gap="md">
                {overviewStats.map((stat) => (
                  <Card key={stat.label}>
                    <Stack direction="column" gap="xs">
                      <Heading as="h2" size="lg">{stat.value}</Heading>
                      <Paragraph size="sm" color="muted">{stat.label}</Paragraph>
                    </Stack>
                  </Card>
                ))}
              </Grid>
              <Stack direction="column" gap="sm">
                <Heading as="h2" type="display" size={{ xs: 'lg', md: 'xl' }}>
                  Component inventory
                </Heading>
                <Paragraph size="sm" color="muted" className="a1-web-section-body">
                  Full list of documented components, route targets, update dates, and package availability.
                </Paragraph>
              </Stack>
              <OverviewTable onNavigate={onNavigate} />
            </Stack>
          )}
        </ComponentDocsShell>
      )}
    </>
  )
}

export function getComponentsSidebar({ activePage, onNavigate, search, setSearch }) {
  return (
    <SideNav>
      <TextField
        label="Search components"
        size="compact"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <ComponentTree activePage={activePage} onNavigate={onNavigate} search={search} />
    </SideNav>
  )
}
