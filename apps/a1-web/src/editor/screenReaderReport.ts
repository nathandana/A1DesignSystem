import type { ComponentNode, PageDefinition } from './pageTypes';

export type ScreenReaderStatus = 'ok' | 'review' | 'issue';

export interface ScreenReaderReportItem {
  id: string;
  depth: number;
  region: string;
  type: string;
  role: string;
  name: string;
  announcement: string;
  status: ScreenReaderStatus;
  notes: string[];
}

export interface ScreenReaderReport {
  pageName: string;
  itemCount: number;
  headingCount: number;
  interactiveCount: number;
  reviewCount: number;
  issueCount: number;
  items: ScreenReaderReportItem[];
}

const ACTION_TYPES = new Set(['Button', 'IconButton', 'Link']);
const FIELD_TYPES = new Set([
  'TextField',
  'SearchField',
  'TextareaField',
  'SelectField',
  'Autocomplete',
  'NumberField',
  'DateField',
  'TimeField',
  'PhoneField',
  'ZipField',
  'CreditCardField',
  'InlineEditable',
]);
const GROUP_FIELD_TYPES = new Set(['CheckboxGroup', 'RadioGroup', 'ChoiceGroup', 'Fieldset']);
const LAYOUT_TYPES = new Set([
  'PageLayout',
  'Section',
  'Stack',
  'Grid',
  'Cluster',
  'Card',
  'Bleed',
  'Inset',
  'Spacer',
  'ButtonContainer',
  'FieldRow',
  'Slot',
  'Outlet',
]);

function cleanText(value: unknown): string {
  if (value == null) return '';
  return String(value)
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function propString(node: ComponentNode, ...keys: string[]): string {
  const props = node.props ?? {};
  for (const key of keys) {
    const value = props[key];
    if (typeof value === 'string' && value.trim()) return cleanText(value);
  }
  return '';
}

function nodeText(node: ComponentNode): string {
  return cleanText(node.content?.fallback)
    || propString(node, 'label', 'title', 'caption', 'alt', 'placeholder', 'value');
}

function collectIdText(nodes: ComponentNode[], out: Map<string, string>): void {
  for (const node of nodes) {
    const domId = propString(node, 'id');
    if (domId) out.set(domId, nodeText(node) || node.name || node.type);
    if (node.children?.length) collectIdText(node.children, out);
  }
}

function idTextMap(definition: PageDefinition): Map<string, string> {
  const out = new Map<string, string>();
  for (const region of definition.page.layout.regions) collectIdText(region.nodes, out);
  return out;
}

function explicitLabel(node: ComponentNode): { value: string; source: string } | null {
  const a11y = cleanText(node.a11y?.label);
  if (a11y) return { value: a11y, source: 'aria-label' };
  const propLabel = propString(node, 'aria-label', 'ariaLabel');
  if (propLabel) return { value: propLabel, source: 'aria-label' };
  return null;
}

function labelledByName(
  node: ComponentNode,
  refs: Map<string, string>,
): { value: string; missing: string[] } | null {
  const labelledBy = cleanText(node.a11y?.labelledBy)
    || propString(node, 'aria-labelledby', 'ariaLabelledBy', 'ariaLabelledby');
  if (!labelledBy) return null;
  const ids = labelledBy.split(/\s+/).filter(Boolean);
  const values = ids.map((id) => refs.get(id)).filter((value): value is string => !!value);
  const missing = ids.filter((id) => !refs.has(id));
  return { value: values.join(' '), missing };
}

function labelKeyName(node: ComponentNode): { value: string; review: string } | null {
  const key = propString(node, 'labelKey');
  if (!key) return null;
  const fallback = propString(node, 'label');
  return {
    value: fallback || `Label key: ${key}`,
    review: fallback
      ? `Label is localized from ${key}.`
      : `Label uses ${key}; verify the key resolves in every locale.`,
  };
}

function accessibleName(
  node: ComponentNode,
  refs: Map<string, string>,
): { value: string; source: string; missingRefs: string[]; review?: string } {
  const direct = explicitLabel(node);
  if (direct) return { ...direct, missingRefs: [] };

  const byRef = labelledByName(node, refs);
  if (byRef) {
    return {
      value: byRef.value,
      source: 'aria-labelledby',
      missingRefs: byRef.missing,
    };
  }

  const localized = labelKeyName(node);
  if (localized) {
    return {
      value: localized.value,
      source: 'labelKey',
      missingRefs: [],
      review: localized.review,
    };
  }

  const visible = nodeText(node);
  return { value: visible, source: visible ? 'visible text' : '', missingRefs: [] };
}

function actionRole(node: ComponentNode): string {
  if (node.type === 'Link') return 'link';
  return propString(node, 'href') ? 'link' : 'button';
}

function headingLevel(node: ComponentNode): number {
  const as = propString(node, 'as');
  const match = as.match(/^h([1-6])$/);
  return match ? Number(match[1]) : 2;
}

function fieldRole(type: string): string {
  if (type === 'SearchField') return 'search field';
  if (type === 'TextareaField') return 'text area';
  if (type === 'SelectField' || type === 'Autocomplete') return 'combobox';
  if (type === 'InlineEditable') return 'editable text';
  return 'text field';
}

function namedItemLabels(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === 'string') return cleanText(item);
      if (!item || typeof item !== 'object') return '';
      const rec = item as Record<string, unknown>;
      return cleanText(rec.label ?? rec.title ?? rec.name ?? rec.value);
    })
    .filter(Boolean);
}

