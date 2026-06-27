/**
 * Page renderer — maps a JSON/TypeScript page definition to real A1 React
 * components.
 *
 * Rules enforced here:
 * - Only components in `componentRegistry` may be rendered. An unknown `type`
 *   renders the `UnsupportedComponent` fallback instead of throwing or rendering
 *   an arbitrary HTML element.
 * - Text content is resolved through the A1 `useLabel` localization helper, with
 *   the node's `fallback` used when no localized value is registered.
 * - Actions are NOT executed yet — see the TODO in `RenderNode`.
 */
import { Code, InlineEditable, Heading, HeadingMark, Paragraph, Section, Stack, useLabel } from '@gtivr4/a1-design-system-react';
import type { ReactNode } from 'react';
import { createElement, createContext, useContext, useMemo, Fragment } from 'react';
import { EditorSelectionBoundary } from './EditorSelectionBoundary';
import type { ComponentType as ReactComponentType } from 'react';
import { componentRegistry } from './componentRegistry';
import { resolveSrc as resolveImageSrc } from '../lib/imageLibrary';
import { useImageLibraryVersion } from './ImageLibraryContext';
import { useDataSources } from '../data/DataSourcesContext.jsx';
import { getActiveProjectId } from '../projects/projectStore';
import { datasetAvailableToProject } from '../services/dataSources/types';
import {
  buildDatasetMap, hasBinding, resolveBinding, resolveBindingsToString,
  type DatasetMap, type RowContext,
} from '../data/bindings';
import { normalizeRepeat, pickRepeatIndices } from '../data/repeat';
import { collectionTargetFor, expandCollection } from '../data/collections';
import { findRowIndexById } from '../services/dataSources/rowIds';
import { utilityClassesFor } from './utilityRegistry';
import type {
  A11yDefinition,
  ComponentNode,
  ContentDefinition,
  PageDefinition,
  PageLayoutDefinition,
  PageRegion,
} from './pageTypes';

const CONTAINER_TYPES = new Set([
  'Section', 'Stack', 'Card', 'Grid', 'Cluster', 'PageLayout', 'Accordion',
  'Bleed', 'Inset', 'ButtonContainer', 'List', 'Fieldset', 'StickyActions',
  'FieldRow', 'Slot',
]);

// Components whose editable text is delivered via a named prop instead of as
// children (e.g. Fieldset's <legend>). The renderer assigns the node's resolved
// text — wrapped in InlineEditable in editor mode — to that prop.
const TEXT_PROP_BY_TYPE: Record<string, string> = {
  Fieldset: 'legend',
};


/**
 * Extract a page id from an internal link href of the form `/?page={id}`.
 * Returns null for external/other hrefs so they keep their normal behaviour.
 */
