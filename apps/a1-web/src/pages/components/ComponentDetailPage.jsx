import { useState } from 'react'
import {
  Accordion,
  Banner,
  Bleed,
  Blockquote,
  Breadcrumb,
  Button,
  ButtonContainer,
  Card,
  CheckboxGroup,
  Cluster,
  DataTable,
  Divider,
  Fieldset,
  Figure,
  Grid,
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
  Pure:   { icon: 'style',        desc: 'packages/html-css' },
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
          Inline content can include <code>code</code>, <kbd>keyboard</kbd>, and <mark>marked text</mark>.
        </Paragraph>
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
          density="compact"
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
          density="compact"
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

function ConfigureControls({ config, setConfig }) {
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

export function ComponentDetailPage({ component, category, onNavigate, tab = 'overview', onTabChange }) {
  const [config, setConfig] = useState({
    label: component.title,
    icon: category.icon,
    size: 'default',
    variant: 'primary',
    showIcon: true,
  })
  const statusKey = COMPONENT_STATUS[component.id] ?? 'beta'
  const statusMeta = STATUS_META[statusKey] ?? STATUS_META.beta
  const relatedComponents = getRelatedComponents(component)

  return (
    <ComponentDocsShell>
      <Section padding="none" contentWidth="xl">
        <Tabs value={tab} onChange={onTabChange} variant="line">
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
            <Stack gap="xl">
              <Stack direction="column" gap="md">
                <Paragraph size="lg">{component.body}</Paragraph>
                <Stack direction="row" gap="sm" align="center" wrap>
                  <MessageBadge subtle icon={category.icon}>{category.title}</MessageBadge>
                  <MessageBadge subtle icon="schedule">Updated {LAST_UPDATED}</MessageBadge>
                </Stack>
              </Stack>

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

          <TabPanel value="configure">
            <Grid columns={{ xs: 1, md: 2 }} gap="md">
              <Stack gap="md">
                <Heading as="h3" size="md">Configurable preview</Heading>
                <ComponentPreview component={component} config={config} />
              </Stack>
              <Card>
                <ConfigureControls config={config} setConfig={setConfig} />
              </Card>
            </Grid>
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
      </Section>
    </ComponentDocsShell>
  )
}