function setStatus(
  current: ScreenReaderStatus,
  next: ScreenReaderStatus,
): ScreenReaderStatus {
  if (current === 'issue' || next === 'issue') return 'issue';
  if (current === 'review' || next === 'review') return 'review';
  return 'ok';
}

function buildItem(
  node: ComponentNode,
  depth: number,
  region: string,
  refs: Map<string, string>,
): ScreenReaderReportItem {
  const name = accessibleName(node, refs);
  const notes: string[] = [];
  let status: ScreenReaderStatus = 'ok';
  let role = node.a11y?.role ? cleanText(node.a11y.role) : '';
  let announcement = '';

  if (name.review) {
    status = setStatus(status, 'review');
    notes.push(name.review);
  }
  if (name.missingRefs.length) {
    status = setStatus(status, 'issue');
    notes.push(`Missing aria-labelledby target: ${name.missingRefs.join(', ')}.`);
  }

  switch (node.type) {
    case 'Heading': {
      const level = headingLevel(node);
      role = role || `heading level ${level}`;
      announcement = name.value ? `Heading level ${level}, ${name.value}` : `Heading level ${level}, unlabeled`;
      if (!name.value) {
        status = setStatus(status, 'issue');
        notes.push('Heading has no readable text.');
      }
      break;
    }
    case 'Paragraph':
    case 'Blockquote':
    case 'Code':
    case 'Inline':
    case 'ListItem':
      role = role || (node.type === 'ListItem' ? 'list item' : 'text');
      announcement = name.value || 'No readable text';
      if (!name.value) status = setStatus(status, 'review');
      break;
    case 'List':
      role = role || 'list';
      announcement = 'List';
      break;
    case 'Button':
    case 'IconButton':
    case 'Link': {
      role = role || actionRole(node);
      announcement = name.value ? `${role}, ${name.value}` : `${role}, unlabeled`;
      if (!name.value) {
        status = setStatus(status, 'issue');
        notes.push(`${node.type} needs an accessible label.`);
      } else if (node.type === 'IconButton' && name.source !== 'aria-label' && name.source !== 'visible text') {
        notes.push('IconButton label is exposed as its aria-label by the component.');
      }
      if (node.props?.disabled) notes.push('Disabled controls are announced as unavailable.');
      break;
    }
    case 'Icon':
      role = role || 'decorative';
      announcement = 'Not announced';
      notes.push('Icon renders aria-hidden by default.');
      break;
    case 'Figure': {
      role = role || 'image';
      const alt = propString(node, 'alt');
      const caption = propString(node, 'caption');
      if (alt) {
        announcement = `Image, ${alt}`;
      } else if (caption) {
        announcement = `Figure caption, ${caption}`;
        status = setStatus(status, 'review');
        notes.push('Image alt text is empty; only the caption is likely read.');
      } else {
        announcement = 'Image skipped by screen readers';
        status = setStatus(status, 'review');
        notes.push('Empty alt is valid only when the image is decorative.');
      }
      break;
    }
    default:
      if (FIELD_TYPES.has(node.type)) {
        role = role || fieldRole(node.type);
        announcement = name.value ? `${role}, ${name.value}` : `${role}, unlabeled`;
        if (!name.value) {
          status = setStatus(status, 'issue');
          notes.push(`${node.type} needs a visible label or accessible name.`);
        }
        if (node.props?.required) notes.push('Required state is included.');
      } else if (GROUP_FIELD_TYPES.has(node.type)) {
        role = role || 'group';
        announcement = name.value ? `Group, ${name.value}` : 'Group, unlabeled';
        if (!name.value) {
          status = setStatus(status, 'issue');
          notes.push(`${node.type} needs a group label.`);
        }
      } else if (node.type === 'Switch') {
        role = role || 'switch';
        announcement = name.value ? `Switch, ${name.value}` : 'Switch, unlabeled';
        if (!name.value) {
          status = setStatus(status, 'issue');
          notes.push('Switch needs a label.');
        }
      } else if (node.type === 'CircularProgress' || node.type === 'StatusBar') {
        role = role || (node.type === 'CircularProgress' ? 'progressbar' : 'status');
        announcement = name.value ? `${role}, ${name.value}` : `${role}, unlabeled`;
        if (!name.value) {
          status = setStatus(status, 'issue');
          notes.push(`${node.type} needs an accessible label describing what is loading or measured.`);
        }
      } else if (node.type === 'Breadcrumb' || node.type === 'TopHeader' || node.type === 'SideNav' || node.type === 'TreeMenu' || node.type === 'PageNav') {
        const itemLabels = namedItemLabels(node.props?.items);
        role = role || 'navigation';
        announcement = itemLabels.length
          ? `Navigation with ${itemLabels.length} items: ${itemLabels.slice(0, 4).join(', ')}${itemLabels.length > 4 ? ', ...' : ''}`
          : (name.value ? `Navigation, ${name.value}` : 'Navigation');
        if (!name.value && node.type !== 'Breadcrumb') {
          status = setStatus(status, 'review');
          notes.push('Give repeated navigation landmarks distinct accessible labels.');
        }
      } else if (node.type === 'DataTable') {
        role = role || 'table';
        announcement = name.value ? `Table, ${name.value}` : 'Table';
        if (!name.value) {
          status = setStatus(status, 'review');
          notes.push('Add a caption or accessible label when the table needs context.');
        }
      } else if (node.type === 'DefinitionList') {
        role = role || 'definition list';
        const items = namedItemLabels(node.props?.items);
        announcement = items.length ? `Definition list with ${items.length} items` : 'Definition list';
      } else if (node.type === 'Tabs') {
        role = role || 'tab list';
        const items = namedItemLabels(node.props?.items);
        announcement = items.length ? `Tabs with ${items.length} tabs` : 'Tabs';
        if (!name.value) {
          status = setStatus(status, 'review');
          notes.push('Confirm the tab set has a clear accessible label in context.');
        }
      } else if (node.type === 'MessageBadge' || node.type === 'Stat' || node.type === 'Banner' || node.type === 'Notification' || node.type === 'Snackbar' || node.type === 'MessageEmptyState') {
        role = role || 'content';
        announcement = name.value || node.type;
      } else if (node.type === 'Divider' || node.type === 'SectionSeparator' || node.type === 'Spacer') {
        role = role || 'separator';
        announcement = 'Usually not announced';
        notes.push('Decorative separators should stay out of the reading order unless meaningful.');
      } else if (LAYOUT_TYPES.has(node.type)) {
        role = role || (node.a11y?.label || node.a11y?.labelledBy ? 'region' : 'layout');
        announcement = role === 'region' && name.value
          ? `Region, ${name.value}`
          : 'Layout container; children are read in order';
      } else {
        role = role || 'component';
        announcement = name.value || `${node.type}; review rendered semantics`;
        status = setStatus(status, 'review');
      }
  }

  return {
    id: node.id,
    depth,
    region,
    type: node.type,
    role,
    name: name.value,
    announcement,
    status,
    notes,
  };
}

