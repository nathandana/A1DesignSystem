import {
  Card,
  Cluster,
  Code,
  Grid,
  Heading,
  Icon,
  IconButton,
  Link,
  PageLayout,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { Choice, FieldState } from './configKit.jsx'

export const bareDisplay = true

const PLACEMENT_OPTIONS = [
  { value: 'start', label: 'Start', icon: 'align_horizontal_left' },
  { value: 'end', label: 'End', icon: 'align_horizontal_right' },
]

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', active: true },
  { icon: 'folder', label: 'Projects' },
  { icon: 'groups', label: 'Team' },
  { icon: 'insights', label: 'Analytics' },
  { icon: 'settings', label: 'Settings' },
]

const STATS = [
  { label: 'Active projects', value: '12' },
  { label: 'Open tasks', value: '48' },
  { label: 'Team members', value: '9' },
]

// Light, token-only styling so each slot reads like a real page region.
const barStyle = (side) => ({
  padding: 'var(--base-spacing-12) var(--base-spacing-16)',
  background: 'var(--semantic-color-surface-panel)',
  [side]: 'var(--component-divider-size-sm) solid var(--semantic-color-border-subtle)',
})

function HeaderSlot() {
  return (
    <div style={barStyle('borderBlockEnd')}>
      <Stack direction="row" align="center" justify="between">
        <Cluster gap="xs" align="center">
          <Icon name="deployed_code" color="accent" />
          <Heading as="span" size="sm">Acme</Heading>
        </Cluster>
        <Cluster gap="md" align="center">
          <Link href="#">Dashboard</Link>
          <Link href="#">Projects</Link>
          <Link href="#">Team</Link>
          <IconButton icon="account_circle" label="Account" variant="tertiary" size="sm" />
        </Cluster>
      </Stack>
    </div>
  )
}

function SidebarSlot() {
  return (
    <nav aria-label="Primary" style={{ padding: 'var(--base-spacing-12)', background: 'var(--semantic-color-surface-panel)', blockSize: '100%' }}>
      <Stack direction="column" gap="xs">
        {NAV_ITEMS.map((item) => (
          <Link key={item.label} href="#" aria-current={item.active ? 'page' : undefined}>
            <Cluster gap="xs" align="center">
              <Icon name={item.icon} size="sm" />
              {item.label}
            </Cluster>
          </Link>
        ))}
      </Stack>
    </nav>
  )
}

function AsideSlot() {
  return (
    <div style={{ padding: 'var(--base-spacing-12)', inlineSize: '12rem' }}>
      <Stack direction="column" gap="xs">
        <Heading as="p" size="xs" color="muted">On this page</Heading>
        <Link href="#">Overview</Link>
        <Link href="#">Recent activity</Link>
        <Link href="#">Team members</Link>
      </Stack>
    </div>
  )
}

function FooterSlot() {
  return (
    <div style={barStyle('borderBlockStart')}>
      <Stack direction="row" align="center" justify="between">
        <Paragraph size="sm" color="muted">© 2026 Acme Inc.</Paragraph>
        <Cluster gap="md">
          <Link href="#">Privacy</Link>
          <Link href="#">Terms</Link>
        </Cluster>
      </Stack>
    </div>
  )
}

function MainContent() {
  return (
    <Section padding="md" gap="md">
      <Stack direction="column" gap="xs">
        <Heading as="h1" size="lg">Dashboard</Heading>
        <Paragraph color="muted">Welcome back — here's what's happening across your projects.</Paragraph>
      </Stack>
      <Grid columns={3} gap="md">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <Stack direction="column" gap="xs">
              <Paragraph size="xs" color="muted">{stat.label}</Paragraph>
              <Heading as="p" size="md">{stat.value}</Heading>
            </Stack>
          </Card>
        ))}
      </Grid>
      <Card>
        <Stack direction="column" gap="xs">
          <Heading as="h2" size="sm">Recent activity</Heading>
          <Paragraph size="sm" color="muted">
            Casey closed 3 tasks · Sam opened a pull request · Jordan invited a new member.
          </Paragraph>
        </Stack>
      </Card>
    </Section>
  )
}

