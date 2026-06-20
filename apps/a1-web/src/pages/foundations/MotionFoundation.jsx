import {
  Breadcrumb,
  DataTable,
  Heading,
  Paragraph,
  Section,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@gtivr4/a1-design-system-react'
import { useState } from 'react'
import tokens from '../../../../../build/json/tokens.json'

function TokenCode({ children }) {
  return <code className="a1-web-token-code">{children}</code>
}

// ── Row data ──────────────────────────────────────────────────────────────────

const durationColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'token', label: 'Token', sortable: true, sortAccessor: (r) => r.tokenText },
  { key: 'value', label: 'Value' },
]

const easingColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'token', label: 'Token', sortable: true, sortAccessor: (r) => r.tokenText },
  { key: 'value', label: 'Value' },
]

const durationRows = Object.entries(tokens.semantic.motion.duration).map(([name, value]) => ({
  id: `duration-${name}`,
  name,
  token: <TokenCode>{`--semantic-motion-duration-${name}`}</TokenCode>,
  tokenText: `--semantic-motion-duration-${name}`,
  value,
}))

const easingRows = Object.entries(tokens.semantic.motion.easing).map(([name, value]) => ({
  id: `easing-${name}`,
  name,
  token: <TokenCode>{`--semantic-motion-easing-${name}`}</TokenCode>,
  tokenText: `--semantic-motion-easing-${name}`,
  value,
}))

// ── Component ─────────────────────────────────────────────────────────────────

export function MotionFoundationPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('duration')

  return (
    <>
      <Section
        padding="xs"
        contentWidth="xl"
        surface="panel"
        borderSize="sm"
        borderVariant="accent"
        borderSides="bottom"
      >
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { href: '/', label: 'Home', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
              { href: '?page=foundations', label: 'Foundations', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('foundations') } },
              { label: 'Motion' },
            ]}
          />
          <Heading as="h1" id="motion-heading" size={{ xs: 'lg', md: 'xxl' }}>
            Motion
          </Heading>
          <Paragraph size="sm" color="muted">
            Duration, easing, and reduced-motion behavior. Every transition in the system uses a semantic motion token — no hardcoded milliseconds or cubic-bezier strings in component CSS.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" aria-labelledby="motion-token-heading">
        <Stack gap="lg">

          <Tabs value={activeTab} onChange={setActiveTab} variant="line">
            <TabList>
              <Tab value="duration" icon="timer">Duration</Tab>
              <Tab value="easing" icon="animation">Easing</Tab>
            </TabList>

            <TabPanel value="duration">
              <DataTable
                columns={durationColumns}
                rows={durationRows}
                getRowId={(r) => r.id}
                size="default"
                scrollable
                caption="Semantic motion duration tokens"
              />
            </TabPanel>

            <TabPanel value="easing">
              <DataTable
                columns={easingColumns}
                rows={easingRows}
                getRowId={(r) => r.id}
                size="default"
                scrollable
                caption="Semantic motion easing tokens"
              />
            </TabPanel>
          </Tabs>
        </Stack>
      </Section>
    </>
  )
}
