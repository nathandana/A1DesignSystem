import { useState } from 'react'
import {
  Breadcrumb,
  Code,
  Divider,
  Grid,
  GridItem,
  Heading,
  Icon,
  MessageBadge,
  PageNav,
  Paragraph,
  Section,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Toolbar,
  ToolbarDivider,
  ToolbarGroup,
} from '@gtivr4/a1-design-system-react'
import todoMarkdown from '../../../../TODO.md?raw'

// Badge tone per priority band.
const PRIORITY_STATUS = { P0: 'error', P1: 'warn', P2: 'info', P3: 'neutral' }
const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'P0', label: 'P0' },
  { value: 'P1', label: 'P1' },
  { value: 'P2', label: 'P2' },
  { value: 'P3', label: 'P3' },
]
const EFFORT_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
]

// Strip inline markdown emphasis / code markers for plain display.
function clean(text) {
  return text.replace(/\*\*/g, '').replace(/`/g, '').trim()
}

function slug(text) {
  return clean(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// Collapse wrapped continuation lines into the line they continue.
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

// Parse a checkbox item: `- [ ] **Title** \`P2 · M\` — description`.
function parseItem(line) {
  const done = line.startsWith('- [x] ')
  const body = line.replace(/^- \[[ x]\] /, '')
  const titleMatch = body.match(/^\*\*(.+?)\*\*/)
  const tagMatch = body.match(/`(P[0-3]) · (XS|S|M|L|XL)`/)
  let rest = body
  if (titleMatch) rest = rest.slice(titleMatch[0].length)
  if (tagMatch) rest = rest.replace(tagMatch[0], '')
  rest = clean(rest).replace(/^[—–-]\s*/, '').trim()
  return {
    done,
    title: titleMatch ? clean(titleMatch[1]) : clean(body),
    priority: tagMatch ? tagMatch[1] : null,
    effort: tagMatch ? tagMatch[2] : null,
    description: rest,
  }
}

// Render a non-heading, non-item line (overview / roadmap content).
function renderLine(line, key) {
  if (line === '') return null
  if (line === '---') return <Divider key={key} space="sm" />
  if (line.startsWith('> ')) return <Paragraph key={key} size="sm" color="muted">{clean(line.slice(2))}</Paragraph>
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

function renderItem(item, key) {
  return (
    <Stack key={key} direction="row" gap="sm" align="start">
      <Icon name={item.done ? 'check_box' : 'check_box_outline_blank'} color={item.done ? 'success' : undefined} />
      <Stack gap="xs">
        <Stack direction="row" gap="xs" align="center" wrap>
          <Paragraph size="sm" color={item.done ? 'muted' : undefined}>{item.title}</Paragraph>
          {item.priority && (
            <MessageBadge status={PRIORITY_STATUS[item.priority]} subtle size="sm">{item.priority}</MessageBadge>
          )}
          {item.effort && <MessageBadge status="neutral" subtle size="sm">{item.effort}</MessageBadge>}
        </Stack>
        {item.description && <Paragraph size="sm" color="muted">{item.description}</Paragraph>}
      </Stack>
    </Stack>
  )
}

// Split the TODO into Overview / Current (parsed groups) / Roadmap.
function buildTabs(md) {
  const overview = []
  const roadmapNodes = []
  const roadmapSections = []
  const currentGroups = []
  let phase = 'overview'
  let group = null

  toLogicalLines(md).forEach((line, i) => {
    if (line.startsWith('# ')) return
    if (line.startsWith('## ')) {
      const text = clean(line.slice(3))
      if (/^roadmap/i.test(text)) phase = 'roadmap'
      else if (/^p[0-3]\b/i.test(text)) phase = 'current'
      const id = `todo-${slug(text)}`
      if (phase === 'current') {
        group = { heading: { text, id }, items: [], emptyNote: null }
        currentGroups.push(group)
      } else if (phase === 'roadmap') {
        roadmapSections.push({ id, label: text, level: 1 })
        roadmapNodes.push(<Heading key={i} as="h2" id={id} size="lg">{text}</Heading>)
      } else {
        overview.push(<Heading key={i} as="h2" id={id} size="lg">{text}</Heading>)
      }
      return
    }
    if (line.startsWith('### ')) {
      const text = clean(line.slice(4))
      const id = `todo-${slug(text)}`
      if (phase === 'roadmap') {
        roadmapSections.push({ id, label: text, level: 2 })
        roadmapNodes.push(<Heading key={i} as="h3" id={id} size="sm" color="muted">{text}</Heading>)
      } else if (phase === 'overview') {
        overview.push(<Heading key={i} as="h3" id={id} size="sm" color="muted">{text}</Heading>)
      }
      return
    }
    if (phase === 'current' && group) {
      if (line.startsWith('- [ ] ') || line.startsWith('- [x] ')) group.items.push(parseItem(line))
      else if (line === '_None._') group.emptyNote = 'None'
      return
    }
    const node = renderLine(line, i)
    if (node) (phase === 'roadmap' ? roadmapNodes : overview).push(node)
  })

  return { overview, roadmapNodes, roadmapSections, currentGroups }
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

function CurrentTab({ groups }) {
  const [priority, setPriority] = useState('all')
  const [effort, setEffort] = useState('all')
  const filterActive = priority !== 'all' || effort !== 'all'
  const matches = (it) =>
    (priority === 'all' || it.priority === priority) && (effort === 'all' || it.effort === effort)

  const visibleGroups = groups
    .map((g) => ({ ...g, shown: g.items.filter(matches) }))
    .filter((g) => !filterActive || g.shown.length > 0)

  const sections = visibleGroups.map((g) => ({ id: g.heading.id, label: g.heading.text, level: 1 }))

  const content = (
    <Stack gap="md">
      <Toolbar label="Filter">
        <ToolbarGroup aria-label="Priority" showLabels value={priority} onChange={setPriority} options={PRIORITY_OPTIONS} />
        <ToolbarDivider />
        <ToolbarGroup aria-label="Effort" showLabels value={effort} onChange={setEffort} options={EFFORT_OPTIONS} />
      </Toolbar>
      {visibleGroups.length === 0 ? (
        <Paragraph size="sm" color="muted">No items match these filters.</Paragraph>
      ) : (
        visibleGroups.map((g) => (
          <Stack key={g.heading.id} gap="xs">
            <Heading as="h2" id={g.heading.id} size="lg">{g.heading.text}</Heading>
            {g.shown.length
              ? g.shown.map((it, i) => renderItem(it, i))
              : <Paragraph size="sm" color="muted">{g.emptyNote || 'None'}</Paragraph>}
          </Stack>
        ))
      )}
    </Stack>
  )

  return (
    <Grid columns={{ xs: 1, lg: 4 }} gap="lg">
      <GridItem span={{ xs: 1, lg: 3 }}>{content}</GridItem>
      <GridItem span={{ xs: 1, lg: 1 }}>
        <PageNav sections={sections} />
      </GridItem>
    </Grid>
  )
}

export function TodoPage({ onNavigate }) {
  const [tab, setTab] = useState('current')
  const { overview, roadmapNodes, roadmapSections, currentGroups } = buildTabs(todoMarkdown)

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
            <Stack gap="xs">{overview}</Stack>
          </TabPanel>
          <TabPanel value="current">
            <CurrentTab groups={currentGroups} />
          </TabPanel>
          <TabPanel value="roadmap">
            <NavLayout sections={roadmapSections}>{roadmapNodes}</NavLayout>
          </TabPanel>
        </Tabs>
      </Section>
    </>
  )
}
