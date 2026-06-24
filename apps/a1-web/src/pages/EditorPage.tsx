/**
 * Editor — the first proof of concept for the A1 JSON-driven page editor.
 *
 * Three tabs:
 * - Edit        — rendered page with InlineEditable text and click-to-select
 *                 components. The right rail (PageLayout aside slot) shows the
 *                 selected component's configurator controls. Changes feed back
 *                 into the JSON and are reflected everywhere.
 * - Preview     — read-only render of the current definition (no editing).
 * - Code snippet — raw JSON editable as text; drives both other tabs.
 */
import { createPortal } from 'react-dom';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Code,
  MessageBadge,
  Paragraph,
  Section,
  SelectField,
  Snackbar,
  Stack,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarGroup,
  ToolbarMenu,
  TopHeader,
} from '@gtivr4/a1-design-system-react';
import { RenderPageDefinition } from '../editor/pageRenderer';
import { ResponsivePreviewFrame, VIEWPORT_PRESETS, viewportSize } from './components/detail/ResponsivePreviewFrame.jsx';
import { buildProjectNav, type ProjectNavItem } from '../projects/projectNav';
import type { ProjectPage } from '../projects/projectStore';
import { EditorAsidePanel } from '../editor/EditorAsidePanel.jsx';
import { propsToConfig, configToNodeUpdate } from '../editor/EditorPropsPanel.jsx';
import { EditorShortcutsDialog } from '../editor/EditorShortcutsDialog.jsx';
import { useEditorHistory } from '../editor/useEditorHistory';
import { useOpenCreateTicket } from '../backlog/BacklogContext';
import { isMac } from '../editor/shortcuts.ts';
import { editorExamplePage } from '../editor/examples/editorExamplePage';
import { SHOWCASE_VERSIONS } from '../editor/examples/editorExampleVersions';
import { type EditorVersion, versionUid } from '../editor/editorVersions';
import { EDITOR_PREVIEW_SESSION_KEY, EDITOR_PREVIEW_PAGES_MAP_KEY, EDITOR_PREVIEW_CURRENT_KEY } from './EditorPreviewPage';
import { readStored, writeStored } from '../editor/storage';
import type { CatalogEntry } from '../editor/componentCatalog';
import { COMPONENT_CATALOG, createNodeFromEntry } from '../editor/componentCatalog';
import { definitionToJsx } from '../editor/definitionToJsx';
import { instantiatePattern } from '../patterns/instantiatePattern.js';
import { getAllPatterns, loadPattern, newPatternId, patternAvailableToProject, registerPattern, savePattern } from '../patterns/patternStore.js';
import { loadProjectLayout, saveProjectLayout, resolvePageJson } from '../projects/projectStore';
import { onRemoteHydrate } from '../projects/cloudSync.js';
import { appendHistory, fetchHistory, updateHistoryLabel } from '../services/historyDb';
import { PagePresence } from '../editor/PagePresence.jsx';
import { toImageRef } from '../lib/imageLibrary';
import { combinePageIntoLayout, splitLayoutAtOutlet } from '../projects/projectLayout';
import { reconcilePageInstances } from '../patterns/patternSync.js';
import { cleanUtilities } from '../editor/utilityRegistry';
import type { ComponentNode, ComponentProps, ComponentType, PageDefinition } from '../editor/pageTypes';
import type { PatternNode } from '../patterns/patternTypes';

// ── Copy pattern (style props) ────────────────────────────────────────────────

const PATTERN_KEY = 'a1-editor-pattern-clipboard';

// Props that are content / identity / data / state rather than visual style —
// excluded when copying a "pattern" so only the look-and-feel travels.
const NON_PATTERN_PROPS = new Set<string>([
  'id', 'children', 'content',
  'src', 'alt', 'caption', 'href', 'label', 'text',
  'items', 'options', 'sections',
  'icon', 'heroIcon', 'placeholder', 'hint',
  'count', 'max', 'min', 'steps', 'currentStep', 'totalPages', 'value', 'defaultValue',
  'prefix', 'unit', 'mask', 'name',
  'checked', 'open', 'defaultOpen', 'active', 'indeterminate',
  'disabled', 'readOnly', 'required', 'loading',
]);

/** The set of prop names a component type accepts, derived from its configurator
 *  bridges. Returns null when the type has no configurator (not pasteable). */
function patternTargetKeys(type: string, props: ComponentProps | undefined): Set<string> | null {
  const toConfig = (propsToConfig as Record<string, (p: unknown) => unknown>)[type];
  const toNode = (configToNodeUpdate as Record<string, (c: unknown) => { props?: Record<string, unknown> }>)[type];
  if (!toConfig || !toNode) return null;
  try {
    const out = toNode(toConfig(props ?? {}));
    return new Set(Object.keys(out?.props ?? {}));
  } catch {
    return null;
  }
}

// Per type: `keys` is the full style-prop surface for that component; `props`
// holds only the non-default values. A key in `keys` but not in `props` is at its
// default, and on paste is cleared from the target so it falls back to default.
type PatternStyle = { keys: string[]; props: Record<string, unknown> };
type PatternStyles = Record<string, PatternStyle>;

/** Resolve a node's effective style via the configurator bridges, so defaults
 *  (e.g. a Badge's implicit `subtle: false`) are captured even when absent from
 *  the raw JSON. Returns null for types without a configurator. */
function nodeStyleEntry(node: ComponentNode): PatternStyle | null {
  const toConfig = (propsToConfig as Record<string, (p: unknown) => unknown>)[node.type];
  const toNode = (configToNodeUpdate as Record<string, (c: unknown) => { props?: Record<string, unknown> }>)[node.type];
  if (!toConfig || !toNode) return null;
  let normalized: Record<string, unknown>;
  try {
    normalized = toNode(toConfig(node.props ?? {}))?.props ?? {};
  } catch {
    return null;
  }
  const keys: string[] = [];
  const props: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(normalized)) {
    if (NON_PATTERN_PROPS.has(k)) continue; // skip content/identity/data/state
    keys.push(k);
    if (v !== undefined) props[k] = v; // present + defined → a non-default value
  }
  return keys.length ? { keys, props } : null;
}

/** Build a `type → style` map from a node and all its descendants. First
 *  occurrence of a type/key wins (the topmost element defines its style). */
function collectPatternStyles(node: ComponentNode): PatternStyles {
  const styles: PatternStyles = {};
  const visit = (n: ComponentNode) => {
    const entry = nodeStyleEntry(n);
    if (entry) {
      const existing = styles[n.type];
      if (!existing) {
        styles[n.type] = { keys: [...entry.keys], props: { ...entry.props } };
      } else {
        for (const k of entry.keys) if (!existing.keys.includes(k)) existing.keys.push(k);
        for (const [k, v] of Object.entries(entry.props)) if (!(k in existing.props)) existing.props[k] = v;
      }
    }
    n.children?.forEach(visit);
  };
  visit(node);
  return styles;
}

/** Apply a `type → style` map across a node and its descendants: every element
 *  whose type is in the map is restyled to the source's effective look — setting
 *  its non-default values and clearing the keys the source left at default.
 *  Returns the new node and how many elements changed. */
function applyPatternToSubtree(node: ComponentNode, styles: PatternStyles): { node: ComponentNode; count: number } {
  let count = 0;
  let props = node.props;
  const entry = styles[node.type];
  if (entry) {
    const validKeys = patternTargetKeys(node.type, node.props);
    if (validKeys) {
      const next: Record<string, unknown> = { ...(node.props ?? {}) };
      let changed = false;
      for (const k of entry.keys) {
        if (!validKeys.has(k)) continue;
        if (k in entry.props) {
          if (next[k] !== entry.props[k]) { next[k] = entry.props[k]; changed = true; }
        } else if (k in next) {
          delete next[k]; changed = true; // source had this at default → reset target
        }
      }
      if (changed) { props = next as ComponentProps; count += 1; }
    }
  }
  let children = node.children;
  if (children?.length) {
    children = children.map((c) => {
      const r = applyPatternToSubtree(c, styles);
      count += r.count;
      return r.node;
    });
  }
  return { node: { ...node, props, ...(children ? { children } : {}) }, count };
}

/** Replace the node with `id` (anywhere in the tree) with `newNode`. */
function replaceNodeInList(nodes: ComponentNode[], id: string, newNode: ComponentNode): ComponentNode[] {
  return nodes.map((n) => {
    if (n.id === id) return newNode;
    if (n.children?.length) return { ...n, children: replaceNodeInList(n.children, id, newNode) };
    return n;
  });
}

type ParseResult =
  | { ok: true; value: PageDefinition }
  | { ok: false; error: string };

// ── Immutable tree patchers ───────────────────────────────────────────────────

function updateNodeFallback(node: ComponentNode, id: string, fallback: string): ComponentNode {
  if (node.id === id) return { ...node, content: { ...node.content!, fallback } };
  if (!node.children) return node;
  return { ...node, children: node.children.map((c) => updateNodeFallback(c, id, fallback)) };
}

function updateNodeProps(node: ComponentNode, id: string, props: ComponentProps): ComponentNode {
  if (node.id === id) return { ...node, props };
  if (!node.children) return node;
  return { ...node, children: node.children.map((c) => updateNodeProps(c, id, props)) };
}

function patchRegions(
  def: PageDefinition,
  patcher: (node: ComponentNode) => ComponentNode,
): PageDefinition {
  return {
    ...def,
    page: {
      ...def.page,
      layout: {
        ...def.page.layout,
        regions: def.page.layout.regions.map((region) => ({
          ...region,
          nodes: region.nodes.map(patcher),
        })),
      },
    },
  };
}

function patchDefinitionContent(def: PageDefinition, nodeId: string, fallback: string) {
  return patchRegions(def, (node) => updateNodeFallback(node, nodeId, fallback));
}

function patchDefinitionProps(def: PageDefinition, nodeId: string, props: ComponentProps) {
  return patchRegions(def, (node) => updateNodeProps(node, nodeId, props));
}

function convertNodeType(node: ComponentNode, id: string, newType: ComponentType, newProps: ComponentProps): ComponentNode {
  if (node.id === id) {
    const next = { ...node, type: newType, props: newProps };
    const utilities = cleanUtilities(newType, node.utilities);
    if (utilities) next.utilities = utilities;
    else delete next.utilities;
    return next;
  }
  if (!node.children) return node;
  return { ...node, children: node.children.map((c) => convertNodeType(c, id, newType, newProps)) };
}

function convertDefinitionNode(def: PageDefinition, nodeId: string, newType: ComponentType, newProps: ComponentProps): PageDefinition {
  return patchRegions(def, (node) => convertNodeType(node, nodeId, newType, newProps));
}

