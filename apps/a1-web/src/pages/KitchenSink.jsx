import { useState } from 'react'
import {
  Accordion,
  Autocomplete,
  Banner,
  Breadcrumb,
  Button,
  ButtonContainer,
  Card,
  CheckboxGroup,
  ChoiceGroup,
  CircularProgress,
  Code,
  DataTable,
  DateField,
  DefinitionList,
  Dialog,
  Divider,
  Figure,
  Grid,
  Heading,
  Icon,
  IconButton,
  Link,
  List,
  ListItem,
  MessageBadge,
  MessageEmptyState,
  NumberField,
  Notification,
  Pagination,
  Paragraph,
  RadioGroup,
  SearchField,
  Section,
  SegmentedControl,
  SelectField,
  Slider,
  Snackbar,
  Stack,
  StatusBar,
  StepTracker,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  TextareaField,
} from '@gtivr4/a1-design-system-react'
import { PageTitleArea } from './PageTitleArea.jsx'

// One labelled subsection on the sticker sheet — a heading, optional note, and
// the live examples below it. Keeps every category visually consistent.
function Sample({ title, note, children }) {
  return (
    <Stack gap="sm">
      <Stack gap="3xs">
        <Heading as="h3" size="sm">{title}</Heading>
        {note ? <Paragraph size="sm" color="muted">{note}</Paragraph> : null}
      </Stack>
      {children}
    </Stack>
  )
}

// A whole category band: a heading rule and the samples grid beneath it.
function Category({ id, title, description, children }) {
  return (
    <Section padding="md" contentWidth="xl" id={id}>
      <Stack gap="lg">
        <Stack gap="3xs">
          <Heading as="h2" size="lg">{title}</Heading>
          {description ? <Paragraph color="muted">{description}</Paragraph> : null}
          <Divider variant="subtle" space="xs" />
        </Stack>
        {children}
      </Stack>
    </Section>
  )
}

const STATUSES = ['neutral', 'info', 'success', 'warn', 'error']

const SELECT_OPTIONS = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'product', label: 'Product' },
]

const PLAN_OPTIONS = [
  { value: 'starter', label: 'Starter', subtext: 'For individuals' },
  { value: 'team', label: 'Team', subtext: 'For small teams' },
  { value: 'enterprise', label: 'Enterprise', subtext: 'For organisations' },
]

const CHANNEL_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'push', label: 'Push' },
]

const CHOICE_OPTIONS = [
  { value: 'card', label: 'Card', subtext: 'Visa, Mastercard', icon: 'credit_card' },
  { value: 'bank', label: 'Bank transfer', subtext: '2–3 business days', icon: 'account_balance' },
  { value: 'wallet', label: 'Digital wallet', subtext: 'Apple or Google Pay', icon: 'wallet' },
]

const TABLE_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status', type: 'badge', statusMap: { Active: 'success', 'On leave': 'warn', Inactive: 'neutral' } },
]

const TABLE_ROWS = [
  { name: 'Aria Chen', role: 'Product designer', status: 'Active' },
  { name: 'Marcus Webb', role: 'Engineering lead', status: 'Active' },
  { name: 'Priya Nair', role: 'Data analyst', status: 'On leave' },
  { name: 'Devon Park', role: 'Frontend engineer', status: 'Inactive' },
]

