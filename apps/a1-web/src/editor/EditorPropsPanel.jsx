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
import { useState } from 'react'
import { Button, ChoiceGroup, Divider, Heading, Link, Paragraph, Stack, TextField, TextareaField } from '@gtivr4/a1-design-system-react'
import { IconSelect } from '../pages/components/detail/IconSelect.jsx'
import { CONVERSION_MAP, getConvertedProps } from './conversionMap.ts'

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

const propsToConfig = {
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
    align: props?.align ?? 'start',
    captionPosition: props?.captionPosition ?? 'start',
    captionSrOnly: props?.captionSrOnly ?? false,
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
    columns: props?.columns != null ? String(props.columns) : 'auto',
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
}

// ── Config bridges: Controls config → node update ─────────────────────────────

const configToNodeUpdate = {
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
      columns: Number(config.columns),
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
      radius: config.radius || undefined,
      size: config.size || undefined,
      align: config.align !== 'start' ? config.align : undefined,
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
      columns: config.columns === 'auto' ? undefined : Number(config.columns),
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
}

// ── Conversion map: type → possible target types ──────────────────────────────

// ── Inline Controls for types without a dedicated configurator ─────────────────

function FigureEditorControls({ config, setConfig }) {
  const set = (patch) => setConfig((c) => ({ ...c, ...patch }))
  return (
    <Stack gap="lg">
      <TextField
        label="Image URL"
        size="compact"
        value={config.src ?? ''}
        onChange={(e) => set({ src: e.target.value })}
      />
      <FigureControls config={config} setConfig={setConfig} />
    </Stack>
  )
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

  // Inline Controls (no separate configurator file)
  List: ListEditorControls,
  ListItem: ListItemControls,
}

// ── Page metadata form (shown when no node is selected) ───────────────────────

function PageConfigForm({ definition, onPageMetadataChange, onDuplicatePage, onDeletePage }) {
  if (!definition) {
    return (
      <Paragraph size="sm" color="muted">
        No definition loaded.
      </Paragraph>
    )
  }

  const { name = '', description = '' } = definition.page

  return (
    <Stack gap="md">
      <Heading as="h3" size="xs" color="muted">Page</Heading>
      <TextField
        label="Name"
        size="compact"
        value={name}
        onChange={(e) => onPageMetadataChange(e.target.value, description)}
      />
      <TextareaField
        label="Description"
        size="compact"
        value={description}
        onChange={(e) => onPageMetadataChange(name, e.target.value)}
      />
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
  pages = [],
  onNodePropsChange,
  onPageMetadataChange,
  onConvertNode,
  onDuplicatePage,
  onDeletePage,
}) {
  // UI-only accordion expand state per node (does not map to node props).
  const [openItemsByNode, setOpenItemsByNode] = useState({})

  const node = selectedNodeId ? findNodeInDefinition(definition, selectedNodeId) : null

  if (!node) {
    return (
      <PageConfigForm
        definition={definition}
        onPageMetadataChange={onPageMetadataChange}
        onDuplicatePage={onDuplicatePage}
        onDeletePage={onDeletePage}
      />
    )
  }

  const Controls = CONTROLS_BY_TYPE[node.type]
  const componentHref = `/?page=component-${node.type.toLowerCase()}`
  const conversionTargets = CONVERSION_MAP[node.type] ?? []

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

  if (!Controls) {
    return (
      <Stack gap="sm">
        <Heading as="h3" size="xs">
          <Link href={componentHref}>{node.type}</Link>
        </Heading>
        <Paragraph size="sm" color="muted">
          No configurator is registered for this component type.
        </Paragraph>
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

  return (
    <Stack gap="lg">
      <Heading as="h3" size="xs" color="muted">
        <Link href={componentHref}>{node.type}</Link>
      </Heading>
      <Controls config={config} setConfig={setConfig} pages={pages} />
      {ConvertSection}
    </Stack>
  )
}
