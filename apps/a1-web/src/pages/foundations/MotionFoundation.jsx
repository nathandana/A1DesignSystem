import {
  Button,
  Card,
  DataTable,
  Grid,
  Heading,
  MessageBadge,
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
import { PageTitleArea } from '../PageTitleArea.jsx'
import { getFoundationBreadcrumbItems } from './utils.js'

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

const durationExamples = [
  { name: 'quick', description: 'Small state changes' },
  { name: 'normal', description: 'Standard UI transitions' },
  { name: 'slow', description: 'Panel movement' },
  { name: 'slowest', description: 'Large transitions' },
]

const easingExamples = [
  { name: 'linear', description: 'Constant speed' },
  { name: 'standard', description: 'Default UI feel' },
  { name: 'enter', description: 'Arriving elements' },
  { name: 'exit', description: 'Leaving elements' },
  { name: 'expressive', description: 'Rare delight moments' },
  { name: 'sharp', description: 'Decisive movement' },
]

function MotionTrack({ label, description, duration = 'slowest', easing = 'standard' }) {
  const [replayKey, setReplayKey] = useState(0)
  const durationValue = tokens.semantic.motion.duration[duration] ?? tokens.semantic.motion.duration.slowest
  const easingValue = tokens.semantic.motion.easing[easing] ?? tokens.semantic.motion.easing.standard

  return (
    <Card>
      <Stack gap="sm">
        <Stack direction="row" gap="xs" align="center" justify="between" wrap>
          <Stack gap="3xs">
            <Heading as="h3" size="xs">{label}</Heading>
            <Paragraph size="xs" color="muted">{description}</Paragraph>
          </Stack>
          <Stack direction="row" gap="xs" align="center" wrap>
            <MessageBadge size="sm" subtle>{duration} · {easing}</MessageBadge>
            <Button variant="secondary" size="sm" icon="replay" onClick={() => setReplayKey((value) => value + 1)}>
              Replay
            </Button>
          </Stack>
        </Stack>
        <div
          className="a1-web-motion-track"
          style={{
            '--a1-web-motion-demo-duration': durationValue,
            '--a1-web-motion-demo-easing': easingValue,
          }}
          aria-hidden="true"
        >
          <span key={`${replayKey}-${label}-${duration}-${easing}`} className="a1-web-motion-dot" />
        </div>
        <Paragraph size="xs" color="muted">
          <TokenCode>{`--semantic-motion-duration-${duration}`}</TokenCode>{' '}
          <TokenCode>{`--semantic-motion-easing-${easing}`}</TokenCode>
        </Paragraph>
      </Stack>
    </Card>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MotionFoundationPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('duration')

  return (
    <>
      <style>{`
        .a1-web-motion-track {
          overflow: hidden;
          padding: var(--base-spacing-4);
          border: var(--component-card-border-width) solid var(--semantic-color-border-subtle);
          border-radius: var(--base-radius-pill);
          background: var(--semantic-color-surface-raised);
        }

        .a1-web-motion-dot {
          display: block;
          inline-size: var(--base-spacing-24);
          block-size: var(--base-spacing-24);
          border-radius: var(--base-radius-pill);
          background: var(--semantic-color-action-background);
          animation: a1-web-motion-slide var(--a1-web-motion-demo-duration) var(--a1-web-motion-demo-easing) both;
        }

        @keyframes a1-web-motion-slide {
          from { transform: translateX(0); }
          to { transform: translateX(var(--base-spacing-192)); }
        }

        @media (prefers-reduced-motion: reduce) {
          .a1-web-motion-dot {
            animation-duration: var(--semantic-motion-duration-instant);
          }
        }

        html.a1-reduce-motion .a1-web-motion-dot {
          animation-duration: var(--semantic-motion-duration-instant);
        }
      `}</style>
      <PageTitleArea
        headingId="motion-heading"
        breadcrumbItems={getFoundationBreadcrumbItems('Motion', onNavigate)}
        title="Motion"
        description="Duration, easing, and reduced-motion behavior. Every transition in the system uses a semantic motion token — no hardcoded milliseconds or cubic-bezier strings in component CSS."
      />

      <Section padding="sm" contentWidth="xl" aria-labelledby="motion-token-heading">
        <Stack gap="lg">
          <Tabs value={activeTab} onChange={setActiveTab} variant="line">
            <TabList>
              <Tab value="duration" icon="timer">Duration</Tab>
              <Tab value="easing" icon="animation">Easing</Tab>
              <Tab value="examples" icon="play_circle">Examples</Tab>
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

            <TabPanel value="examples">
              <Stack gap="lg">
                <Stack direction="column" gap="xs">
                  <Stack gap="xs">
                    <Heading as="h2" id="motion-examples-heading" size={{ xs: 'lg', md: 'xl' }}>
                      Motion examples
                    </Heading>
                    <Paragraph size="sm" color="muted">
                      Replay tokenized motion to compare timing and easing. These demos use semantic motion tokens; OS or app reduced-motion settings collapse the animations to instant movement.
                    </Paragraph>
                  </Stack>
                </Stack>

                <Grid columns={{ xs: 1, md: 2, xl: 4 }} gap="md">
                  {durationExamples.map((example) => (
                    <MotionTrack
                      key={example.name}
                      label={example.name}
                      description={example.description}
                      duration={example.name}
                      easing="standard"
                    />
                  ))}
                </Grid>

                <Grid columns={{ xs: 1, md: 2, xl: 3 }} gap="md">
                  {easingExamples.map((example) => (
                    <MotionTrack
                      key={example.name}
                      label={example.name}
                      description={example.description}
                      duration="slowest"
                      easing={example.name}
                    />
                  ))}
                </Grid>
              </Stack>
            </TabPanel>
          </Tabs>
        </Stack>
      </Section>
    </>
  )
}
