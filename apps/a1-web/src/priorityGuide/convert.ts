/**
 * Priority Guide ⇄ PageDefinition conversion.
 *
 * A Priority Guide is a content-first, layout-agnostic brief: an ordered list of
 * content elements (headings, actions, lists, groups) plus alignment metadata
 * (problem, audience, goals, annotations). A PageDefinition is the a1-web
 * page-builder's JSON — a tree of real A1 component nodes rendered by
 * editor/pageRenderer.tsx.
 *
 * `guideToPageDefinition` produces a real page of A1 components in priority order,
 * so the "wireframe" is just that page viewed under the Wireframe theme — no
 * special low-fidelity renderer. `pageDefinitionToGuide` walks a page back into a
 * guide. To make the round-trip lossless (annotations, goals, priority metadata
 * have no home in the visual page), the original guide JSON is stashed in
 * page.meta.__priorityGuide on convert-to-page and read back when present.
 */
import type {
  PriorityGuide,
  GuideItem,
  GuideLeafItem,
  GuideGroupItem,
} from './priorityGuideStore';
import { isGuideGroup } from './priorityGuideStore';

// Local structural types (kept loose to avoid a hard dep on editor/pageTypes).
interface ComponentNode {
  id: string;
  type: string;
  name?: string;
  props?: Record<string, unknown>;
  content?: { fallback: string };
  a11y?: { label?: string };
  children?: ComponentNode[];
}
interface PageDefinition {
  schemaVersion: string;
  page: {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    meta?: Record<string, string>;
    layout: {
      type: string;
      props?: Record<string, unknown>;
      regions: { id: string; name?: string; nodes: ComponentNode[] }[];
    };
  };
}

const SCHEMA_VERSION = '0.1.0';
/** page.meta key holding the source guide JSON for a lossless round-trip. */
export const GUIDE_META_KEY = '__priorityGuide';

// ── id generation (stable within a single conversion, no global counter) ──────

function makeIdFactory(prefix: string) {
  let n = 0;
  return () => `${prefix}-${(n += 1)}`;
}

// ── componentType heuristics (mirrors the example priority-guide app) ─────────

function norm(s: string | undefined): string {
  return (s || '').trim().toLowerCase();
}

function isHeadingComponent(componentType: string | undefined): boolean {
  const c = norm(componentType);
  return c === 'heading' || c === 'title' || c === 'eyebrow' || c === 'headline';
}

function isActionComponent(componentType: string | undefined): boolean {
  const c = norm(componentType);
  return c === 'button' || c === 'link' || c === 'cta' || c === 'action';
}

function isListComponent(componentType: string | undefined): boolean {
  const c = norm(componentType);
  return c === 'list' || c === 'checklist' || c === 'bullets' || c === 'steps';
}

/** Container componentType → which A1 layout wraps a group's children. */
function groupContainerType(componentType: string | undefined): 'Section' | 'Card' | 'ButtonContainer' {
  const c = norm(componentType);
  if (c === 'card') return 'Card';
  if (c === 'button container' || c === 'buttoncontainer') return 'ButtonContainer';
  return 'Section';
}

/** Split a content string into list items on newlines or semicolons. */
function splitListItems(content: string): string[] {
  return (content || '')
    .split(/\n|;/)
    .map((s) => s.replace(/^\s*[-*•]\s*/, '').trim())
    .filter(Boolean);
}

// ── Guide → PageDefinition ────────────────────────────────────────────────────