// Detach a pattern instance into loose nodes (used by "Detach pattern"). Strips
// the outer pattern's instance metadata + locks, but **stops at nested pattern
// instances** (any descendant with `patternInstance`) — those stay intact so
// detaching the outer pattern doesn't detach the patterns nested inside it.
function detachPatternMeta(node: ComponentNode, isRoot: boolean): ComponentNode {
  if (!isRoot && node.patternInstance) return node; // nested instance — keep linked
  const { patternInstance: _pi, patternNodeId: _pn, lock: _lk, ...rest } = node;
  return { ...rest, children: node.children?.map((child) => detachPatternMeta(child, false)) };
}

// Extract a subtree as a pattern source (for "Create pattern from selection").
// Unlike `stripPatternMeta`, a **nested pattern instance** (any descendant with
// `patternInstance`) is preserved as a `PatternRef` so it stays linked to its
// source pattern instead of being flattened into loose nodes — patterns can
// nest inside patterns. The selection root itself is always extracted as a
// normal node (its own structure becomes the new pattern).
function extractPatternSource(node: ComponentNode, isRoot: boolean): PatternNode {
  if (!isRoot && node.patternInstance) {
    return {
      id: freshId(),
      type: 'PatternRef',
      patternId: node.patternInstance.id,
      ...(node.lock ? { lock: node.lock } : {}),
    };
  }
  const { patternInstance: _pi, patternNodeId: _pn, lock: _lk, ...rest } = node;
  return {
    ...rest,
    id: freshId(),
    children: node.children?.map((child) => extractPatternSource(child, false)),
  } as PatternNode;
}

function setNodeLockInNode(node: ComponentNode, id: string, lock: ComponentNode['lock']): ComponentNode {
  if (node.id === id) {
    const next = { ...node };
    if (lock && (lock.node || lock.content || (lock.props && lock.props.length))) next.lock = lock;
    else delete next.lock;
    return next;
  }
  if (!node.children) return node;
  return { ...node, children: node.children.map((c) => setNodeLockInNode(c, id, lock)) };
}

function setNodeRepeatInNode(node: ComponentNode, id: string, repeat: ComponentNode['repeat'] | null): ComponentNode {
  if (node.id === id) {
    const next = { ...node };
    if (repeat) next.repeat = repeat;
    else delete next.repeat;
    return next;
  }
  if (!node.children) return node;
  return { ...node, children: node.children.map((c) => setNodeRepeatInNode(c, id, repeat)) };
}

function setNodeCollectionsInNode(node: ComponentNode, id: string, collections: ComponentNode['collections'] | null): ComponentNode {
  if (node.id === id) {
    const next = { ...node };
    if (collections && Object.keys(collections).length) next.collections = collections;
    else delete next.collections;
    return next;
  }
  if (!node.children) return node;
  return { ...node, children: node.children.map((c) => setNodeCollectionsInNode(c, id, collections)) };
}

function setNodeUtilitiesInNode(node: ComponentNode, id: string, utilities: ComponentNode['utilities'] | null): ComponentNode {
  if (node.id === id) {
    const next = { ...node };
    const cleaned = cleanUtilities(node.type, utilities);
    if (cleaned) next.utilities = cleaned;
    else delete next.utilities;
    return next;
  }
  if (!node.children) return node;
  return { ...node, children: node.children.map((c) => setNodeUtilitiesInNode(c, id, utilities)) };
}

function freshId(): string {
  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function duplicateNode(node: ComponentNode): ComponentNode {
  return {
    ...node,
    id: freshId(),
    children: node.children?.map(duplicateNode),
  };
}

function insertAfterInNodes(nodes: ComponentNode[], targetId: string, newNode: ComponentNode): ComponentNode[] | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === targetId) {
      const result = [...nodes];
      result.splice(i + 1, 0, newNode);
      return result;
    }
    if (nodes[i].children?.length) {
      const newChildren = insertAfterInNodes(nodes[i].children!, targetId, newNode);
      if (newChildren) {
        return [...nodes.slice(0, i), { ...nodes[i], children: newChildren }, ...nodes.slice(i + 1)];
      }
    }
  }
  return null;
}

function duplicateDefinitionNode(def: PageDefinition, nodeId: string): PageDefinition {
  const original = (() => {
    for (const region of def.page.layout.regions) {
      const found = findNodeById(region.nodes, nodeId);
      if (found) return found;
    }
    return null;
  })();
  if (!original) return def;
  const copy = duplicateNode(original);
  return {
    ...def,
    page: {
      ...def.page,
      layout: {
        ...def.page.layout,
        regions: def.page.layout.regions.map((region) => {
          const updated = insertAfterInNodes(region.nodes, nodeId, copy);
          return updated ? { ...region, nodes: updated } : region;
        }),
      },
    },
  };
}

function wrapInStackList(nodes: ComponentNode[], id: string): ComponentNode[] {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      const wrapper: ComponentNode = {
        id: freshId(),
        type: 'Stack' as ComponentType,
        props: { direction: 'column', gap: 'md' },
        children: [nodes[i]],
      };
      return [...nodes.slice(0, i), wrapper, ...nodes.slice(i + 1)];
    }
    if (nodes[i].children?.length) {
      const newChildren = wrapInStackList(nodes[i].children!, id);
      if (newChildren !== nodes[i].children) {
        return [...nodes.slice(0, i), { ...nodes[i], children: newChildren }, ...nodes.slice(i + 1)];
      }
    }
  }
  return nodes;
}

function wrapDefinitionNodeInStack(def: PageDefinition, nodeId: string): PageDefinition {
  return {
    ...def,
    page: {
      ...def.page,
      layout: {
        ...def.page.layout,
        regions: def.page.layout.regions.map((region) => {
          const updated = wrapInStackList(region.nodes, nodeId);
          return updated !== region.nodes ? { ...region, nodes: updated } : region;
        }),
      },
    },
  };
}

function removeNodeFromList(nodes: ComponentNode[], id: string): ComponentNode[] {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) => ({ ...n, children: n.children ? removeNodeFromList(n.children, id) : undefined }));
}

// The node whose `children` contains `childId`, or null at a region root.
function findParentInList(nodes: ComponentNode[], childId: string): ComponentNode | null {
  for (const n of nodes) {
    if (n.children?.some((c) => c.id === childId)) return n;
    if (n.children) { const found = findParentInList(n.children, childId); if (found) return found; }
  }
  return null;
}

function deleteDefinitionNode(def: PageDefinition, nodeId: string): PageDefinition {
  return {
    ...def,
    page: {
      ...def.page,
      layout: {
        ...def.page.layout,
        regions: def.page.layout.regions.map((region) => ({
          ...region,
          nodes: removeNodeFromList(region.nodes, nodeId),
        })),
      },
    },
  };
}

// Find the pattern-instance root id whose subtree contains `selectedId` (so its
// lock outlines show while it's being edited). Returns null if the selection
// isn't inside a pattern instance.
function findActivePatternRoot(nodes: ComponentNode[], selectedId: string, inheritedRoot: string | null = null): string | null | undefined {
  for (const node of nodes) {
    const rootHere = node.patternInstance ? node.id : inheritedRoot;
    if (node.id === selectedId) return rootHere;
    if (node.children) {
      const found = findActivePatternRoot(node.children, selectedId, rootHere);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

function findNodeById(nodes: ComponentNode[], id: string): ComponentNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) { const found = findNodeById(n.children, id); if (found) return found; }
  }
  return null;
}

// Swap node at idx with the sibling in `direction`; recurse into children if not found at this level.
function moveNodeInListDirection(nodes: ComponentNode[], id: string, direction: 'up' | 'down'): ComponentNode[] {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      const target = direction === 'up' ? i - 1 : i + 1;
      if (target < 0 || target >= nodes.length) return nodes;
      const result = [...nodes];
      [result[i], result[target]] = [result[target], result[i]];
      return result;
    }
    if (nodes[i].children?.length) {
      const newChildren = moveNodeInListDirection(nodes[i].children!, id, direction);
      if (newChildren !== nodes[i].children) {
        return [...nodes.slice(0, i), { ...nodes[i], children: newChildren }, ...nodes.slice(i + 1)];
      }
    }
  }
  return nodes;
}

// Replace a node with its own children, promoting them into the parent list.
function ungroupNodeFromList(nodes: ComponentNode[], id: string): ComponentNode[] {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      if (!nodes[i].children?.length) return nodes;
      return [...nodes.slice(0, i), ...nodes[i].children!, ...nodes.slice(i + 1)];
    }
    if (nodes[i].children?.length) {
      const newChildren = ungroupNodeFromList(nodes[i].children!, id);
      if (newChildren !== nodes[i].children) {
        return [...nodes.slice(0, i), { ...nodes[i], children: newChildren }, ...nodes.slice(i + 1)];
      }
    }
  }
  return nodes;
}

// Return sibling position + hasChildren for a node (drives context menu disabled state).
function getNodeSiblingInfo(
  nodes: ComponentNode[],
  targetId: string,
): { isFirst: boolean; isLast: boolean; hasChildren: boolean } | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === targetId) {
      return { isFirst: i === 0, isLast: i === nodes.length - 1, hasChildren: !!(nodes[i].children?.length) };
    }
    if (nodes[i].children?.length) {
      const found = getNodeSiblingInfo(nodes[i].children!, targetId);
      if (found) return found;
    }
  }
  return null;
}

function extractFromNodes(nodes: ComponentNode[], id: string): [ComponentNode | null, ComponentNode[]] {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      return [nodes[i], [...nodes.slice(0, i), ...nodes.slice(i + 1)]];
    }
    if (nodes[i].children?.length) {
      const [found, newChildren] = extractFromNodes(nodes[i].children!, id);
      if (found) {
        return [found, [...nodes.slice(0, i), { ...nodes[i], children: newChildren }, ...nodes.slice(i + 1)]];
      }
    }
  }
  return [null, nodes];
}

function insertInNodes(
  nodes: ComponentNode[],
  node: ComponentNode,
  targetId: string,
  position: 'before' | 'into' | 'after',
): ComponentNode[] {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === targetId) {
      if (position === 'before') return [...nodes.slice(0, i), node, ...nodes.slice(i)];
      if (position === 'after')  return [...nodes.slice(0, i + 1), node, ...nodes.slice(i + 1)];
      const children = [...(nodes[i].children ?? []), node];
      return [...nodes.slice(0, i), { ...nodes[i], children }, ...nodes.slice(i + 1)];
    }
    if (nodes[i].children?.length) {
      const newChildren = insertInNodes(nodes[i].children!, node, targetId, position);
      if (newChildren !== nodes[i].children) {
        return [...nodes.slice(0, i), { ...nodes[i], children: newChildren }, ...nodes.slice(i + 1)];
      }
    }
  }
  return nodes;
}

