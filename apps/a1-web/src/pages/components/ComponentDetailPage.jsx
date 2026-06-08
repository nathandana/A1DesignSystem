import { useEffect, useState } from 'react'
import {
  Accordion,
  Banner,
  Bleed,
  Blockquote,
  Breadcrumb,
  Button,
  ButtonContainer,
  Calendar,
  Card,
  CheckboxGroup,
  ChoiceGroup,
  Code,
  Cluster,
  DataTable,
  Divider,
  Fieldset,
  Figure,
  Grid,
  GridItem,
  Heading,
  Icon,
  IconButton,
  Inset,
  Link,
  List,
  ListItem,
  MessageEmptyState,
  MessageBadge,
  Notification,
  Pagination,
  Paragraph,
  RadioGroup,
  Section,
  SegmentedControl,
  SelectField,
  Stack,
  Snackbar,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  TextareaField,
} from '@gtivr4/a1-design-system-react'
import {
  COMPONENT_STATUS,
  ICON_OPTIONS,
  PACKAGE_COLUMNS,
  STATUS_META,
  LAST_UPDATED,
} from './data.js'
import { ComponentDocsShell } from './ComponentDocsShell.jsx'
import {
  getComponentPath,
  getRelatedComponents,
  getRulesForComponent,
  navigateCard,
} from './utils.js'

const PACKAGE_META = {
  React:  { icon: 'code',         desc: 'packages/react' },
  Native: { icon: 'phone_iphone', desc: 'packages/react-native' },
  Pure:   { icon: 'palette',      desc: 'packages/pure' },
}

function PackageSupportGrid({ packages }) {
  return (
    <Grid columns={3} gap="sm">
      {PACKAGE_COLUMNS.map((pkg) => {
        const supported = packages.includes(pkg)
        const meta = PACKAGE_META[pkg]
        return (
          <Card key={pkg} shadow="xs">
            <Stack direction="column" gap="xs">
              <Stack direction="row" gap="xs" align="center">
                <Icon name={meta.icon} />
                <Heading as="h4" size="xs">{pkg}</Heading>
              </Stack>
              <MessageBadge
                status={supported ? 'success' : 'neutral'}
                icon={supported ? 'check_circle' : 'remove'}
                subtle={!supported}
              >
                {supported ? 'Available' : 'Not available'}
              </MessageBadge>
            </Stack>
          </Card>
        )
      })}
    </Grid>
  )
}

function ComponentPreview({ component, config }) {
  if (component.id === 'heading') {
    const textWrap = config.textWrap ? 'balance' : undefined
    return (
      <Heading
        as={config.as}
        type={config.type}
        size={config.size}
        color={config.color}
        align={config.align}
        margin={config.margin || undefined}
        textWrap={textWrap}
      >
        {config.children || component.title}
      </Heading>
    )
  }

  return (
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
  )
}

const DEFAULT_ANATOMY = {
  callouts: [
    { label: 'Container', description: 'Outer element that owns spacing, surface, borders, and interaction states.', anchor: 'top-left' },
    { label: 'Content', description: 'Primary visible content. Text should remain readable and preserve semantic structure.', anchor: 'center' },
    { label: 'States', description: 'Hover, active, focus-visible, disabled, selected, and validation states appear on the owning element.', anchor: 'bottom-right' },
  ],
  sizing: {
    width: 'Flexible',
    widthBehavior: 'Fills the available parent width unless the component is naturally inline or content-sized.',
    height: 'Content-driven',
    heightBehavior: 'Height grows from content, padding, and density tokens.',
    wrapping: 'Text wraps by default unless the component is an intentionally compact control.',
    overflow: 'Content should stay inside the component boundary; long content wraps, scrolls, or truncates according to the component role.',
  },
}

const CATEGORY_ANATOMY = {
  typography: {
    callouts: [
      { label: 'Semantic element', description: 'Uses the correct text element for hierarchy and document structure.', anchor: 'top-left' },
      { label: 'Text content', description: 'Copy uses the selected type scale, line height, color, and wrapping behavior.', anchor: 'center' },
      { label: 'Rhythm', description: 'Spacing comes from surrounding layout components rather than local margins.', anchor: 'bottom-right' },
    ],
    sizing: {
      width: 'Flexible',
      widthBehavior: 'Text fills the readable content column.',
      height: 'Content-driven',
      heightBehavior: 'Height follows line count and semantic line-height tokens.',
      wrapping: 'Text wraps naturally within the parent content width.',
      overflow: 'Avoid clipping text; long words should wrap or use an intentional overflow pattern.',
    },
  },
  actions: {
    callouts: [
      { label: 'Control container', description: 'Clickable/tappable surface that owns size, variant, border, and state styles.', anchor: 'top-left' },
      { label: 'Label', description: 'Visible action text communicates the command and stays centered with icons.', anchor: 'top' },
      { label: 'Optional icon', description: 'Icon supports the label without replacing accessible text unless the component is icon-only.', anchor: 'left' },
      { label: 'Focus ring', description: 'Keyboard focus appears around the full control, not only the text or icon.', anchor: 'bottom-right' },
    ],
    sizing: {
      width: 'Content-sized',
      widthBehavior: 'Hugs label and icon by default; parent layouts can stretch actions when needed.',
      height: 'Fixed by density',
      heightBehavior: 'Default Button and Icon Button controls use the 40px control height token.',
      wrapping: 'Short labels are expected; long labels should wrap only when the parent allows multi-line actions.',
      overflow: 'Icons and labels stay within padding; compact contexts should shorten labels before truncating.',
    },
  },
  inputs: {
    callouts: [
      { label: 'Label', description: 'Persistent text label identifies the input and remains associated with the control.', anchor: 'top-left' },
      { label: 'Control', description: 'Input surface owns height, border, value text, focus, disabled, and validation states.', anchor: 'center' },
      { label: 'Hint or error', description: 'Supporting text appears below the control and is connected for assistive technology.', anchor: 'bottom-left' },
      { label: 'Affordance', description: 'Icons, chevrons, selection marks, or required indicators clarify the expected interaction.', anchor: 'top-right' },
    ],
    sizing: {
      width: 'Flexible',
      widthBehavior: 'Fields fill the form column or grid track they are placed in.',
      height: 'Fixed control, content-driven group',
      heightBehavior: 'Default field controls use 40px height; labels and messages add content height.',
      wrapping: 'Labels, hints, and errors wrap; entered text follows native input behavior.',
      overflow: 'Field text scrolls horizontally inside single-line inputs; messages wrap below the control.',
    },
  },
  layout: {
    callouts: [
      { label: 'Container', description: 'Defines the layout boundary, surface, padding, and child alignment.', anchor: 'top-left' },
      { label: 'Content area', description: 'Children flow inside the component using layout tokens and responsive constraints.', anchor: 'center' },
      { label: 'Spacing', description: 'Gaps and insets are tokenized and should not be recreated with arbitrary values.', anchor: 'bottom-left' },
      { label: 'Responsive behavior', description: 'Width and columns adapt to the parent and breakpoint rules.', anchor: 'bottom-right' },
    ],
    sizing: {
      width: 'Flexible',
      widthBehavior: 'Layout components usually fill the parent width or the configured content width.',
      height: 'Content-driven',
      heightBehavior: 'Height expands from child content, padding, and configured gaps.',
      wrapping: 'Child layout wraps only when the component contract supports wrapping.',
      overflow: 'Prefer responsive wrapping or scrolling containers over clipping child content.',
    },
  },
  navigation: {
    callouts: [
      { label: 'Navigation target', description: 'The link, tab, breadcrumb, or nav item owns the route target.', anchor: 'top-left' },
      { label: 'Label', description: 'Visible text names the destination or current location.', anchor: 'center' },
      { label: 'Optional icon', description: 'Icons reinforce destination type but do not replace clear labels.', anchor: 'top-right' },
      { label: 'Active state', description: 'Current, selected, hover, active, and focus states are visually distinct.', anchor: 'bottom-right' },
    ],
    sizing: {
      width: 'Contextual',
      widthBehavior: 'Inline links hug content; nav containers and menus use the available layout region.',
      height: 'Content or item-token driven',
      heightBehavior: 'Single nav items use control/item height; grouped navigation grows with item count.',
      wrapping: 'Long labels wrap in menus and side navigation; compact horizontal navigation may scroll.',
      overflow: 'Overflow should remain reachable through wrapping, scrolling, or responsive menu behavior.',
    },
  },
  data: {
    callouts: [
      { label: 'Table container', description: 'Scrollable region owns borders, density, and overflow behavior.', anchor: 'top-left' },
      { label: 'Header cells', description: 'Column labels communicate sort, selection, or filter affordances.', anchor: 'top-right' },
      { label: 'Body cells', description: 'Rows align values for scanning, comparison, and keyboard navigation.', anchor: 'center' },
      { label: 'Overflow edge', description: 'Wide data scrolls inside the table container instead of escaping the page.', anchor: 'bottom-right' },
    ],
    sizing: {
      width: 'Flexible with horizontal overflow',
      widthBehavior: 'Tables fill the parent and expose horizontal scrolling when columns exceed available width.',
      height: 'Content-driven',
      heightBehavior: 'Rows and controls determine height; pagination or virtualized regions may constrain long data sets.',
      wrapping: 'Cell content may wrap or truncate based on column purpose.',
      overflow: 'Horizontal overflow belongs to the table scroll container, not the page body.',
    },
  },
}

const COMPONENT_ANATOMY_OVERRIDES = {
  button: {
    sizing: {
      height: 'Fixed by size',
      heightBehavior: 'Default height uses `--component-button-min-height`.',
      wrapping: 'Prefer concise labels; multi-line buttons should be intentional and tested.',
    },
  },
  'icon-button': {
    callouts: [
      { label: 'Button surface', description: 'Square interactive target owns hover, active, disabled, and focus-visible states.', anchor: 'top-left' },
      { label: 'Icon glyph', description: 'Single Material Symbol communicates the action visually.', anchor: 'center' },
      { label: 'Accessible label', description: 'A text label is required for screen readers even when no text is visible.', anchor: 'bottom-left' },
      { label: 'Focus ring', description: 'Focus surrounds the complete target.', anchor: 'bottom-right' },
    ],
    sizing: {
      width: 'Fixed',
      widthBehavior: 'Width uses the icon button size token.',
      height: 'Fixed',
      heightBehavior: 'Height uses `--component-icon-button-size`.',
      wrapping: 'No visible text wraps because the control is icon-only.',
      overflow: 'Icon remains centered and clipped only if an invalid glyph or custom content is forced in.',
    },
  },
  card: {
    sizing: {
      width: 'Flexible',
      widthBehavior: 'Cards fill their grid or stack track and can also act as navigation links.',
      height: 'Content-driven',
      heightBehavior: 'Height grows from content, padding, optional icon, and optional hero region.',
      wrapping: 'Headings and body text wrap within the card content area.',
      overflow: 'Cards should not hide critical content; constrain media intentionally.',
    },
  },
  link: {
    sizing: {
      width: 'Inline content-sized',
      widthBehavior: 'Links hug their text and optional icon in inline contexts.',
      height: 'Line-height driven',
      heightBehavior: 'Height follows the selected text size and line-height.',
      wrapping: 'Long link text wraps with surrounding text unless placed in a compact navigation item.',
      overflow: 'Avoid clipping links; use wrapping or responsive navigation behavior.',
    },
  },
  tabs: {
    sizing: {
      width: 'Flexible',
      widthBehavior: 'Tab lists fill the available row and scroll horizontally when needed.',
      height: 'Item-token driven',
      heightBehavior: 'Tab height follows item padding, line-height, and level styling.',
      wrapping: 'Tab labels should stay short; overflow is handled by horizontal scrolling.',
      overflow: 'The tab list owns horizontal overflow so the page width remains stable.',
    },
  },
  'data-table': CATEGORY_ANATOMY.data,
  calendar: {
    callouts: [
      { label: 'Container', description: 'Outer element uses container-type: inline-size to drive density via container queries at 480px and 320px.', anchor: 'top-left' },
      { label: 'Month heading', description: 'Year and month label provides orientation. In the paginated variant it includes prev/next buttons and month/year selects.', anchor: 'top' },
      { label: 'Day grid', description: '7-column grid maps each date to its weekday column. Today is highlighted; past dates receive a background tint.', anchor: 'center' },
      { label: 'Weekday headers', description: 'Abbreviated day names adapt to the locale week-start setting (Sunday-first or Monday-first).', anchor: 'top-right' },
    ],
    sizing: {
      width: 'Flexible',
      widthBehavior: 'Fills the parent container. Container queries adjust cell density at 480px (medium) and 320px (compact).',
      height: 'Content-driven',
      heightBehavior: 'Scroll variant grows with monthsToShow. Paginated shows one month at a time.',
      wrapping: 'Day cells never wrap; the grid column count is always 7.',
      overflow: 'Scroll variant overflows the page vertically with native scroll. Paginated variant contains everything in a single month view.',
    },
  },
}

