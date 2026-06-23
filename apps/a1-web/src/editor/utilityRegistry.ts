import type { ComponentType } from './pageTypes';

export type UtilityValue = string | null | undefined;

export interface NodeUtilities {
  padding?: UtilityValue;
  paddingBlock?: UtilityValue;
  paddingInline?: UtilityValue;
  margin?: UtilityValue;
  marginBlock?: UtilityValue;
  marginInline?: UtilityValue;
  gap?: UtilityValue;
  maxWidth?: UtilityValue;
  minWidth?: UtilityValue;
}

export type UtilityKey = keyof NodeUtilities;

export interface UtilityDefinition {
  key: UtilityKey;
  label: string;
  icon: string;
  classPrefix: string;
  values: readonly string[];
  commonValues: readonly string[];
  helper: string;
}

export const SPACING_UTILITY_VALUES = [
  '0', '1', '2', '4', '6', '8', '12', '16', '20', '24', '32', '40', '64', '96', '128',
] as const;

export const GAP_UTILITY_VALUES = ['0', 'xs', 'sm', 'md', 'lg'] as const;
export const MAX_WIDTH_UTILITY_VALUES = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full', 'none'] as const;
export const MIN_WIDTH_UTILITY_VALUES = ['0', '3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'] as const;

const MARGIN_HELPER = 'Prefer managing space between items with gap on the parent layout or a Spacer component. Use margin only when neither is available.';

export const UTILITY_DEFINITIONS: Record<UtilityKey, UtilityDefinition> = {
  padding:       { key: 'padding',       label: 'Padding',        icon: 'padding',      classPrefix: 'a1-p',     values: SPACING_UTILITY_VALUES,    commonValues: ['0', '8', '16', '24', '32'], helper: 'Adds internal space on all four sides inside the component boundary.' },
  paddingBlock:  { key: 'paddingBlock',  label: 'Padding block',  icon: 'height',       classPrefix: 'a1-py',    values: SPACING_UTILITY_VALUES,    commonValues: ['0', '8', '16', '24', '32'], helper: 'Adds internal space above and below (block axis) inside the component.' },
  paddingInline: { key: 'paddingInline', label: 'Padding inline', icon: 'width',        classPrefix: 'a1-px',    values: SPACING_UTILITY_VALUES,    commonValues: ['0', '8', '16', '24', '32'], helper: 'Adds internal space to the left and right (inline axis) inside the component.' },
  margin:        { key: 'margin',        label: 'Margin',         icon: 'border_outer', classPrefix: 'a1-m',     values: SPACING_UTILITY_VALUES,    commonValues: ['0', '8', '16', '24', '32'], helper: MARGIN_HELPER },
  marginBlock:   { key: 'marginBlock',   label: 'Margin block',   icon: 'unfold_more',  classPrefix: 'a1-my',    values: SPACING_UTILITY_VALUES,    commonValues: ['0', '8', '16', '24', '32'], helper: MARGIN_HELPER },
  marginInline:  { key: 'marginInline',  label: 'Margin inline',  icon: 'unfold_less',  classPrefix: 'a1-mx',    values: SPACING_UTILITY_VALUES,    commonValues: ['0', '8', '16', '24', '32'], helper: 'Adds external space to the left and right (inline axis) outside the component.' },
  gap:           { key: 'gap',           label: 'Gap',            icon: 'space_bar',    classPrefix: 'a1-gap',   values: GAP_UTILITY_VALUES,        commonValues: ['0', 'xs', 'sm', 'md'],      helper: 'Sets the spacing between direct children of this layout component.' },
  maxWidth:      { key: 'maxWidth',      label: 'Max width',      icon: 'fit_width',    classPrefix: 'a1-max-w', values: MAX_WIDTH_UTILITY_VALUES,   commonValues: ['sm', 'md', 'lg', 'xl'],     helper: 'Constrains how wide the component can grow. Useful for keeping text readable at large viewports.' },
  minWidth:      { key: 'minWidth',      label: 'Min width',      icon: 'keyboard_tab', classPrefix: 'a1-min-w', values: MIN_WIDTH_UTILITY_VALUES,   commonValues: ['0', 'sm', 'md', 'full'],    helper: 'Sets the smallest width the component will shrink to.' },
};