// ── Component ─────────────────────────────────────────────────────────────────

const HISTORY_KEY  = (exampleId: string) => `a1-editor-history-${exampleId}`;
const VERSIONS_KEY = (exampleId: string) => `a1-editor-versions-${exampleId}`;
// Legacy draft key — kept only for migration: if a user had an unsaved draft
// before history persistence was added, it becomes the initial history entry.
const DRAFT_KEY = (exampleId: string) => `a1-editor-draft-${exampleId}`;

// ── Version persistence ───────────────────────────────────────────────────────

const BUILT_IN_VERSIONS: Record<string, EditorVersion[]> = {
  'component-showcase': SHOWCASE_VERSIONS,
};

function loadVersionState(exampleId: string, fallbackJson: string): { versions: EditorVersion[]; activeVersionId: string } {
  try {
    const raw = readStored(VERSIONS_KEY(exampleId));
    if (raw) {
      const parsed = JSON.parse(raw) as { versions: EditorVersion[]; activeVersionId: string };
      if (parsed.versions?.length && parsed.activeVersionId) return parsed;
    }
  } catch { /* ignore */ }
  const builtIn = BUILT_IN_VERSIONS[exampleId];
  if (builtIn?.length) return { versions: builtIn, activeVersionId: builtIn[0].id };
  const initial: EditorVersion = { id: versionUid(), label: 'Base', json: fallbackJson };
  return { versions: [initial], activeVersionId: initial.id };
}

function saveVersionState(exampleId: string, versions: EditorVersion[], activeVersionId: string) {
  writeStored(VERSIONS_KEY(exampleId), JSON.stringify({ versions, activeVersionId }));
}

type AddTarget = { targetId: string | null; position: 'into' | 'after' } | null;