function mergeAnatomySpec(component, category) {
  const base = CATEGORY_ANATOMY[category.id] ?? DEFAULT_ANATOMY
  const override = COMPONENT_ANATOMY_OVERRIDES[component.id] ?? {}

  return {
    callouts: override.callouts ?? base.callouts ?? DEFAULT_ANATOMY.callouts,
    sizing: {
      ...DEFAULT_ANATOMY.sizing,
      ...(base.sizing ?? {}),
      ...(override.sizing ?? {}),
    },
  }
}

function AnatomyComponentPreview({ component }) {
  const [nestedTab, setNestedTab] = useState('overview')
  const [segment, setSegment] = useState('one')
  const [page, setPage] = useState(2)

  switch (component.id) {
    case 'heading':
      return <Heading as="h3" size="lg">{component.title}</Heading>
    case 'paragraph':
      return (
        <Paragraph>
          Paragraph text wraps inside its parent container and keeps a readable measure across responsive layouts.
        </Paragraph>
      )
    case 'blockquote':
      return <Blockquote cite="A1 Design System">Good component anatomy makes structure visible.</Blockquote>
    case 'divider':
      return (
        <div className="a1-web-anatomy-example-block">
          <Paragraph size="sm">Content above</Paragraph>
          <Divider />
          <Paragraph size="sm">Content below</Paragraph>
        </div>
      )
    case 'inline':
      return (
        <Paragraph>
          Inline content can include <Code>code</Code>, <kbd>keyboard</kbd>, and <mark>marked text</mark>.
        </Paragraph>
      )
    case 'code':
      return (
        <Code variant="block" wrapping copyCode>
          npm install @gtivr4/a1-design-system-react
        </Code>
      )
    case 'link':
      return <Link href={getComponentPath(`component-${component.id}`)}>{component.title}</Link>
    case 'breadcrumb':
      return (
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Components', href: getComponentPath('components') },
            { label: component.title },
          ]}
        />
      )
    case 'tabs':
      return (
        <Tabs value={nestedTab} onChange={setNestedTab} variant="line">
          <TabList>
            <Tab value="overview">Overview</Tab>
            <Tab value="details">Details</Tab>
          </TabList>
          <TabPanel value="overview">
            <Paragraph size="sm" color="muted">Selected panel content.</Paragraph>
          </TabPanel>
          <TabPanel value="details">
            <Paragraph size="sm" color="muted">Secondary panel content.</Paragraph>
          </TabPanel>
        </Tabs>
      )
    case 'page-nav':
      return (
        <List icon="arrow_forward" size="sm">
          <ListItem><Link href="#overview">Overview</Link></ListItem>
          <ListItem><Link href="#rules">Rules</Link></ListItem>
          <ListItem><Link href="#properties">Properties</Link></ListItem>
        </List>
      )
    case 'button':
      return <Button icon="star">{component.title}</Button>
    case 'icon-button':
      return <IconButton icon="settings" label={component.title} />
    case 'switch':
      return <Switch label={component.title} checked onChange={() => {}} />
    case 'segmented-control':
      return (
        <SegmentedControl
          value={segment}
          onChange={setSegment}
          options={[
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
          ]}
        />
      )
    case 'field':
      return <TextField label={component.title} value="Example value" readOnly />
    case 'textarea':
      return <TextareaField label={component.title} value="Example multi-line value" readOnly />
    case 'select':
      return (
        <SelectField label={component.title} value="one" readOnly>
          <option value="one">Option one</option>
          <option value="two">Option two</option>
        </SelectField>
      )
    case 'choice-group':
      return (
        <ChoiceGroup
          label={component.title}
          defaultValue="professional"
          options={[
            { value: 'starter',      label: 'Starter',      subtext: 'Up to 3 users',   icon: 'deployed_code' },
            { value: 'professional', label: 'Professional', subtext: 'Up to 25 users',  icon: 'rocket_launch' },
            { value: 'enterprise',   label: 'Enterprise',   subtext: 'Unlimited',        icon: 'domain' },
          ]}
        />
      )
    case 'checkbox-group':
      return (
        <CheckboxGroup
          label={component.title}
          value={['one']}
          onChange={() => {}}
          options={[
            { value: 'one', label: 'Option one' },
            { value: 'two', label: 'Option two' },
          ]}
        />
      )
    case 'radio-group':
      return (
        <RadioGroup
          label={component.title}
          value="one"
          onChange={() => {}}
          options={[
            { value: 'one', label: 'Option one' },
            { value: 'two', label: 'Option two' },
          ]}
        />
      )
    case 'fieldset':
      return (
        <Fieldset legend={component.title}>
          <TextField label="Example field" value="Example value" readOnly />
        </Fieldset>
      )
    case 'inline-editable':
      return <TextField label={component.title} value="Editable text" readOnly />
    case 'banner':
      return <Banner status="info" title={component.title}>A short page-level message.</Banner>
    case 'message':
      return <MessageBadge status="info">{component.title}</MessageBadge>
    case 'notification':
      return (
        <Notification count={3}>
          <IconButton icon="notifications" label="Notifications" />
        </Notification>
      )
    case 'snackbar':
      return <Snackbar open actionLabel="Undo" onAction={() => {}}>Saved changes</Snackbar>
    case 'empty-state':
      return <MessageEmptyState title={component.title} description="No items to show yet." icon="inbox" />
    case 'system-banner':
      return <Banner variant="system" status="info" title={component.title}>System-wide announcement.</Banner>
    case 'section':
      return (
        <Section padding="sm" surface="panel" contentWidth="sm">
          <Paragraph size="sm">Section content</Paragraph>
        </Section>
      )
    case 'card':
      return (
        <Card icon="dashboard">
          <Stack direction="column" gap="xs">
            <Heading as="h3" size="sm">{component.title}</Heading>
            <Paragraph size="sm" color="muted">Grouped content with tokenized spacing.</Paragraph>
          </Stack>
        </Card>
      )
    case 'stack':
      return (
        <Stack gap="sm">
          <MessageBadge subtle>First item</MessageBadge>
          <MessageBadge subtle>Second item</MessageBadge>
        </Stack>
      )
    case 'cluster':
      return (
        <Cluster gap="sm">
          <MessageBadge subtle>One</MessageBadge>
          <MessageBadge subtle>Two</MessageBadge>
          <MessageBadge subtle>Three</MessageBadge>
        </Cluster>
      )
    case 'grid':
      return (
        <Grid columns={2} gap="sm">
          <Card><Paragraph size="sm">One</Paragraph></Card>
          <Card><Paragraph size="sm">Two</Paragraph></Card>
        </Grid>
      )
    case 'bleed':
      return (
        <Inset>
          <Bleed>
            <Card><Paragraph size="sm">Bleed content reaches past the inset.</Paragraph></Card>
          </Bleed>
        </Inset>
      )
    case 'inset':
      return (
        <Inset>
          <Card><Paragraph size="sm">Inset content</Paragraph></Card>
        </Inset>
      )
    case 'spacer':
      return (
        <Stack gap="sm">
          <MessageBadge subtle>Before</MessageBadge>
          <div className="a1-web-anatomy-spacer-example" aria-label="Spacer preview" />
          <MessageBadge subtle>After</MessageBadge>
        </Stack>
      )
    case 'page-layout':
      return (
        <Card>
          <Stack direction="column" gap="xs">
            <MessageBadge subtle icon="web_asset">Header</MessageBadge>
            <Paragraph size="sm" color="muted">Main content region</Paragraph>
          </Stack>
        </Card>
      )
    case 'button-container':
      return (
        <ButtonContainer>
          <Button>Save</Button>
          <Button variant="secondary">Cancel</Button>
        </ButtonContainer>
      )
    case 'figure':
      return (
        <Figure
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 160'%3E%3Crect width='320' height='160' fill='%23e9eef7'/%3E%3Ccircle cx='160' cy='80' r='32' fill='%237c3aed'/%3E%3C/svg%3E"
          alt="Abstract figure preview"
          caption="Example figure caption"
        />
      )
    case 'dialog':
      return (
        <Card>
          <Stack direction="column" gap="sm">
            <Heading as="h3" size="sm">Dialog title</Heading>
            <Paragraph size="sm" color="muted">Dialog body content.</Paragraph>
            <Button size="sm">Confirm</Button>
          </Stack>
        </Card>
      )
    case 'menu':
      return (
        <List icon="more_vert" size="sm">
          <ListItem>Menu item</ListItem>
          <ListItem>Another item</ListItem>
        </List>
      )
    case 'list':
      return (
        <List icon="check" size="sm">
          <ListItem>Primary item</ListItem>
          <ListItem>Secondary item</ListItem>
        </List>
      )
    case 'data-table':
      return (
        <DataTable
          caption="Anatomy table example"
          size="compact"
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'status', label: 'Status' },
          ]}
          rows={[
            { id: 'one', name: 'Row one', status: 'Ready' },
            { id: 'two', name: 'Row two', status: 'Draft' },
          ]}
        />
      )
    case 'calendar':
      return <Calendar monthsToShow={1} />
    case 'pagination':
      return <Pagination page={page} totalPages={5} onChange={setPage} />
    case 'icon':
      return <Icon name="widgets" />
    case 'accordion':
      return (
        <Accordion label={component.title} defaultOpen>
          <Paragraph size="sm" color="muted">Expandable panel content.</Paragraph>
        </Accordion>
      )
    case 'side-nav':
    case 'top-header':
      return (
        <Card>
          <Stack direction="column" gap="xs">
            <MessageBadge subtle icon={component.categoryIcon}>{component.title}</MessageBadge>
            <Paragraph size="sm" color="muted">Navigation container with items and active state.</Paragraph>
          </Stack>
        </Card>
      )
    default:
      return (
        <Card icon={component.categoryIcon}>
          <Stack direction="column" gap="xs">
            <Heading as="h3" size="sm">{component.title}</Heading>
            <Paragraph size="sm" color="muted">{component.body}</Paragraph>
          </Stack>
        </Card>
      )
  }
}