function walkNodes(
  nodes: ComponentNode[],
  depth: number,
  region: string,
  refs: Map<string, string>,
  out: ScreenReaderReportItem[],
): void {
  for (const node of nodes) {
    out.push(buildItem(node, depth, region, refs));
    if (node.children?.length) walkNodes(node.children, depth + 1, region, refs, out);
  }
}

function applyHeadingChecks(items: ScreenReaderReportItem[]): void {
  let lastLevel = 0;
  let h1Count = 0;

  for (const item of items) {
    if (!item.role.startsWith('heading level')) continue;
    const level = Number(item.role.replace('heading level ', ''));
    if (level === 1) h1Count += 1;
    if (!lastLevel && level !== 1) {
      item.status = setStatus(item.status, 'review');
      item.notes.push('First heading is not level 1; confirm the page has a clear h1.');
    } else if (lastLevel && level > lastLevel + 1) {
      item.status = setStatus(item.status, 'review');
      item.notes.push(`Heading level jumps from ${lastLevel} to ${level}.`);
    }
    lastLevel = level;
  }

  if (h1Count > 1) {
    for (const item of items) {
      if (item.role === 'heading level 1') {
        item.status = setStatus(item.status, 'review');
        item.notes.push('Multiple h1 headings found on this page.');
      }
    }
  }
}

export function createScreenReaderReport(definition: PageDefinition): ScreenReaderReport {
  const refs = idTextMap(definition);
  const items: ScreenReaderReportItem[] = [];
  for (const region of definition.page.layout.regions) {
    walkNodes(region.nodes, 1, region.name || region.id, refs, items);
  }
  applyHeadingChecks(items);

  return {
    pageName: definition.page.name || 'Untitled page',
    itemCount: items.length,
    headingCount: items.filter((item) => item.role.startsWith('heading level')).length,
    interactiveCount: items.filter((item) => ACTION_TYPES.has(item.type) || FIELD_TYPES.has(item.type) || GROUP_FIELD_TYPES.has(item.type) || item.type === 'Switch').length,
    reviewCount: items.filter((item) => item.status === 'review').length,
    issueCount: items.filter((item) => item.status === 'issue').length,
    items,
  };
}
