/**
 * EditorPropsPanel — configure tab content for the editor aside panel.
 *
 * When a node is selected: shows the A1 component configurator for that node.
 * When nothing is selected: shows page-level metadata (name, description).
 *
 * Config is mostly derived from the live definition: setConfig / onPageMetadataChange
 * write changes straight back so the panel and the rendered canvas always agree.
 * The one exception is `openItems` — UI-only accordion expand state used by some
 * configurators (ChoiceGroup, CheckboxGroup, RadioGroup) — which has no home in
 * the node, so it is held in local state here.
 */
import { useContext, useState } from 'react'
import { Button, CheckboxGroup, ChoiceGroup, Divider, Heading, Icon, IconButton, Link, NumberField, Paragraph, SelectField, Stack, TextField, TextareaField } from '@gtivr4/a1-design-system-react'
import { getAllPatterns, getPatternProjects, setPatternProjects } from '../patterns/patternStore.js'
import { Choice, ConfigSlider } from '../pages/components/detail/configKit.jsx'
import { IconSelect } from '../pages/components/detail/IconSelect.jsx'
import { ConfigLockContext } from '../pages/components/detail/configLock.jsx'
import { CONVERSION_MAP, getConvertedProps } from './conversionMap.ts'
import { UtilityControls } from './UtilityControls.jsx'

// Layout
import { Controls as SectionControls } from '../pages/components/detail/section.jsx'
import { Controls as StackControls } from '../pages/components/detail/stack.jsx'
import { Controls as GridControls } from '../pages/components/detail/grid.jsx'
import { Controls as ClusterControls } from '../pages/components/detail/cluster.jsx'
import { Controls as CardControls } from '../pages/components/detail/card.jsx'
import { Controls as BleedControls } from '../pages/components/detail/bleed.jsx'
import { Controls as InsetControls } from '../pages/components/detail/inset.jsx'
import { Controls as SpacerControls } from '../pages/components/detail/spacer.jsx'
import { Controls as ButtonContainerControls } from '../pages/components/detail/button-container.jsx'

// Typography & media
import { Controls as HeadingControls } from '../pages/components/detail/heading.jsx'
import { Controls as ParagraphControls } from '../pages/components/detail/paragraph.jsx'
import { Controls as BlockquoteControls } from '../pages/components/detail/blockquote.jsx'
import { Controls as CodeControls } from '../pages/components/detail/code.jsx'
import { Controls as DividerControls } from '../pages/components/detail/divider.jsx'
import { Controls as IconControls } from '../pages/components/detail/icon.jsx'
import { Controls as FigureControls } from '../pages/components/detail/figure.jsx'

// Actions
import { Controls as LinkControls } from '../pages/components/detail/link.jsx'
import { Controls as ButtonControls } from '../pages/components/detail/button.jsx'
import { Controls as IconButtonControls } from '../pages/components/detail/icon-button.jsx'
import { Controls as SwitchControls } from '../pages/components/detail/switch.jsx'
import { Controls as SegmentedControlControls } from '../pages/components/detail/segmented-control.jsx'

// Feedback
import { Controls as BannerControls } from '../pages/components/detail/banner.jsx'
import { Controls as BadgeControls } from '../pages/components/detail/badge.jsx'
import { Controls as EmptyStateControls } from '../pages/components/detail/empty-state.jsx'
import { Controls as StatusBarControls } from '../pages/components/detail/status-bar.jsx'
import { Controls as CircularProgressControls } from '../pages/components/detail/circular-progress.jsx'
import { Controls as StepTrackerControls } from '../pages/components/detail/step-tracker.jsx'

// Inputs
import { Controls as TextFieldControls } from '../pages/components/detail/text-field.jsx'
import { Controls as TextareaFieldControls } from '../pages/components/detail/textarea.jsx'
import { EditorBindControls } from './EditorBindControls.jsx'
import { EditorCollectionControls } from './EditorCollectionControls.jsx'
import { useDataSources } from '../data/DataSourcesContext.jsx'
import { datasetAvailableToProject } from '../services/dataSources/types'
import { datasetBindingKey } from '../data/bindings'
import { ROW_ID_KEY } from '../services/dataSources/rowIds'
import { Controls as SelectFieldControls } from '../pages/components/detail/select.jsx'
import { Controls as NumberFieldControls } from '../pages/components/detail/number-field.jsx'
import { Controls as DateFieldControls } from '../pages/components/detail/date-field.jsx'
import { Controls as TimeFieldControls } from '../pages/components/detail/time-field.jsx'
import { Controls as PhoneFieldControls } from '../pages/components/detail/phone-field.jsx'
import { Controls as ZipFieldControls } from '../pages/components/detail/zip-field.jsx'
import { Controls as CreditCardFieldControls } from '../pages/components/detail/credit-card-field.jsx'
import { Controls as FieldsetControls } from '../pages/components/detail/fieldset.jsx'
import { Controls as CheckboxGroupControls } from '../pages/components/detail/checkbox-group.jsx'
import { Controls as RadioGroupControls } from '../pages/components/detail/radio-group.jsx'
import { Controls as ChoiceGroupControls } from '../pages/components/detail/choice-group.jsx'

// Data
import { Controls as DefinitionListControls } from '../pages/components/detail/definition-list.jsx'
import { Controls as PaginationControls } from '../pages/components/detail/pagination.jsx'
import { Controls as CalendarControls } from '../pages/components/detail/calendar.jsx'

// Navigation
import { Controls as BreadcrumbControls } from '../pages/components/detail/breadcrumb.jsx'
import { Controls as TopHeaderControls } from '../pages/components/detail/top-header.jsx'
import { Controls as BottomDrawerControls } from '../pages/components/detail/bottom-drawer.jsx'
import { Controls as StickyActionsControls } from '../pages/components/detail/sticky-actions.jsx'

// Disclosure
import { Controls as AccordionControls } from '../pages/components/detail/accordion.jsx'

// Actions & controls / data (added editor support)
import { Controls as SliderControls, getDefaultConfig as sliderDefaults } from '../pages/components/detail/slider.jsx'
import { Controls as TabsControls, getDefaultConfig as tabsDefaults } from '../pages/components/detail/tabs.jsx'
import { Controls as ToolbarControls, getDefaultConfig as toolbarDefaults } from '../pages/components/detail/toolbar.jsx'
import { Controls as DataTableControls, getDefaultConfig as dataTableDefaults } from '../pages/components/detail/data-table.jsx'
import { Controls as PageNavControls, getDefaultConfig as pageNavDefaults } from '../pages/components/detail/page-nav.jsx'
import { Controls as TreeMenuControls, getDefaultConfig as treeMenuDefaults } from '../pages/components/detail/tree-menu.jsx'

// ── Node lookup ───────────────────────────────────────────────────────────────

function findInNodes(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findInNodes(node.children, id)
      if (found) return found
    }
  }
  return null
}

export function findNodeInDefinition(definition, id) {
  for (const region of definition.page.layout.regions) {
    const found = findInNodes(region.nodes, id)
    if (found) return found
  }
  return null
}

// ── Config bridges: node → Controls config ────────────────────────────────────
// Exported so the "Copy pattern" feature can introspect which props a component
// type understands (config keys) and which props it produces (node prop keys).