function AnatomyPanel({ component, category }) {
  const [showCallouts, setShowCallouts] = useState(true)
  const anatomy = mergeAnatomySpec(component, category)
  const sizingRows = [
    { id: 'width', item: 'Default width', value: anatomy.sizing.width, behavior: anatomy.sizing.widthBehavior },
    { id: 'height', item: 'Default height', value: anatomy.sizing.height, behavior: anatomy.sizing.heightBehavior },
    { id: 'wrapping', item: 'Text wrapping', value: 'Defined by content role', behavior: anatomy.sizing.wrapping },
    { id: 'overflow', item: 'Overflow behavior', value: 'Contained', behavior: anatomy.sizing.overflow },
  ]

  return (
    <Stack gap="lg">
      <Stack direction="row" gap="sm" align="center" justify="between" wrap>
        <Heading as="h3" size="sm">Component anatomy</Heading>
        <Switch
          label="Show callouts"
          size="compact"
          checked={showCallouts}
          onChange={setShowCallouts}
        />
      </Stack>
      <Section padding="md" surface="panel">
        <div className="a1-web-anatomy-surface">
          <div className="a1-web-anatomy-preview">
            <AnatomyComponentPreview component={component} />
            {showCallouts && anatomy.callouts.map((callout, index) => (
              <span
                key={callout.label}
                className={`a1-web-anatomy-callout a1-web-anatomy-callout--${callout.anchor}`}
                aria-label={`${index + 1}. ${callout.label}`}
              >
                <span className="a1-web-anatomy-callout__label">
                  <span>{callout.label}</span>
                  <span className="a1-web-anatomy-callout__number">{index + 1}</span>
                </span>
                <span className="a1-web-anatomy-callout__line" aria-hidden="true" />
                <span className="a1-web-anatomy-callout__dot" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>
      </Section>

      {showCallouts && (
        <Grid columns={{ xs: 1, md: 2 }} gap="sm">
          {anatomy.callouts.map((callout, index) => (
            <Card key={callout.label} shadow="xs">
              <Stack direction="column" gap="xs">
                <MessageBadge subtle icon="ads_click">{index + 1}</MessageBadge>
                <Heading as="h3" size="sm">{callout.label}</Heading>
                <Paragraph size="sm" color="muted">{callout.description}</Paragraph>
              </Stack>
            </Card>
          ))}
        </Grid>
      )}

      <Stack direction="column" gap="sm">
        <Heading as="h3" size="sm">Sizing and overflow</Heading>
        <DataTable
          caption={`${component.title} sizing and overflow behavior`}
          size="compact"
          columns={[
            { key: 'item', label: 'Item', sortable: true },
            { key: 'value', label: 'Default' },
            { key: 'behavior', label: 'Behavior' },
          ]}
          rows={sizingRows}
        />
      </Stack>
    </Stack>
  )
}

const HEADING_ELEMENT_OPTIONS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span']
const HEADING_TYPE_OPTIONS = ['heading', 'display']
const HEADING_SIZE_OPTIONS = {
  heading: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
  display: ['sm', 'md', 'lg', 'xl', 'xxl', 'jumbo', 'xJumbo'],
}
const HEADING_COLOR_OPTIONS = ['default', 'muted', 'accent']
const HEADING_ALIGN_OPTIONS = ['left', 'center', 'right']
const HEADING_MARGIN_OPTIONS = ['', 'sm', 'md', 'lg']

function optionLabel(value) {
  return value === 'xJumbo'
    ? 'X jumbo'
    : value.charAt(0).toUpperCase() + value.slice(1)
}

function radioOptions(options) {
  return options.map((option) => ({
    value: option,
    label: optionLabel(option),
  }))
}

function ConfigureControls({ component, config, setConfig }) {
  if (component.id === 'heading') {
    const sizeOptions = HEADING_SIZE_OPTIONS[config.type] ?? HEADING_SIZE_OPTIONS.heading

    return (
      <Stack gap="lg">
        <TextField
          label="Text"
          size="compact"
          value={config.children}
          onChange={(event) => setConfig((current) => ({ ...current, children: event.target.value }))}
        />
        <SelectField
          label="Element"
          size="compact"
          value={config.as}
          onChange={(event) => setConfig((current) => ({ ...current, as: event.target.value }))}
        >
          {HEADING_ELEMENT_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </SelectField>
        <RadioGroup
          label="Type"
          size="compact"
          inline
          value={config.type}
          options={radioOptions(HEADING_TYPE_OPTIONS)}
          onChange={(type) => {
            const nextSizeOptions = HEADING_SIZE_OPTIONS[type] ?? HEADING_SIZE_OPTIONS.heading
            setConfig((current) => ({
              ...current,
              type,
              size: nextSizeOptions.includes(current.size) ? current.size : nextSizeOptions[2],
            }))
          }}
        />
        <SelectField
          label="Size"
          size="compact"
          value={config.size}
          onChange={(event) => setConfig((current) => ({ ...current, size: event.target.value }))}
        >
          {sizeOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </SelectField>

        <div>

                              <ChoiceGroup
            defaultValue="h2"
            label="Element"
            options={[
              {
                label: 'h1',
                value: 'h1'
              },
              {
                label: 'h2',
                value: 'h2'
              },
              {
                label: 'h3',
                value: 'h3'
              },
              {
                label: 'h4',
                value: 'h4'
              },
              {
                label: 'h5',
                value: 'h5'
              },
              {
                label: 'h6',
                value: 'h6'
              },
              {label: 'p', value: 'p'},
              {label: 'span', value: 'span'}
            ]}
            size="compact"
          />


                    <ChoiceGroup
            defaultValue="heading"
            label="Type"
            options={[
              {
                label: 'Heading',
                value: 'heading'
              },
              {
                label: 'Display',
                value: 'display'
              }
            ]}
            size="compact"
          />
          <ChoiceGroup
            defaultValue="left"
            label="Alignment"
            options={[
              {
                icon: 'align_horizontal_left',
                value: 'left'
              },
              {
                icon: 'align_horizontal_center',
                value: 'center'
              },
              {
                icon: 'align_horizontal_right',
                value: 'right'
              }
            ]}
            size="compact"
          />

          <ChoiceGroup
            defaultValue="sm"
            label="Color"
            options={[
              {
                label: 'xs',
                value: 'xs'
              },
              {
                label: 'sm',
                value: 'sm'
              },
              {
                label: 'md',
                value: 'md'
              },
              {
                label: 'lg',
                value: 'lg'
              },
              {
                label: 'xl',
                value: 'xl'
              },
              {
                label: 'jumbo',
                value: 'jumbo'
              },
              {
                label: 'xJumbo',
                value: 'xJumbo'
              }
            ]}
            size="compact"
          />
          <ChoiceGroup
            defaultValue="None"
            label="Margin"
            options={[
              {
                label: 'None',
                value: 'None'
              },
              {
                label: 'sm',
                value: 'sm'
              },
              {
                label: 'md',
                value: 'md'
              },
              {
                label: 'lg',
                value: 'lg'
              }
            ]}
            size="compact"
          />
        </div>





        <RadioGroup
          label="Color"
          size="compact"
          inline
          value={config.color}
          options={radioOptions(HEADING_COLOR_OPTIONS)}
          onChange={(color) => setConfig((current) => ({ ...current, color }))}
        />
        <RadioGroup
          label="Align"
          size="compact"
          inline
          value={config.align}
          options={radioOptions(HEADING_ALIGN_OPTIONS)}
          onChange={(align) => setConfig((current) => ({ ...current, align }))}
        />
        <SelectField
          label="Margin"
          size="compact"
          value={config.margin}
          onChange={(event) => setConfig((current) => ({ ...current, margin: event.target.value }))}
        >
          <option value="">None</option>
          {HEADING_MARGIN_OPTIONS.filter(Boolean).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </SelectField>
        <Switch
          label="Balance wrapping"
          size="compact"
          checked={config.textWrap}
          onChange={(checked) => setConfig((current) => ({ ...current, textWrap: checked }))}
        />
      </Stack>
    )
  }

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
      <RadioGroup
        label="Size"
        size="compact"
        inline
        value={config.size}
        options={[
          { value: 'compact', label: 'Compact' },
          { value: 'default', label: 'Default' },
          { value: 'lg', label: 'Large' },
        ]}
        onChange={(size) => setConfig((current) => ({ ...current, size }))}
      />
      <RadioGroup
        label="Variant"
        size="compact"
        inline
        value={config.variant}
        options={[
          { value: 'primary', label: 'Primary' },
          { value: 'secondary', label: 'Secondary' },
          { value: 'tertiary', label: 'Tertiary' },
        ]}
        onChange={(variant) => setConfig((current) => ({ ...current, variant }))}
      />
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

const COMPONENT_SNIPPETS = {
  code: {
    react: `<Code>--semantic-color-text-default</Code>\n\n<Code variant="block" wrapping copyCode>\n{exampleCode}\n</Code>`,
    native: `// Not available in the Native package.`,
    pure: `// Not available in the Pure package.`,
  },
  calendar: {
    react: `// Scroll variant — renders all months vertically (default)\n<Calendar monthsToShow={13} />\n\n// Paginated variant — one month at a time with navigation\n<Calendar\n  variant="paginated"\n  highlightToday\n  dimPast\n  todayButton\n/>`,
    native: `// Not available in the Native package.`,
    pure: `// Not available in the Pure package.`,
  },
}

const COMPONENT_PROPS = {
  // ── Typography ────────────────────────────────────────────────────────────
  heading: [
    {
      title: 'Heading',
      rows: [
        { id: 'as',       name: 'as',       type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"', description: 'HTML element to render. Controls semantic heading level independently of visual size. Default: "h2".' },
        { id: 'type',     name: 'type',     type: '"heading" | "display"',                                    description: 'Typography scale. "heading" uses the text hierarchy scale (xs–xxl); "display" uses the larger editorial scale (sm–xJumbo). Default: "heading".' },
        { id: 'size',     name: 'size',     type: 'HeadingSize | DisplaySize | ResponsiveObject',             description: 'Size within the active scale. Heading sizes: xs, sm, md, lg, xl, xxl. Display sizes: sm, md, lg, xl, xxl, jumbo, xJumbo. Accepts a responsive object, e.g. { xs: "lg", md: "xl" }. Default: "md".' },
        { id: 'color',    name: 'color',    type: '"default" | "muted" | "accent"',                           description: 'Text colour token. Default: "default".' },
        { id: 'align',    name: 'align',    type: '"left" | "center" | "right"',                              description: 'Horizontal text alignment.' },
        { id: 'margin',   name: 'margin',   type: '"sm" | "md" | "lg"',                                       description: 'Adds a bottom margin below the heading. Useful when a heading is directly followed by body text without a layout wrapper.' },
        { id: 'textWrap', name: 'textWrap', type: '"balance"',                                                description: 'Applies text-wrap: balance to distribute line lengths evenly. Recommended for short headings up to 4 lines.' },
        { id: 'children', name: 'children', type: 'ReactNode',                                                description: 'Heading text content. Accepts HeadingMark for styled emphasis spans with highlight or underline variants.' },
        { id: 'className',name: 'className',type: 'string',                                                   description: 'Additional CSS class names for local layout adjustment.' },
      ],
    },
    {
      title: 'HeadingMark',
      rows: [
        { id: 'variant',  name: 'variant',  type: '"highlight" | "underline"', description: 'Visual treatment. "highlight" adds a coloured background; "underline" adds a decorative underline. Default: "highlight".' },
        { id: 'children', name: 'children', type: 'ReactNode',                 description: 'The portion of heading text to emphasise.' },
      ],
    },
  ],
  paragraph: [
    { id: 'as',       name: 'as',       type: 'ElementType',                description: 'Underlying HTML element. Default: "p".' },
    { id: 'size',     name: 'size',     type: '"xs" | "sm" | "md" | "lg" | "xl" | ResponsiveObject', description: 'Font size. Accepts a responsive object, e.g. { xs: "sm", md: "md" }. Default: "md".' },
    { id: 'color',    name: 'color',    type: '"default" | "muted"',        description: 'Text colour. Default: "default".' },
    { id: 'align',    name: 'align',    type: '"left" | "center" | "right"',description: 'Horizontal text alignment.' },
    { id: 'textWrap', name: 'textWrap', type: '"balance"',                  description: 'Applies text-wrap: balance. Use for short intro copy up to 4 lines.' },
    { id: 'children', name: 'children', type: 'ReactNode',                  description: 'Paragraph text content.' },
    { id: 'className',name: 'className',type: 'string',                     description: 'Additional CSS class names for local layout adjustment.' },
  ],
  blockquote: [
    { id: 'variant',  name: 'variant',  type: '"border" | "filled" | "feature" | "minimal" | "accent" | "pull" | "ruled"', description: 'Visual style. border = left accent border; filled = neutral surface; feature = large centred pullquote; accent = action-colour background; pull = editorial with curly quotes; ruled = top/bottom horizontal rules. Default: "border".' },
    { id: 'cite',     name: 'cite',     type: 'string',   description: 'Attribution text rendered as a figcaption below the quote.' },
    { id: 'citeUrl',  name: 'citeUrl',  type: 'string',   description: 'URL that the cite text links to.' },
    { id: 'children', name: 'children', type: 'ReactNode', description: 'Quote body text.' },
  ],
  list: [
    {
      title: 'List',
      rows: [
        { id: 'as',           name: 'as',           type: '"ul" | "ol"',                         description: 'Underlying element. "ol" renders the ordered variant automatically. Default: "ul".' },
        { id: 'size',         name: 'size',         type: '"xs" | "sm" | "md" | "lg" | "xl"',   description: 'Font size. Accepts a responsive object. Default: "md".' },
        { id: 'color',        name: 'color',        type: '"default" | "muted"',                 description: 'Text colour. Default: "default".' },
        { id: 'icon',         name: 'icon',         type: 'string | null',                       description: 'Material Symbols icon name applied to every list item. Setting icon switches variant to "icon" automatically.' },
        { id: 'variant',      name: 'variant',      type: '"unordered" | "ordered" | "icon" | "divider"', description: 'List style. Auto-detected from as and icon when not set. "divider" separates items with horizontal rules.' },
        { id: 'marginBottom', name: 'marginBottom', type: '"sm" | "md" | "lg"',                 description: 'Bottom margin below the list.' },
        { id: 'children',     name: 'children',     type: 'ReactNode',                           description: 'ListItem elements.' },
      ],
    },
    {
      title: 'ListItem',
      rows: [
        { id: 'icon',     name: 'icon',     type: 'string | null', description: 'Per-item icon override. Pass null to suppress the list-level icon for this item. Omit to inherit from the parent List.' },
        { id: 'children', name: 'children', type: 'ReactNode',     description: 'List item content.' },
      ],
    },
  ],
  inline: [
    { id: 'element',  name: '(element)', type: 'strong | b | em | i | u | s | del | ins | mark | kbd | abbr | cite | q', description: 'Inline uses native semantic HTML elements directly — no wrapper component. Each element carries its semantic meaning: strong/b for importance, em/i for emphasis, del/ins for edits, mark for highlights, kbd for keyboard input, abbr for abbreviations.' },
    { id: 'children', name: 'children',  type: 'ReactNode', description: 'Inline text content.' },
  ],
  code: [
    { id: 'variant',   name: 'variant',   type: '"inline" | "block"', description: 'Presentation mode. Inline keeps minimal padding in prose; block renders a preformatted code surface. Default: "inline".' },
    { id: 'wrapping',  name: 'wrapping',  type: 'boolean',            description: 'Allows long inline values or block snippets to wrap instead of scrolling horizontally. Default: false.' },
    { id: 'copyCode',  name: 'copyCode',  type: 'boolean',            description: 'Adds a small tertiary copy button below the code block. Default: false.' },
    { id: 'copyText',  name: 'copyText',  type: 'string',             description: 'Optional clipboard text override. Defaults to the text content rendered inside the component.' },
    { id: 'className', name: 'className', type: 'string',             description: 'Additional CSS class names for local layout adjustment.' },
  ],
  divider: [
    { id: 'orientation', name: 'orientation', type: '"horizontal" | "vertical" | ResponsiveObject', description: 'Line orientation. Accepts a responsive object. Default: "horizontal".' },
    { id: 'variant',     name: 'variant',     type: '"subtle" | "strong" | "accent" | "dashed" | "dotted"', description: 'Visual style. Default: "subtle".' },
    { id: 'size',        name: 'size',        type: '"xs" | "sm" | "md" | "lg"', description: 'Line thickness. Default: "xs".' },
    { id: 'space',       name: 'space',       type: '"none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl"', description: 'Block-axis margin above and below (or left/right for vertical). Default: "sm".' },
    { id: 'decorative',  name: 'decorative',  type: 'boolean', description: 'When true the element has no semantic role (aria-hidden). Default: true.' },
  ],

  // ── Navigation ────────────────────────────────────────────────────────────
  link: [
    { id: 'href',         name: 'href',         type: 'string',                                description: 'Link destination URL.' },
    { id: 'size',         name: 'size',         type: '"xs" | "sm" | "md" | "lg" | "xl"',    description: 'Font size. Inherits from context when omitted.' },
    { id: 'weight',       name: 'weight',       type: '"normal" | "medium" | "semibold" | "bold"', description: 'Font weight override.' },
    { id: 'icon',         name: 'icon',         type: 'string',                                description: 'Material Symbols icon name shown alongside the link text.' },
    { id: 'iconPosition', name: 'iconPosition', type: '"start" | "end"',                      description: 'Position of the icon relative to the text. Default: "start".' },
    { id: 'children',     name: 'children',     type: 'ReactNode',                             description: 'Link text content.' },
  ],
  breadcrumb: [
    {
      title: 'Breadcrumb',
      rows: [
        { id: 'items',     name: 'items',     type: 'BreadcrumbItem[]', description: 'Ordered list of breadcrumb items. The last item is treated as the current page and rendered non-interactively.' },
        { id: 'backLabel', name: 'backLabel', type: 'string',           description: 'Label for the back link shown in narrow containers. Default: "Back".' },
      ],
    },
    {
      title: 'BreadcrumbItem',
      rows: [
        { id: 'label',   name: 'label',   type: 'string',   description: 'Visible text for this step. Required.' },
        { id: 'href',    name: 'href',    type: 'string',   description: 'Link destination. When omitted the item renders as a button.' },
        { id: 'onClick', name: 'onClick', type: '() => void', description: 'Click handler. Can be used with href or standalone.' },
      ],
    },
  ],
  'side-nav': [
    {
      title: 'SideNav',
      rows: [
        { id: 'header',                 name: 'header',                 type: 'ReactNode | (collapsed: boolean) => ReactNode', description: 'Header slot. Pass a render function to receive the current collapsed state and conditionally render a compact logo.' },
        { id: 'footer',                 name: 'footer',                 type: 'ReactNode | (collapsed: boolean) => ReactNode', description: 'Footer slot — hidden when collapsed.' },
        { id: 'children',               name: 'children',               type: 'ReactNode',    description: 'SideNavItem and SideNavGroup elements.' },
        { id: 'open',                   name: 'open',                   type: 'boolean',      description: 'Controls overlay visibility on xs/sm/md viewports. Default: false.' },
        { id: 'onClose',                name: 'onClose',                type: '() => void',   description: 'Called when the scrim, Escape key, or close button is triggered.' },
        { id: 'defaultCollapsed',       name: 'defaultCollapsed',       type: 'boolean',      description: 'Initial collapsed state on lg/xl (uncontrolled). Default: false.' },
        { id: 'collapsed',              name: 'collapsed',              type: 'boolean',      description: 'Controlled collapsed state for lg/xl.' },
        { id: 'onCollapsedChange',      name: 'onCollapsedChange',      type: '(collapsed: boolean) => void', description: 'Called with the next boolean when collapsed state changes.' },
        { id: 'collapseButtonPlacement',name: 'collapseButtonPlacement',type: '"header" | "footer"', description: 'Where the desktop collapse toggle appears. Default: "header".' },
        { id: 'placement',              name: 'placement',              type: '"start" | "end"', description: 'Side of the layout the nav occupies. Default: "start".' },
      ],
    },
    {
      title: 'SideNavItem',
      rows: [
        { id: 'label',  name: 'label',  type: 'string',      description: 'Visible label text. Also shown as a tooltip when the nav is collapsed. Required.' },
        { id: 'as',     name: 'as',     type: 'ElementType', description: 'Underlying element or component. Default: "a".' },
        { id: 'icon',   name: 'icon',   type: 'string',      description: 'Material Symbols icon name. Recommended for collapsed-state legibility.' },
        { id: 'badge',  name: 'badge',  type: 'string | number', description: 'Count or label displayed next to the item.' },
        { id: 'active', name: 'active', type: 'boolean',     description: 'Mark as the current page/route. Default: false.' },
      ],
    },
    {
      title: 'SideNavGroup',
      rows: [
        { id: 'label',         name: 'label',         type: 'string',   description: 'Trigger label for the collapsible group. Required.' },
        { id: 'icon',          name: 'icon',          type: 'string',   description: 'Material Symbols icon name shown on the trigger.' },
        { id: 'defaultOpen',   name: 'defaultOpen',   type: 'boolean',  description: 'Initial expanded state (uncontrolled). Default: false.' },
        { id: 'open',          name: 'open',          type: 'boolean',  description: 'Controlled expanded state.' },
        { id: 'onOpenChange',  name: 'onOpenChange',  type: '(open: boolean) => void', description: 'Called with the next boolean when the group is toggled.' },
        { id: 'children',      name: 'children',      type: 'ReactNode',description: 'SideNavItem elements inside the group.' },
      ],
    },
  ],
  'top-header': [
    {
      title: 'TopHeader',
      rows: [
        { id: 'logo',        name: 'logo',        type: 'ReactNode',   description: 'Logo image or icon rendered at the start of the header.' },
        { id: 'logoText',    name: 'logoText',    type: 'string',      description: 'Brand name text shown next to or instead of the logo image.' },
        { id: 'logoHref',    name: 'logoHref',    type: 'string',      description: 'Link destination for the logo. Default: "/".' },
        { id: 'navItems',    name: 'navItems',    type: 'NavItem[]',   description: 'Primary navigation items. Default: [].' },
        { id: 'actions',     name: 'actions',     type: 'ActionItem[]',description: 'Icon button actions shown at the trailing end. Default: [].' },
        { id: 'loginButton', name: 'loginButton', type: 'ReactNode',   description: 'Optional CTA element (e.g. a Button) rendered before the action icons.' },
      ],
    },
    {
      title: 'NavItem',
      rows: [
        { id: 'label',   name: 'label',   type: 'string',            description: 'Navigation link text. Required.' },
        { id: 'href',    name: 'href',    type: 'string',            description: 'Link destination. When omitted the item renders as a button.' },
        { id: 'icon',    name: 'icon',    type: 'string',            description: 'Material Symbols icon name shown before the label in flyout menus.' },
        { id: 'onClick', name: 'onClick', type: 'MouseEventHandler', description: 'Click handler.' },
        { id: 'items',   name: 'items',   type: 'NavItem[]',         description: 'Flyout submenu items. Same NavItem shape. Use { divider: true } to insert a separator.' },
      ],
    },
    {
      title: 'ActionItem',
      rows: [
        { id: 'id',      name: 'id',      type: 'string',          description: 'Unique key for the action. Required.' },
        { id: 'icon',    name: 'icon',    type: 'string',          description: 'Material Symbols icon name. Required.' },
        { id: 'label',   name: 'label',   type: 'string',          description: 'Accessible label used as aria-label. Required.' },
        { id: 'onClick', name: 'onClick', type: '() => void',      description: 'Click handler when no items dropdown is provided.' },
        { id: 'items',   name: 'items',   type: 'NavItem[]',       description: 'Dropdown menu items — same shape as NavItem. Replaces onClick.' },
        { id: 'badge',   name: 'badge',   type: 'string | number', description: 'Badge count shown on the action icon.' },
      ],
    },
  ],
  tabs: [
    {
      title: 'Tabs',
      rows: [
        { id: 'value',    name: 'value',    type: 'string',      description: 'Controlled active tab value.' },
        { id: 'onChange', name: 'onChange', type: '(value: string) => void', description: 'Called with the new value when a tab is clicked.' },
        { id: 'variant',  name: 'variant',  type: '"line" | "pills" | "segment" | "progress" | "folder"', description: 'Visual style. Default: "line".' },
        { id: 'level',    name: 'level',    type: '1 | 2',       description: 'Heading level for nested tab hierarchies. Default: 1.' },
        { id: 'children', name: 'children', type: 'ReactNode',   description: 'TabList and TabPanel elements.' },
      ],
    },
    {
      title: 'Tab',
      rows: [
        { id: 'value',        name: 'value',        type: 'string',     description: 'Value identifier — must match the corresponding TabPanel value. Required.' },
        { id: 'count',        name: 'count',        type: 'number',     description: 'Badge count shown next to the label.' },
        { id: 'icon',         name: 'icon',         type: 'string',     description: 'Material Symbols icon name.' },
        { id: 'iconPosition', name: 'iconPosition', type: '"start" | "end" | "above"', description: 'Icon placement relative to the label. Default: "start".' },
        { id: 'status',       name: 'status',       type: '"completed" | "error" | "warning"', description: 'Status indicator shown in the "progress" variant.' },
        { id: 'children',     name: 'children',     type: 'ReactNode',  description: 'Tab label text.' },
      ],
    },
    {
      title: 'TabPanel',
      rows: [
        { id: 'value',    name: 'value',    type: 'string',    description: 'Value identifier — panel is visible only when this matches the active Tabs value. Required.' },
        { id: 'children', name: 'children', type: 'ReactNode', description: 'Panel content rendered when the tab is active.' },
      ],
    },
  ],
  'page-nav': [
    {
      title: 'PageNav',
      rows: [
        { id: 'sections', name: 'sections', type: 'PageNavSection[]', description: 'List of page sections to link to.' },
        { id: 'label',    name: 'label',    type: 'string',            description: 'Accessible label for the nav element and the visible heading. Default: "On this page".' },
      ],
    },
    {
      title: 'PageNavSection',
      rows: [
        { id: 'id',    name: 'id',    type: 'string',  description: 'Must match the id attribute on the corresponding heading element. Required.' },
        { id: 'label', name: 'label', type: 'string',  description: 'Visible nav link text. Required.' },
        { id: 'level', name: 'level', type: '1 | 2',   description: 'Indentation depth. Level 2 items are indented under the preceding level-1 item. Default: 1.' },
      ],
    },
  ],

  // ── Actions ───────────────────────────────────────────────────────────────
  button: [
    { id: 'as',           name: 'as',           type: 'ElementType',  description: 'Underlying element or component. Default: "button".' },
    { id: 'variant',      name: 'variant',      type: '"primary" | "secondary" | "tertiary" | "destructive" | "success"', description: 'Visual style. Default: "primary".' },
    { id: 'size',         name: 'size',         type: '"sm" | "md" | "lg"', description: 'Button size. Default: "md".' },
    { id: 'icon',         name: 'icon',         type: 'string',       description: 'Material Symbols icon name shown alongside the label.' },
    { id: 'iconPosition', name: 'iconPosition', type: '"start" | "end"', description: 'Icon placement relative to the label. Default: "start".' },
    { id: 'disabled',     name: 'disabled',     type: 'boolean',      description: 'Disables the button and prevents interaction.' },
    { id: 'onClick',      name: 'onClick',      type: 'MouseEventHandler', description: 'Click handler.' },
    { id: 'children',     name: 'children',     type: 'ReactNode',    description: 'Button label text.' },
  ],
  'icon-button': [
    { id: 'icon',    name: 'icon',    type: 'string',   description: 'Material Symbols icon name. Required.' },
    { id: 'label',   name: 'label',   type: 'string',   description: 'Accessible label used as aria-label and tooltip text. Required.' },
    { id: 'variant', name: 'variant', type: '"tertiary" | "secondary" | "destructive" | "success"', description: 'Visual style. Default: "tertiary".' },
    { id: 'disabled',name: 'disabled',type: 'boolean',  description: 'Disables the button.' },
    { id: 'onClick', name: 'onClick', type: 'MouseEventHandler', description: 'Click handler.' },
  ],
  switch: [
    { id: 'label',         name: 'label',         type: 'string',   description: 'Visible label text.' },
    { id: 'hint',          name: 'hint',          type: 'string',   description: 'Helper text shown below the switch.' },
    { id: 'error',         name: 'error',         type: 'string',   description: 'Error message shown below the switch.' },
    { id: 'size',          name: 'size',          type: '"comfortable" | "default" | "compact"', description: 'Size density. Default: "default".' },
    { id: 'labelPosition', name: 'labelPosition', type: '"start" | "end"', description: 'Position of the label relative to the toggle. Default: "end".' },
    { id: 'checked',       name: 'checked',       type: 'boolean',  description: 'Controlled checked state.' },
    { id: 'defaultChecked',name: 'defaultChecked',type: 'boolean',  description: 'Initial checked state (uncontrolled). Default: false.' },
    { id: 'disabled',      name: 'disabled',      type: 'boolean',  description: 'Disables the switch.' },
    { id: 'onChange',      name: 'onChange',      type: '(checked: boolean, event) => void', description: 'Called with the new checked state on change.' },
    { id: 'name',          name: 'name',          type: 'string',   description: 'Input name attribute for form submission.' },
    { id: 'value',         name: 'value',         type: 'string',   description: 'Input value attribute for form submission.' },
  ],
  'segmented-control': [
    { id: 'options',    name: 'options',    type: 'SegmentedOption[]', description: 'Array of options. Each accepts value, label, and an optional icon (Material Symbols name).' },
    { id: 'value',      name: 'value',      type: 'string',            description: 'Controlled selected value.' },
    { id: 'onChange',   name: 'onChange',   type: '(value: string) => void', description: 'Called with the selected value on change.' },
    { id: 'fullWidth',  name: 'fullWidth',  type: 'boolean',           description: 'Stretches the control to fill its container. Default: false.' },
    { id: 'size',       name: 'size',       type: '"sm" | "md" | "lg"',description: 'Button size. Default: "md".' },
  ],

  // ── Inputs ────────────────────────────────────────────────────────────────
  field: [
    { id: 'label',         name: 'label',         type: 'string',   description: 'Visible label text.' },
    { id: 'hint',          name: 'hint',          type: 'string',   description: 'Helper text shown below the field.' },
    { id: 'error',         name: 'error',         type: 'string',   description: 'Error message — replaces hint and marks the field invalid.' },
    { id: 'size',          name: 'size',          type: '"comfortable" | "default" | "compact"', description: 'Size density. Inherits from parent Fieldset when omitted. Default: "default".' },
    { id: 'labelPosition', name: 'labelPosition', type: '"above" | "side"', description: 'Label placement. Inherits from parent Fieldset when omitted. Default: "above".' },
    { id: 'type',          name: 'type',          type: 'string',   description: 'HTML input type (text, email, password, number, date, etc.). Default: "text".' },
    { id: 'value',         name: 'value',         type: 'string',   description: 'Controlled input value.' },
    { id: 'required',      name: 'required',      type: 'boolean',  description: 'Marks the field as required and shows a required indicator.' },
    { id: 'disabled',      name: 'disabled',      type: 'boolean',  description: 'Disables the input.' },
    { id: 'readOnly',      name: 'readOnly',      type: 'boolean',  description: 'Makes the input read-only.' },
    { id: 'inputOverlay',  name: 'inputOverlay',  type: 'ReactNode',description: 'Element rendered inside the field control, e.g. a unit suffix.' },
  ],
  textarea: [
    { id: 'label',         name: 'label',         type: 'string',   description: 'Visible label text.' },
    { id: 'hint',          name: 'hint',          type: 'string',   description: 'Helper text shown below the textarea.' },
    { id: 'error',         name: 'error',         type: 'string',   description: 'Error message — replaces hint and marks the field invalid.' },
    { id: 'size',          name: 'size',          type: '"comfortable" | "default" | "compact"', description: 'Size density. Default: "default".' },
    { id: 'labelPosition', name: 'labelPosition', type: '"above" | "side"', description: 'Label placement. Default: "above".' },
    { id: 'rows',          name: 'rows',          type: '"sm" | "md" | "lg" | "xl" | number', description: 'Initial visible row height. sm=2, md=4, lg=8, xl=12 rows. Default: "md".' },
    { id: 'maxLength',     name: 'maxLength',     type: 'number',   description: 'Maximum character count.' },
    { id: 'showCount',     name: 'showCount',     type: 'boolean',  description: 'Show a character counter. Auto-enabled when maxLength is set. Default: false.' },
    { id: 'required',      name: 'required',      type: 'boolean',  description: 'Marks the field as required.' },
    { id: 'disabled',      name: 'disabled',      type: 'boolean',  description: 'Disables the textarea.' },
    { id: 'readOnly',      name: 'readOnly',      type: 'boolean',  description: 'Makes the textarea read-only.' },
  ],
  select: [
    { id: 'label',         name: 'label',         type: 'string',   description: 'Visible label text.' },
    { id: 'hint',          name: 'hint',          type: 'string',   description: 'Helper text shown below the select.' },
    { id: 'error',         name: 'error',         type: 'string',   description: 'Error message — replaces hint and marks the field invalid.' },
    { id: 'size',          name: 'size',          type: '"comfortable" | "default" | "compact"', description: 'Size density. Default: "default".' },
    { id: 'labelPosition', name: 'labelPosition', type: '"above" | "side"', description: 'Label placement. Default: "above".' },
    { id: 'value',         name: 'value',         type: 'string',   description: 'Controlled selected value.' },
    { id: 'required',      name: 'required',      type: 'boolean',  description: 'Marks the field as required.' },
    { id: 'disabled',      name: 'disabled',      type: 'boolean',  description: 'Disables the select.' },
    { id: 'children',      name: 'children',      type: 'ReactNode',description: '<option> and <optgroup> elements.' },
  ],
  'checkbox-group': [
    {
      title: 'CheckboxGroup',
      rows: [
        { id: 'label',        name: 'label',        type: 'string',   description: 'Group legend text.' },
        { id: 'hint',         name: 'hint',         type: 'string',   description: 'Helper text shown below the group.' },
        { id: 'error',        name: 'error',        type: 'string',   description: 'Error message.' },
        { id: 'size',         name: 'size',         type: '"comfortable" | "default" | "compact"', description: 'Size density. Default: "default".' },
        { id: 'options',      name: 'options',      type: 'CheckboxOption[]', description: 'Array of checkbox options.' },
        { id: 'value',        name: 'value',        type: 'string[]', description: 'Controlled array of selected values.' },
        { id: 'defaultValue', name: 'defaultValue', type: 'string[]', description: 'Initial selected values (uncontrolled).' },
        { id: 'onChange',     name: 'onChange',     type: '(value: string[]) => void', description: 'Called with the full updated array of selected values on change.' },
        { id: 'inline',       name: 'inline',       type: 'boolean',  description: 'Render checkboxes side by side. Default: false.' },
        { id: 'required',     name: 'required',     type: 'boolean',  description: 'Marks the group as required.' },
        { id: 'disabled',     name: 'disabled',     type: 'boolean',  description: 'Disables all checkboxes in the group.' },
        { id: 'name',         name: 'name',         type: 'string',   description: 'Input name attribute shared by all checkboxes.' },
      ],
    },
    {
      title: 'CheckboxOption',
      rows: [
        { id: 'value',    name: 'value',    type: 'string',  description: 'Form value submitted when checked. Required.' },
        { id: 'label',    name: 'label',    type: 'string',  description: 'Visible label text. Required.' },
        { id: 'hint',     name: 'hint',     type: 'string',  description: 'Helper text shown below the label.' },
        { id: 'disabled', name: 'disabled', type: 'boolean', description: 'Disables this option only. Default: false.' },
      ],
    },
  ],
  'radio-group': [
    {
      title: 'RadioGroup',
      rows: [
        { id: 'label',        name: 'label',        type: 'string',       description: 'Group legend text.' },
        { id: 'hint',         name: 'hint',         type: 'string',       description: 'Helper text shown below the group.' },
        { id: 'error',        name: 'error',        type: 'string',       description: 'Error message.' },
        { id: 'size',         name: 'size',         type: '"comfortable" | "default" | "compact"', description: 'Size density. Default: "default".' },
        { id: 'options',      name: 'options',      type: 'RadioOption[]',description: 'Array of radio options.' },
        { id: 'value',        name: 'value',        type: 'string | null',description: 'Controlled selected value.' },
        { id: 'defaultValue', name: 'defaultValue', type: 'string | null',description: 'Initial selected value (uncontrolled). Default: null.' },
        { id: 'onChange',     name: 'onChange',     type: '(value: string) => void', description: 'Called with the selected value string on change.' },
        { id: 'inline',       name: 'inline',       type: 'boolean',      description: 'Render radios side by side. Default: false.' },
        { id: 'required',     name: 'required',     type: 'boolean',      description: 'Marks the group as required.' },
        { id: 'disabled',     name: 'disabled',     type: 'boolean',      description: 'Disables all radios in the group.' },
        { id: 'name',         name: 'name',         type: 'string',       description: 'Input name attribute shared by all radios.' },
      ],
    },
    {
      title: 'RadioOption',
      rows: [
        { id: 'value',    name: 'value',    type: 'string',  description: 'Form value submitted when selected. Required.' },
        { id: 'label',    name: 'label',    type: 'string',  description: 'Visible label text. Required.' },
        { id: 'hint',     name: 'hint',     type: 'string',  description: 'Helper text shown below the label.' },
        { id: 'disabled', name: 'disabled', type: 'boolean', description: 'Disables this option only. Default: false.' },
      ],
    },
  ],
  fieldset: [
    { id: 'legend',        name: 'legend',        type: 'string',   description: 'Legend text for the field group, rendered as a <legend>.' },
    { id: 'size',          name: 'size',          type: '"comfortable" | "default" | "compact"', description: 'Size density applied to all child fields via context. Individual fields can override this.' },
    { id: 'labelPosition', name: 'labelPosition', type: '"above" | "side"', description: 'Label position applied to all child fields via context.' },
    { id: 'markRequired',  name: 'markRequired',  type: 'boolean',  description: 'Show a "* Required field" note below the legend. Only shown for default and compact sizes. Default: false.' },
    { id: 'surface',       name: 'surface',       type: 'boolean',  description: 'Add a subtle surface background to the fieldset. Default: false.' },
    { id: 'children',      name: 'children',      type: 'ReactNode',description: 'Form field components.' },
  ],
  'inline-editable': [
    { id: 'value',          name: 'value',          type: 'string',   description: 'Current text value.' },
    { id: 'onChange',       name: 'onChange',       type: '(value: string) => void', description: 'Called with the updated value when editing is committed.' },
    { id: 'multiline',      name: 'multiline',      type: 'boolean',  description: 'Use a textarea instead of a single-line input. Default: false.' },
    { id: 'disabled',       name: 'disabled',       type: 'boolean',  description: 'Prevents editing. Default: false.' },
    { id: 'placeholder',    name: 'placeholder',    type: 'string',   description: 'Placeholder text shown when the value is empty.' },
    { id: 'aria-label',     name: 'aria-label',     type: 'string',   description: 'Accessible label for the edit trigger. Default: "Click to edit".' },
    { id: 'children',       name: 'children',       type: 'ReactNode',description: 'Display content shown in read mode. Falls back to value if omitted.' },
    { id: 'className',      name: 'className',      type: 'string',   description: 'Additional CSS class names on the outer element.' },
  ],
  'choice-group': [
    {
      title: 'ChoiceGroup',
      rows: [
        { id: 'label',        name: 'label',        type: 'string',    description: 'Group legend text.' },
        { id: 'hint',         name: 'hint',         type: 'string',    description: 'Helper text — hidden when error or success is present.' },
        { id: 'error',        name: 'error',        type: 'string',    description: 'Error message. Replaces hint and adds error styling to tiles.' },
        { id: 'success',      name: 'success',      type: 'string',    description: 'Success message — shown instead of hint when present, hidden if error is also set.' },
        { id: 'size',         name: 'size',         type: '"compact" | "default" | "comfortable"', description: 'Tile density — affects padding and child element sizes only. Default: "default".' },
        { id: 'columns',      name: 'columns',      type: 'number | { xs?, sm?, md?, lg?, xl? }', description: 'Column count. Pass a number for all breakpoints, or a responsive object. Omit for automatic fill.' },
        { id: 'multiple',     name: 'multiple',     type: 'boolean',   description: 'Allow multiple selections (checkbox semantics). Default: false (radio semantics).' },
        { id: 'required',     name: 'required',     type: 'boolean',   description: 'Marks the group as required.' },
        { id: 'options',      name: 'options',      type: 'ChoiceOption[]', description: 'Flat list of options. Overridden by sections when both are provided.' },
        { id: 'sections',     name: 'sections',     type: 'ChoiceGroupSection[]', description: 'Options divided into labeled sections with dividers. Overrides options.' },
        { id: 'value',        name: 'value',        type: 'string | string[] | null', description: 'Controlled value. String for single-select; string[] for multi-select.' },
        { id: 'defaultValue', name: 'defaultValue', type: 'string | string[] | null', description: 'Initial value (uncontrolled). Default: null / [].' },
        { id: 'onChange',     name: 'onChange',     type: '(value: string | string[]) => void', description: 'Called with the selected value on change.' },
      ],
    },
    {
      title: 'ChoiceOption',
      rows: [
        { id: 'value',    name: 'value',    type: 'string',  description: 'Form value submitted on selection. Required.' },
        { id: 'label',    name: 'label',    type: 'string',  description: 'Tile label text. Required.' },
        { id: 'subtext',  name: 'subtext',  type: 'string',  description: 'Secondary line shown below the label.' },
        { id: 'icon',     name: 'icon',     type: 'string',  description: 'Material Symbols icon name shown above the label.' },
        { id: 'disabled', name: 'disabled', type: 'boolean', description: 'Prevents this tile from being selected. Default: false.' },
      ],
    },
    {
      title: 'ChoiceGroupSection',
      rows: [
        { id: 'label',   name: 'label',   type: 'string',          description: 'Section heading shown above the tile group. Required.' },
        { id: 'options', name: 'options', type: 'ChoiceOption[]',  description: 'Options in this section.' },
      ],
    },
  ],

  // ── Feedback ─────────────────────────────────────────────────────────────
  banner: [
    { id: 'variant',   name: 'variant',   type: '"inline" | "system"',  description: 'Layout style. "inline" sits within content; "system" spans full viewport width. Default: "inline".' },
    { id: 'status',    name: 'status',    type: '"neutral" | "info" | "success" | "warn" | "error"', description: 'Semantic status colour. Default: "neutral".' },
    { id: 'title',     name: 'title',     type: 'string',               description: 'Bold title text shown before the body.' },
    { id: 'icon',      name: 'icon',      type: 'string',               description: 'Override the default status icon with any Material Symbols name.' },
    { id: 'action',    name: 'action',    type: 'ReactNode',            description: 'Action element (e.g. a Button) rendered at the trailing end.' },
    { id: 'onDismiss', name: 'onDismiss', type: '() => void',           description: 'Called when the dismiss button is clicked. Omit to hide the dismiss button.' },
    { id: 'children',  name: 'children',  type: 'ReactNode',            description: 'Banner body text.' },
  ],
  message: [
    { id: 'status',   name: 'status',   type: '"neutral" | "info" | "success" | "warn" | "error"', description: 'Semantic status colour. Default: "neutral".' },
    { id: 'subtle',   name: 'subtle',   type: 'boolean',  description: 'Reduce background opacity for a softer appearance. Default: false.' },
    { id: 'size',     name: 'size',     type: '"sm" | "md" | "lg"', description: 'Badge size. Default: "md".' },
    { id: 'icon',     name: 'icon',     type: 'string | null', description: 'Override the default status icon. Pass null to suppress the icon entirely.' },
    { id: 'children', name: 'children', type: 'ReactNode', description: 'Badge label text.' },
  ],
  notification: [
    { id: 'children', name: 'children', type: 'ReactNode',  description: 'The element the badge is anchored to, typically an IconButton.' },
    { id: 'count',    name: 'count',    type: 'number',     description: 'Numeric count shown in the badge. Values above max display as "max+". Omit to show a dot.' },
    { id: 'label',    name: 'label',    type: 'string',     description: 'Text label shown in the badge instead of a count.' },
    { id: 'dot',      name: 'dot',      type: 'boolean',    description: 'Show a small dot with no label. Auto-enabled when count and label are both omitted. Default: false.' },
    { id: 'variant',  name: 'variant',  type: '"default" | "neutral" | "info" | "success" | "warn" | "error"', description: 'Badge colour. Default: "default" (action colour).' },
    { id: 'position', name: 'position', type: '"top-right" | "top-left" | "bottom-right" | "bottom-left"', description: 'Corner the badge anchors to. Default: "top-right".' },
    { id: 'max',      name: 'max',      type: 'number',     description: 'Maximum count shown before displaying as "max+". Default: 99.' },
  ],
  snackbar: [
    { id: 'open',        name: 'open',        type: 'boolean',   description: 'Whether the snackbar is visible. Default: false.' },
    { id: 'children',    name: 'children',    type: 'ReactNode', description: 'Snackbar message text.' },
    { id: 'actionLabel', name: 'actionLabel', type: 'string',    description: 'Label for the inline action button (e.g. "Undo").' },
    { id: 'onAction',    name: 'onAction',    type: '() => void', description: 'Called when the action button is clicked.' },
    { id: 'onClose',     name: 'onClose',     type: '() => void', description: 'Called when the snackbar auto-dismisses or is closed.' },
    { id: 'variant',     name: 'variant',     type: '"default" | "success" | "error"', description: 'Colour variant. Default: "default".' },
    { id: 'position',    name: 'position',    type: '"bottom" | "top"', description: 'Screen position. Default: "bottom".' },
    { id: 'inverse',     name: 'inverse',     type: 'boolean',   description: 'Apply the inverse (dark) colour scheme. Default: true.' },
  ],
  'empty-state': [
    { id: 'scale',       name: 'scale',       type: '"page" | "section" | "card"', description: 'Visual scale matching the container. page = largest (h1), section = medium (h2), card = compact (h3). Default: "section".' },
    { id: 'icon',        name: 'icon',        type: 'string',    description: 'Material Symbols icon name shown above the title. Default: "inbox".' },
    { id: 'title',       name: 'title',       type: 'string',    description: 'Primary message.' },
    { id: 'description', name: 'description', type: 'string',    description: 'Supporting description text below the title.' },
    { id: 'action',      name: 'action',      type: 'ReactNode', description: 'Action element (e.g. a Button) rendered below the description.' },
  ],
  'system-banner': [
    { id: 'status',    name: 'status',    type: '"neutral" | "info" | "success" | "warn" | "error"', description: 'Semantic status colour. Default: "neutral".' },
    { id: 'title',     name: 'title',     type: 'string',    description: 'Bold title text.' },
    { id: 'icon',      name: 'icon',      type: 'string',    description: 'Override the default status icon with any Material Symbols name.' },
    { id: 'action',    name: 'action',    type: 'ReactNode', description: 'Action element rendered at the trailing end.' },
    { id: 'onDismiss', name: 'onDismiss', type: '() => void', description: 'Called when the dismiss button is clicked. Omit to hide the dismiss button.' },
    { id: 'children',  name: 'children',  type: 'ReactNode', description: 'Banner body text.' },
  ],

  // ── Layout ────────────────────────────────────────────────────────────────
  section: [
    { id: 'as',               name: 'as',               type: 'ElementType', description: 'Underlying HTML element. Default: "section".' },
    { id: 'padding',          name: 'padding',          type: '"none" | "xs" | "sm" | "md" | "lg" | ResponsiveObject', description: 'Block padding scale. Accepts a responsive object. Default: "md".' },
    { id: 'surface',          name: 'surface',          type: '"page" | "panel" | "raised"', description: 'Background surface treatment.' },
    { id: 'gap',              name: 'gap',              type: '"xs" | "sm" | "md" | "lg"',  description: 'Gap between direct children.' },
    { id: 'gradient',         name: 'gradient',         type: '"accent" | "highlight" | "info" | "success" | "warn"', description: 'Gradient overlay colour.' },
    { id: 'gradientPosition', name: 'gradientPosition', type: '"top" | "center" | "bottom" | …', description: 'Gradient origin. Default: "center".' },
    { id: 'inverse',          name: 'inverse',          type: 'boolean',     description: 'Apply the inverse (dark) colour scheme to this section.' },
    { id: 'contentWidth',     name: 'contentWidth',     type: '"xs" | "sm" | "md" | "lg" | "xl" | "2xl"', description: 'Constrain inner content to a max-width and centre it.' },
    { id: 'height',           name: 'height',           type: '"screen" | "hero"',           description: '"screen" fills full viewport height; "hero" fills 90svh minus the sticky header and vertically centres content.' },
    { id: 'alignment',        name: 'alignment',        type: '"left" | "center" | "right" | ResponsiveObject', description: 'Horizontal alignment of direct children.' },
    { id: 'children',         name: 'children',         type: 'ReactNode',   description: 'Section content.' },
  ],
  card: [
    { id: 'as',          name: 'as',          type: 'ElementType',  description: 'Underlying HTML element. Default: "div".' },
    { id: 'variant',     name: 'variant',     type: '"default" | "navigation"', description: 'Navigation cards make the entire card interactive. Do not place nested interactive elements inside navigation cards. Default: "default".' },
    { id: 'href',        name: 'href',        type: 'string',       description: 'Destination URL for navigation cards. Renders as an anchor by default when set.' },
    { id: 'bare',        name: 'bare',        type: 'boolean',      description: 'Remove the card border and background. Default: false.' },
    { id: 'icon',        name: 'icon',        type: 'string',       description: 'Material Symbols icon name. Rendered according to iconDisplay.' },
    { id: 'iconDisplay', name: 'iconDisplay', type: '"none" | "default" | "hero"', description: '"default" = small icon block above content; "hero" = full-bleed coloured header. Default: "default" when icon is set.' },
    { id: 'heroColor',   name: 'heroColor',   type: '"action" | "neutral" | "info" | "success" | "warn" | "error" | string', description: 'Background colour of the hero block. Default: "action".' },
    { id: 'children',    name: 'children',    type: 'ReactNode',    description: 'Card content.' },
  ],
  stack: [
    { id: 'as',        name: 'as',        type: 'ElementType',  description: 'Underlying HTML element. Default: "div".' },
    { id: 'direction', name: 'direction', type: '"column" | "row" | "column-reverse" | "row-reverse" | ResponsiveObject', description: 'Flex direction. Accepts a responsive object. Default: "column".' },
    { id: 'gap',       name: 'gap',       type: '"xs" | "sm" | "md" | "lg" | number', description: 'Gap between children. Semantic token or numeric spacing value. Default: 16.' },
    { id: 'align',     name: 'align',     type: '"stretch" | "start" | "center" | "end" | "baseline"', description: 'Align-items. Default: "stretch".' },
    { id: 'justify',   name: 'justify',   type: '"start" | "center" | "end" | "between" | "around" | "evenly" | ResponsiveObject', description: 'Justify-content. Default: "start".' },
    { id: 'wrap',      name: 'wrap',      type: 'boolean',      description: 'Allow children to wrap. Default: false.' },
    { id: 'children',  name: 'children',  type: 'ReactNode',    description: 'Stacked content.' },
  ],
  cluster: [
    { id: 'as',          name: 'as',          type: 'ElementType', description: 'Underlying HTML element. Default: "div".' },
    { id: 'gap',         name: 'gap',         type: 'number',      description: 'Gap applied to both row and column axes. Default: 8.' },
    { id: 'rowGap',      name: 'rowGap',      type: 'number',      description: 'Row gap override.' },
    { id: 'columnGap',   name: 'columnGap',   type: 'number',      description: 'Column gap override.' },
    { id: 'align',       name: 'align',       type: '"start" | "center" | "end" | "stretch" | "baseline"', description: 'Align-items. Default: "center".' },
    { id: 'justify',     name: 'justify',     type: '"start" | "center" | "end" | "between" | "around" | "evenly"', description: 'Justify-content. Default: "start".' },
    { id: 'children',    name: 'children',    type: 'ReactNode',   description: 'Inline content to cluster.' },
  ],
  grid: [
    {
      title: 'Grid',
      rows: [
        { id: 'columns',   name: 'columns',   type: 'number | ResponsiveObject', description: 'Number of columns. Pass a number or a responsive object, e.g. { xs: 1, md: 2, lg: 3 }.' },
        { id: 'gap',       name: 'gap',       type: '"sm" | "md" | "lg" | "xl" | "xxl" | number', description: 'Gap for both row and column. Semantic token or numeric spacing value.' },
        { id: 'rowGap',    name: 'rowGap',    type: 'GapKey',   description: 'Row gap override. Falls back to gap.' },
        { id: 'columnGap', name: 'columnGap', type: 'GapKey',   description: 'Column gap override. Falls back to gap.' },
        { id: 'layout',    name: 'layout',    type: '"default" | "bento"', description: 'Grid layout preset. Default: "default".' },
        { id: 'autoRows',  name: 'autoRows',  type: 'string',   description: 'CSS value for grid-auto-rows.' },
        { id: 'children',  name: 'children',  type: 'ReactNode',description: 'Grid content. Use GridItem for per-cell span control.' },
      ],
    },
    {
      title: 'GridItem',
      rows: [
        { id: 'span',     name: 'span',     type: 'number | "full" | ResponsiveObject', description: 'Column span. Pass a number, "full" to span all columns, or a responsive object.' },
        { id: 'rowSpan',  name: 'rowSpan',  type: 'number | ResponsiveObject',          description: 'Row span. Pass a number or a responsive object.' },
        { id: 'children', name: 'children', type: 'ReactNode',                           description: 'Cell content.' },
      ],
    },
  ],
  bleed: [
    { id: 'as',       name: 'as',       type: 'ElementType',         description: 'Underlying HTML element. Default: "div".' },
    { id: 'space',    name: 'space',    type: 'number | "none"',     description: 'Base bleed applied to all axes when no axis override is set. Default: 16.' },
    { id: 'block',    name: 'block',    type: 'number | "none"',     description: 'Block-axis (top/bottom) bleed override. Default: "none".' },
    { id: 'inline',   name: 'inline',   type: 'number',              description: 'Inline-axis (left/right) bleed override. Falls back to space.' },
    { id: 'children', name: 'children', type: 'ReactNode',           description: 'Content that bleeds beyond the parent padding.' },
  ],
  inset: [
    { id: 'as',       name: 'as',       type: 'ElementType', description: 'Underlying HTML element. Default: "div".' },
    { id: 'space',    name: 'space',    type: 'number',      description: 'Base padding applied to all axes. Default: 16.' },
    { id: 'block',    name: 'block',    type: 'number',      description: 'Block-axis (top/bottom) padding override. Falls back to space.' },
    { id: 'inline',   name: 'inline',   type: 'number',      description: 'Inline-axis (left/right) padding override. Falls back to space.' },
    { id: 'children', name: 'children', type: 'ReactNode',   description: 'Content with inner spacing applied.' },
  ],
  spacer: [
    { id: 'size', name: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl" | "xxl" | ResponsiveObject', description: 'Space height. xs=8px, sm=16px, md=24px, lg=40px, xl=64px, xxl=96px. Accepts a responsive object. Default: "md".' },
  ],
  'page-layout': [
    { id: 'header',           name: 'header',           type: 'ReactNode', description: 'Top header slot — rendered in a <header> landmark.' },
    { id: 'footer',           name: 'footer',           type: 'ReactNode', description: 'Bottom footer slot — rendered in a <footer> landmark.' },
    { id: 'sidebar',          name: 'sidebar',          type: 'ReactNode', description: 'Side navigation panel — rendered in an <aside> landmark.' },
    { id: 'sidebarPlacement', name: 'sidebarPlacement', type: '"start" | "end"', description: 'Which side the sidebar occupies. Default: "start".' },
    { id: 'aside',            name: 'aside',            type: 'ReactNode', description: 'Supplemental content panel, e.g. a table of contents.' },
    { id: 'asidePlacement',   name: 'asidePlacement',   type: '"start" | "end"', description: 'Which side the aside occupies. Default: "end".' },
    { id: 'stickyHeader',     name: 'stickyHeader',     type: 'boolean',   description: 'Keep the header fixed at the top while content scrolls. Default: false.' },
    { id: 'viewportHeight',   name: 'viewportHeight',   type: 'boolean',   description: 'Constrain the layout to 100vh. Default: false.' },
    { id: 'children',         name: 'children',         type: 'ReactNode', description: 'Main content area.' },
  ],
  'button-container': [
    { id: 'align',    name: 'align',    type: '"start" | "center" | "end"', description: 'Horizontal alignment of buttons. Default: "start".' },
    { id: 'size',     name: 'size',     type: '"sm" | "md" | "lg"',         description: 'Default size passed to child Button elements that do not set their own size.' },
    { id: 'children', name: 'children', type: 'ReactNode',                  description: 'Button elements.' },
  ],
  figure: [
    { id: 'src',             name: 'src',             type: 'string',   description: 'Image source URL. Required.' },
    { id: 'alt',             name: 'alt',             type: 'string',   description: 'Image alt text. Pass "" for decorative images.' },
    { id: 'caption',         name: 'caption',         type: 'ReactNode',description: 'Caption text or React node rendered as <figcaption>.' },
    { id: 'captionSrOnly',   name: 'captionSrOnly',   type: 'boolean',  description: 'Render the caption visually hidden (screen-reader only). Default: false.' },
    { id: 'captionPosition', name: 'captionPosition', type: '"start" | "center"', description: 'Caption alignment. Default: "start".' },
    { id: 'radius',          name: 'radius',          type: '"none" | "sm" | "md" | "lg"', description: 'Border radius on the image.' },
    { id: 'size',            name: 'size',            type: '"xs" | "sm" | "md" | "lg"', description: 'Constrain figure width.' },
    { id: 'align',           name: 'align',           type: '"start" | "center" | "end"', description: 'Horizontal alignment of the figure. Default: "start".' },
    { id: 'bleed',           name: 'bleed',           type: 'boolean | number', description: 'Pull the figure outside its container padding. true for symmetric bleed or a spacing token for inline-only.' },
    { id: 'marginTop',       name: 'marginTop',       type: '"sm" | "md" | "lg"', description: 'Top margin.' },
    { id: 'marginBottom',    name: 'marginBottom',    type: '"sm" | "md" | "lg"', description: 'Bottom margin.' },
  ],

  // ── Overlay ───────────────────────────────────────────────────────────────
  dialog: [
    { id: 'open',     name: 'open',     type: 'boolean',   description: 'Whether the dialog is visible. Default: false.' },
    { id: 'onClose',  name: 'onClose',  type: '() => void', description: 'Called when the user closes the dialog via Escape, the close button, or a backdrop click.' },
    { id: 'title',    name: 'title',    type: 'string',    description: 'Dialog title shown in the header.' },
    { id: 'footer',   name: 'footer',   type: 'ReactNode', description: 'Footer content — wrapped in a right-aligned ButtonContainer.' },
    { id: 'children', name: 'children', type: 'ReactNode', description: 'Dialog body content.' },
  ],
  menu: [
    {
      title: 'Menu',
      rows: [
        { id: 'open',       name: 'open',       type: 'boolean',               description: 'Whether the menu is open. Required.' },
        { id: 'onClose',    name: 'onClose',    type: '() => void',            description: 'Called when the menu should close.' },
        { id: 'anchorRef',  name: 'anchorRef',  type: 'RefObject<HTMLElement>',description: 'Ref to the trigger element — used to position the menu below it.' },
        { id: 'aria-label', name: 'aria-label', type: 'string',                description: 'Accessible label for the menu dialog element.' },
        { id: 'children',   name: 'children',   type: 'ReactNode',             description: 'MenuSection and MenuItem elements.' },
      ],
    },
    {
      title: 'MenuItem',
      rows: [
        { id: 'icon',      name: 'icon',      type: 'string',            description: 'Material Symbols icon name shown before the label.' },
        { id: 'shortcut',  name: 'shortcut',  type: 'string',            description: 'Keyboard shortcut hint displayed at the trailing end, e.g. "⌘K".' },
        { id: 'variant',   name: 'variant',   type: '"default" | "destructive"', description: 'Colour variant. Default: "default".' },
        { id: 'active',    name: 'active',    type: 'boolean',           description: 'Marks this item as the current page — adds a left-border indicator and aria-current="page".' },
        { id: 'disabled',  name: 'disabled',  type: 'boolean',           description: 'Prevents interaction and visually dims the item.' },
        { id: 'href',      name: 'href',      type: 'string',            description: 'Renders as an anchor when provided.' },
        { id: 'onClick',   name: 'onClick',   type: 'MouseEventHandler', description: 'Click handler.' },
        { id: 'children',  name: 'children',  type: 'ReactNode',         description: 'Item label text.' },
      ],
    },
    {
      title: 'MenuSection',
      rows: [
        { id: 'label',    name: 'label',    type: 'string',    description: 'Optional section heading shown above the items.' },
        { id: 'children', name: 'children', type: 'ReactNode', description: 'MenuItem elements.' },
      ],
    },
  ],

  // ── Data ──────────────────────────────────────────────────────────────────
  'data-table': [
    {
      title: 'DataTable',
      rows: [
        { id: 'columns',          name: 'columns',          type: 'Column[]',  description: 'Column definitions.' },
        { id: 'rows',             name: 'rows',             type: 'Row[]',     description: 'Data rows. Each row must have an id field. All other keys map to column keys.' },
        { id: 'density',          name: 'density',          type: '"auto" | "comfortable" | "default" | "compact"', description: 'Row density. "auto" selects based on available width. Default: "default".' },
        { id: 'zebra',            name: 'zebra',            type: 'boolean',   description: 'Alternate row background colours. Default: false.' },
        { id: 'scrollable',       name: 'scrollable',       type: 'boolean',   description: 'Wrap the table in a horizontally scrollable container. Default: false.' },
        { id: 'caption',          name: 'caption',          type: 'string',    description: 'Accessible table caption.' },
        { id: 'page',             name: 'page',             type: 'number',    description: 'Controlled current page (1-based).' },
        { id: 'defaultPage',      name: 'defaultPage',      type: 'number',    description: 'Initial page (uncontrolled). Default: 1.' },
        { id: 'pageSize',         name: 'pageSize',         type: 'number',    description: 'Rows per page. Omit to disable pagination.' },
        { id: 'totalPages',       name: 'totalPages',       type: 'number',    description: 'Total pages for server-side pagination.' },
        { id: 'totalRows',        name: 'totalRows',        type: 'number',    description: 'Total row count for server-side pagination display.' },
        { id: 'onPageChange',     name: 'onPageChange',     type: '(page: number) => void', description: 'Called when the page changes.' },
        { id: 'sort',             name: 'sort',             type: '{ key, dir }', description: 'Controlled sort state. dir is "asc" or "desc".' },
        { id: 'defaultSort',      name: 'defaultSort',      type: '{ key, dir }', description: 'Initial sort state (uncontrolled).' },
        { id: 'onSortChange',     name: 'onSortChange',     type: '(sort) => void', description: 'Called when sort state changes.' },
        { id: 'filters',          name: 'filters',          type: 'FilterDef[]', description: 'Filter definitions.' },
        { id: 'selectable',       name: 'selectable',       type: 'boolean',   description: 'Enable row selection with checkboxes. Default: false.' },
        { id: 'selectedRowIds',   name: 'selectedRowIds',   type: 'string[]',  description: 'Controlled selected row IDs.' },
        { id: 'onDeleteSelected', name: 'onDeleteSelected', type: '() => void', description: 'Called when the delete action is triggered for selected rows.' },
        { id: 'emptyTitle',       name: 'emptyTitle',       type: 'string',    description: 'Heading shown when there are no results. Default: "No results".' },
        { id: 'emptyDescription', name: 'emptyDescription', type: 'string',    description: 'Supporting text shown below the empty-state heading.' },
        { id: 'emptyIcon',        name: 'emptyIcon',        type: 'string',    description: 'Icon shown in the empty state. Default: "inbox".' },
      ],
    },
    {
      title: 'Column',
      rows: [
        { id: 'key',      name: 'key',      type: 'string',  description: 'Matches a key in each row object to pull cell data. Required.' },
        { id: 'label',    name: 'label',    type: 'string',  description: 'Column header text. Required.' },
        { id: 'sortable', name: 'sortable', type: 'boolean', description: 'Allow the user to sort by this column. Default: false.' },
        { id: 'width',    name: 'width',    type: 'string',  description: 'CSS width value, e.g. "120px" or "20%". Omit for auto.' },
      ],
    },
    {
      title: 'FilterDef',
      rows: [
        { id: 'key',     name: 'key',     type: 'string',               description: 'Row property to filter on. Required.' },
        { id: 'label',   name: 'label',   type: 'string',               description: 'Filter chip label. Required.' },
        { id: 'options', name: 'options', type: '{ value, label }[]',   description: 'Available filter values shown in the filter dropdown.' },
      ],
    },
  ],
  pagination: [
    { id: 'page',       name: 'page',       type: 'number',   description: 'Current page number (1-based). Required.' },
    { id: 'totalPages', name: 'totalPages', type: 'number',   description: 'Total number of pages. Required.' },
    { id: 'onChange',   name: 'onChange',   type: '(page: number) => void', description: 'Called with the new page number when a page button is clicked.' },
    { id: 'siblings',   name: 'siblings',   type: 'number',   description: 'How many page numbers to show on each side of the current page. Default: 1.' },
    { id: 'size',       name: 'size',       type: '"sm" | "md" | "lg"', description: 'Pagination button size. Default: "md".' },
  ],
  calendar: [
    { id: 'variant',        name: 'variant',        type: '"scroll" | "paginated"',   description: 'Display mode. scroll renders all months vertically; paginated shows one month at a time with prev/next navigation. Default: "scroll".' },
    { id: 'initialMonth',   name: 'initialMonth',   type: 'Date | { year, month }',   description: 'Starting month. month is 1-indexed. Default: current month.' },
    { id: 'monthsToShow',   name: 'monthsToShow',   type: 'number',                   description: 'Total months to render. Applies to the scroll variant only. Default: 13.' },
    { id: 'highlightToday', name: 'highlightToday', type: 'boolean',                  description: "Highlight today's date with the action colour. Default: true." },
    { id: 'dimPast',        name: 'dimPast',        type: 'boolean',                  description: 'Apply a background tint to dates before today. Default: true.' },
    { id: 'todayButton',    name: 'todayButton',    type: 'boolean',                  description: 'Show a Today button in the paginated nav that jumps to the current month. Applies to variant="paginated" only. Default: false.' },
    { id: 'className',      name: 'className',      type: 'string',                   description: 'Additional CSS class names for local layout adjustment.' },
  ],

  // ── Media ─────────────────────────────────────────────────────────────────
  icon: [
    { id: 'name',        name: 'name',        type: 'string',  description: 'Material Symbols icon name, e.g. "check_circle", "home". Required.' },
    { id: 'fill',        name: 'fill',        type: 'boolean', description: 'Fill the icon shape. Default: false.' },
    { id: 'weight',      name: 'weight',      type: 'number',  description: 'Variable font weight axis (100–700). Default set via CSS token.' },
    { id: 'grade',       name: 'grade',       type: 'number',  description: 'Grade axis — adjusts visual weight without changing size (-25–200). Default set via CSS token.' },
    { id: 'opticalSize', name: 'opticalSize', type: '20 | 24 | 40 | 48', description: 'Optical size axis — adjusts detail level. Default set via CSS token.' },
  ],

  // ── Disclosure ────────────────────────────────────────────────────────────
  accordion: [
    { id: 'label',       name: 'label',       type: 'string',   description: 'Trigger label text. Required.' },
    { id: 'open',        name: 'open',        type: 'boolean',  description: 'Controlled open state.' },
    { id: 'defaultOpen', name: 'defaultOpen', type: 'boolean',  description: 'Initial open state (uncontrolled). Default: false.' },
    { id: 'onChange',    name: 'onChange',    type: '(open: boolean) => void', description: 'Called with the next boolean when the trigger is clicked.' },
    { id: 'size',        name: 'size',        type: '"sm" | "md" | "lg"', description: 'Trigger text size and padding. Default: "md".' },
    { id: 'disabled',    name: 'disabled',    type: 'boolean',  description: 'Prevent the accordion from being toggled. Default: false.' },
    { id: 'children',    name: 'children',    type: 'ReactNode',description: 'Expanded panel content.' },
  ],
}

function escapeJsxText(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function propLine(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue || value === '') return null
  return `  ${name}="${value}"`
}

function buildHeadingSnippet(config) {
  const textWrap = config.textWrap ? 'balance' : undefined
  const lines = [
    '<Heading',
    propLine('as', config.as, 'h2'),
    propLine('type', config.type, 'heading'),
    propLine('size', config.size, undefined),
    propLine('color', config.color, 'default'),
    propLine('align', config.align, 'left'),
    propLine('margin', config.margin, undefined),
    propLine('textWrap', textWrap, undefined),
    '>',
  ].filter(Boolean)

  return `${lines.join('\n')}\n  ${escapeJsxText(config.children || 'Heading')}\n</Heading>`
}

function CodeSnippets({ component, config }) {
  const reactName = component.title.replace(/\s+/g, '')

  if (component.id === 'heading') {
    return <Code variant="block" wrapping copyCode>{buildHeadingSnippet(config)}</Code>
  }

  const snippets = COMPONENT_SNIPPETS[component.id] ?? {
    react: `<${reactName}>${component.title}</${reactName}>`,
    native: `<${reactName}>${component.title}</${reactName}>`,
    pure: `<div class="a1-${component.id}">${component.title}</div>`,
  }

  return <Code variant="block" wrapping copyCode>{snippets.react}</Code>
}

const FALLBACK_PROP_ROWS = [
  { id: 'children', name: 'children', type: 'ReactNode', description: 'Visible content or composed child elements.' },
  { id: 'className', name: 'className', type: 'string', description: 'Additional CSS class names for local layout hooks.' },
]

function normalizePropTables(component) {
  const entry = COMPONENT_PROPS[component.id]
  if (!entry) return [{ title: null, rows: FALLBACK_PROP_ROWS }]
  // Multi-table format: array of { title, rows }
  if (entry[0]?.rows !== undefined) return entry
  // Single-table format: flat row array — wrap with component title
  return [{ title: component.title, rows: entry }]
}

function getDefaultConfig(component, category) {
  if (component.id === 'heading') {
    return {
      as: 'h2',
      type: 'heading',
      size: 'md',
      color: 'default',
      align: 'left',
      margin: '',
      textWrap: false,
      children: component.title,
    }
  }

  return {
    label: component.title,
    icon: category.icon,
    size: 'default',
    variant: 'primary',
    showIcon: true,
  }
}

export function ComponentDetailPage({ component, category, onNavigate, tab = 'overview', onTabChange }) {
  const [config, setConfig] = useState(() => getDefaultConfig(component, category))
  const statusKey = COMPONENT_STATUS[component.id] ?? 'beta'
  const statusMeta = STATUS_META[statusKey] ?? STATUS_META.beta
  const relatedComponents = getRelatedComponents(component)

  useEffect(() => {
    setConfig(getDefaultConfig(component, category))
  }, [component.id, component.title, category.icon])

  return (
    <ComponentDocsShell>
      <Section padding="none" contentWidth="xl">
        <Tabs value={tab} onChange={onTabChange}>
          <TabList>
            <Tab value="configure">Configure</Tab>
            <Tab value="overview">Overview</Tab>
            <Tab value="anatomy">Anatomy</Tab>
            <Tab value="rules">Rules</Tab>
            <Tab value="properties">Properties</Tab>
            <Tab value="accessibility">Accessibility</Tab>
          </TabList>
          <TabPanel value="configure">
            <Stack gap="xl">
              <Grid columns={{ xs: 1, md: 12 }} gap="md">
                <GridItem span={{ xs: 1, md: 8 }}>
                                <Stack gap="sm">
                  <Section surface="panel" gap="lg">
                    <ComponentPreview component={component} config={config} />
                  </Section>

                <CodeSnippets component={component} config={config} />
              </Stack>

                </GridItem>
                <GridItem span={{ xs: 1, md: 4 }}>
                  <Section padding="xs" surface="raised">
                    <ConfigureControls component={component} config={config} setConfig={setConfig} />
                  </Section>
                </GridItem>
              </Grid>
            </Stack>
          </TabPanel>

          <TabPanel value="overview">
            <Stack gap="xl">

              <Section padding="md" surface="raised" align="center">
                  <AnatomyComponentPreview component={component} />
              </Section>
                <Paragraph size="sm">{component.body}</Paragraph>

              <Card shadow="xs">
                <Stack direction="column" gap="sm">
                  <MessageBadge status={statusMeta.status} icon={statusMeta.icon}>{statusMeta.label}</MessageBadge>
                  <Heading as="h3" size="sm">Component status</Heading>
                  <Paragraph size="sm" color="muted">{statusMeta.desc}</Paragraph>
                </Stack>
              </Card>

              <Stack direction="column" gap="sm">
                <Heading as="h3" size="sm">Package support</Heading>
                <PackageSupportGrid packages={component.packages ?? ['React']} />
              </Stack>

              {relatedComponents.length > 0 && (
                <Stack direction="column" gap="sm">
                  <Heading as="h3" size="sm">Related components</Heading>
                  <List icon="arrow_forward" size="sm" color="muted">
                    {relatedComponents.map((relatedComponent) => (
                      <ListItem key={relatedComponent.id}>
                        <Link
                          href={getComponentPath(`component-${relatedComponent.id}`)}
                          onClick={(event) => navigateCard(event, onNavigate, `component-${relatedComponent.id}`)}
                        >
                          {relatedComponent.title}
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </Stack>
              )}
            </Stack>
          </TabPanel>

          <TabPanel value="anatomy">
            <AnatomyPanel component={component} category={category} />
          </TabPanel>

          <TabPanel value="rules">
            <RulesPanel component={component} />
          </TabPanel>


          <TabPanel value="properties">
            <Stack gap="xl">
              {normalizePropTables(component).map((table, i) => (
                <Stack key={i} gap="sm">
                  {table.title && <Heading as="h3" size="sm">{table.title}</Heading>}
                  <DataTable
                    caption={table.title ?? `${component.title} properties`}
                    size="comfortable"
                    columns={[
                      { key: 'name', label: 'Property', sortable: true, width: '160px' },
                      { key: 'type', label: 'Type', width: '260px' },
                      { key: 'description', label: 'Description' },
                    ]}
                    rows={table.rows}
                  />
                </Stack>
              ))}
            </Stack>
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
      </Section>
    </ComponentDocsShell>
  )
}
