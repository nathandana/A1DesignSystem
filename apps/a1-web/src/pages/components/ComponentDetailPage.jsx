import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
  CircularProgress,
  Code,
  Cluster,
  DataTable,
  DefinitionList,
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
  StatusBar,
  Snackbar,
  StepTracker,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  TextareaField,
  Toolbar,
  ToolbarGroup,
  ToolbarMenu,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { Toggle } from './detail/Toggle.jsx'
import { ConfigHelpContext } from './detail/configKit.jsx'
import {
  COMPONENT_STATUS,
  PACKAGE_COLUMNS,
  STATUS_META,
  LAST_UPDATED,
} from './data.js'
import { ComponentDocsShell } from './ComponentDocsShell.jsx'
import { getDetailModule } from './detail/index.js'
import { CreateTicketButton } from '../../backlog/CreateTicketButton'
import { ResponsivePreviewFrame, VIEWPORT_PRESETS, viewportSize } from './detail/ResponsivePreviewFrame.jsx'
import { UtilityControls } from '../../editor/UtilityControls.jsx'
import { cleanUtilities, utilityClassesFor, utilityTypeForCatalogComponent } from '../../editor/utilityRegistry.ts'
import {
  getBreadcrumbItems,
  getComponentPath,
  getRelatedComponents,
  getRulesForComponent,
  navigateCard,
  navigateBreadcrumb,
} from './utils.js'
import { GENERATED_PROP_TABLES } from './generatedPropTables.js'
import { BUTTON_CONTRAST_ROWS, BUTTON_TARGET_SIZE_ROWS } from './accessibilityReports.generated.js'

const PACKAGE_META = {
  React:  { icon: 'code',         desc: 'packages/react' },
  Native: { icon: 'phone_iphone', desc: 'packages/react-native' },
  Pure:   { icon: 'palette',      desc: 'packages/pure' },
}