export function getDefaultConfig() {
  return {
    showHeader: true,
    showSidebar: true,
    showAside: false,
    showFooter: true,
    sidebarPlacement: 'start',
    asidePlacement: 'end',
    stickyHeader: false,
    viewportHeight: false,
  }
}

export function Preview({ config }) {
  return (
    // A bounded frame so the full-page layout reads as a real page without
    // taking over the viewport.
    <div
      style={{
        inlineSize: '100%',
        blockSize: 'clamp(360px, 62vh, 560px)',
        border: 'var(--component-divider-size-sm) solid var(--semantic-color-border-default)',
        borderRadius: 'var(--base-radius-lg)',
        overflow: 'hidden',
      }}
    >
      <PageLayout
        stickyHeader={config.stickyHeader}
        viewportHeight={config.viewportHeight}
        sidebarPlacement={config.sidebarPlacement}
        asidePlacement={config.asidePlacement}
        header={config.showHeader ? <HeaderSlot /> : undefined}
        sidebar={config.showSidebar ? <SidebarSlot /> : undefined}
        aside={config.showAside ? <AsideSlot /> : undefined}
        footer={config.showFooter ? <FooterSlot /> : undefined}
      >
        <MainContent />
      </PageLayout>
    </div>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <FieldState
        label="Slots"
        items={[
          { key: 'showHeader', label: 'Header', icon: 'web_asset', value: config.showHeader },
          { key: 'showSidebar', label: 'Sidebar', icon: 'dock_to_right', value: config.showSidebar },
          { key: 'showAside', label: 'Aside', icon: 'view_sidebar', value: config.showAside },
          { key: 'showFooter', label: 'Footer', icon: 'horizontal_rule', value: config.showFooter },
        ]}
        onChange={set}
      />
      {config.showSidebar && (
        <Choice prop="sidebarPlacement"
          label="Sidebar placement"
          iconOnly
          value={config.sidebarPlacement}
          onChange={(sidebarPlacement) => set({ sidebarPlacement })}
          options={PLACEMENT_OPTIONS}
        />
      )}
      {config.showAside && (
        <Choice prop="asidePlacement"
          label="Aside placement"
          iconOnly
          value={config.asidePlacement}
          onChange={(asidePlacement) => set({ asidePlacement })}
          options={PLACEMENT_OPTIONS}
        />
      )}
      <FieldState
        label="Behavior"
        items={[
          { key: 'stickyHeader', label: 'Sticky header', icon: 'push_pin', value: config.stickyHeader },
          { key: 'viewportHeight', label: 'Viewport height', icon: 'height', value: config.viewportHeight },
        ]}
        onChange={set}
      />
    </Stack>
  )
}

function buildPageLayoutSnippet(config) {
  const props = [
    config.stickyHeader ? '  stickyHeader' : null,
    config.viewportHeight ? '  viewportHeight' : null,
    config.showSidebar && config.sidebarPlacement !== 'start' ? `  sidebarPlacement="${config.sidebarPlacement}"` : null,
    config.showAside && config.asidePlacement !== 'end' ? `  asidePlacement="${config.asidePlacement}"` : null,
    config.showHeader ? '  header={<TopHeader … />}' : null,
    config.showSidebar ? '  sidebar={<SideNav … />}' : null,
    config.showAside ? '  aside={<nav aria-label="On this page">…</nav>}' : null,
    config.showFooter ? '  footer={<footer>…</footer>}' : null,
  ].filter(Boolean).join('\n')

  return `<PageLayout\n${props}\n>\n  <Section padding="md">{/* main content */}</Section>\n</PageLayout>`
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildPageLayoutSnippet(config)}</Code>
}