export const propsToConfig = {
  // Layout
  Section: (props) => ({
    as: props?.as ?? 'section',
    padding: props?.padding ?? 'md',
    surface: props?.surface ?? '',
    gap: props?.gap ?? '',
    contentWidth: props?.contentWidth ?? '',
    height: props?.height ?? '',
    align: props?.align ?? '',
    gradient: props?.gradient ?? '',
    gradientPosition: props?.gradientPosition ?? 'center',
    borderSize: props?.borderSize ?? '',
    borderStyle: props?.borderStyle ?? 'solid',
    borderVariant: props?.borderVariant ?? 'subtle',
    borderSides: Array.isArray(props?.borderSides) ? props.borderSides : ['top', 'right', 'bottom', 'left'],
    radius: props?.radius ?? 'none',
    inverse: props?.inverse ?? false,
  }),

  Stack: (props) => ({
    as: props?.as ?? 'div',
    direction: props?.direction ?? 'column',
    gap: props?.gap ?? 'sm',
    align: props?.align ?? 'stretch',
    justify: props?.justify ?? 'start',
    wrap: props?.wrap ?? false,
  }),

  Grid: (props) => ({
    columns: props?.columns ?? 2,
    gap: props?.gap ?? 'md',
    layout: props?.layout ?? 'default',
  }),

  Cluster: (props) => ({
    gap: props?.gap ?? 8,
    align: props?.align ?? 'center',
    justify: props?.justify ?? 'start',
  }),

  Card: (props) => ({
    as: props?.as ?? 'div',
    variant: props?.variant ?? 'default',
    href: props?.href ?? '#',
    bare: props?.bare ?? false,
    icon: props?.icon ?? '',
    iconDisplay: props?.iconDisplay ?? (props?.icon ? 'default' : 'none'),
    heroColor: props?.heroColor ?? 'action',
    heroBadge: props?.heroBadge ?? '',
    heroBadgeStatus: props?.heroBadgeStatus ?? 'neutral',
    heroBadgePosition: props?.heroBadgePosition ?? 'top-end',
    status: props?.status ?? '',
    statusLabel: props?.statusLabel ?? 'In progress',
    statusPulse: props?.statusPulse ?? false,
  }),

  Bleed: (props) => ({
    space: props?.space ?? 16,
  }),

  Inset: (props) => ({
    space: props?.space ?? 16,
  }),

  Spacer: (props) => ({
    size: props?.size ?? 'md',
  }),

  ButtonContainer: (props) => ({
    align: props?.align ?? 'end',
    size: props?.size ?? '',
    fillButtons: props?.fillButtons ?? false,
    primaryLabel: 'Save changes',
    secondaryLabel: 'Cancel',
  }),

  // Typography & media
  Heading: (props, content) => ({
    as: props?.as ?? 'h2',
    type: props?.type ?? 'heading',
    size: props?.size ?? 'md',
    color: props?.color ?? 'default',
    align: props?.align ?? 'left',
    margin: props?.margin ?? '',
    textWrap: props?.textWrap === 'balance',
    children: content?.fallback ?? '',
  }),

  Paragraph: (props, content) => ({
    as: props?.as ?? 'p',
    size: props?.size ?? 'md',
    color: props?.color ?? 'default',
    align: props?.align ?? 'left',
    textWrap: props?.textWrap === 'balance',
    children: content?.fallback ?? '',
  }),

  Blockquote: (props, content) => ({
    variant: props?.variant ?? 'border',
    cite: props?.cite ?? '',
    citeUrl: props?.citeUrl ?? '',
    children: content?.fallback ?? '',
  }),

  Code: (props, content) => ({
    variant: props?.variant ?? 'block',
    wrapping: props?.wrapping ?? true,
    editable: props?.editable ?? false,
    copyCode: props?.copyCode ?? false,
    copyText: props?.copyText ?? '',
    children: content?.fallback ?? '',
  }),

  Divider: (props) => ({
    orientationMode: 'horizontal',
    orientation: props?.orientation ?? 'horizontal',
    responsiveOrientation: {
      xs: 'horizontal', sm: 'horizontal', md: 'vertical', lg: 'vertical', xl: 'vertical',
    },
    variant: props?.variant ?? 'subtle',
    lineStyle: props?.lineStyle ?? 'solid',
    size: props?.size ?? 'xs',
    space: props?.space ?? 'sm',
    decorative: props?.decorative ?? true,
  }),

  Icon: (props) => ({
    name: props?.name ?? 'star',
    size: props?.size ?? 'lg',
    color: props?.color ?? '',
    fill: props?.fill ?? false,
  }),

  Figure: (props) => ({
    src: props?.src ?? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
    alt: props?.alt ?? '',
    caption: props?.caption ?? '',
    radius: props?.radius ?? 'md',
    size: props?.size ?? '',
    align: props?.align ?? 'none',
    captionPosition: props?.captionPosition ?? 'start',
    captionSrOnly: props?.captionSrOnly ?? false,
    // A node with a cropRect uses the freeform "Custom" crop; otherwise it uses
    // the preset aspect-ratio + named focal point.
    aspectRatio: props?.aspectRatio ?? '',
    crop: props?.crop ?? 'center',
    customCrop: !!props?.cropRect,
    cropRatio: '',
    cropRect: props?.cropRect ?? null,
  }),

  // Actions
  Link: (props, content) => ({
    children: content?.fallback ?? 'Link text',
    href: props?.href ?? '#',
    size: props?.size ?? '',
    weight: props?.weight ?? '',
    showIcon: !!props?.icon,
    icon: props?.icon ?? 'open_in_new',
    iconPosition: props?.iconPosition ?? 'end',
  }),

  Button: (props, content) => ({
    label: content?.fallback ?? '',
    variant: props?.variant ?? 'primary',
    size: props?.size ?? 'md',
    href: props?.href ?? '',
    icon: props?.icon ?? '',
    iconPosition: props?.iconPosition ?? 'start',
    fullWidth: props?.fullWidth ?? false,
    loading: props?.loading ?? false,
    disabled: props?.disabled ?? false,
  }),

  IconButton: (props) => ({
    icon: props?.icon ?? 'settings',
    label: props?.label ?? 'Action',
    variant: props?.variant ?? 'tertiary',
    size: props?.size ?? 'md',
    href: props?.href ?? '',
    disabled: props?.disabled ?? false,
  }),

  Switch: (props) => ({
    label: props?.label ?? '',
    hint: props?.hint ?? '',
    error: props?.error ?? '',
    size: props?.size ?? 'default',
    labelPosition: props?.labelPosition ?? 'end',
    checked: props?.defaultChecked ?? true,
    disabled: props?.disabled ?? false,
  }),

  SegmentedControl: (props) => ({
    size: props?.size ?? 'md',
    fullWidth: props?.fullWidth ?? false,
    options: (props?.options ?? [
      { value: 'day', label: 'Day', icon: '' },
      { value: 'week', label: 'Week', icon: '' },
      { value: 'month', label: 'Month', icon: '' },
    ]).map((opt) => ({
      id: opt.value ?? opt.id,
      label: opt.label ?? '',
      icon: opt.icon ?? '',
    })),
    openItems: [],
  }),

  // Feedback
  Banner: (props, content) => ({
    variant: props?.variant ?? 'inline',
    status: props?.status ?? 'info',
    title: props?.title ?? '',
    children: content?.fallback ?? '',
    iconMode: props?.iconMode ?? 'default',
    icon: props?.icon ?? 'info',
    action: props?.action ?? 'link',
    actionLabel: props?.actionLabel ?? 'Learn more',
    dismissible: props?.dismissible ?? true,
    dismissed: false,
  }),

  MessageBadge: (props, content) => ({
    children: content?.fallback ?? '',
    status: props?.status ?? 'neutral',
    subtle: props?.subtle ?? false,
    size: props?.size ?? 'md',
    iconMode: props?.icon === null ? 'none' : (props?.icon ? 'custom' : 'default'),
    icon: typeof props?.icon === 'string' ? props.icon : 'info',
  }),

  MessageEmptyState: (props) => ({
    scale: props?.scale ?? 'section',
    icon: props?.icon ?? 'inbox',
    title: props?.title ?? '',
    description: props?.description ?? '',
    showAction: false,
    actionLabel: 'Get started',
    actionVariant: 'secondary',
  }),

  StatusBar: (props) => ({
    value: props?.value ?? 65,
    max: props?.max ?? 100,
    label: props?.label ?? '',
    ariaLabel: props?.['aria-label'] ?? '',
    labelPosition: props?.labelPosition ?? 'above',
    size: props?.size ?? 'md',
    indeterminate: props?.indeterminate ?? false,
  }),

  CircularProgress: (props) => ({
    value: props?.value ?? 65,
    max: props?.max ?? 100,
    size: props?.size ?? 'md',
    indeterminate: props?.indeterminate ?? false,
    content: 'percent',
    label: 'Loading',
    icon: 'check',
    ariaLabel: props?.['aria-label'] ?? '',
  }),

  StepTracker: (props) => ({
    steps: props?.steps ?? 5,
    currentStep: props?.currentStep ?? 2,
    align: props?.align ?? 'left',
  }),

  // Inputs
  TextField: (props) => ({
    label: props?.label ?? 'Label',
    type: props?.type ?? 'text',
    hint: props?.hint ?? '',
    error: props?.error ?? '',
    value: '',
    size: props?.size ?? 'default',
    labelPosition: props?.labelPosition ?? 'above',
    autoComplete: props?.autoComplete ?? '',
    required: props?.required ?? false,
    disabled: props?.disabled ?? false,
    readOnly: props?.readOnly ?? false,
  }),

  TextareaField: (props) => ({
    label: props?.label ?? 'Label',
    hint: props?.hint ?? '',
    error: props?.error ?? '',
    value: '',
    size: props?.size ?? 'default',
    labelPosition: props?.labelPosition ?? 'above',
    autoComplete: props?.autoComplete ?? '',
    required: props?.required ?? false,
    disabled: props?.disabled ?? false,
    readOnly: props?.readOnly ?? false,
    rows: props?.rows ?? 'md',
    maxLength: props?.maxLength != null ? String(props.maxLength) : '',
    showCount: props?.showCount ?? false,
  }),

  CheckboxGroup: (props) => ({
    label: props?.label ?? '',
    hint: props?.hint ?? '',
    error: props?.error ?? '',
    size: props?.size ?? 'default',
    inline: props?.inline ?? false,
    required: props?.required ?? false,
    disabled: props?.disabled ?? false,
    options: (props?.options ?? [
      { value: 'opt-email', label: 'Email' },
      { value: 'opt-sms', label: 'SMS' },
      { value: 'opt-push', label: 'Push' },
    ]).map((opt) => ({
      id: opt.value ?? opt.id ?? '',
      label: opt.label ?? '',
      hint: opt.hint ?? '',
      disabled: !!opt.disabled,
      selected: false,
    })),
    openItems: [],
  }),

  RadioGroup: (props) => ({
    label: props?.label ?? '',
    hint: props?.hint ?? '',
    error: props?.error ?? '',
    size: props?.size ?? 'default',
    inline: props?.inline ?? false,
    required: props?.required ?? false,
    disabled: props?.disabled ?? false,
    options: (props?.options ?? [
      { value: 'opt-starter', label: 'Starter' },
      { value: 'opt-pro', label: 'Professional' },
      { value: 'opt-ent', label: 'Enterprise' },
    ]).map((opt) => ({
      id: opt.value ?? opt.id ?? '',
      label: opt.label ?? '',
      hint: opt.hint ?? '',
      disabled: !!opt.disabled,
      selected: false,
    })),
    openItems: [],
  }),

  ChoiceGroup: (props) => ({
    label: props?.label ?? 'Plan',
    hint: props?.hint ?? '',
    error: props?.error ?? '',
    success: props?.success ?? '',
    size: props?.size ?? 'default',
    columns: props?.columns == null ? 'auto' : (typeof props.columns === 'object' ? props.columns : String(props.columns)),
    multiple: props?.multiple ?? false,
    inlineIcon: props?.inlineIcon ?? false,
    hideIndicator: props?.hideIndicator ?? false,
    required: props?.required ?? false,
    options: (props?.options ?? [
      { value: 'starter', label: 'Starter', subtext: 'For individuals', icon: 'person' },
      { value: 'team', label: 'Team', subtext: 'For small teams', icon: 'group' },
      { value: 'business', label: 'Business', subtext: 'For organizations', icon: 'apartment' },
    ]).map((opt) => ({
      id: opt.value ?? opt.id ?? '',
      label: opt.label ?? '',
      subtext: opt.subtext ?? '',
      icon: opt.icon ?? '',
      disabled: !!opt.disabled,
    })),
    openItems: [],
  }),

  // Data
  DefinitionList: (props) => {
    const rawItems = props?.items ?? [
      { label: 'Account ID', value: 'A1-849204', copyValue: true },
      { label: 'Plan', value: 'Enterprise' },
      { label: 'Renewal', value: 'June 30, 2026' },
    ]
    return {
      direction: props?.direction ?? 'row',
      size: props?.size ?? 'md',
      labelWidth: props?.labelWidth ?? 'fixed',
      items: rawItems.map((item, i) => ({ id: `dl-item-${i}`, ...item })),
    }
  },

  Pagination: (props) => ({
    totalPages: props?.totalPages ?? 10,
    siblings: props?.siblings ?? 1,
    size: props?.size ?? 'md',
  }),

  // More inputs
  SelectField: (props) => ({
    label: props?.label ?? 'Label',
    hint: props?.hint ?? '',
    error: props?.error ?? '',
    size: props?.size ?? 'default',
    labelPosition: props?.labelPosition ?? 'above',
    required: props?.required ?? false,
    disabled: props?.disabled ?? false,
    options: props?.options ?? [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
      { value: 'opt3', label: 'Option 3' },
    ],
  }),

  NumberField: (props) => ({
    label: props?.label ?? 'Amount',
    hint: props?.hint ?? '',
    error: props?.error ?? '',
    value: '',
    prefix: props?.prefix ?? '',
    unit: props?.unit ?? '',
    size: props?.size ?? 'default',
    labelPosition: props?.labelPosition ?? 'above',
    required: props?.required ?? false,
    disabled: props?.disabled ?? false,
    readOnly: props?.readOnly ?? false,
  }),

  DateField: (props) => ({
    label: props?.label ?? 'Date',
    hint: props?.hint ?? '',
    error: props?.error ?? '',
    value: '',
    size: props?.size ?? 'default',
    labelPosition: props?.labelPosition ?? 'above',
    required: props?.required ?? false,
    disabled: props?.disabled ?? false,
    readOnly: props?.readOnly ?? false,
  }),

  TimeField: (props) => ({
    label: props?.label ?? 'Time',
    hint: props?.hint ?? '',
    error: props?.error ?? '',
    value: '',
    size: props?.size ?? 'default',
    labelPosition: props?.labelPosition ?? 'above',
    required: props?.required ?? false,
    disabled: props?.disabled ?? false,
    readOnly: props?.readOnly ?? false,
  }),

  PhoneField: (props) => ({
    label: props?.label ?? 'Phone number',
    hint: props?.hint ?? '',
    error: props?.error ?? '',
    value: '',
    autoComplete: props?.autoComplete ?? 'tel',
    size: props?.size ?? 'default',
    labelPosition: props?.labelPosition ?? 'above',
    required: props?.required ?? false,
    disabled: props?.disabled ?? false,
    readOnly: props?.readOnly ?? false,
  }),

  ZipField: (props) => ({
    label: props?.label ?? 'ZIP code',
    hint: props?.hint ?? '',
    error: props?.error ?? '',
    value: '',
    autoComplete: props?.autoComplete ?? 'postal-code',
    size: props?.size ?? 'default',
    labelPosition: props?.labelPosition ?? 'above',
    required: props?.required ?? false,
    disabled: props?.disabled ?? false,
    readOnly: props?.readOnly ?? false,
  }),

  CreditCardField: (props) => ({
    label: props?.label ?? 'Card number',
    hint: props?.hint ?? '',
    error: props?.error ?? '',
    value: '',
    autoComplete: props?.autoComplete ?? 'cc-number',
    size: props?.size ?? 'default',
    labelPosition: props?.labelPosition ?? 'above',
    required: props?.required ?? false,
    disabled: props?.disabled ?? false,
    readOnly: props?.readOnly ?? false,
  }),

  Fieldset: (props, content) => ({
    legend: content?.fallback ?? props?.legend ?? 'Group',
    size: props?.size ?? 'default',
    labelPosition: props?.labelPosition ?? 'above',
    markRequired: props?.markRequired ?? false,
    surface: props?.surface ?? false,
  }),

  // Navigation
  Breadcrumb: (props) => ({
    items: props?.items ?? [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'section', label: 'Section', href: '/section' },
      { id: 'current', label: 'Current page' },
    ],
  }),

  TopHeader: (props) => ({
    logoText: props?.logoText ?? 'My App',
    navIconPosition: props?.navIconPosition ?? 'start',
    navItems: props?.navItems ?? [
      { id: 'home', label: 'Home', icon: 'home', href: '/', active: true },
      { id: 'about', label: 'About', icon: 'info', href: '/about' },
    ],
  }),

  BottomDrawer: (props) => ({
    items: props?.items ?? [
      { id: 'home', label: 'Home', icon: 'home', active: true },
      { id: 'search', label: 'Search', icon: 'search' },
      { id: 'account', label: 'Account', icon: 'person' },
    ],
    ariaLabel: props?.['aria-label'] ?? 'App navigation',
  }),

  StickyActions: (props) => ({
    contentWidth: props?.contentWidth ?? 'md',
  }),

  // Calendar
  Calendar: (props) => ({
    variant: props?.variant ?? 'paginated',
    monthsToShow: props?.monthsToShow ?? 13,
    highlightToday: props?.highlightToday ?? true,
    dimPast: props?.dimPast ?? true,
    todayButton: props?.todayButton ?? false,
  }),

  // Disclosure
  Accordion: (props) => ({
    label: props?.label ?? 'Accordion heading',
    size: props?.size ?? 'md',
    defaultOpen: props?.defaultOpen ?? true,
    disabled: props?.disabled ?? false,
  }),

  List: (props) => ({
    variant: props?.variant ?? 'unordered',
    icon: props?.icon ?? 'check',
    size: props?.size ?? 'md',
    color: props?.color ?? 'default',
    children: '',
  }),

  ListItem: (props, content) => ({
    children: content?.fallback ?? '',
    icon: props?.icon ?? '',
  }),

  // Actions & controls — Slider/PageNav use real props; Tabs/Toolbar use
  // config-as-props (the node's props are the configurator config, rendered by
  // the editor adapters in editorComponents.jsx).
  Slider: (props) => {
    const d = sliderDefaults()
    return {
      label: props?.label ?? 'Slider',
      size: props?.size ?? 'default',
      variant: props?.variant ?? 'default',
      mode: Array.isArray(props?.detents) ? 'detents' : (props ? 'continuous' : d.mode),
      detents: Array.isArray(props?.detents) ? props.detents : d.detents,
      min: props?.min ?? 0,
      max: props?.max ?? 100,
      step: props?.step ?? 1,
      valuePosition: props?.valuePosition ?? 'above',
      showValue: props?.showValue ?? true,
      disabled: props?.disabled ?? false,
    }
  },

  Tabs: (props) => ({ ...tabsDefaults(), ...(props ?? {}), openItems: [] }),

  Toolbar: (props) => ({ ...toolbarDefaults(), ...(props ?? {}) }),

  // Navigation
  PageNav: (props) => ({
    label: props?.label ?? 'On this page',
    sections: (props?.sections ?? pageNavDefaults().sections.map((s) => ({ id: s.key, label: s.label, level: s.level })))
      .map((s, i) => ({ key: s.id ?? `page-nav-${i}`, label: s.label ?? '', level: s.level ?? 1 })),
    openItems: [],
  }),

  TreeMenu: (props) => ({ ...treeMenuDefaults(), ...(props ?? {}) }),

  // Inputs — FieldRow has no props of its own (it lays out its field children).
  FieldRow: () => ({}),

  // Data
  DataTable: (props) => ({ ...dataTableDefaults(), ...(props ?? {}) }),

  // Pattern authoring — a constrained blank area.
  Slot: (props) => ({
    label: props?.label ?? '',
    allow: props?.allow ?? [],
    allowPatterns: props?.allowPatterns ?? [],
    min: props?.min,
    max: props?.max,
    columns: props?.columns,
    gap: props?.gap,
  }),
}