function componentUtilityType(component) {
  return utilityTypeForCatalogComponent(component.id, component.title)
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
  notification: {
    sizing: {
      width: 'Content-sized',
      widthBehavior: 'A small dot, count, or label badge anchored to its child — it takes only the space its content needs, so it centers in the display Section.',
    },
  },
  slider: {
    sizing: {
      width: 'Flexible',
      widthBehavior: 'The slider fills its container width; it should not be centered or shrunk.',
      height: 'Fixed by size',
      heightBehavior: 'Track and thumb scale with the `size` prop; the label adds height above.',
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
  'definition-list': {
    callouts: [
      { label: 'List container', description: 'Semantic dl element owns direction, size, and responsive label width behavior.', anchor: 'top-left' },
      { label: 'Label term', description: 'Each dt names the value and uses muted, medium-weight text for scanability.', anchor: 'top' },
      { label: 'Value description', description: 'Each dd contains the value and may render body text, rich React content, or Heading typography.', anchor: 'center' },
      { label: 'Copy action', description: 'Optional copy button sits beside exact reusable values and keeps an accessible label.', anchor: 'bottom-right' },
    ],
    sizing: {
      width: 'Flexible',
      widthBehavior: 'Fills the parent container. Fixed row labels use container width to align values while preserving responsive space.',
      height: 'Content-driven',
      heightBehavior: 'Height grows from item count, selected size, wrapping labels, values, and optional copy buttons.',
      wrapping: 'Labels and values wrap by default. Row layout stacks at narrow container widths.',
      overflow: 'Content should wrap inside each pair; use DataTable for wide multi-column comparison.',
    },
  },
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

// Components with a natural (content-sized) width — buttons, badges, etc. — look
// best centered in the display Section. Flexible/full-width components (Paragraph,
// fields, tables) must stay full-width, so they default to no alignment; the
// Section's `align` (justify-items) would otherwise shrink them to their content.
function componentHasNaturalWidth(component, category) {
  // Both content-sized and fixed-width controls (e.g. Icon Button) don't stretch,
  // so they should be centered rather than pinned to the start.
  const width = mergeAnatomySpec(component, category).sizing.width
  return width === 'Content-sized' || width === 'Fixed'
}

// Default display alignment for a component: center natural-width controls, leave
// flexible components full-width (overridable either way via the Display tab).
function defaultDisplayAlign(component, category) {
  return componentHasNaturalWidth(component, category) ? 'center' : ''
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
    case 'text-field':
      return <TextField label={component.title} value="Example value" readOnly />
    case 'number-field':
      return <TextField label={component.title} type="text" value="1,200" readOnly />
    case 'date-field':
      return <TextField label={component.title} type="date" value="2026-06-15" readOnly />
    case 'time-field':
      return <TextField label={component.title} type="time" value="09:30" readOnly />
    case 'phone-field':
      return <TextField label={component.title} type="tel" value="(555) 012-3456" readOnly />
    case 'zip-field':
      return <TextField label={component.title} value="90210" readOnly />
    case 'credit-card-field':
      return <TextField label={component.title} value="4242 4242 4242 4242" readOnly />
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
    case 'badge':
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
    case 'status-bar':
      return <StatusBar value={65} label="Progress" />
    case 'circular-progress':
      return <CircularProgress value={65} aria-label="65% complete">65%</CircularProgress>
    case 'step-tracker':
      return <StepTracker steps={5} currentStep={2} />
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
    case 'context-menu':
      return (
        <Stack direction="column" gap="xs">
          <Icon name="right_click" size="lg" color="muted" />
          <Paragraph size="sm" color="muted">Right-click menu</Paragraph>
        </Stack>
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
    case 'definition-list':
      return (
        <DefinitionList
          direction="row"
          labelWidth="fixed"
          size="sm"
          items={[
            { label: 'Status', value: 'Ready' },
            { label: 'Record ID', value: 'A1-849204', copyValue: true },
            { label: 'Owner', value: 'Platform team' },
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

// Shared prop rows for the field family (TextField, NumberField, DateField, …).
const FIELD_BASE_ROWS = [
  { id: 'label',         name: 'label',         type: 'string',   description: 'Visible label text.' },
  { id: 'hint',          name: 'hint',          type: 'string',   description: 'Helper text shown below the field.' },
  { id: 'error',         name: 'error',         type: 'string',   description: 'Error message — replaces hint and marks the field invalid.' },
  { id: 'size',          name: 'size',          type: '"comfortable" | "default" | "compact"', description: 'Size density. Inherits from parent Fieldset when omitted. Default: "default".' },
  { id: 'labelPosition', name: 'labelPosition', type: '"above" | "before"', description: 'Label placement. Inherits from parent Fieldset when omitted. Default: "above".' },
  { id: 'value',         name: 'value',         type: 'string',   description: 'Controlled input value (use defaultValue for uncontrolled).' },
  { id: 'required',      name: 'required',      type: 'boolean',  description: 'Marks the field as required and shows a required indicator.' },
  { id: 'disabled',      name: 'disabled',      type: 'boolean',  description: 'Disables the input.' },
  { id: 'readOnly',      name: 'readOnly',      type: 'boolean',  description: 'Makes the input read-only.' },
]

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
    { id: 'element',  name: '(element)', type: 'strong | b | em | i | u | s | del | ins | mark | small | sub | sup | abbr | cite | q | time | code | kbd | samp | var | span.a1-muted | span.a1-accent', description: 'Inline uses native semantic HTML elements directly — no wrapper component. Each element carries its semantic meaning, and utility spans provide muted/accent inline text.' },
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
    { id: 'variant',     name: 'variant',     type: '"subtle" | "strong" | "accent"', description: 'Color tone. Default: "subtle".' },
    { id: 'lineStyle',   name: 'lineStyle',   type: '"solid" | "dashed" | "dotted"', description: 'Border pattern. Can combine with any variant, for example accent + dashed. Default: "solid".' },
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
  'text-field': [
    ...FIELD_BASE_ROWS,
    { id: 'type',         name: 'type',         type: '"text" | "email" | "password" | string', description: 'HTML input type. Default: "text".' },
    { id: 'inputOverlay', name: 'inputOverlay', type: 'ReactNode', description: 'Element rendered inside the field control, e.g. a unit suffix.' },
  ],
  'number-field': [
    ...FIELD_BASE_ROWS,
    { id: 'prefix', name: 'prefix', type: 'string', description: 'Non-editable prefix before the value at full size (e.g. "$").' },
    { id: 'unit',   name: 'unit',   type: 'string', description: 'Non-editable unit after the value, smaller and muted (e.g. "lbs").' },
  ],
  'date-field': FIELD_BASE_ROWS,
  'time-field': FIELD_BASE_ROWS,
  'phone-field': [
    ...FIELD_BASE_ROWS,
    { id: 'mask', name: 'mask', type: 'string', description: 'Input mask pattern. Defaults to a standard phone format.' },
  ],
  'zip-field': [
    ...FIELD_BASE_ROWS,
    { id: 'mask', name: 'mask', type: 'string', description: 'Input mask pattern. ZIP_MASKS provides common presets.' },
  ],
  'credit-card-field': FIELD_BASE_ROWS,
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
  badge: [
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
    { id: 'status',   name: 'status',   type: '"neutral" | "info" | "success" | "warn" | "error"', description: 'Badge status colour. Default: "neutral".' },
    { id: 'position', name: 'position', type: '"top-right" | "top-left" | "bottom-right" | "bottom-left"', description: 'Corner the badge anchors to. Default: "top-right".' },
    { id: 'max',      name: 'max',      type: 'number',     description: 'Maximum count shown before displaying as "max+". Default: 99.' },
  ],
  snackbar: [
    { id: 'open',        name: 'open',        type: 'boolean',   description: 'Whether the snackbar is visible. Default: false.' },
    { id: 'children',    name: 'children',    type: 'ReactNode', description: 'Snackbar message text.' },
    { id: 'actionLabel', name: 'actionLabel', type: 'string',    description: 'Label for the inline action button (e.g. "Undo").' },
    { id: 'onAction',    name: 'onAction',    type: '() => void', description: 'Called when the action button is clicked.' },
    { id: 'onClose',     name: 'onClose',     type: '() => void', description: 'Called when the snackbar auto-dismisses or is closed.' },
    { id: 'position',    name: 'position',    type: '"bottom" | "bottom-left" | "bottom-right" | "top" | "top-left" | "top-right"', description: 'Screen position. Default: "bottom".' },
  ],
  'empty-state': [
    { id: 'scale',       name: 'scale',       type: '"page" | "section" | "card"', description: 'Visual scale matching the container. page = largest (h1), section = medium (h2), card = compact (h3). Default: "section".' },
    { id: 'icon',        name: 'icon',        type: 'string',    description: 'Material Symbols icon name shown above the title. Default: "inbox".' },
    { id: 'title',       name: 'title',       type: 'string',    description: 'Primary message.' },
    { id: 'description', name: 'description', type: 'string',    description: 'Supporting description text below the title.' },
    { id: 'action',      name: 'action',      type: 'ReactNode', description: 'Action element (e.g. a Button) rendered below the description.' },
  ],
  'status-bar': [
    { id: 'value',         name: 'value',         type: 'number', description: 'Current progress value. Default: 0.' },
    { id: 'max',           name: 'max',           type: 'number', description: 'Maximum progress value. Default: 100.' },
    { id: 'label',         name: 'label',         type: 'ReactNode', description: 'Visible label shown before, after, above, or below the bar.' },
    { id: 'labelPosition', name: 'labelPosition', type: '"above" | "below" | "before" | "after"', description: 'Label placement. Default: "above".' },
    { id: 'size',          name: 'size',          type: '"sm" | "md" | "lg"', description: 'Track height. Default: "md".' },
    { id: 'indeterminate', name: 'indeterminate', type: 'boolean', description: 'Shows an animated loading sweep and removes aria-valuenow. Default: false.' },
    { id: 'aria-label',    name: 'aria-label',    type: 'string', description: 'Accessible name for the progressbar when no visible label is provided.' },
  ],
  'circular-progress': [
    { id: 'value',         name: 'value',         type: 'number', description: 'Current progress value. Default: 0.' },
    { id: 'max',           name: 'max',           type: 'number', description: 'Maximum progress value. Default: 100.' },
    { id: 'size',          name: 'size',          type: '"xs" | "sm" | "md" | "lg" | "xl"', description: 'Ring size. Default: "md".' },
    { id: 'indeterminate', name: 'indeterminate', type: 'boolean', description: 'Shows a spinning loading indicator and removes aria-valuenow. Default: false.' },
    { id: 'children',      name: 'children',      type: 'ReactNode', description: 'Optional visual content inside the ring for sm and larger, or after the ring for xs.' },
    { id: 'aria-label',    name: 'aria-label',    type: 'string', description: 'Accessible name for the progressbar. Required because visual children are aria-hidden.' },
  ],
  'step-tracker': [
    { id: 'steps',       name: 'steps',       type: 'number', description: 'Total number of steps. Minimum effective value is 1.' },
    { id: 'currentStep', name: 'currentStep', type: 'number', description: 'Current 1-based step. Values are clamped between 1 and steps. Default: 1.' },
    { id: 'align',       name: 'align',       type: '"left" | "center" | "right" | "full"', description: 'Horizontal alignment. Full expands the current step pill to fill remaining width. Default: "left".' },
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
    { id: 'align',            name: 'align',            type: '"left" | "center" | "right" | ResponsiveObject', description: 'Horizontal alignment of direct children.' },
    { id: 'borderSize',       name: 'borderSize',       type: '"xs" | "sm" | "md" | "lg"', description: 'Border thickness. Uses the same size tokens as Divider. Omit for no border.' },
    { id: 'borderStyle',      name: 'borderStyle',      type: '"solid" | "dashed" | "dotted"', description: 'Border pattern. Uses the same line styles as Divider. Default: "solid".' },
    { id: 'borderVariant',    name: 'borderVariant',    type: '"subtle" | "strong" | "accent"', description: 'Border color tone. Uses the same variants as Divider. Default: "subtle".' },
    { id: 'radius',           name: 'radius',           type: '"none" | "sm" | "md" | "lg" | "xl"', description: 'Border radius scale. Default: "none".' },
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
    { id: 'status',      name: 'status',      type: '"neutral" | "info" | "success" | "warn" | "error"', description: 'Coloured status stripe down the card’s inline-start edge (MessageBadge tones). Pair with statusLabel so meaning isn’t colour-only. Default: none.' },
    { id: 'statusLabel', name: 'statusLabel', type: 'ReactNode',    description: 'Badge label at the top of the content, tinted to match status. Only renders when status is set.' },
    { id: 'statusPulse', name: 'statusPulse', type: 'boolean',      description: 'Subtly pulses the status stripe to signal in-progress work. Respects prefers-reduced-motion. Default: false.' },
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
    { id: 'size',     name: 'size',     type: '"sm" | "md" | "lg" | "xl"', description: 'Dialog width: sm (440px), md (560px, default), lg (720px), xl (920px). Every size caps at the viewport.' },
    { id: 'status',   name: 'status',   type: '"success" | "error" | "warn" | "info" | "neutral"', description: 'Renders a full-bleed colored hero band at the top with a status icon.' },
    { id: 'icon',     name: 'icon',     type: 'string',    description: 'Overrides the default status icon when status is set.' },
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
  'definition-list': [
    {
      title: 'DefinitionList',
      rows: [
        { id: 'items',             name: 'items',             type: 'DefinitionListItem[]',                    description: 'Label/value pairs rendered as semantic dt/dd groups. Default: [].' },
        { id: 'direction',         name: 'direction',         type: '"row" | "column"',                       description: 'Pair layout. Row places label and value side-by-side; column stacks each label above its value. Default: "row".' },
        { id: 'size',              name: 'size',              type: '"sm" | "md" | "lg"',                     description: 'Spacing and body text size. Default: "md".' },
        { id: 'labelWidth',        name: 'labelWidth',        type: '"auto" | "fixed"',                       description: 'Row label sizing. Auto lets each label hug content; fixed aligns values using a responsive label column that adapts to container width. Default: "auto".' },
        { id: 'copyValue',         name: 'copyValue',         type: 'boolean',                                description: 'Show copy buttons for copyable text values. Can be overridden per item. Default: false.' },
        { id: 'copyLabel',         name: 'copyLabel',         type: 'string',                                 description: 'Accessible label for copy buttons. Default: "Copy value".' },
        { id: 'copiedLabel',       name: 'copiedLabel',       type: 'string',                                 description: 'Accessible label after a copy succeeds. Default: "Copied".' },
        { id: 'valueHeadingProps', name: 'valueHeadingProps', type: 'Omit<HeadingProps, "children" | "className">', description: 'Render values with Heading typography, including type and all Heading/Display sizes. Can be overridden per item.' },
        { id: 'className',         name: 'className',         type: 'string',                                 description: 'Additional CSS class names for local layout adjustment.' },
      ],
    },
    {
      title: 'DefinitionListItem',
      rows: [
        { id: 'id',                name: 'id',                type: 'React.Key',                              description: 'Stable key for this item. Falls back to label or index.' },
        { id: 'label',             name: 'label',             type: 'ReactNode',                              description: 'Label rendered in the dt element. Required.' },
        { id: 'value',             name: 'value',             type: 'ReactNode',                              description: 'Value rendered in the dd element.' },
        { id: 'children',          name: 'children',          type: 'ReactNode',                              description: 'Alternate value content for object-literal ergonomics.' },
        { id: 'copyValue',         name: 'copyValue',         type: 'boolean',                                description: 'Enables or disables the copy button for this item. Defaults to the list-level copyValue prop.' },
        { id: 'copyText',          name: 'copyText',          type: 'string',                                 description: 'Exact clipboard text. Defaults to the rendered text value when it can be inferred.' },
        { id: 'copyLabel',         name: 'copyLabel',         type: 'string',                                 description: 'Accessible label override for this item copy button.' },
        { id: 'copiedLabel',       name: 'copiedLabel',       type: 'string',                                 description: 'Accessible copied-state label override for this item copy button.' },
        { id: 'valueHeadingProps', name: 'valueHeadingProps', type: 'Omit<HeadingProps, "children" | "className">', description: 'Heading typography override for this item value.' },
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
    { id: 'name',        name: 'name',        type: 'string',  description: 'Material Symbols name, e.g. "home", or a registered project icon as "custom:name". Required.' },
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

const FALLBACK_PROP_ROWS = [
  { id: 'children', name: 'children', type: 'ReactNode', description: 'Visible content or composed child elements.' },
  { id: 'className', name: 'className', type: 'string', description: 'Additional CSS class names for local layout hooks.' },
]

const CONTAINER_QUERY_COMPONENT_IDS = new Set([
  'breadcrumb',
  'button-container',
  'calendar',
  'card',
  'definition-list',
])

const CONTAINER_QUERY_PRESETS = [
  { label: 'Auto', value: 'auto', subtext: '100%' },
  { label: 'xs', value: 'xs', subtext: '240px' },
  { label: 'sm', value: 'sm', subtext: '320px' },
  { label: 'md', value: 'md', subtext: '480px' },
  { label: 'lg', value: 'lg', subtext: '640px' },
  { label: 'xl', value: 'xl', subtext: '960px' },
]

function supportsContainerQueries(component) {
  return CONTAINER_QUERY_COMPONENT_IDS.has(component.id)
}

function ContainerQueryPreviewFrame({ component, displayConfig, children }) {
  const preset = displayConfig.containerQuery ?? 'auto'

  if (!supportsContainerQueries(component) || preset === 'auto') {
    return children
  }

  return (
    <div className="a1-web-container-query-preview-scroll">
      <div className={`a1-web-container-query-preview a1-web-container-query-preview--${preset} a1-web-container-query-preview--${component.id}`}>
        {children}
      </div>
    </div>
  )
}

// Viewport presets for the responsive preview. Each renders the preview inside
// an iframe of the given width — a real nested viewport, so CSS @media (and
// container) queries respond accurately — then scales it down to fit the panel.
// Preview padding options for the center-panel display toolbar.
const PADDING_ITEMS = [
  { value: 'none', label: 'None' },
  { value: 'xs', label: 'XS' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
]

const VISIBLE_DETAIL_TABS = new Set(['configure', 'rules', 'properties', 'accessibility'])
const EXAMPLE_TAB_PREFIX = 'example:'
const GENERATED_PROP_ALIASES = {
  'date-field': 'text-field',
  'time-field': 'text-field',
  'phone-field': 'text-field',
  'zip-field': 'text-field',
  'credit-card-field': 'text-field',
}

function visibleDetailTab(tab) {
  if (tab?.startsWith(EXAMPLE_TAB_PREFIX)) return 'examples'
  return VISIBLE_DETAIL_TABS.has(tab) ? tab : 'configure'
}

function exampleIdFromTab(tab) {
  return tab?.startsWith(EXAMPLE_TAB_PREFIX) ? tab.slice(EXAMPLE_TAB_PREFIX.length) : null
}

function cloneExampleConfig(config) {
  return JSON.parse(JSON.stringify(config ?? {}))
}

function examplePreviewStyle(example) {
  const width = example?.preview?.width
  return width ? { '--a1-web-example-preview-width': width } : undefined
}

function normalizePropTables(component) {
  const generatedAlias = GENERATED_PROP_ALIASES[component.id]
  const generatedEntry = GENERATED_PROP_TABLES[component.id] ?? GENERATED_PROP_TABLES[generatedAlias]
  if (generatedEntry?.length) {
    return generatedEntry.map((table, index) => ({
      ...table,
      title: generatedAlias && index === 0 ? component.title : table.title,
    }))
  }

  const entry = COMPONENT_PROPS[component.id]
  if (!entry) return [{ title: null, rows: FALLBACK_PROP_ROWS }]
  // Multi-table format: array of { title, rows }
  if (entry[0]?.rows !== undefined) return entry
  // Single-table format: flat row array — wrap with component title
  return [{ title: component.title, rows: entry }]
}

const BUTTON_KEYBOARD_ROWS = [
  { id: 'tab', key: 'Tab', expected: 'Moves focus to the next enabled Button in DOM order.', status: 'Required' },
  { id: 'shift-tab', key: 'Shift + Tab', expected: 'Moves focus to the previous enabled focusable control.', status: 'Required' },
  { id: 'enter', key: 'Enter', expected: 'Activates a native button or link button once.', status: 'Required' },
  { id: 'space', key: 'Space', expected: 'Activates a native button once on keyup; page should not scroll.', status: 'Required' },
  { id: 'escape', key: 'Escape', expected: 'No Button behavior by itself; parent overlays may handle dismissal.', status: 'Contextual' },
  { id: 'loading', key: 'Loading state', expected: 'Button becomes inert, exposes aria-busy, and prevents duplicate activation.', status: 'Required' },
]

const BUTTON_WCAG_ROWS = [
  { id: '111', guideline: '1.1.1 Non-text content', level: 'A', evidence: 'Decorative icons are hidden or paired with a visible text label. Icon-only use belongs to IconButton with an accessible label.' },
  { id: '141', guideline: '1.4.1 Use of color', level: 'A', evidence: 'Intent variants are not enough on their own; destructive/success actions need meaningful text.' },
  { id: '143', guideline: '1.4.3 Contrast minimum', level: 'AA', evidence: 'Text variants target at least 4.5:1 against their rendered surface.' },
  { id: '1411', guideline: '1.4.11 Non-text contrast', level: 'AA', evidence: 'Borders, focus rings, and spinner affordances target at least 3:1 against adjacent colors.' },
  { id: '211', guideline: '2.1.1 Keyboard', level: 'A', evidence: 'Native button and anchor semantics preserve keyboard activation without custom handlers.' },
  { id: '243', guideline: '2.4.3 Focus order', level: 'A', evidence: 'Buttons follow DOM order; full-width and icon variants do not change focus sequence.' },
  { id: '247', guideline: '2.4.7 Focus visible', level: 'AA', evidence: 'Focus-visible ring remains present across variants, sizes, and inverse surfaces.' },
  { id: '2411', guideline: '2.4.11 Focus appearance', level: 'AA', evidence: 'Focus indicator area, thickness, and contrast are tested as part of the release gate.' },
  { id: '253', guideline: '2.5.3 Label in name', level: 'A', evidence: 'Visible label text is included in the accessible name.' },
  { id: '255', guideline: '2.5.5 Target size', level: 'AAA / advisory', evidence: 'Generated target-size rows record the minimum visual block size for each Button size. Small and medium require spacing, equivalent-target, or inline-layout justification; large meets 44 px by token.' },
  { id: '412', guideline: '4.1.2 Name, role, value', level: 'A', evidence: 'Button renders native role and state; loading exposes aria-busy and inert behavior.' },
]

const BUTTON_TEST_ROWS = [
  { id: 'axe', area: 'Automated axe', coverage: 'React stories, page preview, inverse surface', owner: 'CI / changed component run', result: 'No violations expected' },
  { id: 'contrast', area: 'Token contrast', coverage: 'All variants, disabled, focus, inverse', owner: 'Design system audit', result: 'Ratios recorded before release' },
  { id: 'keyboard', area: 'Keyboard manual', coverage: 'Tab, Shift+Tab, Enter, Space, loading, disabled', owner: 'Reviewer', result: 'Pass required' },
  { id: 'screen-reader', area: 'Screen reader smoke', coverage: 'VoiceOver Safari, NVDA Firefox, JAWS Chrome', owner: 'Reviewer', result: 'Name, role, busy, disabled announced' },
  { id: 'zoom', area: 'Zoom and reflow', coverage: '200% and 400%, xs to xl', owner: 'Reviewer', result: 'No clipped labels or hidden focus' },
  { id: 'motion', area: 'Reduced motion', coverage: 'Spinner and state transitions', owner: 'Reviewer', result: 'No essential info conveyed by motion alone' },
]

const BUTTON_CONTRAST_SPECS = [
  {
    id: 'primary',
    surface: 'Primary',
    foreground: 'Primary foreground',
    background: 'Primary background',
    foregroundToken: 'component-button-primary-foreground',
    backgroundToken: 'component-button-primary-background',
  },
  {
    id: 'secondary',
    surface: 'Secondary',
    foreground: 'Secondary foreground',
    background: 'Secondary background',
    foregroundToken: 'component-button-secondary-foreground',
    backgroundToken: 'component-button-secondary-background',
  },
  {
    id: 'tertiary',
    surface: 'Tertiary',
    foreground: 'Tertiary foreground',
    background: 'Tertiary background',
    foregroundToken: 'component-button-tertiary-foreground',
    backgroundToken: 'component-button-tertiary-background',
  },
  {
    id: 'destructive',
    surface: 'Destructive',
    foreground: 'Error foreground',
    background: 'Error background',
    foregroundToken: 'semantic-color-status-error-foreground',
    backgroundToken: 'semantic-color-status-error-background',
  },
  {
    id: 'success',
    surface: 'Success',
    foreground: 'Success foreground',
    background: 'Success background',
    foregroundToken: 'semantic-color-status-success-foreground',
    backgroundToken: 'semantic-color-status-success-background',
  },
]

const BUTTON_TARGET_SIZE_SPECS = [
  {
    id: 'small',
    size: 'Small',
    tokenName: '--component-button-small-height',
    token: 'component-button-small-height',
    usage: 'Dense toolbars, compact tables, and repeated low-risk actions.',
  },
  {
    id: 'medium',
    size: 'Medium',
    tokenName: '--component-button-min-height',
    token: 'component-button-min-height',
    usage: 'Default application actions.',
  },
  {
    id: 'large',
    size: 'Large',
    tokenName: '--component-button-large-height',
    token: 'component-button-large-height',
    usage: 'Primary calls to action and touch-forward layouts.',
  },
]

const FORM_COMPONENT_IDS = new Set([
  'text-field',
  'search-field',
  'number-field',
  'date-field',
  'time-field',
  'phone-field',
  'zip-field',
  'credit-card-field',
  'textarea',
  'select',
  'autocomplete',
  'checkbox-group',
  'radio-group',
  'choice-group',
  'fieldset',
  'field-row',
  'inline-editable',
])

const NAVIGATION_COMPONENT_IDS = new Set([
  'breadcrumb',
  'side-nav',
  'top-header',
  'bottom-drawer',
  'page-nav',
  'tree-menu',
  'tabs',
  'pagination',
  'calendar',
  'link',
])

const OVERLAY_COMPONENT_IDS = new Set(['dialog', 'menu', 'context-menu', 'bottom-sheet'])

const INTERACTIVE_COMPONENT_IDS = new Set([
  'button',
  'icon-button',
  'switch',
  'segmented-control',
  'slider',
  'toolbar',
  'sticky-actions',
  'accordion',
  'tabs',
  'link',
  'data-table',
  'calendar',
  'canvas',
  'node',
  ...FORM_COMPONENT_IDS,
  ...NAVIGATION_COMPONENT_IDS,
  ...OVERLAY_COMPONENT_IDS,
])

const TARGET_SIZE_TOKEN_SPECS = {
  'icon-button': [
    { id: 'default', size: 'Default', tokenName: '--component-icon-button-size', token: 'component-icon-button-size', usage: 'Icon-only action target.' },
  ],
  switch: [
    { id: 'compact-track', size: 'Compact track', tokenName: '--component-switch-compact-track-height', token: 'component-switch-compact-track-height', usage: 'Compact switch visual track; row padding and label area must supply the full target.' },
    { id: 'default-track', size: 'Default track', tokenName: '--component-switch-track-height', token: 'component-switch-track-height', usage: 'Default switch visual track; row padding and label area must supply the full target.' },
    { id: 'comfortable-track', size: 'Comfortable track', tokenName: '--component-switch-comfortable-track-height', token: 'component-switch-comfortable-track-height', usage: 'Comfortable switch visual track; row padding and label area must supply the full target.' },
  ],
  accordion: [
    { id: 'small', size: 'Small trigger', tokenName: '--component-accordion-trigger-height-sm', token: 'component-accordion-trigger-height-sm', usage: 'Compact disclosure trigger.' },
    { id: 'medium', size: 'Medium trigger', tokenName: '--component-accordion-trigger-height-md', token: 'component-accordion-trigger-height-md', usage: 'Default disclosure trigger.' },
    { id: 'large', size: 'Large trigger', tokenName: '--component-accordion-trigger-height-lg', token: 'component-accordion-trigger-height-lg', usage: 'Touch-forward disclosure trigger.' },
  ],
  pagination: [
    { id: 'small', size: 'Small item', tokenName: '--component-pagination-item-size-sm', token: 'component-pagination-item-size-sm', usage: 'Dense pagination item.' },
    { id: 'default', size: 'Default item', tokenName: '--component-pagination-item-size', token: 'component-pagination-item-size', usage: 'Default pagination item.' },
  ],
  'side-nav': [
    { id: 'item', size: 'Navigation item', tokenName: '--component-side-nav-item-height', token: 'component-side-nav-item-height', usage: 'Nested side navigation item.' },
  ],
  'tree-menu': [
    { id: 'item', size: 'Tree item', tokenName: '--component-tree-menu-item-height', token: 'component-tree-menu-item-height', usage: 'Nested tree menu item.' },
  ],
}

for (const id of ['text-field', 'search-field', 'number-field', 'date-field', 'time-field', 'phone-field', 'zip-field', 'credit-card-field', 'select', 'autocomplete']) {
  TARGET_SIZE_TOKEN_SPECS[id] = [
    { id: 'compact', size: 'Compact field', tokenName: '--component-field-compact-height', token: 'component-field-compact-height', usage: 'Dense forms, filters, and compact editor controls.' },
    { id: 'default', size: 'Default field', tokenName: '--component-field-default-height', token: 'component-field-default-height', usage: 'Default form control target.' },
    { id: 'comfortable', size: 'Comfortable field', tokenName: '--component-field-comfortable-height', token: 'component-field-comfortable-height', usage: 'Touch-forward and spacious form control target.' },
  ]
}

function componentA11yKind(component) {
  if (FORM_COMPONENT_IDS.has(component.id)) return 'Input'
  if (NAVIGATION_COMPONENT_IDS.has(component.id)) return 'Navigation'
  if (OVERLAY_COMPONENT_IDS.has(component.id)) return 'Overlay'
  if (INTERACTIVE_COMPONENT_IDS.has(component.id)) return 'Interactive'
  return 'Content'
}

function componentRequiresKeyboard(component) {
  return INTERACTIVE_COMPONENT_IDS.has(component.id)
}

function componentScreenReaderExpectations(component) {
  if (FORM_COMPONENT_IDS.has(component.id)) {
    return [
      'Expose a programmatic label, description, validation state, and error message relationship.',
      'Keep required, disabled, read-only, invalid, and busy state announcements aligned with the visual state.',
      'Do not use placeholder text as the only label or instruction.',
      'Group related controls with fieldset semantics where the user needs shared context.',
    ]
  }

  if (OVERLAY_COMPONENT_IDS.has(component.id)) {
    return [
      'Expose the overlay name and role, and keep focus inside modal overlays until dismissed.',
      'Return focus to the trigger when the overlay closes.',
      'Make dismissal behavior available by keyboard and pointer without trapping users.',
      'Ensure portaled content remains correctly ordered for assistive technology.',
    ]
  }

  if (NAVIGATION_COMPONENT_IDS.has(component.id)) {
    return [
      'Expose navigation landmarks or list semantics when the component represents a navigation region.',
      'Announce the current item with aria-current or an equivalent selected state.',
      'Keep visible labels in the accessible names for every link or command.',
      'Preserve logical DOM order across responsive layouts and overflow menus.',
    ]
  }

  if (INTERACTIVE_COMPONENT_IDS.has(component.id)) {
    return [
      'Expose a clear accessible name, role, and state for every interactive part.',
      'Keep disabled, selected, expanded, pressed, and busy states programmatically available.',
      'Use native elements where possible before adding custom keyboard behavior.',
      'Do not rely on icon shape, color, or position as the only state indicator.',
    ]
  }

  return [
    'Preserve semantic HTML so assistive technology can understand the content structure.',
    'Keep text content readable at zoom and across responsive breakpoints.',
    'Do not convey meaning with color, spacing, or decoration alone.',
    'Ensure any nested interactive content follows the owning component contract.',
  ]
}

function componentKeyboardRows(component) {
  if (!componentRequiresKeyboard(component)) {
    return [
      { id: 'read', key: 'Reading order', expected: 'Content follows DOM order and remains understandable without pointer interaction.', status: 'Required' },
      { id: 'skip', key: 'Tab', expected: 'No focus stop is added unless the component contains an interactive child.', status: 'Required' },
    ]
  }

  const rows = [
    { id: 'tab', key: 'Tab', expected: 'Moves focus to the next enabled interactive element in DOM order.', status: 'Required' },
    { id: 'shift-tab', key: 'Shift + Tab', expected: 'Moves focus to the previous enabled interactive element.', status: 'Required' },
    { id: 'enter', key: 'Enter', expected: 'Activates the focused action or confirms the focused control where applicable.', status: 'Required' },
    { id: 'space', key: 'Space', expected: 'Activates button-like controls, toggles switches, or selects options without scrolling the page.', status: 'Required' },
  ]

  if (['accordion', 'tabs', 'segmented-control', 'radio-group', 'slider', 'menu', 'context-menu', 'tree-menu', 'side-nav', 'data-table', 'calendar'].includes(component.id)) {
    rows.push({ id: 'arrows', key: 'Arrow keys', expected: 'Moves within the composite control according to the component pattern.', status: 'Required' })
  }

  if (OVERLAY_COMPONENT_IDS.has(component.id) || ['menu', 'context-menu', 'bottom-sheet'].includes(component.id)) {
    rows.push({ id: 'escape', key: 'Escape', expected: 'Dismisses the active overlay and returns focus to the trigger.', status: 'Required' })
  }

  if (component.id === 'slider') {
    rows.push({ id: 'home-end', key: 'Home / End', expected: 'Moves to the minimum or maximum value.', status: 'Required' })
  }

  return rows
}

function componentWcagRows(component) {
  const rows = [
    { id: '141', guideline: '1.4.1 Use of color', level: 'A', evidence: 'State and meaning must not rely on color alone.' },
    { id: '143', guideline: '1.4.3 Contrast minimum', level: 'AA', evidence: 'Text and icon labels must meet contrast against their active surface.' },
    { id: '1411', guideline: '1.4.11 Non-text contrast', level: 'AA', evidence: 'Focus indicators, boundaries, controls, and state marks must meet non-text contrast.' },
    { id: '144', guideline: '1.4.4 Resize text', level: 'AA', evidence: 'Content must remain usable at 200% zoom without clipping or overlap.' },
  ]

  if (componentRequiresKeyboard(component)) {
    rows.push(
      { id: '211', guideline: '2.1.1 Keyboard', level: 'A', evidence: 'Every interactive operation must be available from the keyboard.' },
      { id: '243', guideline: '2.4.3 Focus order', level: 'A', evidence: 'Focus follows the visual and DOM task order.' },
      { id: '247', guideline: '2.4.7 Focus visible', level: 'AA', evidence: 'Focus remains visible in every state, theme, and surface.' },
      { id: '2411', guideline: '2.4.11 Focus appearance', level: 'AA', evidence: 'Focus indicator contrast and area are verified for the active token set.' },
      { id: '258', guideline: '2.5.8 Target size', level: 'AA', evidence: 'Interactive targets meet 24 px or document a valid exception.' },
      { id: '412', guideline: '4.1.2 Name, role, value', level: 'A', evidence: 'Name, role, value, and state are exposed and updated programmatically.' },
    )
  }

  if (FORM_COMPONENT_IDS.has(component.id)) {
    rows.push(
      { id: '131', guideline: '1.3.1 Info and relationships', level: 'A', evidence: 'Labels, groups, hints, and errors are programmatically related.' },
      { id: '332', guideline: '3.3.2 Labels or instructions', level: 'A', evidence: 'Required inputs and format requirements are visible and accessible.' },
      { id: '333', guideline: '3.3.3 Error suggestion', level: 'AA', evidence: 'Validation explains how to recover when possible.' },
    )
  }

  if (NAVIGATION_COMPONENT_IDS.has(component.id)) {
    rows.push({ id: '244', guideline: '2.4.4 Link purpose', level: 'A', evidence: 'Each destination or command is clear from its label and context.' })
  }

  return rows
}

function componentTestRows(component) {
  const rows = [
    { id: 'axe', area: 'Automated axe', coverage: `${component.title} stories and component page preview`, owner: 'CI / changed component run', result: 'No violations expected' },
    { id: 'contrast', area: 'Token contrast', coverage: 'Active theme, color mode, focus indicator, text and action colors', owner: 'Design system audit', result: 'Ratios reviewed before release' },
    { id: 'zoom', area: 'Zoom and reflow', coverage: '200% and 400%, xs to xl', owner: 'Reviewer', result: 'No clipped labels, controls, or focus indicators' },
  ]

  if (componentRequiresKeyboard(component)) {
    rows.push(
      { id: 'keyboard', area: 'Keyboard manual', coverage: 'Tab order, activation, escape behavior, composite navigation', owner: 'Reviewer', result: 'Pass required' },
      { id: 'screen-reader', area: 'Screen reader smoke', coverage: 'VoiceOver Safari, NVDA Firefox, JAWS Chrome where practical', owner: 'Reviewer', result: 'Name, role, value, and state announced correctly' },
      { id: 'target', area: 'Target size', coverage: 'Default, compact, dense, and responsive variants', owner: 'Reviewer', result: '24 px AA minimum or documented exception' },
    )
  }

  return rows
}

function componentChecklistItems(component) {
  const items = [
    `${component.title} works in base, a1-light, accessible, heritage, dark, and light modes.`,
    'Visible focus is present and not clipped by parent overflow.',
    'Meaning does not depend on color alone.',
    'Text remains readable and non-overlapping at supported breakpoints.',
  ]

  if (componentRequiresKeyboard(component)) {
    items.push('Keyboard operation matches the documented component pattern.')
    items.push('Pointer-only behavior has a keyboard equivalent.')
  }

  if (FORM_COMPONENT_IDS.has(component.id)) {
    items.push('Label, hint, required, invalid, and error relationships are programmatic.')
  }

  if (OVERLAY_COMPONENT_IDS.has(component.id)) {
    items.push('Focus moves into the overlay, remains contained where modal, and returns to the trigger.')
  }

  if (NAVIGATION_COMPONENT_IDS.has(component.id)) {
    items.push('Current page, selected item, and expanded state are exposed without relying on visual styling alone.')
  }

  return items
}

function parseCssColor(value) {
  const clean = String(value || '').trim()
  if (!clean) throw new Error('Missing color value')
  if (clean.startsWith('#')) {
    const hex = clean.slice(1)
    if (/^[0-9a-f]{3}$/i.test(hex)) {
      return hex.split('').map((part) => parseInt(`${part}${part}`, 16))
    }
    if (/^[0-9a-f]{6}$/i.test(hex)) {
      return [0, 2, 4].map((index) => parseInt(hex.slice(index, index + 2), 16))
    }
  }

  const rgbMatch = clean.match(/^rgba?\((.+)\)$/i)
  if (rgbMatch) {
    const parts = rgbMatch[1]
      .replaceAll(',', ' ')
      .replace(/\s*\/\s*/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
    return parts.slice(0, 3).map((part) => {
      if (part.endsWith('%')) return Math.round((Number(part.slice(0, -1)) / 100) * 255)
      return Number(part)
    })
  }

  const srgbMatch = clean.match(/^color\(srgb\s+(.+)\)$/i)
  if (srgbMatch) {
    return srgbMatch[1]
      .replace(/\s*\/\s*[\d.]+%?$/, '')
      .split(/\s+/)
      .slice(0, 3)
      .map((part) => Math.round(Number(part) * 255))
  }

  throw new Error(`Unsupported color value: ${clean}`)
}

function rgbToHex(rgb) {
  return `#${rgb.map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')}`
}

function blendRgb(foreground, background, alpha) {
  return foreground.map((value, index) => value * alpha + background[index] * (1 - alpha))
}

function channelToLinear(value) {
  const normalized = value / 255
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4
}

function colorLuminance(rgb) {
  const [r, g, b] = rgb.map(channelToLinear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(foreground, background) {
  const fg = colorLuminance(foreground)
  const bg = colorLuminance(background)
  const lighter = Math.max(fg, bg)
  const darker = Math.min(fg, bg)
  return (lighter + 0.05) / (darker + 0.05)
}

function ratioLabel(value) {
  return `${value.toFixed(2)}:1`
}

function textContrastStatus(value, disabled = false) {
  if (disabled) return 'Exempt'
  if (value >= 7) return 'Pass AA / AAA'
  if (value >= 4.5) return 'Pass AA'
  return 'Needs review'
}

function nonTextContrastStatus(value) {
  return value >= 3 ? 'Pass 2.4.11' : 'Needs review'
}

function targetStatus(value, minimum) {
  return value >= minimum ? 'Pass' : 'Needs exception'
}

function pxLabel(value) {
  return `${Number(value.toFixed(2))} px`
}

function resolveTokenColor(measurer, tokenName) {
  measurer.style.color = `var(--${tokenName})`
  return parseCssColor(getComputedStyle(measurer).color)
}

function resolveTokenLengthPx(measurer, tokenName) {
  measurer.style.inlineSize = `var(--${tokenName})`
  const px = Number.parseFloat(getComputedStyle(measurer).inlineSize)
  if (!Number.isFinite(px)) throw new Error(`Could not resolve --${tokenName}`)
  return px
}

function liveButtonContrastRows() {
  const measurer = document.createElement('span')
  measurer.style.position = 'fixed'
  measurer.style.inset = '0 auto auto 0'
  measurer.style.visibility = 'hidden'
  measurer.style.pointerEvents = 'none'
  document.body.append(measurer)

  try {
    const page = resolveTokenColor(measurer, 'semantic-color-surface-page')
    const disabledOpacity = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--component-button-disabled-opacity')) || 0.55
    const rows = BUTTON_CONTRAST_SPECS.map((spec) => {
      const foreground = resolveTokenColor(measurer, spec.foregroundToken)
      const background = resolveTokenColor(measurer, spec.backgroundToken)
      const ratio = contrastRatio(foreground, background)
      return {
        id: spec.id,
        surface: spec.surface,
        foreground: spec.foreground,
        background: spec.background,
        foregroundToken: `var(--${spec.foregroundToken})`,
        backgroundToken: `var(--${spec.backgroundToken})`,
        ratio: ratioLabel(ratio),
        wcag: textContrastStatus(ratio),
        notes: `Computed from ${rgbToHex(foreground)} over ${rgbToHex(background)} in the current theme and mode.`,
      }
    })

    const disabledForeground = blendRgb(resolveTokenColor(measurer, 'component-button-primary-foreground'), page, disabledOpacity)
    const disabledBackground = blendRgb(resolveTokenColor(measurer, 'component-button-primary-background'), page, disabledOpacity)
    const disabledRatio = contrastRatio(disabledForeground, disabledBackground)
    rows.push({
      id: 'disabled',
      surface: 'Disabled primary',
      foreground: `Primary foreground at ${Math.round(disabledOpacity * 100)}% opacity`,
      background: `Primary background at ${Math.round(disabledOpacity * 100)}% opacity`,
      foregroundToken: rgbToHex(disabledForeground),
      backgroundToken: rgbToHex(disabledBackground),
      ratio: ratioLabel(disabledRatio),
      wcag: textContrastStatus(disabledRatio, true),
      notes: `Computed from the full primary button composited at disabled opacity over ${rgbToHex(page)} in the current theme and mode.`,
    })

    const focus = resolveTokenColor(measurer, 'component-button-focus-ring')
    const focusRatio = contrastRatio(focus, page)
    rows.push({
      id: 'focus',
      surface: 'Focus ring',
      foreground: 'Shared focus ring',
      background: 'Page surface',
      foregroundToken: 'var(--component-button-focus-ring)',
      backgroundToken: 'var(--semantic-color-surface-page)',
      ratio: ratioLabel(focusRatio),
      wcag: nonTextContrastStatus(focusRatio),
      notes: `Computed from ${rgbToHex(focus)} over ${rgbToHex(page)} in the current theme and mode.`,
    })

    return rows
  } finally {
    measurer.remove()
  }
}

function liveButtonTargetSizeRows() {
  const measurer = document.createElement('span')
  measurer.style.position = 'fixed'
  measurer.style.visibility = 'hidden'
  measurer.style.pointerEvents = 'none'
  document.body.append(measurer)

  try {
    return BUTTON_TARGET_SIZE_SPECS.map((spec) => {
      const blockSize = resolveTokenLengthPx(measurer, spec.token)
      const wcag255 = targetStatus(blockSize, 44)
      return {
        id: spec.id,
        size: spec.size,
        measuredToken: spec.tokenName,
        minimumBlockSize: pxLabel(blockSize),
        wcag258: targetStatus(blockSize, 24),
        wcag255,
        usage: spec.usage,
        notes: wcag255 === 'Pass'
          ? 'Meets the 44 px block-size target before any adjacent spacing is counted; inline size remains content-dependent.'
          : 'Below the 44 px AAA target by visual block size; use only where spacing, equivalent target, or inline layout exceptions are satisfied.',
      }
    })
  } finally {
    measurer.remove()
  }
}

function resolveLiveButtonReportRows() {
  if (typeof document === 'undefined' || !document.body) {
    return { contrastRows: BUTTON_CONTRAST_ROWS, targetSizeRows: BUTTON_TARGET_SIZE_ROWS }
  }

  try {
    return {
      contrastRows: liveButtonContrastRows(),
      targetSizeRows: liveButtonTargetSizeRows(),
    }
  } catch {
    return { contrastRows: BUTTON_CONTRAST_ROWS, targetSizeRows: BUTTON_TARGET_SIZE_ROWS }
  }
}

function useLiveButtonReportRows() {
  const [rows, setRows] = useState(resolveLiveButtonReportRows)

  useEffect(() => {
    let frame = null
    const update = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        frame = null
        setRows(resolveLiveButtonReportRows())
      })
    }

    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme', 'data-color-mode'] })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'style', 'data-theme', 'data-color-mode'] })
    window.addEventListener('storage', update)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('storage', update)
    }
  }, [])

  return rows
}

function liveComponentContrastRows(component) {
  const measurer = document.createElement('span')
  measurer.style.position = 'fixed'
  measurer.style.inset = '0 auto auto 0'
  measurer.style.visibility = 'hidden'
  measurer.style.pointerEvents = 'none'
  document.body.append(measurer)

  try {
    const page = resolveTokenColor(measurer, 'semantic-color-surface-page')
    const rows = []

    const addTextRow = ({ id, surface, foreground, background, foregroundToken, backgroundToken = 'semantic-color-surface-page', status = textContrastStatus }) => {
      const fg = resolveTokenColor(measurer, foregroundToken)
      const bg = resolveTokenColor(measurer, backgroundToken)
      const ratio = contrastRatio(fg, bg)
      rows.push({
        id,
        surface,
        foreground,
        background,
        foregroundToken: `var(--${foregroundToken})`,
        backgroundToken: `var(--${backgroundToken})`,
        ratio: ratioLabel(ratio),
        wcag: status(ratio),
        notes: `Computed from ${rgbToHex(fg)} over ${rgbToHex(bg)} in the current theme and mode.`,
      })
    }

    addTextRow({
      id: 'text-default',
      surface: 'Default text',
      foreground: 'Text default',
      background: 'Page surface',
      foregroundToken: 'semantic-color-text-default',
    })
    addTextRow({
      id: 'text-muted',
      surface: 'Muted text',
      foreground: 'Text muted',
      background: 'Page surface',
      foregroundToken: 'semantic-color-text-muted',
    })

    if (componentRequiresKeyboard(component) || NAVIGATION_COMPONENT_IDS.has(component.id)) {
      addTextRow({
        id: 'action',
        surface: 'Action color',
        foreground: 'Action background',
        background: 'Page surface',
        foregroundToken: 'semantic-color-action-background',
      })
    }

    if (FORM_COMPONENT_IDS.has(component.id)) {
      addTextRow({
        id: 'error-text',
        surface: 'Error text',
        foreground: 'Error text',
        background: 'Page surface',
        foregroundToken: 'semantic-color-status-error-text',
      })
    }

    const focusToken = FORM_COMPONENT_IDS.has(component.id)
      ? 'component-field-focus-ring-color'
      : 'component-button-focus-ring'
    const focus = resolveTokenColor(measurer, focusToken)
    const focusRatio = contrastRatio(focus, page)
    rows.push({
      id: 'focus',
      surface: 'Focus indicator',
      foreground: FORM_COMPONENT_IDS.has(component.id) ? 'Field focus ring' : 'Shared focus ring',
      background: 'Page surface',
      foregroundToken: `var(--${focusToken})`,
      backgroundToken: 'var(--semantic-color-surface-page)',
      ratio: ratioLabel(focusRatio),
      wcag: nonTextContrastStatus(focusRatio),
      notes: `Computed from ${rgbToHex(focus)} over ${rgbToHex(page)} in the current theme and mode.`,
    })

    return rows
  } finally {
    measurer.remove()
  }
}

function liveComponentTargetSizeRows(component) {
  const specs = TARGET_SIZE_TOKEN_SPECS[component.id] || []
  if (!specs.length) return []

  const measurer = document.createElement('span')
  measurer.style.position = 'fixed'
  measurer.style.visibility = 'hidden'
  measurer.style.pointerEvents = 'none'
  document.body.append(measurer)

  try {
    return specs.map((spec) => {
      const blockSize = resolveTokenLengthPx(measurer, spec.token)
      const wcag255 = targetStatus(blockSize, 44)
      return {
        id: spec.id,
        size: spec.size,
        measuredToken: spec.tokenName,
        minimumBlockSize: pxLabel(blockSize),
        wcag258: targetStatus(blockSize, 24),
        wcag255,
        usage: spec.usage,
        notes: wcag255 === 'Pass'
          ? 'Meets the 44 px block-size target before adjacent spacing is counted.'
          : 'Below the 44 px AAA target by visual block size; verify spacing, equivalent-target, or inline-layout exceptions.',
      }
    })
  } finally {
    measurer.remove()
  }
}

function resolveLiveComponentReportRows(component) {
  if (typeof document === 'undefined' || !document.body) {
    return { contrastRows: [], targetSizeRows: [] }
  }

  try {
    return {
      contrastRows: liveComponentContrastRows(component),
      targetSizeRows: liveComponentTargetSizeRows(component),
    }
  } catch {
    return { contrastRows: [], targetSizeRows: [] }
  }
}

function useLiveComponentReportRows(component) {
  const [rows, setRows] = useState(() => resolveLiveComponentReportRows(component))

  useEffect(() => {
    let frame = null
    const update = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        frame = null
        setRows(resolveLiveComponentReportRows(component))
      })
    }

    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme', 'data-color-mode'] })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'style', 'data-theme', 'data-color-mode'] })
    window.addEventListener('storage', update)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('storage', update)
    }
  }, [component])

  return rows
}

function ContrastSample({ foreground, background, foregroundToken, backgroundToken }) {
  return (
    <span
      aria-label={`${foreground} over ${background}`}
      title={`${foreground} over ${background}`}
      style={{
        display: 'inline-grid',
        placeItems: 'center',
        inlineSize: 'var(--base-spacing-40)',
        blockSize: 'var(--base-spacing-40)',
        borderRadius: 'var(--base-radius-sm)',
        border: '1px solid var(--semantic-color-border-subtle)',
        background: backgroundToken,
        color: foregroundToken,
        fontFamily: 'var(--semantic-font-family-heading)',
        fontSize: 'var(--semantic-font-size-heading-sm)',
        fontWeight: 'var(--base-font-weight-bold)',
        lineHeight: 1,
      }}
    >
      A
    </span>
  )
}

function ComponentAccessibilityReport({ component }) {
  const { contrastRows: liveContrastRows, targetSizeRows } = useLiveComponentReportRows(component)
  const contrastRows = liveContrastRows.map((row) => ({
    ...row,
    sample: (
      <ContrastSample
        foreground={row.foreground}
        background={row.background}
        foregroundToken={row.foregroundToken}
        backgroundToken={row.backgroundToken}
      />
    ),
  }))
  const kind = componentA11yKind(component)
  const keyboardRows = componentKeyboardRows(component)
  const wcagRows = componentWcagRows(component)
  const testRows = componentTestRows(component)
  const checklistItems = componentChecklistItems(component)
  const expectations = componentScreenReaderExpectations(component)

  return (
    <Stack gap="xl">
      <Stack direction="column" gap="sm">
        <Stack direction={{ xs: 'column', md: 'row' }} justify="between" align="start" gap="sm">
          <Stack direction="column" gap="xs">
            <Heading as="h3" size="md">{component.title} accessibility report</Heading>
            <Paragraph size="sm" color="muted">
              Report scaffold for {component.title}, covering active-theme token checks, keyboard behavior, assistive technology expectations, WCAG mapping, manual verification, and release gates.
            </Paragraph>
          </Stack>
          <MessageBadge status={componentRequiresKeyboard(component) ? 'info' : 'neutral'} icon={componentRequiresKeyboard(component) ? 'keyboard' : 'article'}>
            {kind}
          </MessageBadge>
        </Stack>
        <Banner status="info" variant="inline">
          Contrast and known target-size values resolve from the active theme and color mode. Component-specific automation can replace these scaffold rows as each report matures.
        </Banner>
      </Stack>

      <Grid columns={{ xs: 1, md: 3 }} gap="sm">
        <Card shadow="xs">
          <Stack direction="column" gap="xs">
            <MessageBadge status="info" icon="contrast">Live tokens</MessageBadge>
            <Heading as="h4" size="xs">Active theme</Heading>
            <Paragraph size="sm" color="muted">Contrast rows recalculate from the current CSS cascade when theme or mode changes.</Paragraph>
          </Stack>
        </Card>
        <Card shadow="xs">
          <Stack direction="column" gap="xs">
            <MessageBadge status={componentRequiresKeyboard(component) ? 'warn' : 'neutral'} icon={componentRequiresKeyboard(component) ? 'keyboard' : 'notes'}>
              {componentRequiresKeyboard(component) ? 'Manual gate' : 'Semantic gate'}
            </MessageBadge>
            <Heading as="h4" size="xs">{componentRequiresKeyboard(component) ? 'Interaction' : 'Structure'}</Heading>
            <Paragraph size="sm" color="muted">
              {componentRequiresKeyboard(component)
                ? 'Keyboard and screen reader behavior still need manual verification.'
                : 'Semantic structure and reading order remain the primary checks.'}
            </Paragraph>
          </Stack>
        </Card>
        <Card shadow="xs">
          <Stack direction="column" gap="xs">
            <MessageBadge status={targetSizeRows.length ? 'info' : 'neutral'} icon="touch_app">
              {targetSizeRows.length ? 'Measured tokens' : 'Manual target'}
            </MessageBadge>
            <Heading as="h4" size="xs">Target size</Heading>
            <Paragraph size="sm" color="muted">
              {targetSizeRows.length
                ? 'Known tokenized control heights are included below.'
                : 'No direct target-size token is mapped yet; measure rendered controls during review.'}
            </Paragraph>
          </Stack>
        </Card>
      </Grid>

      <Stack gap="sm">
        <Heading as="h3" size="sm">Color contrast</Heading>
        <DataTable
          caption={`${component.title} color contrast report`}
          columns={[
            { key: 'sample', label: 'Sample', width: '72px' },
            { key: 'surface', label: 'Surface', sortable: true, width: '150px' },
            { key: 'foreground', label: 'Foreground', width: '180px' },
            { key: 'background', label: 'Background', width: '180px' },
            { key: 'ratio', label: 'Ratio', width: '90px' },
            { key: 'wcag', label: 'WCAG', width: '130px' },
            { key: 'notes', label: 'Notes' },
          ]}
          rows={contrastRows}
          zebra
          scrollable
          emptyTitle="No contrast rows"
          emptyDescription="This report could not resolve the active token values."
          emptyIcon="contrast"
        />
      </Stack>

      {targetSizeRows.length > 0 && (
        <Stack gap="sm">
          <Heading as="h3" size="sm">Target size</Heading>
          <Paragraph size="sm" color="muted">
            WCAG 2.5.8 is the AA 24 by 24 CSS pixel minimum. WCAG 2.5.5 is the AAA 44 by 44 CSS pixel target. These rows report known tokenized block-size values; inline size and spacing still need rendered review.
          </Paragraph>
          <DataTable
            caption={`${component.title} target size report`}
            columns={[
              { key: 'size', label: 'Size', sortable: true, width: '150px' },
              { key: 'measuredToken', label: 'Measured token', width: '240px' },
              { key: 'minimumBlockSize', label: 'Minimum block size', width: '160px' },
              { key: 'wcag258', label: '2.5.8 AA', width: '130px' },
              { key: 'wcag255', label: '2.5.5 AAA', width: '150px' },
              { key: 'usage', label: 'Intended usage' },
              { key: 'notes', label: 'Notes' },
            ]}
            rows={targetSizeRows}
            zebra
            scrollable
          />
        </Stack>
      )}

      <Stack gap="sm">
        <Heading as="h3" size="sm">Keyboard controls</Heading>
        <DataTable
          caption={`${component.title} keyboard controls`}
          columns={[
            { key: 'key', label: 'Input', width: '140px' },
            { key: 'expected', label: 'Expected behavior' },
            { key: 'status', label: 'Status', width: '110px' },
          ]}
          rows={keyboardRows}
          zebra
          scrollable
        />
      </Stack>

      <Stack gap="sm">
        <Heading as="h3" size="sm">Screen reader expectations</Heading>
        <List icon="record_voice_over" size="sm" color="muted">
          {expectations.map((item) => <ListItem key={item}>{item}</ListItem>)}
        </List>
      </Stack>

      <Stack gap="sm">
        <Heading as="h3" size="sm">Relevant WCAG guidelines</Heading>
        <DataTable
          caption={`${component.title} WCAG guideline mapping`}
          columns={[
            { key: 'guideline', label: 'Guideline', sortable: true, width: '220px' },
            { key: 'level', label: 'Level', width: '80px' },
            { key: 'evidence', label: 'Evidence required' },
          ]}
          rows={wcagRows}
          zebra
          scrollable
        />
      </Stack>

      <Stack gap="sm">
        <Heading as="h3" size="sm">Test matrix</Heading>
        <DataTable
          caption={`${component.title} accessibility test matrix`}
          columns={[
            { key: 'area', label: 'Area', width: '160px' },
            { key: 'coverage', label: 'Coverage' },
            { key: 'owner', label: 'Owner', width: '150px' },
            { key: 'result', label: 'Expected result', width: '170px' },
          ]}
          rows={testRows}
          scrollable
        />
      </Stack>

      <Stack gap="sm">
        <Heading as="h3" size="sm">Manual checklist</Heading>
        <List icon="check_circle" size="sm" color="muted">
          {checklistItems.map((item) => <ListItem key={item}>{item}</ListItem>)}
        </List>
      </Stack>
    </Stack>
  )
}

function ButtonAccessibilityReport() {
  const { contrastRows: liveContrastRows, targetSizeRows } = useLiveButtonReportRows()
  const contrastRows = liveContrastRows.map((row) => ({
    ...row,
    sample: (
      <ContrastSample
        foreground={row.foreground}
        background={row.background}
        foregroundToken={row.foregroundToken}
        backgroundToken={row.backgroundToken}
      />
    ),
  }))

  return (
    <Stack gap="xl">
      <Stack direction="column" gap="sm">
        <Stack direction={{ xs: 'column', md: 'row' }} justify="between" align="start" gap="sm">
          <Stack direction="column" gap="xs">
            <Heading as="h3" size="md">Button accessibility report</Heading>
            <Paragraph size="sm" color="muted">
              Showcase report for the Button component, covering automated checks, manual verification, keyboard behavior, assistive technology expectations, contrast, WCAG mapping, and release gates.
            </Paragraph>
          </Stack>
          <MessageBadge status="success" icon="verified">Reference format</MessageBadge>
        </Stack>
        <Banner status="info" variant="inline">
          Use this as the target shape for future component accessibility tabs. Contrast and target-size values resolve from the active theme and color mode, with generated default-token values as a build-time fallback.
        </Banner>
      </Stack>

      <Grid columns={{ xs: 1, md: 3 }} gap="sm">
        <Card shadow="xs">
          <Stack direction="column" gap="xs">
            <MessageBadge status="success" icon="check_circle">Pass target</MessageBadge>
            <Heading as="h4" size="xs">Current summary</Heading>
            <Paragraph size="sm" color="muted">Native semantics, visible focus, keyboard activation, and loading state are covered by the component contract.</Paragraph>
          </Stack>
        </Card>
        <Card shadow="xs">
          <Stack direction="column" gap="xs">
            <MessageBadge status="warn" icon="rule">Needs evidence</MessageBadge>
            <Heading as="h4" size="xs">Theme coverage</Heading>
            <Paragraph size="sm" color="muted">Contrast ratios must be recorded across base, a1-light, accessible, heritage, inverse, and high-contrast modes.</Paragraph>
          </Stack>
        </Card>
        <Card shadow="xs">
          <Stack direction="column" gap="xs">
            <MessageBadge status="info" icon="keyboard">Manual gate</MessageBadge>
            <Heading as="h4" size="xs">Reviewer pass</Heading>
            <Paragraph size="sm" color="muted">Keyboard, screen reader, zoom, target size, and reduced-motion checks remain required even when automation passes.</Paragraph>
          </Stack>
        </Card>
      </Grid>

      <Stack gap="sm">
        <Heading as="h3" size="sm">Color contrast</Heading>
        <DataTable
          caption="Button color contrast report"
          columns={[
            { key: 'sample', label: 'Sample', width: '72px' },
            { key: 'surface', label: 'Surface', sortable: true, width: '150px' },
            { key: 'foreground', label: 'Foreground', width: '180px' },
            { key: 'background', label: 'Background', width: '180px' },
            { key: 'ratio', label: 'Ratio', width: '90px' },
            { key: 'wcag', label: 'WCAG', width: '130px' },
            { key: 'notes', label: 'Notes' },
          ]}
          rows={contrastRows}
          zebra
          scrollable
        />
      </Stack>

      <Stack gap="sm">
        <Heading as="h3" size="sm">Keyboard controls</Heading>
        <DataTable
          caption="Button keyboard controls"
          size="comfortable"
          columns={[
            { key: 'key', label: 'Input', width: '140px' },
            { key: 'expected', label: 'Expected behavior' },
            { key: 'status', label: 'Status', width: '110px' },
          ]}
          rows={BUTTON_KEYBOARD_ROWS}
        />
      </Stack>

      <Stack gap="sm">
        <Heading as="h3" size="sm">Screen reader expectations</Heading>
        <List icon="record_voice_over" size="sm" color="muted">
          <ListItem>Accessible name comes from visible button text; icon names must not replace text labels.</ListItem>
          <ListItem>Native button announces as “button”; link buttons announce as links only when navigation is intended.</ListItem>
          <ListItem>Disabled native buttons are removed from normal activation; non-button render targets use `aria-disabled` when inert.</ListItem>
          <ListItem>Loading buttons expose `aria-busy="true"` and prevent duplicate submission.</ListItem>
          <ListItem>Spinner is decorative and hidden from assistive technology.</ListItem>
          <ListItem>SplitButton menu actions must each have a clear accessible name and deterministic focus return.</ListItem>
        </List>
      </Stack>

      <Stack gap="sm">
        <Heading as="h3" size="sm">Target size</Heading>
        <Paragraph size="sm" color="muted">
          WCAG 2.5.5 is the AAA 44 by 44 CSS pixel target. WCAG 2.5.8 is the AA 24 by 24 CSS pixel minimum. Button width is content-dependent, so these generated rows report the tokenized minimum block size and flag where reviewer evidence is still required.
        </Paragraph>
        <DataTable
          caption="Button target size report"
          columns={[
            { key: 'size', label: 'Size', sortable: true, width: '110px' },
            { key: 'measuredToken', label: 'Measured token', width: '220px' },
            { key: 'minimumBlockSize', label: 'Minimum block size', width: '160px' },
            { key: 'wcag258', label: '2.5.8 AA', width: '130px' },
            { key: 'wcag255', label: '2.5.5 AAA', width: '150px' },
            { key: 'usage', label: 'Intended usage' },
            { key: 'notes', label: 'Notes' },
          ]}
          rows={targetSizeRows}
          zebra
          scrollable
        />
      </Stack>

      <Stack gap="sm">
        <Heading as="h3" size="sm">Relevant WCAG guidelines</Heading>
        <DataTable
          caption="Button WCAG guideline mapping"
          columns={[
            { key: 'guideline', label: 'Guideline', sortable: true, width: '220px' },
            { key: 'level', label: 'Level', width: '80px' },
            { key: 'evidence', label: 'Evidence required' },
          ]}
          rows={BUTTON_WCAG_ROWS}
          zebra
          scrollable
        />
      </Stack>

      <Stack gap="sm">
        <Heading as="h3" size="sm">Test matrix</Heading>
        <DataTable
          caption="Button accessibility test matrix"
          columns={[
            { key: 'area', label: 'Area', width: '160px' },
            { key: 'coverage', label: 'Coverage' },
            { key: 'owner', label: 'Owner', width: '150px' },
            { key: 'result', label: 'Expected result', width: '170px' },
          ]}
          rows={BUTTON_TEST_ROWS}
          scrollable
        />
      </Stack>

      <Stack gap="sm">
        <Heading as="h3" size="sm">Manual checklist</Heading>
        <List icon="check_circle" size="sm" color="muted">
          <ListItem>Confirm one primary action per decision area; secondary actions are visually and semantically lower priority.</ListItem>
          <ListItem>Confirm labels are action-oriented, unique in context, and include visible text in the accessible name.</ListItem>
          <ListItem>Confirm destructive buttons describe the object or outcome, for example “Delete project”.</ListItem>
          <ListItem>Confirm small buttons appear only where target spacing remains adequate.</ListItem>
          <ListItem>Confirm focus ring is visible against page, panel, raised, inverse, and image-adjacent surfaces.</ListItem>
          <ListItem>Confirm loading state is announced and cannot submit twice.</ListItem>
          <ListItem>Confirm disabled state is not the only way to explain why an action is unavailable.</ListItem>
        </List>
      </Stack>

      <Stack gap="sm">
        <Heading as="h3" size="sm">Implementation notes</Heading>
        <Code variant="block" wrapping copyCode>{`<Button type="button">Save changes</Button>
<Button variant="destructive" aria-describedby="delete-help">Delete project</Button>
<Button loading aria-live="polite">Saving</Button>`}</Code>
        <Paragraph size="sm" color="muted">
          Prefer native button semantics for in-page actions and link semantics only for navigation. Avoid icon-only Button usage; use IconButton when the visual label is intentionally absent.
        </Paragraph>
      </Stack>
    </Stack>
  )
}

function AccessibilityPanel({ component }) {
  if (component.id === 'button') return <ButtonAccessibilityReport />
  return <ComponentAccessibilityReport component={component} />
}

/* The component configuration controls. Rendered into the PageLayout aside slot
   (right rail) via a portal — see ComponentDetailPage. */
function ConfigurationPanel({
  component,
  config,
  setConfig,
  onResetConfig,
  Controls,
  viewAs,
  setViewAs,
  viewAsModes,
  showHelp,
  onToggleHelp,
  projectId,
}) {
  const utilityType = componentUtilityType(component)
  const setUtilities = (utilities) => {
    setConfig((current) => ({
      ...current,
      utilities: cleanUtilities(utilityType, utilities),
    }))
  }

  return (
    <div className="a1-web-config-aside__inner">
      <div className="a1-web-config-panel">
        <div className="a1-web-config-panel__body">
          {viewAsModes && (
            <div className="a1-web-config-viewas">
              <Toolbar label="Codebase">
                <ToolbarGroup
                  aria-label="Codebase"
                  showLabels
                  value={viewAs}
                  onChange={setViewAs}
                  options={viewAsModes}
                />
              </Toolbar>
            </div>
          )}
          <ConfigHelpContext.Provider value={{ showHelp }}>
            <Stack gap="sm">
              <Controls component={component} config={config} setConfig={setConfig} viewAs={viewAs} projectId={projectId} />
              <UtilityControls
                type={utilityType}
                utilities={config.utilities}
                onChange={setUtilities}
              />
            </Stack>
          </ConfigHelpContext.Provider>
        </div>
        <div className="a1-web-config-panel__footer">
          <Switch
            label="Helper text"
            checked={showHelp}
            onChange={onToggleHelp}
            size="compact"
          />
          <Stack direction="row" gap="xs" align="center">
            <CreateTicketButton
              as="icon"
              scope={{ kind: 'component', ref: component.id, label: component.title }}
            />
            <Button
              icon="restart_alt"
              size="sm"
              variant="tertiary"
              type="button"
              onClick={onResetConfig}
            >
              Reset
            </Button>
          </Stack>
        </div>
      </div>
    </div>
  )
}

/* Display controls shown as a toolbar in the top-right of the centre preview
   panel: responsive viewport, preview padding, and inverse. */
function DisplayToolbar({ displayConfig, setDisplayConfig, bareDisplay }) {
  const set = (patch) => setDisplayConfig((current) => ({ ...current, ...patch }))
  return (
    <Toolbar aria-label="Display options">
        <ToolbarMenu
          aria-label="Responsive view"
          label="Responsive view"
          showLabel
          value={displayConfig.viewport ?? 'fit'}
          onChange={(viewport) => set({ viewport })}
          items={VIEWPORT_PRESETS}
        />
        {!bareDisplay && (
          <ToolbarMenu
            icon="padding"
            aria-label="Padding"
            label="Padding"
            showLabel
            value={displayConfig.padding}
            onChange={(padding) => set({ padding })}
            items={PADDING_ITEMS}
          />
        )}
        {!bareDisplay && (
          <ToolbarToggle
            icon="invert_colors"
            label="Inverse"
            showLabel
            pressed={displayConfig.inverse}
            onChange={(inverse) => set({ inverse })}
          />
        )}
      </Toolbar>
  )
}

function ComponentConfigureSurface({
  component,
  detail,
  config,
  setConfig,
  displayConfig,
  setDisplayConfig,
  viewAs,
  utilityClass,
  example,
}) {
  const preview = (
    <ResponsivePreviewFrame {...(viewportSize(displayConfig.viewport) ?? {})}>
      {detail.bareDisplay ? (
        <ContainerQueryPreviewFrame component={component} displayConfig={displayConfig}>
          <detail.Preview component={component} config={config} setConfig={setConfig} viewAs={viewAs} utilityClass={utilityClass} />
        </ContainerQueryPreviewFrame>
      ) : (
        <Section
          align={displayConfig.align}
          padding={displayConfig.padding}
          inverse={displayConfig.inverse}
          gap="lg"
          borderSize={displayConfig.borderSize}
          borderStyle={displayConfig.borderStyle}
          borderVariant={displayConfig.borderVariant}
          radius={displayConfig.radius}
        >
          <ContainerQueryPreviewFrame component={component} displayConfig={displayConfig}>
            <detail.Preview component={component} config={config} setConfig={setConfig} viewAs={viewAs} utilityClass={utilityClass} />
          </ContainerQueryPreviewFrame>
        </Section>
      )}
    </ResponsivePreviewFrame>
  )

  return (
    <Stack gap="sm">
      <DisplayToolbar
        displayConfig={displayConfig}
        setDisplayConfig={setDisplayConfig}
        bareDisplay={detail.bareDisplay}
      />
      {example?.preview?.width ? (
        <div className="a1-web-example-preview-scroll">
          <div className="a1-web-example-preview" style={examplePreviewStyle(example)}>
            {preview}
          </div>
        </div>
      ) : preview}
      <Divider lineStyle="dashed" space="lg" />
      <detail.Snippet component={component} config={config} viewAs={viewAs} utilityClass={utilityClass} />
    </Stack>
  )
}

export function ComponentDetailPage({ component, category, onNavigate, projectId = null, tab = 'overview', onTabChange }) {
  const detail = getDetailModule(component.id)
  const examples = detail.examples ?? []
  const requestedExampleId = exampleIdFromTab(tab)
  const isExamplePage = Boolean(requestedExampleId)
  const activeTab = isExamplePage ? 'configure' : visibleDetailTab(tab)
  const [config, setConfig] = useState(() => detail.getDefaultConfig(component, category))
  const [selectedExampleId, setSelectedExampleId] = useState(() => requestedExampleId ?? examples[0]?.id ?? null)
  // Platform the component is viewed/coded as (React / Native / Pure). Only
  // components whose detail module exports `viewAsModes` show the control.
  const [viewAs, setViewAs] = useState('react')
  // Per-property helper text under each control. Off by default; toggled from the
  // config panel footer and shared with every control via ConfigHelpContext.
  const [showHelp, setShowHelp] = useState(false)
  const [displayConfig, setDisplayConfig] = useState({
    align: defaultDisplayAlign(component, category),
    padding: 'md',
    inverse: false,
    containerQuery: 'auto',
    viewport: 'fit',
    borderSize: 'xs',
    borderStyle: 'solid',
    borderVariant: 'subtle',
    radius: 'md',
  })
  const [asideNode, setAsideNode] = useState(null)
  const statusKey = COMPONENT_STATUS[component.id] ?? 'beta'
  const statusMeta = STATUS_META[statusKey] ?? STATUS_META.beta
  const relatedComponents = getRelatedComponents(component)
  const utilityType = componentUtilityType(component)
  const utilityClass = utilityClassesFor(utilityType, config.utilities)
  const selectedExample = examples.find((example) => example.id === selectedExampleId)
  const activeExample = selectedExample ?? examples[0]

  useEffect(() => {
    setConfig(detail.getDefaultConfig(component, category))
    setSelectedExampleId(requestedExampleId ?? examples[0]?.id ?? null)
    setViewAs('react')
    // Re-apply the per-component display alignment default (center for
    // natural-width components, none for flexible ones) on navigation.
    setDisplayConfig((current) => ({ ...current, align: defaultDisplayAlign(component, category) }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component.id, component.title, category.icon])

  useEffect(() => {
    if (requestedExampleId && examples.some((example) => example.id === requestedExampleId)) {
      setSelectedExampleId(requestedExampleId)
    }
  }, [examples, requestedExampleId])

  useEffect(() => {
    if (activeTab !== 'examples' && !isExamplePage) return
    const example = activeExample
    if (!example) return
    setConfig((current) => ({
      ...current,
      ...cloneExampleConfig(example.config),
    }))
    if (example.display) {
      setDisplayConfig((current) => ({ ...current, ...example.display }))
    }
  }, [activeTab, activeExample, component.id, isExamplePage])

  useEffect(() => {
    if (activeTab !== tab && !tab?.startsWith(EXAMPLE_TAB_PREFIX)) onTabChange?.(activeTab)
  }, [activeTab, onTabChange, tab])

  function resetConfig() {
    if (isExamplePage && activeExample) {
      setConfig((current) => ({
        ...current,
        ...cloneExampleConfig(activeExample.config),
      }))
      if (activeExample.display) {
        setDisplayConfig((current) => ({ ...current, ...activeExample.display }))
      }
      return
    }
    setConfig(detail.getDefaultConfig(component, category))
  }

  // Mount the configuration panel into the PageLayout aside slot (right rail).
  // The slot is rendered by the app shell only on the Configure tab.
  useLayoutEffect(() => {
    // Re-acquire on resize too: at xs/sm the slot moves into a BottomSheet.
    const find = () => setAsideNode(activeTab === 'configure' ? document.getElementById('a1-web-config-aside-slot') : null)
    find()
    window.addEventListener('resize', find)
    return () => window.removeEventListener('resize', find)
  }, [activeTab, component.id])

  const breadcrumbItems = isExamplePage && activeExample
    ? [
        ...getBreadcrumbItems({ category, component }, onNavigate).map((item, index, items) =>
          index === items.length - 1
            ? {
                href: getComponentPath(`component-${component.id}`),
                label: component.title,
                onClick: (event) => navigateBreadcrumb(event, onNavigate, `component-${component.id}`),
              }
            : item,
        ),
        { label: activeExample.title },
      ]
    : getBreadcrumbItems({ category, component }, onNavigate)

  return (
    <ComponentDocsShell>
        {asideNode && createPortal(
          <ConfigurationPanel
            component={component}
            config={config}
            setConfig={setConfig}
            onResetConfig={resetConfig}
            Controls={detail.Controls}
            viewAs={viewAs}
            setViewAs={setViewAs}
            viewAsModes={detail.viewAsModes}
            showHelp={showHelp}
            onToggleHelp={setShowHelp}
            projectId={projectId}
          />,
          asideNode,
        )}
        <Section padding="xs" surface='page' direction="column" gap="xs">
          <Breadcrumb items={breadcrumbItems} />
        </Section>
        <Section padding="xs" surface='page' direction="column" gap="xs">
          {isExamplePage && activeExample ? (
            <Stack gap="lg">
              <Stack gap="xs">
                <Heading as="h1" size={{ xs: 'lg', md: 'xxl' }}>{activeExample.title}</Heading>
                <Paragraph size="sm" color="muted">{activeExample.description}</Paragraph>
              </Stack>
              <ComponentConfigureSurface
                component={component}
                detail={detail}
                config={config}
                setConfig={setConfig}
                displayConfig={displayConfig}
                setDisplayConfig={setDisplayConfig}
                viewAs={viewAs}
                utilityClass={utilityClass}
                example={activeExample}
              />
            </Stack>
          ) : (
            <Tabs value={activeTab} onChange={onTabChange} size="compact">
            <TabList>
              <Tab value="configure">Configure</Tab>
              <Tab value="rules">Rules</Tab>
              <Tab value="properties">Properties</Tab>
              <Tab value="accessibility">Accessibility</Tab>
            </TabList>
            <TabPanel value="configure">
              <ComponentConfigureSurface
                component={component}
                detail={detail}
                config={config}
                setConfig={setConfig}
                displayConfig={displayConfig}
                setDisplayConfig={setDisplayConfig}
                viewAs={viewAs}
                utilityClass={utilityClass}
              />
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
              <AccessibilityPanel component={component} />
            </TabPanel>
          </Tabs>
          )}
        </Section>
    </ComponentDocsShell>
  )
}