/** Render one leaf item as one or more nodes (heading + body, a button, a list…). */
function leafToNodes(item: GuideLeafItem, id: () => string): ComponentNode[] {
  const componentType = item.componentType;
  const title = item.title || '';
  const content = item.content || '';
  const nodes: ComponentNode[] = [];

  if (isActionComponent(componentType)) {
    const isLink = norm(componentType) === 'link';
    nodes.push({
      id: id(),
      type: isLink ? 'Link' : 'Button',
      name: title || 'Action',
      props: isLink ? {} : { variant: 'primary' },
      content: { fallback: title || 'Action' },
    });
    return nodes;
  }

  if (isListComponent(componentType)) {
    if (title) {
      nodes.push({
        id: id(),
        type: 'Heading',
        props: { as: 'h3', size: 'sm' },
        content: { fallback: title },
      });
    }
    const listItems = splitListItems(content);
    nodes.push({
      id: id(),
      type: 'List',
      name: title || 'List',
      props: { as: norm(componentType) === 'steps' ? 'ol' : 'ul' },
      children: (listItems.length ? listItems : [content || 'Item']).map((text) => ({
        id: id(),
        type: 'ListItem',
        content: { fallback: text },
      })),
    });
    return nodes;
  }

  if (isHeadingComponent(componentType)) {
    nodes.push({
      id: id(),
      type: 'Heading',
      name: title || 'Heading',
      props: { as: 'h2', size: 'lg' },
      content: { fallback: title || 'Heading' },
    });
    if (content) {
      nodes.push({ id: id(), type: 'Paragraph', props: { color: 'muted' }, content: { fallback: content } });
    }
    return nodes;
  }

  // Default: a small heading for the title (if any) plus a paragraph for the content.
  if (title) {
    nodes.push({ id: id(), type: 'Heading', props: { as: 'h3', size: 'sm' }, content: { fallback: title } });
  }
  if (content) {
    nodes.push({ id: id(), type: 'Paragraph', content: { fallback: content } });
  }
  if (!nodes.length) {
    nodes.push({ id: id(), type: 'Paragraph', content: { fallback: title || content || '' } });
  }
  return nodes;
}

/** Render a group item as a container wrapping a column Stack of its children. */
function groupToNode(group: GuideGroupItem, id: () => string): ComponentNode {
  const container = groupContainerType(group.componentType);
  const childNodes: ComponentNode[] = [];
  if (group.title) {
    childNodes.push({ id: id(), type: 'Heading', props: { as: 'h2', size: 'md' }, content: { fallback: group.title } });
  }
  for (const child of group.children || []) {
    childNodes.push(...leafToNodes(child, id));
  }
  const stack: ComponentNode = {
    id: id(),
    type: 'Stack',
    props: { direction: 'column', gap: 'md' },
    children: childNodes,
  };
  const props: Record<string, unknown> =
    container === 'Section'
      ? { padding: 'lg', surface: 'panel', gap: 'md' }
      : container === 'ButtonContainer'
        ? {}
        : {};
  return { id: id(), type: container, name: group.title || container, props, children: [stack] };
}

/**
 * Convert a Priority Guide to a PageDefinition. Nodes are emitted in priority
 * order (index 0 = highest). The source guide is stashed in page.meta for a
 * lossless round-trip back to a guide.
 */
export function guideToPageDefinition(
  guide: PriorityGuide,
  opts: { pageId?: string } = {},
): PageDefinition {
  const id = makeIdFactory('pg');
  const nodes: ComponentNode[] = [];

  // A lead heading from the guide title + problem statement gives the page an anchor.
  nodes.push({ id: id(), type: 'Heading', props: { as: 'h1', size: 'xl' }, content: { fallback: guide.title } });
  if (guide.problemStatement) {
    nodes.push({ id: id(), type: 'Paragraph', props: { size: 'lg', color: 'muted' }, content: { fallback: guide.problemStatement } });
  }

  for (const item of guide.items || []) {
    if (isGuideGroup(item)) {
      nodes.push(groupToNode(item as GuideGroupItem, id));
    } else {
      nodes.push(...leafToNodes(item as GuideLeafItem, id));
    }
  }

  const contentSection: ComponentNode = {
    id: id(),
    type: 'Section',
    props: { padding: 'lg', contentWidth: 'md', gap: 'lg' },
    children: nodes,
  };

  return {
    schemaVersion: SCHEMA_VERSION,
    page: {
      id: opts.pageId || guide.pageId || guide.id,
      name: guide.title,
      description: guide.problemStatement || undefined,
      icon: guide.icon,
      meta: { [GUIDE_META_KEY]: JSON.stringify(guide) },
      layout: {
        type: 'PageLayout',
        props: {},
        regions: [{ id: 'main', name: 'Main', nodes: [contentSection] }],
      },
    },
  };
}

// ── PageDefinition → Guide ────────────────────────────────────────────────────

/** Best-effort componentType from an A1 node type (inverse of the heuristics). */
function nodeTypeToComponentType(type: string): string {
  switch (type) {
    case 'Heading': return 'Heading';
    case 'Paragraph': return 'Paragraph';
    case 'Button': return 'Button';
    case 'Link': return 'Link';
    case 'List': return 'List';
    default: return type;
  }
}