export function EditorPage({
  definition = editorExamplePage,
  exampleId = 'default',
  documentKind = 'page',
  patternId = null,
  pages = [],
  projects = [],
  projectId = null,
  projectName,
  projectPages = [],
  onNavigateToPage,
  composeWithAi = false,
  onAiComposeConsumed,
  pageLevel,
  availableLevels,
  onSetPageLevel,
  onDuplicatePage,
  onDeletePage,
  selectedNodeId = null,
  onSelectNode,
  onViewChange,
  onDirtyChange,
  onDefinitionChange,
  pendingMove = null,
  onPendingMoveDone,
  addTarget = null,
  onCancelAdd,
  onRequestAdd,
  pendingAction = null,
  onPendingActionDone,
  pendingConvert = null,
  onPendingConvertDone,
}: {
  definition?: PageDefinition;
  exampleId?: string;
  /** 'page' (default) edits a project page; 'pattern' authors a reusable pattern. */
  documentKind?: 'page' | 'pattern' | 'layout';
  /** The pattern id when documentKind === 'pattern' (used for save + lock authoring). */
  patternId?: string | null;
  pages?: { id: string; label: string }[];
  /** All projects — used to scope a pattern to specific projects. */
  projects?: { id: string; name: string }[];
  projectId?: string | null;
  projectName?: string;
  projectPages?: ProjectPage[];
  onNavigateToPage?: (id: string) => void;
  composeWithAi?: boolean;
  onAiComposeConsumed?: () => void;
  pageLevel?: number;
  availableLevels?: number[];
  onSetPageLevel?: (level: number) => void;
  onDuplicatePage?: () => void;
  onDeletePage?: () => void;
  selectedNodeId?: string | null;
  onSelectNode?: (id: string | null) => void;
  onViewChange?: (view: string) => void;
  onDirtyChange?: (isDirty: boolean) => void;
  onDefinitionChange?: (definition: PageDefinition | null) => void;
  pendingMove?: { draggedId: string; targetId: string; position: 'before' | 'into' | 'after' } | null;
  onPendingMoveDone?: () => void;
  addTarget?: AddTarget;
  onCancelAdd?: () => void;
  onRequestAdd?: (target: AddTarget) => void;
  pendingAction?: { type: 'delete' | 'ungroup' | 'duplicate' | 'group-as-stack' | 'copy-pattern' | 'paste-pattern' | 'detach' | 'create-pattern'; nodeId: string } | null;
  onPendingActionDone?: () => void;
  pendingConvert?: { nodeId: string; newType: ComponentType; newProps: ComponentProps } | null;
  onPendingConvertDone?: () => void;
}) {
  const canonicalJson = useMemo(() => JSON.stringify(definition, null, 2), [definition]);

  // Pattern-authoring mode: persist to the pattern store, author locks (don't
  // enforce them), and hide page/project-only chrome.
  const isPattern = documentKind === 'pattern';
  const isLayout = documentKind === 'layout';
  const openTicket = useOpenCreateTicket();

  // Use any legacy draft as the fallback so existing unsaved work is preserved.
  const [fallbackJson] = useState(() => readStored(DRAFT_KEY(exampleId)) ?? canonicalJson);

  // ── Versions state ──────────────────────────────────────────────────────────
  const [{ versions, activeVersionId }, setVersionState] = useState(() =>
    loadVersionState(exampleId, fallbackJson)
  );

  // Persist versions whenever they change.
  useEffect(() => {
    saveVersionState(exampleId, versions, activeVersionId);
  }, [versions, activeVersionId, exampleId]);

  const activeVersion = versions.find((v) => v.id === activeVersionId) ?? versions[0];
  const baseVersion = versions[0];

  // Shared, attributed edit history (Supabase). For pages, the History panel shows
  // this cloud log (who changed what, when) rather than the local undo stack — so
  // history is attached to the object and visible to every user. Local undo/redo
  // (keyboard) still runs off useEditorHistory.
  type CloudHistoryEntry = { id: string; label: string; user_email: string | null; snapshot: string | null; created_at: string };
  const historyEntityType: 'page' | 'pattern' = documentKind === 'pattern' ? 'pattern' : 'page';
  const historyEntityId = documentKind === 'pattern' ? patternId : exampleId;
  const historyEnabled = (documentKind === 'page' || documentKind === 'pattern') && !!historyEntityId;
  const [cloudHistory, setCloudHistory] = useState<CloudHistoryEntry[]>([]);
  function refreshHistory() {
    if (historyEnabled) fetchHistory(historyEntityType, historyEntityId as string).then(setCloudHistory);
  }

  // Use the active version's json as the history starting point. Each commit is also
  // appended to the shared cloud history, tagged with the current user — so history
  // is attached to the object (page/pattern) and visible to every user.
  const history = useEditorHistory(
    activeVersion?.json ?? fallbackJson,
    HISTORY_KEY(exampleId),
    (json, label) => {
      if (historyEnabled) {
        appendHistory({ entityType: historyEntityType, entityId: historyEntityId as string, label, snapshot: json }).then(refreshHistory);
      }
    },
  );

  // Map the cloud log into the History panel's entry shape (pages + patterns).
  const panelEntries = historyEnabled
    ? cloudHistory.map((r) => ({ id: r.id, json: r.snapshot ?? '', label: r.label, timestamp: Date.parse(r.created_at), userEmail: r.user_email ?? undefined, restored: r.label.startsWith('Restored:') }))
    : history.entries;
  const panelIndex = historyEnabled ? panelEntries.length - 1 : history.index;

  // Non-destructive preview: when set, the canvas shows this historical JSON
  // without touching history.workingJson. Cleared on restore or history navigation.
  const [previewJson, setPreviewJson] = useState<string | null>(null);
  const historyIndexRef = useRef(history.index);
  useEffect(() => {
    if (history.index !== historyIndexRef.current) {
      historyIndexRef.current = history.index;
      setPreviewJson(null);
    }
  }, [history.index]);

  const [view, setView] = useState('edit');
  // "Code snippet" view sub-format: editable JSON, or read-only generated React.
  const [codeFormat, setCodeFormat] = useState<'json' | 'react'>('json');
  // Responsive preview device for the Preview view ('fit' = no simulation).
  const [previewViewport, setPreviewViewport] = useState('fit');
  const [asideNode, setAsideNode] = useState<Element | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deletedLabel, setDeletedLabel] = useState('');
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [notice, setNotice] = useState(''); // transient one-line snackbar (copy/paste pattern)
  // The child item being edited (e.g. a DefinitionList item) — shared by the
  // canvas (outline) and the configurator (active tab).
  const [activeItem, setActiveItem] = useState<{ nodeId: string; index: number } | null>(null);

  // Debounce timer ref for text-input style changes.
  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDirty = history.workingJson !== canonicalJson;

  // History persistence is handled inside useEditorHistory via its storageKey.
  // Clean up any legacy draft key left from before history persistence was added.
  useEffect(() => {
    localStorage.removeItem(DRAFT_KEY(exampleId));
  }, [exampleId]);

  // Notify parent shell so it can show the sidebar badge.
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty]); // eslint-disable-line react-hooks/exhaustive-deps

  // Notify parent of view changes so the shell knows when to render the aside.
  useEffect(() => {
    onViewChange?.(view);
  }, [view]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the standalone prototype in sync: write the working JSON to localStorage
  // whenever it changes so the preview tab picks it up via a storage event. The
  // pages map holds only the current page (its live, uncommitted working copy);
  // every other page is resolved on demand from its own history/versions keys, so
  // the map stays tiny and can't blow the localStorage quota.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLayout) {
        // Persist the project's shared-layout document back to its own store key.
        if (projectId) saveProjectLayout(projectId, history.workingJson);
        return;
      }
      if (isPattern) {
        // Persist the edited pattern back to the pattern store (unwrap the
        // page-definition regions into the pattern's node list). Metadata and
        // lock flags ride along on the nodes.
        if (!patternId) return;
        try {
          const def = JSON.parse(history.workingJson) as PageDefinition;
          const nodes = def.page.layout.regions.flatMap((r) => r.nodes);
          const current = loadPattern(patternId);
          if (current) {
            savePattern({
              ...current,
              pattern: {
                ...current.pattern,
                name: def.page.name ?? current.pattern.name,
                description: def.page.description ?? current.pattern.description,
                nodes,
              },
            });
          }
        } catch { /* ignore malformed working json */ }
        return;
      }
      writeStored(EDITOR_PREVIEW_SESSION_KEY, history.workingJson);
      // Record which page is being edited so the prototype only live-updates
      // the screen on display when it matches.
      writeStored(EDITOR_PREVIEW_CURRENT_KEY, exampleId);
      writeStored(EDITOR_PREVIEW_PAGES_MAP_KEY, JSON.stringify({ [exampleId]: history.workingJson }));
    }, 500);
    return () => clearTimeout(timer);
  }, [history.workingJson, exampleId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Grab the aside slot once on mount — it's always in the DOM when the
  // editor is active, regardless of view, so we can portal into it at any time.
  useLayoutEffect(() => {
    // Re-acquire on resize too: at xs/sm the slot moves into a BottomSheet, so
    // the portal target changes when crossing the breakpoint.
    const find = () => setAsideNode(document.getElementById('a1-web-editor-aside-slot'));
    find();
    window.addEventListener('resize', find);
    return () => window.removeEventListener('resize', find);
  }, []);

  // Stable refs used by keyboard handler so we never need to re-register the listener.
  const historyRef = useRef(history);
  historyRef.current = history;
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  // Safe re-hydrate: when a teammate's change to THIS page arrives via cloud sync,
  // adopt it — but only when the local user isn't mid-edit (no uncommitted change),
  // so we never clobber active work. `!isDirty` means working === last commit, so a
  // differing stored value can only have come from a remote write.
  useEffect(() => {
    if (!historyEnabled) return;
    refreshHistory(); // load the shared history for this page/pattern
    const unsub = onRemoteHydrate(() => {
      // Safe re-hydrate is page-only (layout/patterns are stored differently).
      if (documentKind === 'page') {
        const stored = resolvePageJson(exampleId);
        if (stored && stored !== historyRef.current.workingJson && !isDirtyRef.current) {
          historyRef.current.reset(stored, 'Synced from team');
        }
      }
      refreshHistory(); // a teammate's change may have added history entries
    });
    return () => { unsub(); };
  }, [historyEnabled, historyEntityType, historyEntityId, documentKind, exampleId]); // eslint-disable-line react-hooks/exhaustive-deps

  // These are filled in after the handler functions are declared below,
  // but the ref itself lives here so the keyboard effect can close over it once.
  const editorActionsRef = useRef({
    selectedNodeId,
    handleMoveUp:         (_id: string) => {},
    handleMoveDown:       (_id: string) => {},
    handleGroupAsStack:   (_id: string) => {},
    handleUngroup:        (_id: string) => {},
    handleDuplicateNode:  (_id: string) => {},
    handleNodeDelete:     (_id: string) => {},
    handleCopyPattern:    () => {},
    handlePastePattern:   () => {},
    setShortcutsOpen:     (_open: boolean) => {},
  });
  // Updated every render so the effect always sees current values without re-registering.
  editorActionsRef.current.selectedNodeId = selectedNodeId;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isText = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (mod && e.key === 'z' && !e.shiftKey) {
        if (isText) return;
        e.preventDefault();
        historyRef.current.undo();
      } else if (mod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        if (isText) return;
        e.preventDefault();
        historyRef.current.redo();
      } else if (e.altKey && e.key === 'ArrowUp') {
        if (isText) return;
        e.preventDefault();
        const { selectedNodeId: id, handleMoveUp } = editorActionsRef.current;
        if (id) handleMoveUp(id);
      } else if (e.altKey && e.key === 'ArrowDown') {
        if (isText) return;
        e.preventDefault();
        const { selectedNodeId: id, handleMoveDown } = editorActionsRef.current;
        if (id) handleMoveDown(id);
      } else if (mod && !e.shiftKey && e.key.toLowerCase() === 'g') {
        if (isText) return;
        e.preventDefault();
        const { selectedNodeId: id, handleGroupAsStack } = editorActionsRef.current;
        if (id) handleGroupAsStack(id);
      } else if (mod && e.shiftKey && e.key.toLowerCase() === 'g') {
        if (isText) return;
        e.preventDefault();
        const { selectedNodeId: id, handleUngroup } = editorActionsRef.current;
        if (id) handleUngroup(id);
      } else if (mod && e.altKey && e.code === 'KeyC') {
        // ⌘⌥C / Ctrl+Alt+C — match e.code, not e.key (Option composes letters on macOS).
        if (isText) return;
        e.preventDefault();
        editorActionsRef.current.handleCopyPattern();
      } else if (mod && e.altKey && e.code === 'KeyV') {
        if (isText) return;
        e.preventDefault();
        editorActionsRef.current.handlePastePattern();
      } else if (mod && e.key.toLowerCase() === 'd') {
        if (isText) return;
        e.preventDefault();
        const { selectedNodeId: id, handleDuplicateNode } = editorActionsRef.current;
        if (id) handleDuplicateNode(id);
      } else if (mod && e.key === 'k') {
        e.preventDefault();
        editorActionsRef.current.setShortcutsOpen(true);
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && !isText) {
        const { selectedNodeId: id, handleNodeDelete } = editorActionsRef.current;
        if (id) { e.preventDefault(); handleNodeDelete(id); }
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const parsedDefinition = useMemo<ParseResult>(() => {
    try {
      return { ok: true, value: JSON.parse(previewJson ?? history.workingJson) as PageDefinition };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Invalid JSON' };
    }
  }, [previewJson, history.workingJson]);

  // Read-only React (JSX) rendition of the current definition.
  const reactCode = useMemo(
    () => (parsedDefinition.ok ? definitionToJsx(parsedDefinition.value) : '// Fix the JSON to see the React output.'),
    [parsedDefinition],
  );

  // Notify parent shell of the current parsed definition so the sidebar tree stays in sync.
  useEffect(() => {
    onDefinitionChange?.(parsedDefinition.ok ? parsedDefinition.value : null);
  }, [parsedDefinition]); // eslint-disable-line react-hooks/exhaustive-deps

  // Process a node-move command issued by EditorSidebar's draggable tree.
  useEffect(() => {
    if (!pendingMove || !parsedDefinition.ok) return;
    const { draggedId, targetId, position } = pendingMove;
    const regions = parsedDefinition.value.page.layout.regions;

    let draggedNode: ComponentNode | null = null;
    let newRegions = regions;

    for (const region of regions) {
      const [found, remaining] = extractFromNodes(region.nodes, draggedId);
      if (found) {
        draggedNode = found;
        newRegions = regions.map((r) => r === region ? { ...r, nodes: remaining } : r);
        break;
      }
    }

    if (!draggedNode) { onPendingMoveDone?.(); return; }

    newRegions = newRegions.map((r) => {
      const updated = insertInNodes(r.nodes, draggedNode!, targetId, position);
      return updated !== r.nodes ? { ...r, nodes: updated } : r;
    });

    const newDef = {
      ...parsedDefinition.value,
      page: { ...parsedDefinition.value.page, layout: { ...parsedDefinition.value.page.layout, regions: newRegions } },
    };
    history.commit(JSON.stringify(newDef, null, 2), `Moved ${draggedNode.type}`);
    onPendingMoveDone?.();
  }, [pendingMove]); // eslint-disable-line react-hooks/exhaustive-deps

  // Process a delete/ungroup command issued by EditorSidebar's tree context menu.
  useEffect(() => {
    if (!pendingAction || !parsedDefinition.ok) return;
    if (pendingAction.type === 'delete') handleNodeDelete(pendingAction.nodeId);
    else if (pendingAction.type === 'ungroup') handleUngroup(pendingAction.nodeId);
    else if (pendingAction.type === 'duplicate') handleDuplicateNode(pendingAction.nodeId);
    else if (pendingAction.type === 'group-as-stack') handleGroupAsStack(pendingAction.nodeId);
    else if (pendingAction.type === 'copy-pattern') handleCopyPattern(pendingAction.nodeId);
    else if (pendingAction.type === 'paste-pattern') handlePastePattern(pendingAction.nodeId);
    else if (pendingAction.type === 'detach') handleDetachPattern(pendingAction.nodeId);
    else if (pendingAction.type === 'create-pattern') handleCreatePatternFromNode(pendingAction.nodeId);
    onPendingActionDone?.();
  }, [pendingAction]); // eslint-disable-line react-hooks/exhaustive-deps

  // Process a convert command issued by EditorSidebar's tree context menu.
  useEffect(() => {
    if (!pendingConvert || !parsedDefinition.ok) return;
    handleConvertNode(pendingConvert.nodeId, pendingConvert.newType, pendingConvert.newProps);
    onPendingConvertDone?.();
  }, [pendingConvert]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helpers ────────────────────────────────────────────────────────────────

  function getNodeType(nodeId: string): string {
    if (!parsedDefinition.ok) return 'Component';
    for (const region of parsedDefinition.value.page.layout.regions) {
      const found = findNodeById(region.nodes, nodeId);
      if (found) return found.type;
    }
    return 'Component';
  }

  function getNodeProps(nodeId: string): Record<string, unknown> | undefined {
    if (!parsedDefinition.ok) return undefined;
    for (const region of parsedDefinition.value.page.layout.regions) {
      const found = findNodeById(region.nodes, nodeId);
      if (found) return found.props as Record<string, unknown> | undefined;
    }
    return undefined;
  }

  // Lock metadata carried by nodes instantiated from a pattern. The page editor
  // enforces these: a locked node can't be deleted/moved/restructured, locked
  // props are read-only (reverted on change), and locked text isn't editable.
  function getNodeLock(nodeId: string): { node?: boolean; props?: string[]; content?: boolean } | undefined {
    // Locks are only *enforced* on a page. In the pattern editor the author is
    // defining the locks, so every property (incl. a slot's allow-lists) stays
    // freely editable.
    if (!parsedDefinition.ok || isPattern) return undefined;
    for (const region of parsedDefinition.value.page.layout.regions) {
      const found = findNodeById(region.nodes, nodeId);
      if (found) return found.lock;
    }
    return undefined;
  }

  function notifyLocked() {
    setNotice('Locked by its pattern — unlock it in the pattern editor to change it');
  }

  function getNode(nodeId: string): ComponentNode | undefined {
    if (!parsedDefinition.ok) return undefined;
    for (const region of parsedDefinition.value.page.layout.regions) {
      const found = findNodeById(region.nodes, nodeId);
      if (found) return found;
    }
    return undefined;
  }

  // When adding INTO a Slot, enforce its allow-list. Returns a rejection message
  // to show, or null when the add is allowed (or the target isn't a slot).
  function slotRejection(
    targetId: string | null | undefined,
    position: string | undefined,
    item: { type?: string; patternId?: string },
  ): string | null {
    if (position !== 'into' || !targetId) return null;
    const target = getNode(targetId);
    if (!target || target.type !== 'Slot') return null;
    // Item count: a full slot rejects everything (even otherwise-allowed items).
    const max = target.props?.max as number | undefined;
    const count = target.children?.length ?? 0;
    if (max != null && count >= max) return `This blank area is full (max ${max}).`;
    const allow = (target.props?.allow as string[] | undefined) ?? [];
    const allowPatterns = (target.props?.allowPatterns as string[] | undefined) ?? [];
    if (!allow.length && !allowPatterns.length) return null; // open slot — accepts anything
    if (item.patternId) {
      if (allowPatterns.includes(item.patternId)) return null;
      return 'This blank area doesn’t accept that pattern.';
    }
    if (item.type && allow.includes(item.type)) return null;
    const accepts = [
      ...allow,
      ...allowPatterns.map((id) => getAllPatterns().find((p) => p.pattern.id === id)?.pattern.name ?? id),
    ];
    return `This blank area only accepts: ${accepts.join(', ')}.`;
  }

  // The root of a pattern instance. Even when locked, the page author may remove
  // or reposition the whole instance (managing placement) — they just can't edit
  // its locked internals.
  function isPatternInstanceRoot(nodeId: string): boolean {
    if (!parsedDefinition.ok) return false;
    for (const region of parsedDefinition.value.page.layout.regions) {
      const found = findNodeById(region.nodes, nodeId);
      if (found) return !!found.patternInstance;
    }
    return false;
  }

  function commitDebounced(json: string, label: string) {
    if (commitTimer.current) clearTimeout(commitTimer.current);
    commitTimer.current = setTimeout(() => {
      history.commit(json, label);
      commitTimer.current = null;
    }, 700);
  }

  // ── Change handlers ────────────────────────────────────────────────────────

  function handleViewChange(v: string) {
    setView(v);
    if (v !== 'edit') onSelectNode?.(null);
  }

  function handlePageMetadataChange(patch: { name?: string; description?: string; icon?: string; detailDataset?: string | null; detailPreviewId?: string | null }) {
    if (!parsedDefinition.ok) return;
    const page = parsedDefinition.value.page;
    const newPage = {
      ...page,
      ...(patch.name !== undefined ? { name: patch.name } : {}),
      ...(patch.description !== undefined ? { description: patch.description || undefined } : {}),
      ...(patch.icon !== undefined ? { icon: patch.icon || undefined } : {}),
      ...(patch.detailDataset !== undefined ? { detailDataset: patch.detailDataset || undefined } : {}),
      ...(patch.detailPreviewId !== undefined ? { detailPreviewId: patch.detailPreviewId || undefined } : {}),
    };
    const newJson = JSON.stringify({ ...parsedDefinition.value, page: newPage }, null, 2);
    history.setWorking(newJson);
    commitDebounced(newJson, 'Updated page settings');
  }

  function handleHistoryPreview(json: string | null) {
    setPreviewJson(json);
  }

  function handleHistoryRename(entryId: string, label: string) {
    if (historyEnabled) { updateHistoryLabel(entryId, label).then(refreshHistory); return; }
    history.rename(entryId, label);
  }

  function handleContentChange(nodeId: string, newFallback: string) {
    if (!parsedDefinition.ok) return;
    const lock = getNodeLock(nodeId);
    if (lock?.node || lock?.content) return; // locked text is not editable
    const newJson = JSON.stringify(
      patchDefinitionContent(parsedDefinition.value, nodeId, newFallback),
      null, 2,
    );
    history.setWorking(newJson);
    commitDebounced(newJson, `Edited ${getNodeType(nodeId)} text`);
  }

  // Inline-edit a child item's text field (e.g. a DefinitionList item's label or
  // value) on the canvas, writing back into the node's `items` array prop.
  function handleItemTextChange(nodeId: string, index: number, field: string, value: string) {
    if (!parsedDefinition.ok) return;
    const lock = getNodeLock(nodeId);
    if (lock?.node || lock?.content) return;
    const patchNode = (node: ComponentNode): ComponentNode => {
      if (node.id === nodeId) {
        const items = Array.isArray(node.props?.items)
          ? (node.props!.items as Array<Record<string, unknown>>).map((it, i) => {
              if (i !== index) return it;
              const next: Record<string, unknown> = { ...it, [field]: value };
              if (field === 'value') delete next.children;
              return next;
            })
          : node.props?.items;
        return { ...node, props: { ...node.props, items } };
      }
      if (node.children) return { ...node, children: node.children.map(patchNode) };
      return node;
    };
    const patched = patchRegions(parsedDefinition.value, patchNode);
    const newJson = JSON.stringify(patched, null, 2);
    history.setWorking(newJson);
    commitDebounced(newJson, `Edited ${getNodeType(nodeId)} item`);
  }

  // Clicking a child item on the canvas selects its node and marks the item so
  // the configurator opens the matching tab and the canvas outlines it.
  function handleItemSelect(nodeId: string, index: number) {
    setActiveItem({ nodeId, index });
    if (nodeId !== selectedNodeId) onSelectNode?.(nodeId);
  }

  function handleNodePropsChange(nodeId: string, newProps: ComponentProps, newContentFallback?: string) {
    if (!parsedDefinition.ok) return;
    const lock = getNodeLock(nodeId);
    if (lock?.node) { notifyLocked(); return; } // fully locked — ignore all edits

    let props = newProps;
    // Locked props are read-only: restore their current values so any change reverts.
    if (lock?.props?.length) {
      const current = getNodeProps(nodeId) ?? {};
      props = { ...newProps };
      for (const key of lock.props) {
        if (key in current) props[key] = current[key];
        else delete props[key];
      }
    }
    let patched = patchDefinitionProps(parsedDefinition.value, nodeId, props);
    if (newContentFallback !== undefined && !lock?.content) {
      patched = patchDefinitionContent(patched, nodeId, newContentFallback);
    }
    const newJson = JSON.stringify(patched, null, 2);
    history.commitProp(newJson, `Edited ${getNodeType(nodeId)}`);
  }

  function handleNodeDelete(nodeId: string) {
    if (!parsedDefinition.ok) return;
    if (getNodeLock(nodeId)?.node && !isPatternInstanceRoot(nodeId)) { notifyLocked(); return; }
    // A slot with a minimum item count won't drop below it.
    const parent = parsedDefinition.value.page.layout.regions
      .map((r) => findParentInList(r.nodes, nodeId))
      .find(Boolean);
    if (parent && parent.type === 'Slot') {
      const min = parent.props?.min as number | undefined;
      const count = parent.children?.length ?? 0;
      if (min != null && count <= min) {
        setNotice(`This blank area needs at least ${min} item${min === 1 ? '' : 's'}.`);
        return;
      }
    }
    const nodeType = getNodeType(nodeId);
    const newJson = JSON.stringify(
      deleteDefinitionNode(parsedDefinition.value, nodeId),
      null, 2,
    );
    history.commit(newJson, `Deleted ${nodeType}`);
    setDeletedLabel(nodeType);
    setSnackbarOpen(true);
    if (nodeId === selectedNodeId) onSelectNode?.(null);
  }

  function handleMoveUp(nodeId: string) {
    if (!parsedDefinition.ok) return;
    if (getNodeLock(nodeId)?.node && !isPatternInstanceRoot(nodeId)) { notifyLocked(); return; }
    const regions = parsedDefinition.value.page.layout.regions;
    const newRegions = regions.map((r) => {
      const updated = moveNodeInListDirection(r.nodes, nodeId, 'up');
      return updated !== r.nodes ? { ...r, nodes: updated } : r;
    });
    if (newRegions === regions) return;
    const newDef = { ...parsedDefinition.value, page: { ...parsedDefinition.value.page, layout: { ...parsedDefinition.value.page.layout, regions: newRegions } } };
    history.commit(JSON.stringify(newDef, null, 2), `Moved ${getNodeType(nodeId)} up`);
  }

  function handleMoveDown(nodeId: string) {
    if (!parsedDefinition.ok) return;
    if (getNodeLock(nodeId)?.node && !isPatternInstanceRoot(nodeId)) { notifyLocked(); return; }
    const regions = parsedDefinition.value.page.layout.regions;
    const newRegions = regions.map((r) => {
      const updated = moveNodeInListDirection(r.nodes, nodeId, 'down');
      return updated !== r.nodes ? { ...r, nodes: updated } : r;
    });
    if (newRegions === regions) return;
    const newDef = { ...parsedDefinition.value, page: { ...parsedDefinition.value.page, layout: { ...parsedDefinition.value.page.layout, regions: newRegions } } };
    history.commit(JSON.stringify(newDef, null, 2), `Moved ${getNodeType(nodeId)} down`);
  }

  function handleUngroup(nodeId: string) {
    if (!parsedDefinition.ok) return;
    if (getNodeLock(nodeId)?.node) { notifyLocked(); return; }
    const regions = parsedDefinition.value.page.layout.regions;
    const newRegions = regions.map((r) => {
      const updated = ungroupNodeFromList(r.nodes, nodeId);
      return updated !== r.nodes ? { ...r, nodes: updated } : r;
    });
    if (newRegions === regions) return;
    const newDef = { ...parsedDefinition.value, page: { ...parsedDefinition.value.page, layout: { ...parsedDefinition.value.page.layout, regions: newRegions } } };
    history.commit(JSON.stringify(newDef, null, 2), `Ungrouped ${getNodeType(nodeId)}`);
    if (nodeId === selectedNodeId) onSelectNode?.(null);
  }

  function handleConvertNode(nodeId: string, newType: ComponentType, newProps: ComponentProps) {
    if (!parsedDefinition.ok) return;
    if (getNodeLock(nodeId)?.node || isPatternInstanceRoot(nodeId)) { notifyLocked(); return; }
    const fromType = getNodeType(nodeId);
    const newDef = convertDefinitionNode(parsedDefinition.value, nodeId, newType, newProps);
    history.commit(JSON.stringify(newDef, null, 2), `Converted ${fromType} to ${newType}`);
  }

  function handleDuplicateNode(nodeId: string) {
    if (!parsedDefinition.ok) return;
    const newDef = duplicateDefinitionNode(parsedDefinition.value, nodeId);
    history.commit(JSON.stringify(newDef, null, 2), `Duplicated ${getNodeType(nodeId)}`);
  }

  // Reconcile this page's pattern instances against their current patterns:
  // pull locked props/text forward and report any incompatible instance edits.
  function handleSyncPatterns() {
    if (!parsedDefinition.ok) return;
    const { def, instanceCount, conflicts } = reconcilePageInstances(parsedDefinition.value, loadPattern);
    if (instanceCount === 0) { setNotice('No pattern instances on this page'); return; }
    const newJson = JSON.stringify(def, null, 2);
    if (newJson === history.workingJson) {
      setNotice(`${instanceCount} pattern instance${instanceCount === 1 ? '' : 's'} — already up to date`);
      return;
    }
    history.commit(newJson, 'Synced pattern instances');
    setNotice(
      conflicts.length
        ? `Synced ${instanceCount} instance${instanceCount === 1 ? '' : 's'} · ${conflicts.length} locked value${conflicts.length === 1 ? '' : 's'} updated`
        : `Synced ${instanceCount} instance${instanceCount === 1 ? '' : 's'}`,
    );
  }

  function findNodeAnywhere(nodeId: string): ComponentNode | null {
    if (!parsedDefinition.ok) return null;
    for (const region of parsedDefinition.value.page.layout.regions) {
      const found = findNodeById(region.nodes, nodeId);
      if (found) return found;
    }
    return null;
  }

  function replaceNodeEverywhere(nodeId: string, newNode: ComponentNode, label: string) {
    if (!parsedDefinition.ok) return;
    const regions = parsedDefinition.value.page.layout.regions.map((r) => ({
      ...r, nodes: replaceNodeInList(r.nodes, nodeId, newNode),
    }));
    const newDef = { ...parsedDefinition.value, page: { ...parsedDefinition.value.page, layout: { ...parsedDefinition.value.page.layout, regions } } };
    history.commit(JSON.stringify(newDef, null, 2), label);
  }

  // Detach a pattern instance: strip its pattern link + lock metadata so it
  // becomes a loose, fully-editable set of components — but keep any patterns
  // nested inside it linked as instances.
  function handleDetachPattern(nodeId: string) {
    const node = findNodeAnywhere(nodeId);
    if (!node) return;
    replaceNodeEverywhere(nodeId, detachPatternMeta(node, true), 'Detached pattern');
    setNotice('Pattern detached');
  }

  // Create a pattern from the selected subtree, then replace the selection with a
  // (linked) instance of the new pattern.
  function handleCreatePatternFromNode(nodeId: string) {
    const node = findNodeAnywhere(nodeId);
    if (!node) return;
    // Preserve nested pattern instances as PatternRefs (don't detach them).
    const patternRoot = extractPatternSource(node, true);
    const id = newPatternId();
    registerPattern({
      schemaVersion: '1.0',
      pattern: { id, name: 'New pattern', description: '', category: 'section', nodes: [patternRoot] },
    });
    const instance = instantiatePattern(id);
    if (!instance) return;
    replaceNodeEverywhere(nodeId, instance, 'Created pattern from selection');
    onSelectNode?.(instance.id);
    setNotice('Created pattern from selection');
  }

  // Pattern authoring: set lock metadata on a node (governs instances of the pattern).
  function handleSetNodeLock(nodeId: string, lock: ComponentNode['lock']) {
    if (!parsedDefinition.ok) return;
    const newDef = patchRegions(parsedDefinition.value, (node) => setNodeLockInNode(node, nodeId, lock));
    history.commit(JSON.stringify(newDef, null, 2), `Updated lock on ${getNodeType(nodeId)}`);
  }

  function handleSetNodeRepeat(nodeId: string, repeat: ComponentNode['repeat'] | null) {
    if (!parsedDefinition.ok) return;
    const newDef = patchRegions(parsedDefinition.value, (node) => setNodeRepeatInNode(node, nodeId, repeat));
    history.commit(JSON.stringify(newDef, null, 2), repeat ? `Repeated ${getNodeType(nodeId)} over data` : `Stopped repeating ${getNodeType(nodeId)}`);
  }

  function handleSetNodeCollections(nodeId: string, collections: ComponentNode['collections'] | null) {
    if (!parsedDefinition.ok) return;
    const newDef = patchRegions(parsedDefinition.value, (node) => setNodeCollectionsInNode(node, nodeId, collections));
    history.commit(JSON.stringify(newDef, null, 2), collections ? `Filled ${getNodeType(nodeId)} from data` : `Cleared data fill on ${getNodeType(nodeId)}`);
  }

  function handleSetNodeUtilities(nodeId: string, utilities: ComponentNode['utilities'] | null) {
    if (!parsedDefinition.ok) return;
    if (getNodeLock(nodeId)?.node) { notifyLocked(); return; }
    const newDef = patchRegions(parsedDefinition.value, (node) => setNodeUtilitiesInNode(node, nodeId, utilities));
    history.commit(JSON.stringify(newDef, null, 2), utilities ? `Updated ${getNodeType(nodeId)} utilities` : `Cleared ${getNodeType(nodeId)} utilities`);
  }

  function handleGroupAsStack(nodeId: string) {
    if (!parsedDefinition.ok) return;
    if (getNodeLock(nodeId)?.node && !isPatternInstanceRoot(nodeId)) { notifyLocked(); return; }
    const nodeType = getNodeType(nodeId);
    if (nodeType === 'Stack') return;
    const newDef = wrapDefinitionNodeInStack(parsedDefinition.value, nodeId);
    history.commit(JSON.stringify(newDef, null, 2), `Grouped ${nodeType} as Stack`);
  }

  // ── Copy pattern: copy a node's style props, paste matching ones elsewhere ────

  function findNodeInDefinition(nodeId: string): ComponentNode | null {
    if (!parsedDefinition.ok) return null;
    for (const region of parsedDefinition.value.page.layout.regions) {
      const found = findNodeById(region.nodes, nodeId);
      if (found) return found;
    }
    return null;
  }

  function handleCopyPattern(nodeId: string | null = selectedNodeId) {
    if (!parsedDefinition.ok) return;
    if (!nodeId) { setNotice('Select an element to copy its properties'); return; }
    const node = findNodeInDefinition(nodeId);
    if (!node) return;
    const styles = collectPatternStyles(node);
    const typeCount = Object.keys(styles).length;
    if (typeCount === 0) { setNotice(`${node.type} has no properties to copy`); return; }
    writeStored(PATTERN_KEY, JSON.stringify({ root: node.type, styles }));
    setNotice(`Copied properties from ${node.type}${typeCount > 1 ? ` (${typeCount} element types)` : ''}`);
  }

  function handlePastePattern(nodeId: string | null = selectedNodeId) {
    if (!parsedDefinition.ok) return;
    if (!nodeId) { setNotice('Select an element to paste properties onto'); return; }
    let pattern: { root?: string; styles?: PatternStyles } | null = null;
    try { pattern = JSON.parse(readStored(PATTERN_KEY) ?? 'null'); } catch { pattern = null; }
    if (!pattern || !pattern.styles || !Object.keys(pattern.styles).length) {
      setNotice(`Copy a pattern first (${isMac ? '⌘⌥C' : 'Ctrl+Alt+C'})`);
      return;
    }
    const node = findNodeInDefinition(nodeId);
    if (!node) return;
    const { node: newNode, count } = applyPatternToSubtree(node, pattern.styles);
    if (count === 0) { setNotice(`No matching elements to paste onto ${node.type}`); return; }
    const regions = parsedDefinition.value.page.layout.regions.map((r) => ({
      ...r,
      nodes: replaceNodeInList(r.nodes, nodeId, newNode),
    }));
    const newDef = {
      ...parsedDefinition.value,
      page: { ...parsedDefinition.value.page, layout: { ...parsedDefinition.value.page.layout, regions } },
    };
    history.commit(JSON.stringify(newDef, null, 2), `Pasted pattern to ${node.type}`);
    setNotice(`Applied pattern to ${count} ${count === 1 ? 'element' : 'elements'}`);
  }

  function getNodeInfoFn(nodeId: string): { isFirst: boolean; isLast: boolean; hasChildren: boolean } {
    if (!parsedDefinition.ok) return { isFirst: false, isLast: false, hasChildren: false };
    for (const region of parsedDefinition.value.page.layout.regions) {
      const info = getNodeSiblingInfo(region.nodes, nodeId);
      if (info) return info;
    }
    return { isFirst: false, isLast: false, hasChildren: false };
  }

  // Insert a catalog component at the current addTarget position.
  function handleAddNode(entry: CatalogEntry) {
    if (!parsedDefinition.ok) return;
    if (addTarget?.position === 'into' && addTarget.targetId && getNodeLock(addTarget.targetId)?.node) {
      notifyLocked(); onCancelAdd?.(); return;
    }
    const slotReject = slotRejection(addTarget?.targetId, addTarget?.position, { type: entry.type });
    if (slotReject) { setNotice(slotReject); return; }
    const newNode = createNodeFromEntry(entry);
    const regions = parsedDefinition.value.page.layout.regions;

    let newRegions;
    if (!addTarget || addTarget.targetId === null) {
      // No target — append to the end of the first region.
      newRegions = [
        { ...regions[0], nodes: [...regions[0].nodes, newNode] },
        ...regions.slice(1),
      ];
    } else {
      newRegions = regions.map((r) => {
        const updated = insertInNodes(r.nodes, newNode, addTarget.targetId!, addTarget.position);
        return updated !== r.nodes ? { ...r, nodes: updated } : r;
      });
    }

    const newDef = {
      ...parsedDefinition.value,
      page: {
        ...parsedDefinition.value.page,
        layout: { ...parsedDefinition.value.page.layout, regions: newRegions },
      },
    };
    history.commit(JSON.stringify(newDef, null, 2), `Added ${entry.label}`);
    onSelectNode?.(newNode.id);
    onCancelAdd?.();
  }

  // Insert a pattern (resolved to fresh, editable page nodes) at the addTarget.
  function handleAddPattern(patternId: string) {
    if (!parsedDefinition.ok) return;
    if (addTarget?.position === 'into' && addTarget.targetId && getNodeLock(addTarget.targetId)?.node) {
      notifyLocked(); onCancelAdd?.(); return;
    }
    const slotReject = slotRejection(addTarget?.targetId, addTarget?.position, { patternId });
    if (slotReject) { setNotice(slotReject); return; }
    const newNode = instantiatePattern(patternId);
    if (!newNode) return;
    const regions = parsedDefinition.value.page.layout.regions;
    let newRegions;
    if (!addTarget || addTarget.targetId === null) {
      newRegions = [{ ...regions[0], nodes: [...regions[0].nodes, newNode] }, ...regions.slice(1)];
    } else {
      newRegions = regions.map((r) => {
        const updated = insertInNodes(r.nodes, newNode, addTarget.targetId!, addTarget.position);
        return updated !== r.nodes ? { ...r, nodes: updated } : r;
      });
    }
    const newDef = {
      ...parsedDefinition.value,
      page: { ...parsedDefinition.value.page, layout: { ...parsedDefinition.value.page.layout, regions: newRegions } },
    };
    const name = getAllPatterns().find((p) => p.pattern.id === patternId)?.pattern.name ?? 'pattern';
    history.commit(JSON.stringify(newDef, null, 2), `Added ${name}`);
    onSelectNode?.(newNode.id);
    onCancelAdd?.();
  }

  // Insert a catalog component dropped onto a canvas node at the given position.
  function handleCatalogDrop(catalogType: string, targetNodeId: string | null, position: 'before' | 'into' | 'after') {
    if (!parsedDefinition.ok) return;
    if (position === 'into' && targetNodeId && getNodeLock(targetNodeId)?.node) { notifyLocked(); return; }
    const isPatternDrop = catalogType.startsWith('pattern:');
    const isFigureImage = catalogType.startsWith('figure-image:');
    const slotReject = slotRejection(targetNodeId, position, isPatternDrop
      ? { patternId: catalogType.slice('pattern:'.length) }
      : { type: isFigureImage ? 'Figure' : catalogType });
    if (slotReject) { setNotice(slotReject); return; }

    // Encodings: `pattern:<id>` → a pattern instance; `figure-image:<id>` → a
    // Figure pre-filled with a library image; everything else → a component type.
    let newNode: ComponentNode | null;
    let label: string;
    if (catalogType.startsWith('pattern:')) {
      const patternId = catalogType.slice('pattern:'.length);
      newNode = instantiatePattern(patternId);
      label = getAllPatterns().find((p) => p.pattern.id === patternId)?.pattern.name ?? 'pattern';
    } else if (isFigureImage) {
      const imageId = catalogType.slice('figure-image:'.length);
      const entry = COMPONENT_CATALOG.flatMap((c) => c.entries).find((e) => e.type === 'Figure');
      newNode = entry ? createNodeFromEntry(entry) : null;
      if (newNode) newNode.props = { ...newNode.props, src: toImageRef(imageId) };
      label = 'image';
    } else {
      const entry = COMPONENT_CATALOG.flatMap((c) => c.entries).find((e) => e.type === catalogType);
      newNode = entry ? createNodeFromEntry(entry) : null;
      label = entry?.label ?? 'component';
    }
    if (!newNode) return;

    const regions = parsedDefinition.value.page.layout.regions;
    let newRegions;
    if (!targetNodeId) {
      newRegions = [{ ...regions[0], nodes: [...regions[0].nodes, newNode] }, ...regions.slice(1)];
    } else {
      newRegions = regions.map((r) => {
        const updated = insertInNodes(r.nodes, newNode!, targetNodeId, position);
        return updated !== r.nodes ? { ...r, nodes: updated } : r;
      });
    }
    const newDef = {
      ...parsedDefinition.value,
      page: { ...parsedDefinition.value.page, layout: { ...parsedDefinition.value.page.layout, regions: newRegions } },
    };
    history.commit(JSON.stringify(newDef, null, 2), `Added ${label}`);
    onSelectNode?.(newNode.id);
  }

  // Canvas "+" button on a selected container — opens the Add panel targeting that node.
  function handleRequestAddChild(nodeId: string) {
    onRequestAdd?.({ targetId: nodeId, position: 'into' });
  }

  // Sync action functions into the ref after they're declared so the keyboard effect sees them.
  editorActionsRef.current.handleMoveUp        = handleMoveUp;
  editorActionsRef.current.handleMoveDown      = handleMoveDown;
  editorActionsRef.current.handleGroupAsStack  = handleGroupAsStack;
  editorActionsRef.current.handleUngroup       = handleUngroup;
  editorActionsRef.current.handleDuplicateNode = handleDuplicateNode;
  editorActionsRef.current.handleNodeDelete    = handleNodeDelete;
  editorActionsRef.current.handleCopyPattern   = handleCopyPattern;
  editorActionsRef.current.handlePastePattern  = handlePastePattern;
  editorActionsRef.current.setShortcutsOpen    = setShortcutsOpen;

  function handleCodeChange(val: string) {
    history.setWorking(val);
    commitDebounced(val, 'Edited code');
  }

  function restoreCloudSnapshot(entry?: CloudHistoryEntry) {
    if (!entry?.snapshot) return;
    const restoredLabel = `Restored: ${entry.label}`;
    history.reset(entry.snapshot, restoredLabel);
    // Push to the cloud log so the restore appears at the top of the history panel.
    appendHistory({
      entityType: historyEntityType,
      entityId: historyEntityId as string,
      label: restoredLabel,
      snapshot: entry.snapshot,
    }).then(refreshHistory);
  }

  function handleHistoryRestore(entryId: string) {
    setPreviewJson(null); // restore replaces the preview permanently
    if (historyEnabled) {
      restoreCloudSnapshot(cloudHistory.find((e) => e.id === entryId));
      onSelectNode?.(null);
      return;
    }
    history.restore(entryId);
    onSelectNode?.(null);
  }

  function handleExpandPreview() {
    // Persist only the current page's live working JSON (including uncommitted
    // edits) so the prototype opens with exactly what's on the canvas. Other
    // pages are resolved on demand by the prototype from their own history /
    // versions keys, so we don't bundle them here — a map of every page can
    // exceed the localStorage quota and make the write (and the launch) fail.
    // writeStored frees space + retries on quota, so it can never block the launch.
    writeStored(EDITOR_PREVIEW_SESSION_KEY, history.workingJson);
    writeStored(EDITOR_PREVIEW_CURRENT_KEY, exampleId);
    writeStored(EDITOR_PREVIEW_PAGES_MAP_KEY, JSON.stringify({ [exampleId]: history.workingJson }));

    // Include the screen id so the prototype opens at — and has a shareable URL
    // for — the current page, plus the project id so the prototype can build the
    // generated navigation from the project's page hierarchy.
    const projectParam = projectId ? `&project=${encodeURIComponent(projectId)}` : '';
    const url = `/editor-preview?standalone&screen=${encodeURIComponent(exampleId)}${projectParam}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // ── Version management ─────────────────────────────────────────────────────

  function handleSwitchVersion(toId: string) {
    if (toId === activeVersionId) return;
    // Snapshot current working state back into the active version before leaving.
    setVersionState((prev) => {
      const updatedVersions = prev.versions.map((v) =>
        v.id === prev.activeVersionId ? { ...v, json: history.workingJson } : v
      );
      const target = updatedVersions.find((v) => v.id === toId);
      if (target) history.reset(target.json);
      onSelectNode?.(null);
      return { versions: updatedVersions, activeVersionId: toId };
    });
  }

  function handleAddVersion(sourceVersion?: EditorVersion | null) {
    const sourceJson = sourceVersion ? sourceVersion.json : history.workingJson;
    const sourceLabel = sourceVersion ? sourceVersion.label : null;
    const label = sourceLabel ? `${sourceLabel} copy` : `Version ${versions.length + 1}`;
    const newVersion: EditorVersion = { id: versionUid(), label, json: sourceJson };
    setVersionState((prev) => ({
      versions: [...prev.versions.map((v) =>
        v.id === prev.activeVersionId ? { ...v, json: history.workingJson } : v
      ), newVersion],
      activeVersionId: newVersion.id,
    }));
    history.reset(newVersion.json);
    onSelectNode?.(null);
  }

  function handleDeleteVersion(id: string) {
    setVersionState((prev) => {
      if (prev.versions.length <= 1) return prev;
      const remaining = prev.versions.filter((v) => v.id !== id);
      const newActiveId = id === prev.activeVersionId ? remaining[0].id : prev.activeVersionId;
      if (id === prev.activeVersionId) {
        history.reset(remaining[0].json);
        onSelectNode?.(null);
      }
      return { versions: remaining, activeVersionId: newActiveId };
    });
  }

  function handleRenameVersion(id: string, label: string) {
    setVersionState((prev) => ({
      ...prev,
      versions: prev.versions.map((v) => (v.id === id ? { ...v, label } : v)),
    }));
  }

  // ── Render helpers ─────────────────────────────────────────────────────────

  const parseError = !parsedDefinition.ok ? (
    <Section padding="md" gap="xs">
      <Paragraph size="sm" color="muted">
        Fix the JSON in the code snippet tab to update the preview.
      </Paragraph>
      <Code variant="inline">{parsedDefinition.error}</Code>
    </Section>
  ) : null;

  const baseParsedDef = useMemo(() => {
    if (!baseVersion) return null;
    try { return JSON.parse(baseVersion.json); } catch { return null; }
  }, [baseVersion]);

  // Auto-generated project navigation, rendered above the page in every view so
  // the page behaves like a real multi-page site. Clicking a nav item switches
  // the open page; the href keeps middle-click / open-in-new-tab working.
  const projectNavItems: ProjectNavItem[] = projectPages.length
    ? buildProjectNav(projectPages, {
        activePageId: exampleId,
        onNavigate: (id) => onNavigateToPage?.(id),
        hrefFor: (id) =>
          `/editor${projectId ? `?project=${encodeURIComponent(projectId)}&doc=${encodeURIComponent(id)}` : `?doc=${encodeURIComponent(id)}`}`,
      })
    : [];

  const generatedHeader = projectNavItems.length ? (
    <TopHeader
      className="a1-web-generated-header"
      logo={projectName ? <span className="a1-web-logo">{projectName}</span> : undefined}
      navItems={projectNavItems}
    />
  ) : null;

  // The project's shared layout wraps content pages: its chrome renders read-only
  // around the editable canvas (edit view) and the page composes into it (preview).
  // Not applied to the layout document itself or to patterns.
  const sharedLayoutDef = useMemo(() => {
    if (documentKind !== 'page' || !projectId) return null;
    try { return JSON.parse(loadProjectLayout(projectId)) as PageDefinition; } catch { return null; }
  }, [documentKind, projectId]);

  const layoutChrome = useMemo(
    () => (sharedLayoutDef ? splitLayoutAtOutlet(sharedLayoutDef, { navItems: projectNavItems, logoFallback: projectName ?? '' }) : null),
    [sharedLayoutDef, projectNavItems, projectName],
  );

  const composedPreviewDef = useMemo(
    () => (sharedLayoutDef && parsedDefinition.ok
      ? combinePageIntoLayout(sharedLayoutDef, parsedDefinition.value, { navItems: projectNavItems, logoFallback: projectName ?? '' })
      : null),
    [sharedLayoutDef, parsedDefinition, projectNavItems, projectName],
  );

  // Only patterns available to the active project (unrestricted, or scoped to it).
  const patternEntries = getAllPatterns()
    .filter((p) => patternAvailableToProject(p.pattern, projectId))
    .map((p) => ({
      id: p.pattern.id,
      label: p.pattern.name,
      description: p.pattern.description,
      icon: 'dashboard_customize',
    }));

  // The pattern instance currently being edited (its root or a descendant is
  // selected) — only that instance reveals its red lock outlines.
  const activePatternRootId = parsedDefinition.ok && selectedNodeId
    ? (findActivePatternRoot(parsedDefinition.value.page.layout.regions.flatMap((r) => r.nodes), selectedNodeId) ?? null)
    : null;

  // When the Add target is a Slot, tell the Add panel what it accepts so it only
  // offers the allowed components / patterns (and signals when it's full).
  let slotFilter = null as
    | null
    | { allow: string[]; allowPatterns: string[]; open: boolean; full: boolean; max?: number };
  if (addTarget?.position === 'into' && addTarget.targetId) {
    const target = getNode(addTarget.targetId);
    if (target && target.type === 'Slot') {
      const allow = (target.props?.allow as string[] | undefined) ?? [];
      const allowPatterns = (target.props?.allowPatterns as string[] | undefined) ?? [];
      const max = target.props?.max as number | undefined;
      const count = target.children?.length ?? 0;
      slotFilter = {
        allow,
        allowPatterns,
        open: !allow.length && !allowPatterns.length,
        full: max != null && count >= max,
        max,
      };
    }
  }

  const asidePanel = asideNode
    ? createPortal(
        <EditorAsidePanel
          selectedNodeId={selectedNodeId}
          definition={parsedDefinition.ok ? parsedDefinition.value : null}
          onApplyDefinition={(def: PageDefinition, label: string) =>
            history.commit(JSON.stringify(def, null, 2), label)}
          composeWithAi={composeWithAi}
          onAiComposeConsumed={onAiComposeConsumed}
          projectId={projectId}
          pages={pages}
          pageLevel={pageLevel}
          availableLevels={availableLevels}
          onSetPageLevel={onSetPageLevel}
          onNodePropsChange={handleNodePropsChange}
          activeItem={activeItem}
          onItemSelect={handleItemSelect}
          onPageMetadataChange={handlePageMetadataChange}
          patternScope={isPattern && patternId ? { patternId, projects } : null}
          lockEnforced={!isPattern}
          lockAuthoring={isPattern}
          onSetLock={handleSetNodeLock}
          onSetNodeRepeat={handleSetNodeRepeat}
          onSetNodeCollections={handleSetNodeCollections}
          onSetNodeUtilities={handleSetNodeUtilities}
          historyEntries={panelEntries}
          historyIndex={panelIndex}
          onHistoryRestore={handleHistoryRestore}
          onHistoryRename={handleHistoryRename}
          onHistoryPreview={handleHistoryPreview}
          onConvertNode={handleConvertNode}
          onDuplicatePage={onDuplicatePage}
          onDeletePage={onDeletePage}
          addTarget={addTarget}
          onCancelAdd={onCancelAdd}
          onAddNode={handleAddNode}
          patternEntries={patternEntries}
          onAddPattern={handleAddPattern}
          slotFilter={slotFilter}
          versions={versions}
          activeVersionId={activeVersionId}
          baseDef={baseParsedDef}
          onSwitchVersion={handleSwitchVersion}
          onAddVersion={handleAddVersion}
          onDeleteVersion={handleDeleteVersion}
          onRenameVersion={handleRenameVersion}
        />,
        asideNode,
      )
    : null;

  return (
    <>
      <Section padding="xs" surface="panel" borderSize="xs"
  borderSides={['bottom']}>
        <Stack direction="row" align="center" justify="between">
          <Toolbar aria-label="Editor">
            <ToolbarGroup
              aria-label="Editor view"
              showLabels
              value={view}
              onChange={(v) => handleViewChange(v as string)}
              options={[
                { value: 'edit', label: 'Edit', icon: 'edit' },
                { value: 'preview', label: 'Preview', icon: 'visibility' },
                { value: 'json', label: 'Code snippet', icon: 'data_object' },
              ]}
            />
            {view === 'json' && (
              <>
                <ToolbarDivider />
                <ToolbarGroup
                  aria-label="Code format"
                  showLabels
                  value={codeFormat}
                  onChange={(v) => setCodeFormat(v as 'json' | 'react')}
                  options={[
                    { value: 'json', label: 'JSON', icon: 'data_object' },
                    { value: 'react', label: 'React', icon: 'code' },
                  ]}
                />
              </>
            )}
            {view === 'preview' && (
              <>
                <ToolbarDivider />
                <ToolbarMenu
                  aria-label="Responsive preview"
                  label={VIEWPORT_PRESETS.find((p) => p.value === previewViewport)?.label ?? 'Fit'}
                  value={previewViewport}
                  onChange={(v) => setPreviewViewport(v as string)}
                  items={VIEWPORT_PRESETS}
                />
              </>
            )}
            <ToolbarDivider />
            <ToolbarButton
              icon="undo"
              label="Undo"
              disabled={!history.canUndo}
              onClick={history.undo}
            />
            <ToolbarButton
              icon="redo"
              label="Redo"
              disabled={!history.canRedo}
              onClick={history.redo}
            />
            <ToolbarDivider />
            <ToolbarButton
              icon="keyboard"
              label="Keyboard shortcuts"
              onClick={() => setShortcutsOpen(true)}
            />
            <ToolbarButton
              icon="flag"
              label="Report a bug or request a feature"
              onClick={() => openTicket({
                kind: isPattern ? 'pattern' : 'project',
                ref: isPattern ? patternId : null,
                label: isPattern ? 'Pattern editor' : 'Page editor',
              })}
            />
            {!isPattern && (
              <ToolbarButton
                icon="sync"
                label="Sync pattern instances"
                onClick={handleSyncPatterns}
              />
            )}
            {!isPattern && (
              <ToolbarButton
                icon="open_in_new"
                label="Launch prototype"
                onClick={handleExpandPreview}
              />
            )}
          </Toolbar>
          <Stack direction="row" align="center" gap="sm">
            <PagePresence pageId={exampleId} />
            {!isPattern && versions.length > 1 && (
              <div className="a1-web-version-switcher">
                <SelectField
                  size="compact"
                  aria-label="Active version"
                  value={activeVersionId}
                  onChange={(e) => handleSwitchVersion((e.target as HTMLSelectElement).value)}
                >
                  {versions.map((v) => (
                    <option key={v.id} value={v.id}>{v.label}</option>
                  ))}
                </SelectField>
              </div>
            )}
          </Stack>
        </Stack>
      </Section>

      <Section padding="none" className="a1-web-canvas-scope">
        {view === 'edit' && (layoutChrome?.before
          ? <RenderPageDefinition definition={layoutChrome.before} onNavigate={(id) => onNavigateToPage?.(id)} />
          : generatedHeader)}
        {view === 'edit' && (
          parsedDefinition.ok ? (
            <>
              <RenderPageDefinition
                definition={parsedDefinition.value}
                enforceLocks={!isPattern}
                activePatternRootId={activePatternRootId}
                selectedNodeId={selectedNodeId}
                onNodeSelect={onSelectNode}
                onContentChange={handleContentChange}
                onItemTextChange={handleItemTextChange}
                activeItem={activeItem}
                onItemSelect={handleItemSelect}
                onNodeDelete={handleNodeDelete}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onUngroup={handleUngroup}
                onDuplicateNode={handleDuplicateNode}
                onGroupAsStack={handleGroupAsStack}
                onConvertNode={handleConvertNode}
                onCopyPattern={handleCopyPattern}
                onPastePattern={handlePastePattern}
                getNodeProps={getNodeProps}
                getNodeInfo={getNodeInfoFn}
                onRequestAddChild={handleRequestAddChild}
                onCatalogDrop={(type, targetId, pos) => handleCatalogDrop(type, targetId, pos)}
                onDetachPattern={handleDetachPattern}
                onCreatePattern={handleCreatePatternFromNode}
              />
              <div
                className="a1-web-canvas-floor"
                onDragOver={(e) => {
                  if (e.dataTransfer.types.includes('a1-catalog-type')) {
                    e.preventDefault();
                    e.currentTarget.setAttribute('data-active', 'true');
                  }
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    e.currentTarget.removeAttribute('data-active');
                  }
                }}
                onDrop={(e) => {
                  const catalogType = e.dataTransfer.getData('a1-catalog-type');
                  if (!catalogType) return;
                  e.preventDefault();
                  e.currentTarget.removeAttribute('data-active');
                  handleCatalogDrop(catalogType, null, 'after');
                }}
              />
              {layoutChrome?.after && (
                <RenderPageDefinition definition={layoutChrome.after} onNavigate={(id) => onNavigateToPage?.(id)} />
              )}
            </>
          ) : parseError
        )}

        {view === 'preview' && (
          parsedDefinition.ok ? (
            <ResponsivePreviewFrame {...(viewportSize(previewViewport) ?? {})}>
              {composedPreviewDef
                ? <RenderPageDefinition definition={composedPreviewDef} onNavigate={(id) => onNavigateToPage?.(id)} />
                : <>{generatedHeader}<RenderPageDefinition definition={parsedDefinition.value} /></>}
            </ResponsivePreviewFrame>
          ) : parseError
        )}

        {view === 'json' && (
          <Stack direction="column" gap="sm">
            {codeFormat === 'json' ? (
              <>
                <Paragraph size="sm" color="muted">
                  Edit the JSON below — the live preview updates on every change.
                  Component <Code variant="inline">type</Code> names must match A1
                  React export names exactly.
                </Paragraph>
                <Code variant="block" editable wrapping copyCode onChangeValue={handleCodeChange}>
                  {history.workingJson}
                </Code>
              </>
            ) : (
              <>
                <Paragraph size="sm" color="muted">
                  Read-only React (JSX) generated from the page definition. Edit via the JSON tab or the canvas.
                </Paragraph>
                <Code variant="block" wrapping copyCode collapsible collapsedLines={24}>
                  {reactCode}
                </Code>
              </>
            )}
          </Stack>
        )}
      </Section>

      {asidePanel}

      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        actionLabel="Undo"
        onAction={() => { history.undo(); setSnackbarOpen(false); }}
      >
        {deletedLabel} deleted
      </Snackbar>

      <Snackbar open={!!notice} onClose={() => setNotice('')}>
        {notice}
      </Snackbar>

      <EditorShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </>
  );
}