// ── Config bridges: Controls config → node update ─────────────────────────────

export const configToNodeUpdate = {
  // Layout
  Section: (config) => ({
    props: {
      as: config.as,
      padding: config.padding,
      surface: config.surface || undefined,
      gap: config.gap || undefined,
      contentWidth: config.contentWidth || undefined,
      height: config.height || undefined,
      align: config.align || undefined,
      gradient: config.gradient || undefined,
      gradientPosition: config.gradient ? config.gradientPosition : undefined,
      borderSize: config.borderSize || undefined,
      borderStyle: config.borderStyle,
      borderVariant: config.borderVariant,
      borderSides:
        config.borderSize && Array.isArray(config.borderSides) && config.borderSides.length !== 4
          ? config.borderSides
          : undefined,
      radius: config.radius,
      inverse: config.inverse || undefined,
    },
  }),

  Stack: (config) => ({
    props: {
      as: config.as,
      direction: config.direction,
      gap: config.gap,
      align: config.align,
      justify: config.justify,
      wrap: config.wrap || undefined,
    },
  }),

  Grid: (config) => ({
    props: {
      // columns may be a number or a responsive `{ xs, sm, … }` object.
      columns: config.columns && typeof config.columns === 'object' ? config.columns : Number(config.columns),
      gap: config.gap,
      layout: config.layout !== 'default' ? config.layout : undefined,
    },
  }),

  Cluster: (config) => ({
    props: {
      gap: config.gap,
      align: config.align !== 'center' ? config.align : undefined,
      justify: config.justify !== 'start' ? config.justify : undefined,
    },
  }),

  Card: (config) => ({
    props: {
      as: config.variant === 'navigation' ? undefined : config.as,
      variant: config.variant,
      href: config.variant === 'navigation' ? config.href : undefined,
      bare: config.bare || undefined,
      icon: config.iconDisplay !== 'none' ? config.icon || undefined : undefined,
      iconDisplay: config.iconDisplay,
      heroColor: config.iconDisplay === 'hero' ? config.heroColor : undefined,
      heroBadge: config.iconDisplay === 'hero' && config.heroBadge ? config.heroBadge : undefined,
      heroBadgeStatus: config.iconDisplay === 'hero' && config.heroBadge ? config.heroBadgeStatus : undefined,
      heroBadgePosition: config.iconDisplay === 'hero' && config.heroBadge ? config.heroBadgePosition : undefined,
      status: config.status || undefined,
      statusLabel: config.status && config.statusLabel ? config.statusLabel : undefined,
      statusPulse: config.status && config.statusPulse ? true : undefined,
    },
  }),

  Bleed: (config) => ({
    props: { space: config.space },
  }),

  Inset: (config) => ({
    props: { space: config.space },
  }),

  Spacer: (config) => ({
    props: { size: config.size },
  }),

  ButtonContainer: (config) => ({
    props: {
      align: config.align,
      size: config.size || undefined,
      fillButtons: config.fillButtons || undefined,
    },
  }),

  // Typography & media
  Heading: (config) => ({
    props: {
      as: config.as,
      type: config.type,
      size: config.size,
      color: config.color,
      align: config.align,
      margin: config.margin || undefined,
      textWrap: config.textWrap ? 'balance' : undefined,
    },
    contentFallback: config.children,
  }),

  Paragraph: (config) => ({
    props: {
      as: config.as,
      size: config.size,
      color: config.color,
      align: config.align,
      textWrap: config.textWrap ? 'balance' : undefined,
    },
    contentFallback: config.children,
  }),

  Blockquote: (config) => ({
    props: {
      variant: config.variant,
      cite: config.cite || undefined,
      citeUrl: config.citeUrl || undefined,
    },
    contentFallback: config.children,
  }),

  Code: (config) => ({
    props: {
      variant: config.variant,
      wrapping: config.wrapping || undefined,
      editable: config.editable || undefined,
      copyCode: config.copyCode || undefined,
      copyText: config.copyText || undefined,
    },
    contentFallback: config.children,
  }),

  Divider: (config) => ({
    props: {
      orientation: config.orientationMode === 'horizontal' ? 'horizontal'
        : config.orientationMode === 'vertical' ? 'vertical'
        : config.responsiveOrientation,
      variant: config.variant,
      lineStyle: config.lineStyle,
      size: config.size,
      space: config.space,
      decorative: config.decorative,
    },
  }),

  Icon: (config) => ({
    props: {
      name: config.name || 'star',
      size: config.size || undefined,
      color: config.color || undefined,
      fill: config.fill || undefined,
    },
  }),

  Figure: (config) => ({
    props: {
      src: config.src || undefined,
      alt: config.alt || undefined,
      caption: config.captionSrOnly ? undefined : (config.caption || undefined),
      radius: config.radius && config.radius !== 'none' ? config.radius : undefined,
      size: config.size || undefined,
      align: config.align && config.align !== 'none' ? config.align : undefined,
      aspectRatio: !config.customCrop && config.aspectRatio ? config.aspectRatio : undefined,
      crop: !config.customCrop && config.aspectRatio && config.crop && config.crop !== 'center' ? config.crop : undefined,
      cropRect: config.customCrop ? (config.cropRect || undefined) : undefined,
      captionPosition: config.captionPosition !== 'start' ? config.captionPosition : undefined,
      captionSrOnly: config.captionSrOnly || undefined,
    },
  }),

  // Actions
  Link: (config) => ({
    props: {
      href: config.href || '#',
      size: config.size || undefined,
      weight: config.weight || undefined,
      icon: config.showIcon ? config.icon : undefined,
      iconPosition: config.showIcon ? config.iconPosition : undefined,
    },
    contentFallback: config.children,
  }),

  Button: (config) => ({
    props: {
      // A Button that links to a page must be an anchor so navigation works.
      as: config.href ? 'a' : undefined,
      variant: config.variant,
      size: config.size,
      href: config.href || undefined,
      icon: config.icon || undefined,
      iconPosition: config.iconPosition,
      fullWidth: config.fullWidth || undefined,
      loading: config.loading || undefined,
      disabled: config.disabled || undefined,
    },
    contentFallback: config.label,
  }),

  IconButton: (config) => ({
    props: {
      // An IconButton that links to a page must be an anchor so navigation works.
      as: config.href ? 'a' : undefined,
      icon: config.icon || 'settings',
      label: config.label,
      variant: config.variant,
      size: config.size,
      href: config.href || undefined,
      disabled: config.disabled || undefined,
    },
  }),

  Switch: (config) => ({
    props: {
      label: config.label || undefined,
      hint: config.hint || undefined,
      error: config.error || undefined,
      size: config.size,
      labelPosition: config.labelPosition,
      defaultChecked: config.checked,
      disabled: config.disabled || undefined,
    },
  }),

  SegmentedControl: (config) => ({
    props: {
      size: config.size,
      fullWidth: config.fullWidth || undefined,
      options: config.options.map(({ id, label, icon }) => ({
        value: id,
        label,
        icon: icon || undefined,
      })),
    },
  }),

  // Feedback
  Banner: (config) => ({
    props: {
      variant: config.variant,
      status: config.status,
      title: config.title || undefined,
      iconMode: config.iconMode,
      icon: config.iconMode === 'custom' ? config.icon : undefined,
      action: config.action !== 'none' ? config.action : undefined,
      actionLabel: config.action !== 'none' ? config.actionLabel : undefined,
      dismissible: config.dismissible || undefined,
    },
    contentFallback: config.children,
  }),

  MessageBadge: (config) => ({
    props: {
      status: config.status,
      subtle: config.subtle || undefined,
      size: config.size,
      icon: config.iconMode === 'none' ? null
        : config.iconMode === 'custom' ? config.icon
        : undefined,
    },
    contentFallback: config.children,
  }),

  MessageEmptyState: (config) => ({
    props: {
      scale: config.scale,
      icon: config.icon || undefined,
      title: config.title || undefined,
      description: config.description || undefined,
    },
  }),

  StatusBar: (config) => ({
    props: {
      value: Number(config.value),
      max: Number(config.max),
      label: config.label || undefined,
      'aria-label': config.ariaLabel || undefined,
      labelPosition: config.labelPosition,
      size: config.size,
      indeterminate: config.indeterminate || undefined,
    },
  }),

  CircularProgress: (config) => ({
    props: {
      value: Number(config.value),
      max: Number(config.max),
      size: config.size,
      indeterminate: config.indeterminate || undefined,
      'aria-label': config.ariaLabel || undefined,
    },
  }),

  StepTracker: (config) => ({
    props: {
      steps: Number(config.steps),
      currentStep: Number(config.currentStep),
      align: config.align,
    },
  }),

  // Inputs
  TextField: (config) => ({
    props: {
      label: config.label || undefined,
      type: config.type,
      hint: config.hint || undefined,
      error: config.error || undefined,
      size: config.size,
      labelPosition: config.labelPosition,
      autoComplete: config.autoComplete || undefined,
      required: config.required || undefined,
      disabled: config.disabled || undefined,
      readOnly: config.readOnly || undefined,
    },
  }),

  TextareaField: (config) => ({
    props: {
      label: config.label || undefined,
      hint: config.hint || undefined,
      error: config.error || undefined,
      size: config.size,
      labelPosition: config.labelPosition,
      autoComplete: config.autoComplete || undefined,
      required: config.required || undefined,
      disabled: config.disabled || undefined,
      readOnly: config.readOnly || undefined,
      rows: config.rows !== 'md' ? config.rows : undefined,
      maxLength: config.maxLength ? Number(config.maxLength) : undefined,
      showCount: config.showCount || undefined,
    },
  }),

  CheckboxGroup: (config) => ({
    props: {
      label: config.label || undefined,
      hint: config.hint || undefined,
      error: config.error || undefined,
      size: config.size,
      inline: config.inline || undefined,
      required: config.required || undefined,
      disabled: config.disabled || undefined,
      options: config.options.map((opt) => ({
        value: opt.id,
        label: opt.label,
        hint: opt.hint || undefined,
        disabled: opt.disabled || undefined,
      })),
    },
  }),

  RadioGroup: (config) => ({
    props: {
      label: config.label || undefined,
      hint: config.hint || undefined,
      error: config.error || undefined,
      size: config.size,
      inline: config.inline || undefined,
      required: config.required || undefined,
      disabled: config.disabled || undefined,
      options: config.options.map((opt) => ({
        value: opt.id,
        label: opt.label,
        hint: opt.hint || undefined,
        disabled: opt.disabled || undefined,
      })),
    },
  }),

  ChoiceGroup: (config) => ({
    props: {
      label: config.label || undefined,
      hint: config.hint || undefined,
      error: config.error || undefined,
      success: config.success || undefined,
      size: config.size,
      columns: config.columns && typeof config.columns === 'object'
        ? Object.fromEntries(Object.entries(config.columns).filter(([, v]) => v !== 'auto' && v != null && v !== '').map(([k, v]) => [k, Number(v)]))
        : (config.columns === 'auto' ? undefined : Number(config.columns)),
      multiple: config.multiple || undefined,
      inlineIcon: config.inlineIcon || undefined,
      hideIndicator: config.hideIndicator || undefined,
      required: config.required || undefined,
      options: config.options.map((opt) => ({
        value: opt.id,
        label: opt.label,
        subtext: opt.subtext || undefined,
        icon: opt.icon || undefined,
        disabled: opt.disabled || undefined,
      })),
    },
  }),

  // Data
  DefinitionList: (config) => ({
    props: {
      direction: config.direction,
      size: config.size,
      labelWidth: config.direction === 'row' ? config.labelWidth : undefined,
      items: config.items.map(({ id: _id, ...rest }) => rest),
    },
  }),

  Pagination: (config) => ({
    props: {
      totalPages: Number(config.totalPages),
      siblings: Number(config.siblings),
      size: config.size,
    },
  }),

  // More inputs
  SelectField: (config) => ({
    props: {
      label: config.label || undefined,
      hint: config.hint || undefined,
      error: config.error || undefined,
      size: config.size,
      labelPosition: config.labelPosition,
      required: config.required || undefined,
      disabled: config.disabled || undefined,
      options: config.options,
    },
  }),

  NumberField: (config) => ({
    props: {
      label: config.label || undefined,
      hint: config.hint || undefined,
      error: config.error || undefined,
      prefix: config.prefix || undefined,
      unit: config.unit || undefined,
      size: config.size,
      labelPosition: config.labelPosition,
      required: config.required || undefined,
      disabled: config.disabled || undefined,
      readOnly: config.readOnly || undefined,
    },
  }),

  DateField: (config) => ({
    props: {
      label: config.label || undefined,
      hint: config.hint || undefined,
      error: config.error || undefined,
      size: config.size,
      labelPosition: config.labelPosition,
      required: config.required || undefined,
      disabled: config.disabled || undefined,
      readOnly: config.readOnly || undefined,
    },
  }),

  TimeField: (config) => ({
    props: {
      label: config.label || undefined,
      hint: config.hint || undefined,
      error: config.error || undefined,
      size: config.size,
      labelPosition: config.labelPosition,
      required: config.required || undefined,
      disabled: config.disabled || undefined,
      readOnly: config.readOnly || undefined,
    },
  }),

  PhoneField: (config) => ({
    props: {
      label: config.label || undefined,
      hint: config.hint || undefined,
      error: config.error || undefined,
      autoComplete: config.autoComplete || undefined,
      size: config.size,
      labelPosition: config.labelPosition,
      required: config.required || undefined,
      disabled: config.disabled || undefined,
      readOnly: config.readOnly || undefined,
    },
  }),

  ZipField: (config) => ({
    props: {
      label: config.label || undefined,
      hint: config.hint || undefined,
      error: config.error || undefined,
      autoComplete: config.autoComplete || undefined,
      size: config.size,
      labelPosition: config.labelPosition,
      required: config.required || undefined,
      disabled: config.disabled || undefined,
      readOnly: config.readOnly || undefined,
    },
  }),

  CreditCardField: (config) => ({
    props: {
      label: config.label || undefined,
      hint: config.hint || undefined,
      error: config.error || undefined,
      autoComplete: config.autoComplete || undefined,
      size: config.size,
      labelPosition: config.labelPosition,
      required: config.required || undefined,
      disabled: config.disabled || undefined,
      readOnly: config.readOnly || undefined,
    },
  }),

  Fieldset: (config) => ({
    props: {
      size: config.size,
      labelPosition: config.labelPosition !== 'above' ? config.labelPosition : undefined,
      markRequired: config.markRequired || undefined,
      surface: config.surface || undefined,
    },
    // Legend is stored as editable content so it can be edited inline on canvas.
    contentFallback: config.legend,
  }),

  // Navigation
  Breadcrumb: (config) => ({
    props: {
      items: config.items,
    },
  }),

  TopHeader: (config) => ({
    props: {
      logoText: config.logoText || undefined,
      navIconPosition: config.navIconPosition,
      navItems: config.navItems,
    },
  }),

  BottomDrawer: (config) => ({
    props: {
      items: config.items,
      'aria-label': config.ariaLabel || undefined,
    },
  }),

  StickyActions: (config) => ({
    props: {
      contentWidth: config.contentWidth || undefined,
    },
  }),

  // Calendar
  Calendar: (config) => ({
    props: {
      variant: config.variant,
      monthsToShow: config.variant === 'scroll' ? Number(config.monthsToShow) : undefined,
      highlightToday: config.highlightToday || undefined,
      dimPast: config.dimPast || undefined,
      todayButton: config.variant === 'paginated' ? config.todayButton || undefined : undefined,
    },
  }),

  // Disclosure
  Accordion: (config) => ({
    props: {
      label: config.label,
      size: config.size,
      defaultOpen: config.defaultOpen,
      disabled: config.disabled || undefined,
    },
  }),

  List: (config) => ({
    props: {
      as: config.variant === 'ordered' ? 'ol' : 'ul',
      variant: config.variant !== 'unordered' ? config.variant : undefined,
      icon: config.variant === 'icon' ? config.icon || undefined : undefined,
      size: config.size !== 'md' ? config.size : undefined,
      color: config.color !== 'default' ? config.color : undefined,
    },
  }),

  ListItem: (config) => ({
    props: { icon: config.icon || undefined },
    contentFallback: config.children,
  }),

  // Actions & controls
  Slider: (config) => {
    const isDetents = config.mode === 'detents'
    const mid = isDetents && config.detents?.length
      ? config.detents[Math.floor((config.detents.length - 1) / 2)].value
      : 40
    return {
      props: {
        label: config.label || undefined,
        size: config.size !== 'default' ? config.size : undefined,
        variant: config.variant !== 'default' ? config.variant : undefined,
        detents: isDetents ? config.detents : undefined,
        defaultValue: isDetents ? mid : 40,
        min: !isDetents && config.min !== 0 ? config.min : undefined,
        max: !isDetents && config.max !== 100 ? config.max : undefined,
        step: !isDetents && config.step !== 1 ? config.step : undefined,
        valuePosition: config.valuePosition !== 'above' ? config.valuePosition : undefined,
        showValue: config.showValue ? undefined : false,
        disabled: config.disabled || undefined,
      },
    }
  },

  // Config-as-props adapters: the node's props ARE the configurator config (the
  // editor adapters in editorComponents.jsx render the matching detail Preview).
  Tabs: (config) => {
    const { openItems: _openItems, ...rest } = config
    return { props: rest }
  },

  Toolbar: (config) => ({ props: { ...config } }),

  TreeMenu: (config) => ({
    props: {
      selectedId: config.selectedId,
      expandedIds: config.expandedIds,
      showExpandControls: config.showExpandControls,
      draggable: config.draggable,
      items: config.items,
    },
  }),

  DataTable: (config) => ({ props: { ...config } }),

  // Pattern authoring — a constrained blank area.
  Slot: (config) => ({
    props: {
      label: config.label || undefined,
      allow: config.allow?.length ? config.allow : undefined,
      allowPatterns: config.allowPatterns?.length ? config.allowPatterns : undefined,
      min: config.min != null && config.min !== '' ? config.min : undefined,
      max: config.max != null && config.max !== '' ? config.max : undefined,
      columns: config.columns != null ? config.columns : undefined,
      gap: config.gap || undefined,
    },
  }),

  // Inputs
  FieldRow: () => ({ props: {} }),

  // Navigation — PageNav renders the real component, so emit real props.
  PageNav: (config) => ({
    props: {
      label: config.label || undefined,
      sections: (config.sections ?? []).map((s) => ({
        id: s.key,
        label: s.label || 'Untitled',
        level: s.level,
      })),
    },
  }),
}