export const CATALOG_COMPONENT_UTILITY_TYPES: Record<string, string> = {
  'page-layout': 'PageLayout',
  'button-container': 'ButtonContainer',
  'icon-button': 'IconButton',
  'segmented-control': 'SegmentedControl',
  'sticky-actions': 'StickyActions',
  'side-nav': 'SideNav',
  'top-header': 'TopHeader',
  'bottom-drawer': 'BottomDrawer',
  'bottom-sheet': 'BottomSheet',
  'page-nav': 'PageNav',
  'tree-menu': 'TreeMenu',
  'text-field': 'TextField',
  'search-field': 'TextField',
  'number-field': 'NumberField',
  'date-field': 'DateField',
  'time-field': 'TimeField',
  'phone-field': 'PhoneField',
  'zip-field': 'ZipField',
  'credit-card-field': 'CreditCardField',
  textarea: 'TextareaField',
  select: 'SelectField',
  'checkbox-group': 'CheckboxGroup',
  'radio-group': 'RadioGroup',
  'choice-group': 'ChoiceGroup',
  'field-row': 'FieldRow',
  'inline-editable': 'InlineEditable',
  badge: 'MessageBadge',
  'empty-state': 'MessageEmptyState',
  'status-bar': 'StatusBar',
  'circular-progress': 'CircularProgress',
  'step-tracker': 'StepTracker',
  'data-table': 'DataTable',
  'definition-list': 'DefinitionList',
  'context-menu': 'ContextMenu',
};

export function utilityTypeForCatalogComponent(id: string, title: string): string {
  return CATALOG_COMPONENT_UTILITY_TYPES[id] ?? title.replace(/\s+/g, '');
}

const LAYOUT_COMPONENTS = new Set<ComponentType>([
  'Section', 'Stack', 'Grid', 'Cluster', 'Card', 'Bleed', 'Inset', 'ButtonContainer',
  'FieldRow', 'Fieldset', 'StickyActions', 'Accordion', 'List', 'Toolbar', 'Tabs',
]);

const WIDTH_COMPONENTS = new Set<ComponentType>([
  'Button', 'Link', 'Card', 'Figure', 'Heading', 'Paragraph', 'Blockquote', 'Code',
  'List', 'Divider', 'StatusBar', 'CircularProgress', 'DefinitionList', 'DataTable',
  'TextField', 'TextareaField', 'SelectField', 'NumberField', 'DateField', 'TimeField',
  'PhoneField', 'ZipField', 'CreditCardField', 'CheckboxGroup', 'RadioGroup',
  'ChoiceGroup', 'Slider', 'SegmentedControl', 'Switch', 'Banner', 'MessageBadge',
  'MessageEmptyState', 'Pagination', 'Calendar', 'Breadcrumb', 'TopHeader',
  'BottomDrawer', 'PageNav', 'TreeMenu', ...LAYOUT_COMPONENTS,
]);

const NO_MARGIN_COMPONENTS = new Set<ComponentType>(['PageLayout', 'Slot', 'Outlet']);

// Fixed/full-width components where only inline margin is meaningful.
const MARGIN_INLINE_ONLY_COMPONENTS = new Set<ComponentType>(['BottomSheet']);

export function getAcceptedUtilitiesForComponent(type: ComponentType | string): UtilityDefinition[] {
  const componentType = type as ComponentType;
  const utilities: UtilityKey[] = [];

  if (MARGIN_INLINE_ONLY_COMPONENTS.has(componentType)) {
    utilities.push('marginInline');
  } else if (!NO_MARGIN_COMPONENTS.has(componentType)) {
    utilities.push('margin', 'marginBlock', 'marginInline');
  }

  if (LAYOUT_COMPONENTS.has(componentType)) {
    utilities.push('padding', 'paddingBlock', 'paddingInline');
    if (componentType !== 'Section') utilities.push('gap');
  }

  if (WIDTH_COMPONENTS.has(componentType) && componentType !== 'IconButton') {
    utilities.push('maxWidth', 'minWidth');
  }

  return utilities.map((key) => UTILITY_DEFINITIONS[key]);
}

export function componentAcceptsUtility(type: ComponentType | string, utility: UtilityKey): boolean {
  return getAcceptedUtilitiesForComponent(type).some((definition) => definition.key === utility);
}

export function utilityClassesFor(type: ComponentType | string, utilities?: NodeUtilities): string {
  if (!utilities) return '';
  const accepted = new Set(getAcceptedUtilitiesForComponent(type).map((definition) => definition.key));
  return Object.entries(utilities)
    .filter(([key, value]) => accepted.has(key as UtilityKey) && typeof value === 'string' && value !== '')
    .map(([key, value]) => {
      const definition = UTILITY_DEFINITIONS[key as UtilityKey];
      return definition && definition.values.includes(value as never) ? `${definition.classPrefix}-${value}` : '';
    })
    .filter(Boolean)
    .join(' ');
}

export function cleanUtilities(type: ComponentType | string, utilities?: NodeUtilities | null): NodeUtilities | undefined {
  if (!utilities) return undefined;
  const accepted = new Set(getAcceptedUtilitiesForComponent(type).map((definition) => definition.key));
  const next: NodeUtilities = {};
  for (const [key, value] of Object.entries(utilities)) {
    if (!accepted.has(key as UtilityKey) || value == null || value === '') continue;
    const definition = UTILITY_DEFINITIONS[key as UtilityKey];
    if (definition?.values.includes(value as never)) next[key as UtilityKey] = value;
  }
  return Object.keys(next).length ? next : undefined;
}
