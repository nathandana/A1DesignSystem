import {
  Card,
  Code,
  Heading,
  MessageBadge,
  Paragraph,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { Toggle } from './Toggle.jsx'

export const bareDisplay = true

function buildPageLayoutSnippet(config) {
  const stickyStr = config.stickyHeader ? '\n  stickyHeader' : ''
  const vhStr = config.viewportHeight ? '\n  viewportHeight' : ''
  return `<PageLayout${stickyStr}${vhStr}
  header={<TopHeader … />}
  sidebar={<SideNav … />}
  footer={<footer>…</footer>}
>
  {/* main content */}
</PageLayout>`
}

export function getDefaultConfig() {
  return {
    stickyHeader: false,
    viewportHeight: false,
  }
}

export function Preview({ config }) {
  return (
    <Stack direction="column" gap="xs" style={{ width: '100%' }}>
      <Card>
        <Stack direction="row" gap="xs" align="center">
          <MessageBadge subtle icon="web_asset">Header</MessageBadge>
          {config.stickyHeader && (
            <MessageBadge status="info" subtle size="sm">Sticky</MessageBadge>
          )}
        </Stack>
      </Card>
      <Stack direction="row" gap="xs" style={{ width: '100%' }}>
        <Card style={{ flexShrink: 0 }}>
          <MessageBadge subtle icon="menu">Sidebar</MessageBadge>
        </Card>
        <Card style={{ flex: 1 }}>
          <Stack direction="column" gap="xs">
            <Heading as="p" size="xs">Main content</Heading>
            <Paragraph size="sm" color="muted">
              Children render here. Use Section as the first direct child.
            </Paragraph>
          </Stack>
        </Card>
      </Stack>
      <Card>
        <MessageBadge subtle icon="horizontal_rule">Footer</MessageBadge>
      </Card>
    </Stack>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <Toggle
        label="Sticky header"
        hint="Keeps the header slot fixed at the top as content scrolls."
        value={config.stickyHeader}
        onChange={(stickyHeader) => set({ stickyHeader })}
      />
      <Toggle
        label="Viewport height"
        hint="Constrains the layout to 100vh so the sidebar and main area scroll independently."
        value={config.viewportHeight}
        onChange={(viewportHeight) => set({ viewportHeight })}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildPageLayoutSnippet(config)}</Code>
}