function pageIdFromHref(href: unknown): string | null {
  if (typeof href !== 'string') return null;
  const match = href.match(/[?&]page=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/** Extract the detail-page `item` id from an internal link href, or null. */
function itemIdFromHref(href: unknown): string | null {
  if (typeof href !== 'string') return null;
  const match = href.match(/[?&]item=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

interface EditorModeContextValue {
  enabled: boolean;
  /** Preview-only: navigate to another page by id (with an optional detail `item`). */
  onNavigate: ((pageId: string, opts?: { item?: string | null }) => void) | null;
  /** Ids of nodes marked as locked (pattern editor) — shown with a lock badge. */
  lockedNodeIds: Set<string>;
  /** When true, a node's own `lock` metadata is enforced (page editor): locked
   *  text is read-only here, and the host blocks locked prop/node edits. */
  enforceLocks: boolean;
  /** The pattern-instance root id currently being edited (it or a descendant is selected). */
  activePatternRootId: string | null;
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string | null) => void;
  onContentChange: (nodeId: string, newFallback: string) => void;
  onNodeDelete: (nodeId: string) => void;
  onMoveUp: (nodeId: string) => void;
  onMoveDown: (nodeId: string) => void;
  onUngroup: (nodeId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  onGroupAsStack: (nodeId: string) => void;
  onConvertNode: (nodeId: string, newType: string, newProps: Record<string, unknown>) => void;
  onCopyPattern: (nodeId: string) => void;
  onPastePattern: (nodeId: string) => void;
  onChooseTextLabel: (nodeId: string) => void;
  getNodeProps: (nodeId: string) => Record<string, unknown> | undefined;
  getNodeInfo: (nodeId: string) => { isFirst: boolean; isLast: boolean; hasChildren: boolean };
  onRequestAddChild: (nodeId: string) => void;
  onCatalogDrop: (catalogType: string, targetNodeId: string, position: 'before' | 'into' | 'after') => void;
  onDetachPattern: (nodeId: string) => void;
  onCreatePattern: (nodeId: string) => void;
  /** Edit the text of a child-item field (e.g. a DefinitionList item's label/value). */
  onItemTextChange: (nodeId: string, index: number, field: string, value: string) => void;
  /** The child item being edited (so the canvas can outline it). */
  activeItem: { nodeId: string; index: number } | null;
  /** Select a child item (e.g. clicking a DefinitionList item opens its tab). */
  onItemSelect: (nodeId: string, index: number) => void;
}


/**
 * Provides the active project's datasets (keyed for binding) to every node so a
 * `{{ dataset.column }}` token in a prop or text content resolves at render. Empty
 * by default (no bindings resolve, tokens render literally). See `data/bindings.ts`.
 */
const PageDataContext = createContext<{ datasetMap: DatasetMap; rowContext: RowContext }>({ datasetMap: {}, rowContext: {} });

const EditorModeContext = createContext<EditorModeContextValue>({
  enabled: false,
  onNavigate: null,
  lockedNodeIds: new Set(),
  enforceLocks: false,
  activePatternRootId: null,
  selectedNodeId: null,
  onNodeSelect: () => {},
  onContentChange: () => {},
  onNodeDelete: () => {},
  onMoveUp: () => {},
  onMoveDown: () => {},
  onUngroup: () => {},
  onDuplicateNode: () => {},
  onGroupAsStack: () => {},
  onConvertNode: () => {},
  onCopyPattern: () => {},
  onPastePattern: () => {},
  onChooseTextLabel: () => {},
  getNodeProps: () => undefined,
  getNodeInfo: () => ({ isFirst: false, isLast: false, hasChildren: false }),
  onRequestAddChild: () => {},
  onItemTextChange: () => {},
  activeItem: null,
  onItemSelect: () => {},
  onCatalogDrop: () => {},
  onDetachPattern: () => {},
  onCreatePattern: () => {},
});

/**
 * Look a component up by name. Typed against `string` (not `ComponentType`) so
 * the fallback path is reachable at runtime: a definition loaded from JSON can
 * legitimately contain a type that is not registered.
 */
function resolveComponent(type: string): ReactComponentType<any> | undefined {
  return (componentRegistry as Record<string, ReactComponentType<any>>)[type];
}

/**
 * Resolve a node's text using the existing A1 `useLabel` helper. When a node has
 * a `textKey`, the localized value is used if registered; otherwise the helper
 * returns the `fallback`. `useLabel` requires a string key, so a harmless empty
 * sentinel is passed when a node has no key (its result is then discarded).
 */
function useResolvedContent(content?: ContentDefinition): string | undefined {
  const resolved = useLabel(content?.textKey ?? '', content?.fallback);
  if (!content) return undefined;
  if (!content.textKey) return content.fallback;
  return resolved;
}

/** Map a node's a11y definition onto ARIA props understood by the DOM. */
function a11yProps(a11y?: A11yDefinition): Record<string, string> {
  if (!a11y) return {};
  const props: Record<string, string> = {};
  if (a11y.label) props['aria-label'] = a11y.label;
  if (a11y.labelledBy) props['aria-labelledby'] = a11y.labelledBy;
  if (a11y.describedBy) props['aria-describedby'] = a11y.describedBy;
  if (a11y.role) props.role = a11y.role;
  return props;
}

function mergeClassNames(...classes: Array<unknown>): string | undefined {
  const value = classes.filter((cls) => typeof cls === 'string' && cls.trim()).join(' ');
  return value || undefined;
}

/**
 * Safe fallback for an unregistered component type. Built entirely from A1
 * components and tokens (no custom CSS, no hardcoded values) and announced via
 * `role="alert"` so it is visible and identifies the offending type.
 */
function UnsupportedComponent({ type }: { type: string }) {
  return (
    <Section
      surface="panel"
      padding="sm"
      borderSize="sm"
      borderVariant="strong"
      radius="md"
      gap="xs"
      role="alert"
    >
      <Heading as="p" size="xs">
        Unsupported component
      </Heading>
      <Paragraph size="sm" color="muted">
        "{type}" is not a registered A1 component, so it was not rendered. Add it
        to the component registry to enable it.
      </Paragraph>
    </Section>
  );
}

const UNDERLINE_STYLES = ['swoop', 'wave', 'sketch'];

// Decode HTML entities (e.g. "&amp;" → "&") for plain-text display. Heading
// content authored via the configurator is stored as HTML, so it may be encoded.
function decodeEntities(str: string): string {
  if (!str.includes('&') || typeof window === 'undefined') return str;
  return new DOMParser().parseFromString(str, 'text/html').body.textContent ?? str;
}

// Render Heading content that contains heading-mark spans into real React nodes
// (text + <HeadingMark>) so marks display as marks instead of literal markup.
function renderHeadingRich(html: string): ReactNode {
  if (typeof window === 'undefined') return html;
  const root = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html').body.firstChild as HTMLElement;
  const out: ReactNode[] = [];
  root.childNodes.forEach((node, i) => {
    if (node.nodeType === 1 && (node as HTMLElement).classList.contains('a1-heading-mark')) {
      const el = node as HTMLElement;
      const underline = el.classList.contains('a1-heading-mark--underline');
      const underlineStyle = underline
        ? (UNDERLINE_STYLES.find((s) => el.classList.contains(`a1-heading-mark--underline-${s}`)) ?? 'swoop')
        : undefined;
      out.push(
        <HeadingMark key={i} variant={underline ? 'underline' : 'highlight'} underlineStyle={underlineStyle}>
          {el.textContent}
        </HeadingMark>,
      );
    } else {
      out.push(node.textContent);
    }
  });
  return out;
}

function escapeHtmlBasic(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Map a parsed inline-markdown tree to React nodes, recursing so nested markup
// (e.g. **bold *italic***) renders correctly.
function inlineNodesToReact(parent: HTMLElement): ReactNode[] {
  const out: ReactNode[] = [];
  parent.childNodes.forEach((node, i) => {
    if (node.nodeType === 3) {
      out.push(node.textContent);
      return;
    }
    if (node.nodeType !== 1) return;
    const el = node as HTMLElement;
    const kids = inlineNodesToReact(el);
    switch (el.tagName.toLowerCase()) {
      case 'strong': out.push(<strong key={i}>{kids}</strong>); break;
      case 'em':     out.push(<em key={i}>{kids}</em>); break;
      case 's':      out.push(<s key={i}>{kids}</s>); break;
      case 'mark':   out.push(<mark key={i}>{kids}</mark>); break;
      case 'code':   out.push(<Code key={i} variant="inline">{el.textContent}</Code>); break;
      default:       out.push(el.textContent);
    }
  });
  return out;
}

// Render inline markdown — **bold**, *italic*, ~~strike~~, ==mark==, `code` —
// into the matching A1 inline elements. Returns null when the text contains no
// markdown so callers can fall back to plain text / inline editing. Markers must
// hug non-space characters, which keeps stray asterisks (e.g. "5 * 3") literal.
function inlineMarkdownToNodes(text: string): ReactNode[] | null {
  if (typeof window === 'undefined') return null;
  const escaped = escapeHtmlBasic(text);
  const html = escaped
    .replace(/\*\*(\S(?:.*?\S)?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(\S(?:.*?\S)?)\*/g, '<em>$1</em>')
    .replace(/~~(\S(?:.*?\S)?)~~/g, '<s>$1</s>')
    .replace(/==(\S(?:.*?\S)?)==/g, '<mark>$1</mark>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
  if (html === escaped) return null;
  const root = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html').body.firstChild as HTMLElement;
  return inlineNodesToReact(root);
}

/** Render a single component node and its children.
 *
 * `inPattern` is true when the node is inside a pattern *instance* (placed on a
 * page); `patternActive` is true when that instance is the one currently being
 * edited (the pattern root or one of its descendants is selected). A pattern
 * instance shows a highlight outline + pattern icon by default, and only reveals
 * its red lock outlines while it is active.
 */
function RenderNode({ node, inPattern = false, patternActive = false }: { node: ComponentNode; inPattern?: boolean; patternActive?: boolean }) {
  // Hooks must run unconditionally and before any early return.
  const text = useResolvedContent(node.content);
  const labelKey = typeof node.props?.labelKey === 'string' ? node.props.labelKey : '';
  const labelFallback = typeof node.props?.label === 'string' ? node.props.label : undefined;
  const resolvedLabel = useLabel(labelKey, labelFallback ?? '');
  // Re-render when the image library hydrates so Figure refs resolve to real URLs.
  useImageLibraryVersion();
  const editorCtx = useContext(EditorModeContext);
  const { enabled: editorMode, onNavigate, lockedNodeIds, enforceLocks, activePatternRootId, selectedNodeId, onNodeSelect, onContentChange, onNodeDelete, onMoveUp, onMoveDown, onUngroup, onDuplicateNode, onGroupAsStack, onConvertNode, onCopyPattern, onPastePattern, onChooseTextLabel, getNodeProps, getNodeInfo, onRequestAddChild, onItemTextChange, activeItem, onItemSelect, onCatalogDrop, onDetachPattern, onCreatePattern } = editorCtx;
  const { datasetMap, rowContext } = useContext(PageDataContext);
  const contentLocked = enforceLocks && !!node.lock?.content;
  const Component = resolveComponent(node.type);

  // Active-pattern bookkeeping. A pattern instance is "active" when it (or a
  // descendant) is selected; only then do its lock outlines show.
  const isPatternRoot = !!node.patternInstance;
  const nodeInPattern = isPatternRoot || inPattern;
  const thisActive = isPatternRoot ? node.id === activePatternRootId : patternActive;
  const childInPattern = nodeInPattern;
  const childPatternActive = nodeInPattern ? thisActive : false;

  if (!Component) {
    return <UnsupportedComponent type={node.type} />;
  }

  // Data repeat: render the node once per row of the bound dataset, each copy with
  // that row as the active row for the `{{ key.column }}` bindings inside it. In the
  // editor the first copy stays interactive (selecting/editing it targets the single
  // template node); the rest render as read-only projections. In preview every copy
  // is non-interactive. Falls through to a single render when the dataset is missing
  // or empty, so the node stays selectable/configurable.
  const repeatCfg = normalizeRepeat(node.repeat);
  if (repeatCfg && datasetMap[repeatCfg.dataset] && (datasetMap[repeatCfg.dataset].rows?.length ?? 0) > 0) {
    const repeatKey = repeatCfg.dataset;
    const indices = pickRepeatIndices(datasetMap[repeatKey].rows.length, repeatCfg, node.id);
    const stripped: ComponentNode = { ...node, repeat: undefined };
    return indices.map((rowIndex, copyNum) => {
      const childRowContext = { ...rowContext, [repeatKey]: rowIndex };
      const inner = (
        <PageDataContext.Provider value={{ datasetMap, rowContext: childRowContext }}>
          <RenderNode node={stripped} inPattern={inPattern} patternActive={patternActive} />
        </PageDataContext.Provider>
      );
      // First copy interactive in the editor; the rest are read-only projections.
      return (editorMode && copyNum > 0)
        ? <EditorModeContext.Provider key={`${node.id}__r${copyNum}`} value={{ ...editorCtx, enabled: false }}>{inner}</EditorModeContext.Provider>
        : <Fragment key={`${node.id}__r${copyNum}`}>{inner}</Fragment>;
    });
  }

  // TODO(actions): wire `node.actions` (navigate / openDialog / appAction /
  // submitForm / externalLink) to real handlers here. For the PoC the renderer
  // intentionally ignores actions and renders interactive components inert.

  // A Heading whose content carries heading-mark markup is rendered rich (text +
  // <HeadingMark>) so the marks display correctly. A Paragraph whose content
  // contains inline markdown (**bold**, *italic*, ~~strike~~, ==mark==, `code`)
  // is rendered into the matching inline elements. Both are edited via the
  // configurator rather than inline once they carry that markup.
  const isHeading = node.type === 'Heading';
  const headingHasMarks = isHeading && typeof text === 'string' && text.includes('a1-heading-mark');
  const paragraphRich = node.type === 'Paragraph' && typeof text === 'string'
    ? inlineMarkdownToNodes(text)
    : null;

  // Data-bound text ({{ dataset.column }}) resolves to a value from the project's
  // datasets. The raw token lives in node.content; the canvas shows the resolved
  // value (read-only inline — edit the binding in the Configure panel / Data tab).
  const textBound = typeof text === 'string' && hasBinding(text);
  const boundText = textBound ? resolveBindingsToString(text, datasetMap, rowContext) : text;

  // In editor mode, plain text content is wrapped in InlineEditable (seamless) so
  // the user can click any heading, paragraph, or button label to edit it in
  // place. Seamless mode inherits all typography from the surrounding component.
  let textContent: ReactNode;
  if (text === undefined) {
    textContent = undefined;
  } else if (textBound) {
    textContent = isHeading ? decodeEntities(boundText) : boundText;
  } else if (editorMode && !contentLocked) {
    // Always editable in the editor — edit the raw text/markdown source. This must
    // come BEFORE the rich-render branches: content with marks or inline markdown
    // renders to styled <span>s, which (when rendered directly) can't be edited.
    // The rich render still applies in preview/prototype mode (the branches below).
    textContent = (
      <InlineEditable
        seamless
        value={isHeading ? decodeEntities(text) : text}
        multiline={node.type === 'Paragraph'}
        onChange={(v) => onContentChange(node.id, v)}
        aria-label="Edit text"
      />
    );
  } else if (headingHasMarks) {
    textContent = renderHeadingRich(text);
  } else if (paragraphRich) {
    textContent = paragraphRich;
  } else {
    textContent = isHeading ? decodeEntities(text) : text;
  }

  // Build the child list explicitly so that components with no content produce
  // zero children arguments in createElement — avoiding `children: [undefined,
  // undefined]` in props, which propagates through ...rest spreads inside
  // components like Switch and causes void-element errors on <input>/<hr>.
  const textProp = TEXT_PROP_BY_TYPE[node.type];

  const childList: ReactNode[] = [];
  // For text-prop components (e.g. Fieldset) the text is assigned to a prop
  // below, not rendered as a child; everything else renders text as children.
  if (!textProp && textContent !== undefined) childList.push(textContent);
  if (node.children?.length) {
    node.children.forEach((child) => childList.push(
      <RenderNode key={child.id} node={child} inPattern={childInPattern} patternActive={childPatternActive} />,
    ));
  }

  const resolvedProps: Record<string, unknown> = { ...(node.props ?? {}), ...a11yProps(node.a11y) };
  resolvedProps.className = mergeClassNames(resolvedProps.className, utilityClassesFor(node.type, node.utilities));
  delete resolvedProps.labelKey;
  if (labelKey) resolvedProps.label = resolvedLabel;

  // Resolve data bindings in string props: `{{ dataset.column }}` → the cell value
  // (whole-token bindings keep their raw type, e.g. a number prop stays a number).
  for (const k of Object.keys(resolvedProps)) {
    const v = resolvedProps[k];
    if (typeof v === 'string' && hasBinding(v)) resolvedProps[k] = resolveBinding(v, datasetMap, rowContext);
  }

  // Data-driven collections: fill an array prop (items/options) from a dataset.
  if (node.collections) {
    const target = collectionTargetFor(node.type);
    const binding = target ? node.collections[target.prop] : undefined;
    if (target && binding?.dataset && datasetMap[binding.dataset]) {
      resolvedProps[target.prop] = expandCollection(binding, target, datasetMap, rowContext, node.id);
    }
  }

  // Child-item inline editing: components whose data lives in an array prop render
  // their text via InlineEditable in editor mode so each item can be edited on the
  // canvas. (DefinitionList first — its `items` accept ReactNode label/value.)
  if (editorMode && !contentLocked && !node.collections?.items && node.type === 'DefinitionList' && Array.isArray(resolvedProps.items)) {
    const itemText = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));
    const activeIndex = activeItem && activeItem.nodeId === node.id ? activeItem.index : null;
    // Wrap a field so clicking/focusing it selects the item (opens its config tab)
    // and outlines the item that's being edited.
    const itemField = (i: number, child: ReactNode) => (
      <span
        className="a1-web-dl-item"
        data-active={activeIndex === i || undefined}
        onMouseDown={() => onItemSelect(node.id, i)}
        // Don't let the click bubble to the selection boundary — it would toggle
        // the just-selected node back off.
        onClick={(e) => e.stopPropagation()}
        onFocusCapture={() => onItemSelect(node.id, i)}
      >
        {child}
      </span>
    );
    resolvedProps.items = (resolvedProps.items as Array<Record<string, unknown>>).map((item, i) => ({
      ...item,
      label: itemField(i, (
        <InlineEditable
          seamless
          value={itemText(item.label)}
          onChange={(val) => onItemTextChange(node.id, i, 'label', val)}
          aria-label="Edit label"
        />
      )),
      value: itemField(i, (
        <InlineEditable
          seamless
          value={itemText(item.value ?? item.children)}
          onChange={(val) => onItemTextChange(node.id, i, 'value', val)}
          aria-label="Edit value"
        />
      )),
      children: undefined,
    }));
  }

  // Assign editable text to its named prop (legend, etc.). Falls back to an
  // existing string prop value for nodes authored before text moved to content.
  if (textProp) {
    const raw = (text ?? (node.props?.[textProp] as string | undefined) ?? '') as string;
    resolvedProps[textProp] = editorMode && !contentLocked ? (
      <InlineEditable
        seamless
        value={raw}
        onChange={(v) => onContentChange(node.id, v)}
        aria-label="Edit legend"
      />
    ) : raw;
  }

  // A Button or IconButton with an href is a navigation action — render it as an
  // anchor so the link actually works. Both default to `as="button"`, which would
  // drop the href onto a <button> element where it does nothing.
  if ((node.type === 'Button' || node.type === 'IconButton') && resolvedProps.href && !resolvedProps.as) {
    resolvedProps.as = 'a';
  }

  // A Figure referencing a library image (`a1img://<id>`) resolves to the object
  // URL created from the locally-stored blob.
  if (node.type === 'Figure' && typeof resolvedProps.src === 'string') {
    resolvedProps.src = resolveImageSrc(resolvedProps.src);
  }

  // In preview (not editor) mode, wire intra-prototype navigation directly to the
  // component's onClick so it works regardless of whether the element rendered as
  // an <a> or a <button>. This is deterministic — no document-level interception.
  if (!editorMode && onNavigate) {
    const pageId = pageIdFromHref(resolvedProps.href);
    if (pageId) {
      const item = itemIdFromHref(resolvedProps.href);
      resolvedProps.onClick = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        onNavigate(pageId, { item });
      };
    }
  }

  const componentEl = createElement(
    Component,
    resolvedProps,
    ...childList,
  );

  if (!editorMode) return componentEl;

  const isContainer = CONTAINER_TYPES.has(node.type);

  // Clicking a Slot on a page opens the Add panel targeted at the slot (so it
  // offers only the components/patterns the slot accepts) instead of selecting
  // it for configuration. In the pattern editor (where the slot's own rules are
  // authored, `enforceLocks` is false) a click still selects it normally.
  const slotAddMode = node.type === 'Slot' && enforceLocks;
  const handleSelect = slotAddMode
    ? () => onRequestAddChild(node.id)
    : onNodeSelect;

  // In editor mode, wrap the component in EditorSelectionBoundary which:
  // - injects data-editor-node / data-editor-type attrs via cloneElement (no DOM wrapper)
  // - shows a dashed hover outline and solid selected outline via CSS
  // - detects multi-level nesting on click and shows the EditorNodePicker
  // - handles catalog drag-and-drop from the Add panel
  return (
    <EditorSelectionBoundary
      nodeId={node.id}
      nodeType={node.type}
      isSelected={node.id === selectedNodeId}
      isLocked={(lockedNodeIds.has(node.id) || !!node.lock?.node) && (nodeInPattern ? thisActive : true)}
      patternOutline={isPatternRoot && !thisActive}
      patternInstance={node.patternInstance}
      selectedId={selectedNodeId}
      onSelect={handleSelect}
      onDelete={onNodeDelete}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onUngroup={onUngroup}
      onDuplicateNode={onDuplicateNode}
      onGroupAsStack={onGroupAsStack}
      onConvertNode={onConvertNode}
      onCopyPattern={onCopyPattern}
      onPastePattern={onPastePattern}
      onChooseTextLabel={onChooseTextLabel}
      getNodeProps={getNodeProps}
      getNodeInfo={getNodeInfo}
      isContainer={isContainer}
      onCatalogDrop={(catalogType, position) => onCatalogDrop(catalogType, node.id, position)}
      onDetachPattern={onDetachPattern}
      onCreatePattern={onCreatePattern}
    >
      {componentEl}
    </EditorSelectionBoundary>
  );
}

/** Render the ordered nodes of a single region. */
function RenderRegion({ region }: { region: PageRegion }) {
  return (
    <>
      {region.nodes.map((node) => (
        <RenderNode key={node.id} node={node} />
      ))}
    </>
  );
}

/** Render the layout-first top-level container and its regions.
 *
 * The layout component (typically PageLayout) is intentionally NOT rendered
 * as the real component. PageLayout is an app-shell wrapper that imposes
 * min-height: 100vh and its own scroll context, which conflicts with any
 * embedding environment such as the Editor page. Regions are rendered directly
 * so the surrounding page controls scrolling.
 */
function RenderLayout({ layout }: { layout: PageLayoutDefinition }) {
  return (
    <>
      {layout.regions.map((region) => (
        <RenderRegion key={region.id} region={region} />
      ))}
    </>
  );
}

/** Entry point: render a full page definition into A1 React components.
 *
 * Pass `onContentChange` to enable editor mode: every text node becomes
 * live-editable via InlineEditable (seamless). Omit it for read-only rendering.
 */
export function RenderPageDefinition({
  definition,
  itemId,
  onNavigate,
  lockedNodeIds,
  enforceLocks = false,
  activePatternRootId = null,
  selectedNodeId = null,
  onNodeSelect,
  onContentChange,
  onNodeDelete,
  onMoveUp,
  onMoveDown,
  onUngroup,
  onDuplicateNode,
  onGroupAsStack,
  onConvertNode,
  onCopyPattern,
  onPastePattern,
  onChooseTextLabel,
  getNodeProps,
  getNodeInfo,
  onRequestAddChild,
  onItemTextChange,
  activeItem = null,
  onItemSelect,
  onCatalogDrop,
  onDetachPattern,
  onCreatePattern,
}: {
  definition: PageDefinition;
  /** Active detail-page item: the `__id` of the row to bind against (from the URL). */
  itemId?: string | null;
  onNavigate?: (pageId: string, opts?: { item?: string | null }) => void;
  lockedNodeIds?: Set<string>;
  enforceLocks?: boolean;
  activePatternRootId?: string | null;
  selectedNodeId?: string | null;
  onNodeSelect?: (nodeId: string | null) => void;
  onContentChange?: (nodeId: string, newFallback: string) => void;
  onNodeDelete?: (nodeId: string) => void;
  onMoveUp?: (nodeId: string) => void;
  onMoveDown?: (nodeId: string) => void;
  onUngroup?: (nodeId: string) => void;
  onDuplicateNode?: (nodeId: string) => void;
  onGroupAsStack?: (nodeId: string) => void;
  onConvertNode?: (nodeId: string, newType: string, newProps: Record<string, unknown>) => void;
  onCopyPattern?: (nodeId: string) => void;
  onPastePattern?: (nodeId: string) => void;
  onChooseTextLabel?: (nodeId: string) => void;
  getNodeProps?: (nodeId: string) => Record<string, unknown> | undefined;
  getNodeInfo?: (nodeId: string) => { isFirst: boolean; isLast: boolean; hasChildren: boolean };
  onRequestAddChild?: (nodeId: string) => void;
  onCatalogDrop?: (catalogType: string, targetNodeId: string, position: 'before' | 'into' | 'after') => void;
  onDetachPattern?: (nodeId: string) => void;
  onCreatePattern?: (nodeId: string) => void;
  onItemTextChange?: (nodeId: string, index: number, field: string, value: string) => void;
  activeItem?: { nodeId: string; index: number } | null;
  onItemSelect?: (nodeId: string, index: number) => void;
}) {
  // Build the binding map from the datasets visible to this page's project (global +
  // project-scoped), so `{{ dataset.column }}` tokens resolve on the canvas + preview.
  const dataCtx = useDataSources();
  const datasets = dataCtx?.items ?? [];
  const datasetMap = useMemo(() => {
    const projectId = getActiveProjectId();
    return buildDatasetMap(datasets.filter((d) => datasetAvailableToProject(d, projectId)));
  }, [datasets]);

  // Detail page: when the page is tagged to a dataset, resolve its bindings against
  // one item — the row whose `__id` matches the `item` URL value (live) or the page's
  // `detailPreviewId` (in the editor), falling back to the first row.
  const rootRowContext = useMemo<RowContext>(() => {
    const detailDataset = definition.page.detailDataset;
    if (!detailDataset) return {};
    const ds = datasetMap[detailDataset];
    if (!ds) return {};
    const activeItemId = itemId ?? definition.page.detailPreviewId ?? null;
    const idx = activeItemId ? findRowIndexById(ds.rows, activeItemId) : -1;
    return { [detailDataset]: idx >= 0 ? idx : 0 };
  }, [definition.page, datasetMap, itemId]);

  const noInfo = () => ({ isFirst: false, isLast: false, hasChildren: false });
  const ctx: EditorModeContextValue = {
    enabled: !!onContentChange,
    onNavigate: onNavigate ?? null,
    lockedNodeIds: lockedNodeIds ?? new Set(),
    enforceLocks,
    activePatternRootId,
    selectedNodeId,
    onNodeSelect: onNodeSelect ?? (() => {}),
    onContentChange: onContentChange ?? (() => {}),
    onNodeDelete: onNodeDelete ?? (() => {}),
    onMoveUp: onMoveUp ?? (() => {}),
    onMoveDown: onMoveDown ?? (() => {}),
    onUngroup: onUngroup ?? (() => {}),
    onDuplicateNode: onDuplicateNode ?? (() => {}),
    onGroupAsStack: onGroupAsStack ?? (() => {}),
    onConvertNode: onConvertNode ?? (() => {}),
    onCopyPattern: onCopyPattern ?? (() => {}),
    onPastePattern: onPastePattern ?? (() => {}),
    onChooseTextLabel: onChooseTextLabel ?? (() => {}),
    getNodeProps: getNodeProps ?? (() => undefined),
    getNodeInfo: getNodeInfo ?? noInfo,
    onRequestAddChild: onRequestAddChild ?? (() => {}),
    onItemTextChange: onItemTextChange ?? (() => {}),
    activeItem,
    onItemSelect: onItemSelect ?? (() => {}),
    onCatalogDrop: onCatalogDrop ?? (() => {}),
    onDetachPattern: onDetachPattern ?? (() => {}),
    onCreatePattern: onCreatePattern ?? (() => {}),
  };

  return (
    <EditorModeContext.Provider value={ctx}>
      <PageDataContext.Provider value={{ datasetMap, rowContext: rootRowContext }}>
        <RenderLayout layout={definition.page.layout} />
      </PageDataContext.Provider>
    </EditorModeContext.Provider>
  );
}

/** Exported for the editor page to demonstrate the unsupported-type fallback. */
export { RenderNode };
