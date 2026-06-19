import { useState } from 'react'
import {
  Breadcrumb,
  Code,
  Divider,
  Grid,
  GridItem,
  Heading,
  Icon,
  PageNav,
  Paragraph,
  Section,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@gtivr4/a1-design-system-react'
import todoMarkdown from '../../../../TODO.md?raw'

// Strip inline markdown emphasis / code markers for plain display.
function clean(text) {
  return text.replace(/\*\*/g, '').replace(/`/g, '').trim()
}

function slug(text) {
  return clean(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// Collapse wrapped continuation lines (indented, not a new marker) into the line
// they continue, so each list item / paragraph renders as one logical line.
function toLogicalLines(md) {
  const lines = []
  for (const raw of md.replace(/\r/g, '').split('\n')) {
    const trimmed = raw.trim()
    const isContinuation =
      /^\s+/.test(raw) && trimmed !== '' &&
      !trimmed.startsWith('- ') && !trimmed.startsWith('#') && !trimmed.startsWith('>')
    if (isContinuation && lines.length) lines[lines.length - 1] += ` ${trimmed}`
    else lines.push(trimmed)
  }
  return lines
}

// Render a non-heading logical line (headings are handled by the bucketer so they
// can carry anchor ids for the PageNav).
function renderLine(line, key) {
  if (line === '') return null
  if (line === '---') return <Divider key={key} space="sm" />
  if (line.startsWith('> ')) return <Paragraph key={key} size="sm" color="muted">{clean(line.slice(2))}</Paragraph>
  if (line.startsWith('- [ ] ') || line.startsWith('- [x] ')) {
    const done = line.startsWith('- [x] ')
    return (
      <Stack key={key} direction="row" gap="xs" align="start">
        <Icon name={done ? 'check_box' : 'check_box_outline_blank'} color={done ? 'success' : undefined} />
        <Paragraph size="sm" color={done ? 'muted' : undefined}>{clean(line.slice(6))}</Paragraph>
      </Stack>
    )
  }
  if (line.startsWith('- ')) {
    return (
      <Stack key={key} direction="row" gap="xs" align="start">
        <Icon name="chevron_right" color="muted" />
        <Paragraph size="sm">{clean(line.slice(2))}</Paragraph>
      </Stack>
    )
  }
  return <Paragraph key={key} size="sm">{clean(line)}</Paragraph>
}

// Split the TODO into Overview (intro + inbox) / Current (the P-bands) / Roadmap
// (larger themes), each with its own nodes + PageNav sections.
function buildTabs(md) {
  const buckets = { overview: [], current: [], roadmap: [] }
  const sections = { current: [], roadmap: [] }
  let phase = 'overview'

  toLogicalLines(md).forEach((line, i) => {
    if (line.startsWith('# ')) return // page title — shown in the header
    if (line.startsWith('## ')) {
      const text = clean(line.slice(3))
      if (/^roadmap/i.test(text)) phase = 'roadmap'
      else if (/^p[0-3]\b/i.test(text)) phase = 'current'
      const id = `todo-${slug(text)}`
      if (phase === 'current') sections.current.push({ id, label: text, level: 1 })
      buckets[phase].push(<Heading key={i} as="h2" id={id} size="lg">{text}</Heading>)
      return
    }
    if (line.startsWith('### ')) {
      const text = clean(line.slice(4))
      const id = `todo-${slug(text)}`
      if (phase === 'roadmap') sections.roadmap.push({ id, label: text, level: 1 })
      buckets[phase].push(<Heading key={i} as="h3" id={id} size="sm" color="muted">{text}</Heading>)
      return
    }
    const node = renderLine(line, i)
    if (node) buckets[phase].push(node)
  })

  return { buckets, sections }
}

function NavLayout({ sections, children }) {
  if (!sections.length) return <Stack gap="xs">{children}</Stack>
  return (
    <Grid columns={{ xs: 1, lg: 4 }} gap="lg">
      <GridItem span={{ xs: 1, lg: 3 }}>
        <Stack gap="xs">{children}</Stack>
      </GridItem>
      <GridItem span={{ xs: 1, lg: 1 }}>
        <PageNav sections={sections} />
      </GridItem>
    </Grid>
  )
}

export function TodoPage({ onNavigate }) {
  const [tab, setTab] = useState('current')
  const { buckets, sections } = buildTabs(todoMarkdown)

  return (
    <>
      <Section padding="xs" contentWidth="xl" surface="panel" borderSize="sm" borderVariant="accent" borderSides="bottom">
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
              { label: 'TODO' },
            ]}
          />
          <Heading as="h1" id="todo-heading" size={{ xs: 'lg', md: 'xxl' }}>
            TODO
          </Heading>
          <Paragraph size="sm" color="muted">
            The living A1 backlog, rendered from <Code variant="inline">TODO.md</Code> — priority
            bands P0–P3 plus a roadmap of larger themes.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" aria-label="Backlog">
        <Tabs value={tab} onChange={setTab}>
          <TabList>
            <Tab value="overview">Overview</Tab>
            <Tab value="current">Current</Tab>
            <Tab value="roadmap">Roadmap</Tab>
          </TabList>
          <TabPanel value="overview">
            <Stack gap="xs">{buckets.overview}</Stack>
          </TabPanel>
          <TabPanel value="current">
            <NavLayout sections={sections.current}>{buckets.current}</NavLayout>
          </TabPanel>
          <TabPanel value="roadmap">
            <NavLayout sections={sections.roadmap}>{buckets.roadmap}</NavLayout>
          </TabPanel>
        </Tabs>
      </Section>
    </>
  )
}