export function KitchenSink({ onNavigate }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [segment, setSegment] = useState('week')
  const [tab, setTab] = useState('overview')
  const [page, setPage] = useState(2)
  const [slider, setSlider] = useState(60)
  const [notify, setNotify] = useState(true)

  return (
    <>
      <PageTitleArea
        breadcrumbItems={[
          { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
          { label: 'Components', href: '/components', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('components') } },
          { label: 'Kitchen sink' },
        ]}
        title="Kitchen sink"
        titleAccessory={<MessageBadge status="info">Preview</MessageBadge>}
        description="A single page that previews as many A1 components as possible. Switch themes and resize the window to scan the whole system at a glance."
        actions={(
          <ButtonContainer>
            <Button variant="secondary" icon="widgets" onClick={() => onNavigate?.('components')}>Browse components</Button>
          </ButtonContainer>
        )}
      />

      {/* ── Typography ──────────────────────────────────────────────────── */}
      <Category id="kitchen-sink-typography" title="Typography" description="Headings, body text, lists, links, inline code, and dividers.">
        <Grid columns={{ xs: 1, lg: 2 }} gap="lg">
          <Sample title="Headings">
            <Stack gap="xs">
              <Heading as="h1" size="xl">Heading extra large</Heading>
              <Heading as="h2" size="lg">Heading large</Heading>
              <Heading as="h3" size="md">Heading medium</Heading>
              <Heading as="h4" size="sm">Heading small</Heading>
            </Stack>
          </Sample>
          <Sample title="Body, links, and code">
            <Stack gap="sm">
              <Paragraph>
                A paragraph of body text with an inline <Link href="/" onClick={(e) => e?.preventDefault?.()}>link</Link> and
                an inline <Code>token</Code> reference.
              </Paragraph>
              <List>
                <ListItem>First list item</ListItem>
                <ListItem>Second list item</ListItem>
                <ListItem>Third list item</ListItem>
              </List>
              <Divider />
              <Code variant="block" copyCode>{`<Button variant="primary">Save</Button>`}</Code>
            </Stack>
          </Sample>
        </Grid>
      </Category>

      {/* ── Actions ─────────────────────────────────────────────────────── */}
      <Category id="kitchen-sink-actions" title="Actions and controls" description="Buttons, icon buttons, switches, sliders, segmented controls, tabs, and accordions.">
        <Grid columns={{ xs: 1, lg: 2 }} gap="lg">
          <Sample title="Buttons">
            <Stack direction="row" gap="sm" wrap>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary" icon="edit">Edit profile</Button>
              <Button variant="destructive">Delete</Button>
              <Button variant="primary" loading>Saving…</Button>
            </Stack>
          </Sample>
          <Sample title="Icon buttons">
            <Stack direction="row" gap="sm" wrap>
              <IconButton icon="favorite" label="Favourite" />
              <IconButton icon="share" label="Share" variant="secondary" />
              <IconButton icon="more_vert" label="More options" variant="tertiary" />
              <IconButton icon="delete" label="Delete" variant="destructive" />
            </Stack>
          </Sample>
          <Sample title="Switch and slider">
            <Stack gap="md">
              <Switch label="Enable notifications" checked={notify} onChange={setNotify} />
              <Slider label="Opacity" value={slider} onChange={setSlider} />
            </Stack>
          </Sample>
          <Sample title="Segmented control">
            <SegmentedControl
              aria-label="Date range"
              value={segment}
              onChange={setSegment}
              options={['Day', 'Week', 'Month', 'Year'].map((s) => ({ value: s.toLowerCase(), label: s }))}
            />
          </Sample>
        </Grid>

        <Sample title="Tabs">
          <Tabs value={tab} onChange={setTab} variant="line">
            <TabList>
              <Tab value="overview">Overview</Tab>
              <Tab value="activity">Activity</Tab>
              <Tab value="settings">Settings</Tab>
            </TabList>
            <TabPanel value="overview"><Paragraph>Overview panel content.</Paragraph></TabPanel>
            <TabPanel value="activity"><Paragraph>Activity panel content.</Paragraph></TabPanel>
            <TabPanel value="settings"><Paragraph>Settings panel content.</Paragraph></TabPanel>
          </Tabs>
        </Sample>

        <Sample title="Accordion">
          <Stack gap="3xs">
            <Accordion label="Shipping" subtext="Free over $50" divider>
              <Paragraph size="sm">Standard delivery in 3–5 business days.</Paragraph>
            </Accordion>
            <Accordion label="Returns" subtext="30 days">
              <Paragraph size="sm">Return any item within 30 days for a full refund.</Paragraph>
            </Accordion>
          </Stack>
        </Sample>
      </Category>

      {/* ── Inputs ──────────────────────────────────────────────────────── */}
      <Category id="kitchen-sink-inputs" title="Inputs" description="Text fields, selects, autocomplete, and grouped choices.">
        <Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="lg">
          <Sample title="Text fields">
            <Stack gap="sm">
              <TextField label="Full name" autoComplete="name" />
              <SearchField aria-label="Search" />
              <NumberField label="Quantity" defaultValue="1" />
              <DateField label="Start date" />
            </Stack>
          </Sample>
          <Sample title="Select and autocomplete">
            <Stack gap="sm">
              <SelectField label="Department" options={SELECT_OPTIONS} />
              <Autocomplete label="Assignee" options={['Aria Chen', 'Marcus Webb', 'Priya Nair']} />
              <TextareaField label="Notes" />
            </Stack>
          </Sample>
          <Sample title="Radio, checkbox, choice">
            <Stack gap="md">
              <RadioGroup label="Subscription plan" defaultValue="team" options={PLAN_OPTIONS} />
              <CheckboxGroup label="Notification channels" defaultValue={['email']} options={CHANNEL_OPTIONS} />
            </Stack>
          </Sample>
        </Grid>
        <Sample title="Choice group">
          <ChoiceGroup label="Payment method" defaultValue="card" columns={{ xs: 1, sm: 3 }} options={CHOICE_OPTIONS} />
        </Sample>
      </Category>

      {/* ── Feedback ────────────────────────────────────────────────────── */}
      <Category id="kitchen-sink-feedback" title="Feedback and messaging" description="Banners, badges, notifications, progress, step trackers, empty states, and overlays.">
        <Sample title="Banners">
          <Stack gap="sm">
            {STATUSES.map((status) => (
              <Banner key={status} variant="inline" status={status} title={`${status[0].toUpperCase()}${status.slice(1)} banner`}>
                A short message describing the {status} state.
              </Banner>
            ))}
          </Stack>
        </Sample>

        <Grid columns={{ xs: 1, lg: 2 }} gap="lg">
          <Sample title="Badges">
            <Stack direction="row" gap="sm" wrap>
              {STATUSES.map((status) => (
                <MessageBadge key={status} status={status}>
                  {`${status[0].toUpperCase()}${status.slice(1)}`}
                </MessageBadge>
              ))}
            </Stack>
          </Sample>
          <Sample title="Notifications">
            <Stack direction="row" gap="md" wrap>
              <Notification count={3}><IconButton icon="notifications" label="Notifications" variant="secondary" /></Notification>
              <Notification dot><IconButton icon="mail" label="Messages" variant="secondary" /></Notification>
            </Stack>
          </Sample>
          <Sample title="Progress">
            <Stack direction="row" gap="lg" align="center" wrap>
              <CircularProgress value={66} aria-label="Upload progress" />
              <CircularProgress indeterminate aria-label="Loading" />
              <StatusBar label="Storage used" value={72} />
            </Stack>
          </Sample>
          <Sample title="Step tracker">
            <StepTracker steps={5} currentStep={3} />
          </Sample>
        </Grid>

        <Sample title="Empty state and overlays">
          <Grid columns={{ xs: 1, lg: 2 }} gap="lg">
            <Card>
              <MessageEmptyState
                scale="card"
                icon="inbox"
                title="No items yet"
                description="Items you create will appear here."
                action={<Button variant="secondary" icon="add">Create item</Button>}
              />
            </Card>
            <Card>
              <Stack gap="sm">
                <Paragraph size="sm" color="muted">Trigger transient and modal overlays.</Paragraph>
                <Stack direction="row" gap="sm" wrap>
                  <Button variant="secondary" onClick={() => setSnackbarOpen(true)}>Show snackbar</Button>
                  <Button variant="secondary" onClick={() => setDialogOpen(true)}>Open dialog</Button>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Sample>
      </Category>

      {/* ── Layout and media ────────────────────────────────────────────── */}
      <Category id="kitchen-sink-layout" title="Layout and media" description="Cards, figures, and surface treatments.">
        <Grid columns={{ xs: 1, sm: 2, lg: 3 }} gap="md">
          <Card icon="bolt">
            <Stack gap="3xs">
              <Heading as="h3" size="sm">Default card</Heading>
              <Paragraph size="sm" color="muted">A bounded content unit with an icon block.</Paragraph>
            </Stack>
          </Card>
          <Card status="info" statusLabel="In review">
            <Stack gap="3xs">
              <Heading as="h3" size="sm">Status card</Heading>
              <Paragraph size="sm" color="muted">A side stripe paired with a status badge.</Paragraph>
            </Stack>
          </Card>
          <Card variant="navigation" icon="arrow_forward" onClick={() => onNavigate?.('components')}>
            <Stack gap="3xs">
              <Heading as="h3" size="sm">Navigation card</Heading>
              <Paragraph size="sm" color="muted">The whole card is a single target.</Paragraph>
            </Stack>
          </Card>
        </Grid>
        <Grid columns={{ xs: 1, sm: 2 }} gap="md">
          <Figure src="" alt="" aspectRatio="16:9" caption="Figure with a tokenized placeholder" />
          <Figure src="" alt="" aspectRatio="1:1" placeholderIcon="image" caption="Square figure placeholder" />
        </Grid>
      </Category>

      {/* ── Navigation and data ─────────────────────────────────────────── */}
      <Category id="kitchen-sink-data" title="Navigation and data" description="Breadcrumb, definition list, data table, and pagination.">
        <Sample title="Breadcrumb">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
              { label: 'Components', href: '/components', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('components') } },
              { label: 'Kitchen sink' },
            ]}
          />
        </Sample>
        <Grid columns={{ xs: 1, lg: 2 }} gap="lg">
          <Sample title="Definition list">
            <DefinitionList
              direction="row"
              labelWidth="fixed"
              items={[
                { label: 'Plan', value: 'Team' },
                { label: 'Seats', value: '12 of 20' },
                { label: 'Renews', value: 'June 30, 2026' },
              ]}
            />
          </Sample>
          <Sample title="Pagination">
            <Pagination page={page} totalPages={8} onChange={setPage} />
          </Sample>
        </Grid>
        <Sample title="Data table">
          <DataTable columns={TABLE_COLUMNS} rows={TABLE_ROWS} />
        </Sample>
      </Category>

      <Snackbar
        open={snackbarOpen}
        actionLabel="Undo"
        onAction={() => setSnackbarOpen(false)}
        onClose={() => setSnackbarOpen(false)}
      >
        Changes saved.
      </Snackbar>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Confirm action"
        footer={(
          <ButtonContainer align="end">
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setDialogOpen(false)}>Confirm</Button>
          </ButtonContainer>
        )}
      >
        <Paragraph>This is a modal dialog rendered from the kitchen sink preview.</Paragraph>
      </Dialog>
    </>
  )
}