function nodeText(node: ComponentNode): string {
  if (node.content?.fallback) return node.content.fallback;
  if (Array.isArray(node.children)) {
    return node.children.map(nodeText).filter(Boolean).join('\n');
  }
  return '';
}

/** Flatten a container node's descendants into leaf guide items. */
function nodesToLeafItems(nodes: ComponentNode[]): GuideLeafItem[] {
  const items: GuideLeafItem[] = [];
  for (const node of nodes) {
    if (node.type === 'Stack' || node.type === 'Cluster' || node.type === 'Grid') {
      items.push(...nodesToLeafItems(node.children || []));
      continue;
    }
    if (node.type === 'List') {
      const listText = (node.children || []).map(nodeText).filter(Boolean).join('\n');
      items.push({ type: 'Content', componentType: 'List', title: node.name || 'List', content: listText });
      continue;
    }
    if (node.type === 'ListItem') continue; // handled by List parent
    const text = nodeText(node);
    items.push({
      type: 'Content',
      componentType: nodeTypeToComponentType(node.type),
      title: node.type === 'Paragraph' ? '' : text,
      content: node.type === 'Paragraph' ? text : '',
    });
  }
  return items;
}

/**
 * Convert a PageDefinition back into a Priority Guide. If the page carries the
 * source guide in page.meta (from a prior guideToPageDefinition), that is returned
 * verbatim (kept in sync with the page's project/page ids). Otherwise a best-effort
 * guide is derived from the page's node tree.
 */
export function pageDefinitionToGuide(
  def: PageDefinition,
  base?: Partial<PriorityGuide>,
): PriorityGuide {
  const meta = def.page?.meta?.[GUIDE_META_KEY];
  if (meta) {
    try {
      const stored = JSON.parse(meta) as PriorityGuide;
      return { ...stored, ...base, id: base?.id ?? stored.id };
    } catch { /* fall through to derive */ }
  }

  // Derive: walk region nodes; containers become groups, leaves become items.
  const regions = def.page?.layout?.regions || [];
  const topNodes = regions.flatMap((r) => r.nodes || []);
  // The convert-to-page wraps everything in one Section; unwrap a single Section.
  const roots =
    topNodes.length === 1 && topNodes[0].type === 'Section'
      ? topNodes[0].children || []
      : topNodes;

  const items: GuideItem[] = [];
  let leadTitle = '';
  let leadProblem = '';
  for (let i = 0; i < roots.length; i += 1) {
    const node = roots[i];
    if (i === 0 && node.type === 'Heading') { leadTitle = nodeText(node); continue; }
    if (i === 1 && node.type === 'Paragraph' && leadTitle) { leadProblem = nodeText(node); continue; }
    if (node.type === 'Section' || node.type === 'Card' || node.type === 'ButtonContainer') {
      const container = node.type === 'Card' ? 'Card' : node.type === 'ButtonContainer' ? 'Button container' : 'Section';
      const children = nodesToLeafItems(node.children || []);
      // A leading heading in the group becomes the group title.
      let title = node.name || '';
      if (children[0]?.componentType === 'Heading' && children[0].title) {
        title = title || children[0].title;
        children.shift();
      }
      items.push({
        kind: 'group',
        componentType: container as GuideGroupItem['componentType'],
        title: title || 'Group',
        content: '',
        children: children.length ? children : [{ title: 'Item', content: '' }],
      });
    } else {
      items.push(...nodesToLeafItems([node]));
    }
  }

  return {
    id: base?.id ?? def.page?.id ?? 'guide',
    title: base?.title ?? def.page?.name ?? leadTitle ?? 'Untitled guide',
    icon: base?.icon ?? def.page?.icon,
    context: base?.context ?? '',
    problemStatement: base?.problemStatement ?? leadProblem ?? def.page?.description ?? '',
    audience: base?.audience ?? '',
    userGoal: base?.userGoal ?? '',
    businessGoal: base?.businessGoal ?? '',
    contextDetails: base?.contextDetails,
    items,
    projectId: base?.projectId ?? null,
    pageId: base?.pageId ?? def.page?.id ?? null,
  };
}