// ── Conversion map: type → possible target types ──────────────────────────────

// ── Inline Controls for types without a dedicated configurator ─────────────────

// FigureControls already includes the Image URL field (with the AI image finder),
// so this just forwards to it.
function FigureEditorControls({ config, setConfig }) {
  return <FigureControls config={config} setConfig={setConfig} />
}

const LIST_VARIANT_OPTIONS = ['unordered', 'ordered', 'icon', 'divider']
const LIST_SIZE_OPTIONS = ['xs', 'sm', 'md', 'lg', 'xl']

function ListEditorControls({ config, setConfig }) {
  const set = (patch) => setConfig((c) => ({ ...c, ...patch }))
  const label = (v) => v.charAt(0).toUpperCase() + v.slice(1)
  return (
    <Stack gap="lg">
      <ChoiceGroup
        label="Variant"
        size="compact"
        hideIndicator
        columns={2}
        value={config.variant}
        onChange={(variant) => set({ variant })}
        options={LIST_VARIANT_OPTIONS.map((opt) => ({ label: label(opt), value: opt }))}
      />
      {config.variant === 'icon' && (
        <IconSelect
          label="Icon"
          value={config.icon}
          onChange={(icon) => set({ icon })}
        />
      )}
      <ChoiceGroup
        label="Size"
        size="compact"
        hideIndicator
        columns={3}
        value={config.size}
        onChange={(size) => set({ size })}
        options={LIST_SIZE_OPTIONS.map((opt) => ({ label: label(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Color"
        size="compact"
        hideIndicator
        columns={2}
        value={config.color}
        onChange={(color) => set({ color })}
        options={[
          { label: 'Default', value: 'default' },
          { label: 'Muted', value: 'muted' },
        ]}
      />
    </Stack>
  )
}

// ChoiceGroup in the editor: edit options via a master-detail picker (click an
// item to select, edit its props below) rather than the accordion list used on
// the standalone detail page.
function ChoiceGroupEditorControls(props) {
  return <ChoiceGroupControls {...props} itemsMode="select" />
}

// FieldRow has no props of its own — it arranges its field children in a row.
function FieldRowEditorControls() {
  return (
    <Paragraph size="sm" color="muted">
      Field Row lays out the field components inside it in equal-width columns. Add
      or remove fields on the canvas to change the row — it has no properties of
      its own.
    </Paragraph>
  )
}

// A Slot is a constrained "blank area" in a pattern: configure the placeholder
// label and which component types and/or patterns instances may drop into it.
// Leaving both lists empty makes the slot accept anything.
const SLOT_COMPONENT_OPTIONS = [
  'Card', 'Button', 'IconButton', 'Link', 'Heading', 'Paragraph', 'Blockquote',
  'Figure', 'Icon', 'MessageBadge', 'DefinitionList', 'Banner', 'List',
  'Stack', 'Grid', 'Section',
]

function SlotEditorControls({ config, setConfig }) {
  const set = (patch) => setConfig((c) => ({ ...c, ...patch }))
  // The accept-lists are pattern-authoring governance — only shown while authoring
  // a pattern, not when a slot is configured on a page.
  const { authoring } = useContext(ConfigLockContext)
  const allow = config.allow ?? []
  const allowPatterns = config.allowPatterns ?? []
  const patterns = getAllPatterns()

  return (
    <Stack gap="lg">
      <TextField
        label="Placeholder label"
        size="compact"
        hint="Shown in the centre of the blank area."
        value={config.label ?? ''}
        onChange={(e) => set({ label: e.target.value })}
      />
      <Stack direction="row" gap="sm">
        <NumberField
          label="Min items"
          size="compact"
          min={0}
          hint="Fewest allowed."
          value={config.min ?? ''}
          onChange={(e) => set({ min: e.target.value === '' ? undefined : Math.max(0, Number(e.target.value)) })}
        />
        <NumberField
          label="Max items"
          size="compact"
          min={0}
          hint="Most allowed."
          value={config.max ?? ''}
          onChange={(e) => set({ max: e.target.value === '' ? undefined : Math.max(0, Number(e.target.value)) })}
        />
      </Stack>
      <Divider space="none" />
      <Paragraph size="xs" color="muted">
        Grid layout — lock a property (in the pattern editor) to fix it for instances, or leave it open.
      </Paragraph>
      <Choice
        label="Columns"
        prop="columns"
        value={config.columns ?? 1}
        onChange={(columns) => set({ columns })}
        options={[1, 2, 3, 4].map((n) => ({ value: n, label: String(n) }))}
      />
      <ConfigSlider
        label="Gap"
        prop="gap"
        values={['xs', 'sm', 'md', 'lg', 'xl']}
        value={config.gap ?? 'md'}
        onChange={(gap) => set({ gap })}
      />
      {authoring && (
        <CheckboxGroup
          label="Allowed components"
          size="compact"
          columns={2}
          hint="Leave empty to accept any component."
          value={allow}
          onChange={(next) => set({ allow: next })}
          options={SLOT_COMPONENT_OPTIONS.map((type) => ({ label: type, value: type }))}
        />
      )}
      {authoring && patterns.length > 0 && (
        <CheckboxGroup
          label="Allowed patterns"
          size="compact"
          hint="Patterns instances may drop into this area."
          value={allowPatterns}
          onChange={(next) => set({ allowPatterns: next })}
          options={patterns.map((p) => ({ label: p.pattern.name, value: p.pattern.id }))}
        />
      )}
    </Stack>
  )
}

function ListItemControls({ config, setConfig }) {
  const set = (patch) => setConfig((c) => ({ ...c, ...patch }))
  return (
    <Stack gap="lg">
      <TextField
        label="Text"
        size="compact"
        value={config.children ?? ''}
        onChange={(e) => set({ children: e.target.value })}
      />
      <IconSelect
        label="Icon"
        value={config.icon ?? ''}
        onChange={(icon) => set({ icon })}
        promptHint={config.children}
      />
    </Stack>
  )
}

const CONTROLS_BY_TYPE = {
  // Layout
  Section: SectionControls,
  Stack: StackControls,
  Grid: GridControls,
  Cluster: ClusterControls,
  Card: CardControls,
  Bleed: BleedControls,
  Inset: InsetControls,
  Spacer: SpacerControls,
  ButtonContainer: ButtonContainerControls,
  // Typography & media
  Heading: HeadingControls,
  Paragraph: ParagraphControls,
  Blockquote: BlockquoteControls,
  Code: CodeControls,
  Divider: DividerControls,
  Icon: IconControls,
  Figure: FigureEditorControls,
  // Actions
  Link: LinkControls,
  Button: ButtonControls,
  IconButton: IconButtonControls,
  Switch: SwitchControls,
  SegmentedControl: SegmentedControlControls,
  // Feedback
  Banner: BannerControls,
  MessageBadge: BadgeControls,
  MessageEmptyState: EmptyStateControls,
  StatusBar: StatusBarControls,
  CircularProgress: CircularProgressControls,
  StepTracker: StepTrackerControls,
  // Inputs
  TextField: TextFieldControls,
  TextareaField: TextareaFieldControls,
  SelectField: SelectFieldControls,
  NumberField: NumberFieldControls,
  DateField: DateFieldControls,
  TimeField: TimeFieldControls,
  PhoneField: PhoneFieldControls,
  ZipField: ZipFieldControls,
  CreditCardField: CreditCardFieldControls,
  Fieldset: FieldsetControls,
  CheckboxGroup: CheckboxGroupControls,
  RadioGroup: RadioGroupControls,
  ChoiceGroup: ChoiceGroupEditorControls,
  // Data
  DefinitionList: DefinitionListControls,
  Pagination: PaginationControls,
  Calendar: CalendarControls,
  // Navigation
  Breadcrumb: BreadcrumbControls,
  TopHeader: TopHeaderControls,
  BottomDrawer: BottomDrawerControls,
  StickyActions: StickyActionsControls,
  // Disclosure
  Accordion: AccordionControls,

  // Actions & controls / data (added editor support)
  Slider: SliderControls,
  Tabs: TabsControls,
  Toolbar: ToolbarControls,
  PageNav: PageNavControls,
  TreeMenu: TreeMenuControls,
  DataTable: DataTableControls,
  FieldRow: FieldRowEditorControls,
  Slot: SlotEditorControls,

  // Inline Controls (no separate configurator file)
  List: ListEditorControls,
  ListItem: ListItemControls,
}

// ── Page metadata form (shown when no node is selected) ───────────────────────

function PatternScopeField({ patternId, projects }) {
  const [projectIds, setProjectIds] = useState(() => getPatternProjects(patternId))
  if (projects.length === 0) {
    return <Paragraph size="sm" color="muted">No projects yet — this pattern is available everywhere.</Paragraph>
  }
  return (
    <CheckboxGroup
      label="Restrict to projects"
      hint="Leave all unchecked to make this pattern available to every project."
      value={projectIds}
      onChange={(next) => { setProjectIds(next); setPatternProjects(patternId, next) }}
      options={projects.map((p) => ({ value: p.id, label: p.name }))}
    />
  )
}

// Detail-page settings: tag a page to a dataset so its bindings resolve to one item
// (chosen by the ?item= URL value), plus pick which item to preview while designing.
function PageDetailField({ projectId, page, onPageMetadataChange }) {
  const ctx = useDataSources()
  const datasets = (ctx?.items ?? []).filter((d) => datasetAvailableToProject(d, projectId))
  if (!datasets.length) return null

  const currentKey = page.detailDataset ?? ''
  const dataset = datasets.find((d) => datasetBindingKey(d.name) === currentKey) ?? null
  const rowLabel = (row, i) => {
    const first = dataset?.columns?.[0]?.key
    const label = first ? row[first] : null
    return label != null && label !== '' ? String(label) : `Row ${i + 1}`
  }

  return (
    <Stack gap="xs">
      <Divider space="xs" />
      <Paragraph size="xs" color="muted">Detail page</Paragraph>
      <SelectField
        label="Shows details for"
        size="compact"
        hint="Bindings on this page resolve to one item, chosen by the ?item= URL value."
        value={currentKey}
        onChange={(e) => onPageMetadataChange({ detailDataset: e.target.value || null, detailPreviewId: null })}
      >
        <option value="">Not a detail page</option>
        {datasets.map((d) => (
          <option key={d.id} value={datasetBindingKey(d.name)}>{d.name}</option>
        ))}
      </SelectField>
      {dataset && (
        <SelectField
          label="Preview item"
          size="compact"
          hint="Which item to show while designing (the live page uses the URL)."
          value={page.detailPreviewId ?? ''}
          onChange={(e) => onPageMetadataChange({ detailPreviewId: e.target.value || null })}
        >
          <option value="">First item</option>
          {dataset.rows.map((row, i) => (
            <option key={row[ROW_ID_KEY] ?? i} value={row[ROW_ID_KEY] ?? ''}>{rowLabel(row, i)}</option>
          ))}
        </SelectField>
      )}
    </Stack>
  )
}

function PageConfigForm({ definition, projectId, pageLevel, availableLevels, onSetPageLevel, onPageMetadataChange, onDuplicatePage, onDeletePage, patternScope }) {
  if (!definition) {
    return (
      <Paragraph size="sm" color="muted">
        No definition loaded.
      </Paragraph>
    )
  }

  const { name = '', description = '', icon = '' } = definition.page
  const levels = availableLevels ?? [1, 2, 3]

  return (
    <Stack gap="md">
      <Heading as="h3" size="xs" color="muted">{patternScope ? 'Pattern' : 'Page'}</Heading>
      <TextField
        label="Title"
        size="compact"
        value={name}
        onChange={(e) => onPageMetadataChange({ name: e.target.value })}
      />
      <IconSelect
        label="Icon"
        size="compact"
        value={icon || 'description'}
        onChange={(value) => onPageMetadataChange({ icon: value })}
      />
      <TextareaField
        label="Description"
        size="compact"
        value={description}
        onChange={(e) => onPageMetadataChange({ description: e.target.value })}
      />
      {patternScope && (
        <PatternScopeField patternId={patternScope.patternId} projects={patternScope.projects} />
      )}
      {!patternScope && (
        <PageDetailField projectId={projectId} page={definition.page} onPageMetadataChange={onPageMetadataChange} />
      )}
      {onSetPageLevel && (
        <SelectField
          label="Level"
          size="compact"
          hint="Level 2 and 3 pages appear in the top navigation menus."
          value={String(pageLevel ?? 1)}
          onChange={(e) => onSetPageLevel(Number(e.target.value))}
        >
          {[1, 2, 3].map((lvl) => (
            <option key={lvl} value={lvl} disabled={!levels.includes(lvl)}>
              Level {lvl}
            </option>
          ))}
        </SelectField>
      )}
      {(onDuplicatePage || onDeletePage) && <Divider space="xs" />}
      {onDuplicatePage && (
        <Button
          variant="secondary"
          size="sm"
          icon="content_copy"
          fullWidth
          onClick={onDuplicatePage}
        >
          Duplicate page
        </Button>
      )}
      {onDeletePage && (
        <Button
          variant="destructive"
          size="sm"
          icon="delete"
          fullWidth
          onClick={onDeletePage}
        >
          Delete page
        </Button>
      )}
    </Stack>
  )
}

// ── Panel component ───────────────────────────────────────────────────────────

export function EditorPropsPanel({
  selectedNodeId,
  definition,
  projectId,
  pages = [],
  pageLevel,
  availableLevels,
  onSetPageLevel,
  onNodePropsChange,
  activeItem,
  onItemSelect,
  onPageMetadataChange,
  onConvertNode,
  onDuplicatePage,
  onDeletePage,
  patternScope = null,
  lockEnforced = false,
  lockAuthoring = false,
  onSetLock,
  onSetNodeRepeat,
  onSetNodeCollections,
  onSetNodeUtilities,
}) {
  // UI-only accordion expand state per node (does not map to node props).
  const [openItemsByNode, setOpenItemsByNode] = useState({})

  const node = selectedNodeId ? findNodeInDefinition(definition, selectedNodeId) : null

  if (!node) {
    return (
      <PageConfigForm
        definition={definition}
        projectId={projectId}
        pageLevel={pageLevel}
        availableLevels={availableLevels}
        onSetPageLevel={onSetPageLevel}
        onPageMetadataChange={onPageMetadataChange}
        onDuplicatePage={onDuplicatePage}
        onDeletePage={onDeletePage}
        patternScope={patternScope}
      />
    )
  }

  const Controls = CONTROLS_BY_TYPE[node.type]
  const componentHref = `/components/${node.type.toLowerCase()}`
  // Pattern instances (and locked pattern parts) can't be converted to another
  // component type — that would break the pattern link.
  const suppressConvert = !!node.patternInstance || (lockEnforced && !!node.lock?.node)
  const conversionTargets = suppressConvert ? [] : (CONVERSION_MAP[node.type] ?? [])

  const ConvertSection = conversionTargets.length > 0 && onConvertNode ? (
    <Stack gap="sm">
      <Divider space="xs" />
      <Paragraph size="xs" color="muted">Convert to</Paragraph>
      <Stack direction="row" gap="xs" wrap>
        {conversionTargets.map((targetType) => (
          <Button
            key={targetType}
            variant="secondary"
            size="sm"
            onClick={() => onConvertNode(node.id, targetType, getConvertedProps(node.type, targetType, node.props))}
          >
            {targetType}
          </Button>
        ))}
      </Stack>
    </Stack>
  ) : null

  const UtilitiesSection = (
    <UtilityControls
      type={node.type}
      utilities={node.utilities}
      onChange={(utilities) => onSetNodeUtilities?.(node.id, utilities)}
    />
  )

  if (!Controls) {
    return (
      <Stack gap="sm">
        <Heading as="h3" size="xs">
          <Link href={componentHref}>{node.type}</Link>
        </Heading>
        <Paragraph size="sm" color="muted">
          No configurator is registered for this component type.
        </Paragraph>
        {UtilitiesSection}
        {ConvertSection}
      </Stack>
    )
  }

  const baseConfig = propsToConfig[node.type](node.props, node.content)
  // Merge locally-held accordion state on top of the node-derived config so
  // expanded option editors stay open across re-renders.
  const config = 'openItems' in baseConfig
    ? { ...baseConfig, openItems: openItemsByNode[node.id] ?? baseConfig.openItems ?? [] }
    : baseConfig

  function setConfig(updater) {
    const next = typeof updater === 'function' ? updater(config) : updater

    // Persist UI-only accordion state locally.
    if ('openItems' in next) {
      setOpenItemsByNode((prev) => ({ ...prev, [node.id]: next.openItems }))
    }

    // If only the accordion state changed, don't write to the node — that would
    // create a spurious history entry just for expanding an option editor.
    const onlyOpenItemsChanged =
      'openItems' in next &&
      JSON.stringify({ ...next, openItems: null }) === JSON.stringify({ ...config, openItems: null })
    if (onlyOpenItemsChanged) return

    const convert = configToNodeUpdate[node.type]
    if (!convert) return
    const { props: newProps, contentFallback } = convert(next)
    onNodePropsChange(node.id, newProps, contentFallback)
  }

  // Pattern-instance governance: when enforcing locks, a fully-locked element's
  // controls are disabled; partially-locked elements show which parts are locked.
  const lock = lockEnforced ? node.lock : undefined
  const fullyLocked = !!lock?.node
  const lockedParts = [...(lock?.props ?? []), ...(lock?.content ? ['text'] : [])]
  const lockNote = lock ? (
    <Stack direction="row" gap="xs" align="center">
      <Icon name="lock" size="sm" color="muted" aria-hidden="true" />
      <Paragraph size="sm" color="muted">
        {fullyLocked
          ? 'Locked by its pattern'
          : `Locked by pattern: ${lockedParts.join(', ')}`}
      </Paragraph>
    </Stack>
  ) : null

  const activeItemIndex = activeItem && activeItem.nodeId === node.id ? activeItem.index : null
  const controls = (
    <Controls
      config={config}
      setConfig={setConfig}
      pages={pages}
      projectId={projectId}
      activeItemIndex={activeItemIndex}
      onSelectItem={(index) => onItemSelect?.(node.id, index)}
    />
  )
  // Provide the lock state so each configurator control outlines itself when the
  // property it edits is locked (red outline + lock badge). A fully-locked element
  // is additionally dimmed + pointer-disabled (accordions still toggle).
  const lockValue = lockAuthoring
    ? {
        lockedProps: new Set(node.lock?.props ?? []),
        fullyLocked: false,
        authoring: true,
        onSetLockedProps: (arr) => onSetLock?.(node.id, { ...(node.lock ?? {}), props: arr }),
      }
    : {
        lockedProps: new Set(lock?.props ?? []),
        fullyLocked: !!lock?.node,
        authoring: false,
        onSetLockedProps: null,
      }
  const lockedControls = (
    <ConfigLockContext.Provider value={lockValue}>
      {(!lockAuthoring && fullyLocked) ? <div className="a1-web-config-locked">{controls}</div> : controls}
    </ConfigLockContext.Provider>
  )

  // "Bind to data" section: reuse the node's current config→node conversion as the
  // base, then override the chosen field with a `{{ key.column }}` token (or clear it).
  const bindBaseUpdate = configToNodeUpdate[node.type]?.(config)
  function handleBind(target, token) {
    if (!bindBaseUpdate) return
    if (target.kind === 'content') {
      onNodePropsChange(node.id, bindBaseUpdate.props, token)
    } else {
      onNodePropsChange(node.id, { ...bindBaseUpdate.props, [target.key]: token }, bindBaseUpdate.contentFallback)
    }
  }
  const BindSection = (!lockAuthoring && !fullyLocked) ? (
    <EditorBindControls
      baseUpdate={bindBaseUpdate}
      projectId={projectId}
      contentLocked={!!lock?.content}
      lockedProps={new Set(lock?.props ?? [])}
      onBind={handleBind}
      repeat={node.repeat}
      onSetRepeat={onSetNodeRepeat ? (cfg) => onSetNodeRepeat(node.id, cfg) : null}
    />
  ) : null
  const CollectionSection = (!lockAuthoring && !fullyLocked) ? (
    <EditorCollectionControls
      nodeType={node.type}
      collections={node.collections}
      projectId={projectId}
      onSetCollections={onSetNodeCollections ? (c) => onSetNodeCollections(node.id, c) : null}
    />
  ) : null

  return (
    <Stack gap="lg">
      {node.patternInstance ? (
        <Stack direction="row" align="center" justify="between" gap="sm">
          <Heading as="h3" size="xs" color="muted">{node.patternInstance.name}</Heading>
          <IconButton
            as="a"
            href={`/editor?pattern=${node.patternInstance.id}`}
            icon="edit"
            size="sm"
            variant="tertiary"
            aria-label="Edit pattern"
          />
        </Stack>
      ) : (
        <Heading as="h3" size="xs" color="muted">
          <Link href={componentHref}>{node.type}</Link>
        </Heading>
      )}
      {lockAuthoring && (
        <Paragraph size="sm" color="muted">
          Lock the properties that instances can’t change — use the lock icon next to each.
        </Paragraph>
      )}
      {lockNote}
      {(lock || lockAuthoring) ? lockedControls : controls}
      {!lockAuthoring && !fullyLocked && UtilitiesSection}
      {BindSection}
      {CollectionSection}
      {ConvertSection}
    </Stack>
  )
}
