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
  IconButton,
  MessageBadge,
  Paragraph,
  Section,
  SegmentedControl,
  SelectField,
  Snackbar,
  Stack,
} from '@gtivr4/a1-design-system-react';
import { RenderPageDefinition } from '../editor/pageRenderer';
import { EditorAsidePanel } from '../editor/EditorAsidePanel.jsx';
import { EditorShortcutsDialog } from '../editor/EditorShortcutsDialog.jsx';
import { useEditorHistory } from '../editor/useEditorHistory';
import { isMac } from '../editor/shortcuts.ts';
import { editorExamplePage } from '../editor/examples/editorExamplePage';
import { SHOWCASE_VERSIONS } from '../editor/examples/editorExampleVersions';
import { type EditorVersion, versionUid } from '../editor/editorVersions';
import { EDITOR_PREVIEW_SESSION_KEY, EDITOR_PREVIEW_PAGES_MAP_KEY, EDITOR_PREVIEW_CURRENT_KEY } from './EditorPreviewPage';
import { readStored, writeStored } from '../editor/storage';
import type { CatalogEntry } from '../editor/componentCatalog';
import { COMPONENT_CATALOG, createNodeFromEntry } from '../editor/componentCatalog';
import type { ComponentNode, ComponentProps, ComponentType, PageDefinition } from '../editor/pageTypes';

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
  if (node.id === id) return { ...node, type: newType, props: newProps };
  if (!node.children) return node;
  return { ...node, children: node.children.map((c) => convertNodeType(c, id, newType, newProps)) };
}

function convertDefinitionNode(def: PageDefinition, nodeId: string, newType: ComponentType, newProps: ComponentProps): PageDefinition {
  return patchRegions(def, (node) => convertNodeType(node, nodeId, newType, newProps));
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
  pages = [],
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
  pages?: { id: string; label: string }[];
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
  pendingAction?: { type: 'delete' | 'ungroup' | 'duplicate' | 'group-as-stack'; nodeId: string } | null;
  onPendingActionDone?: () => void;
  pendingConvert?: { nodeId: string; newType: ComponentType; newProps: ComponentProps } | null;
  onPendingConvertDone?: () => void;
}) {
  const canonicalJson = useMemo(() => JSON.stringify(definition, null, 2), [definition]);

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

  // Use the active version's json as the history starting point.
  const history = useEditorHistory(activeVersion?.json ?? fallbackJson, HISTORY_KEY(exampleId));

  const [view, setView] = useState('edit');
  const [asideNode, setAsideNode] = useState<Element | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deletedLabel, setDeletedLabel] = useState('');
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

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
    setAsideNode(document.getElementById('a1-web-editor-aside-slot'));
  }, []);

  // Stable refs used by keyboard handler so we never need to re-register the listener.
  const historyRef = useRef(history);
  historyRef.current = history;

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
      return { ok: true, value: JSON.parse(history.workingJson) as PageDefinition };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Invalid JSON' };
    }
  }, [history.workingJson]);

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

  function handlePageMetadataChange(name: string, description: string) {
    if (!parsedDefinition.ok) return;
    const newJson = JSON.stringify(
      { ...parsedDefinition.value, page: { ...parsedDefinition.value.page, name, description: description || undefined } },
      null, 2,
    );
    history.setWorking(newJson);
    commitDebounced(newJson, 'Updated page settings');
  }

  function handleHistoryRename(entryId: string, label: string) {
    history.rename(entryId, label);
  }

  function handleContentChange(nodeId: string, newFallback: string) {
    if (!parsedDefinition.ok) return;
    const newJson = JSON.stringify(
      patchDefinitionContent(parsedDefinition.value, nodeId, newFallback),
      null, 2,
    );
    history.setWorking(newJson);
    commitDebounced(newJson, `Edited ${getNodeType(nodeId)} text`);
  }

  function handleNodePropsChange(nodeId: string, newProps: ComponentProps, newContentFallback?: string) {
    if (!parsedDefinition.ok) return;
    let patched = patchDefinitionProps(parsedDefinition.value, nodeId, newProps);
    if (newContentFallback !== undefined) {
      patched = patchDefinitionContent(patched, nodeId, newContentFallback);
    }
    const newJson = JSON.stringify(patched, null, 2);
    history.commit(newJson, `Updated ${getNodeType(nodeId)} properties`);
  }

  function handleNodeDelete(nodeId: string) {
    if (!parsedDefinition.ok) return;
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
    const fromType = getNodeType(nodeId);
    const newDef = convertDefinitionNode(parsedDefinition.value, nodeId, newType, newProps);
    history.commit(JSON.stringify(newDef, null, 2), `Converted ${fromType} to ${newType}`);
  }

  function handleDuplicateNode(nodeId: string) {
    if (!parsedDefinition.ok) return;
    const newDef = duplicateDefinitionNode(parsedDefinition.value, nodeId);
    history.commit(JSON.stringify(newDef, null, 2), `Duplicated ${getNodeType(nodeId)}`);
  }

  function handleGroupAsStack(nodeId: string) {
    if (!parsedDefinition.ok) return;
    const nodeType = getNodeType(nodeId);
    if (nodeType === 'Stack') return;
    const newDef = wrapDefinitionNodeInStack(parsedDefinition.value, nodeId);
    history.commit(JSON.stringify(newDef, null, 2), `Grouped ${nodeType} as Stack`);
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

  // Insert a catalog component dropped onto a canvas node at the given position.
  function handleCatalogDrop(catalogType: string, targetNodeId: string | null, position: 'before' | 'into' | 'after') {
    if (!parsedDefinition.ok) return;
    const entry = COMPONENT_CATALOG.flatMap((c) => c.entries).find((e) => e.type === catalogType);
    if (!entry) return;
    const newNode = createNodeFromEntry(entry);
    const regions = parsedDefinition.value.page.layout.regions;
    let newRegions;
    if (!targetNodeId) {
      newRegions = [{ ...regions[0], nodes: [...regions[0].nodes, newNode] }, ...regions.slice(1)];
    } else {
      newRegions = regions.map((r) => {
        const updated = insertInNodes(r.nodes, newNode, targetNodeId, position);
        return updated !== r.nodes ? { ...r, nodes: updated } : r;
      });
    }
    const newDef = {
      ...parsedDefinition.value,
      page: { ...parsedDefinition.value.page, layout: { ...parsedDefinition.value.page.layout, regions: newRegions } },
    };
    history.commit(JSON.stringify(newDef, null, 2), `Added ${entry.label}`);
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
  editorActionsRef.current.setShortcutsOpen    = setShortcutsOpen;

  function handleCodeChange(val: string) {
    history.setWorking(val);
    commitDebounced(val, 'Edited code');
  }

  function handleHistoryJump(i: number) {
    history.jump(i);
    onSelectNode?.(null);
  }

  function handleHistoryRestore(entryId: string) {
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
    // for — the current page.
    const url = `/?page=editor-preview&standalone&screen=${encodeURIComponent(exampleId)}`;
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

  const asidePanel = asideNode
    ? createPortal(
        <EditorAsidePanel
          selectedNodeId={selectedNodeId}
          definition={parsedDefinition.ok ? parsedDefinition.value : null}
          pages={pages}
          onNodePropsChange={handleNodePropsChange}
          onPageMetadataChange={handlePageMetadataChange}
          historyEntries={history.entries}
          historyIndex={history.index}
          onHistoryJump={handleHistoryJump}
          onHistoryRestore={handleHistoryRestore}
          onHistoryRename={handleHistoryRename}
          onConvertNode={handleConvertNode}
          onDuplicatePage={onDuplicatePage}
          onDeletePage={onDeletePage}
          addTarget={addTarget}
          onCancelAdd={onCancelAdd}
          onAddNode={handleAddNode}
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
      <Section padding="xs" surface="raised">
        <Stack direction="row" align="center" justify="between">
          <Stack direction="row" align="center" gap="sm">
            <SegmentedControl
              value={view}
              onChange={handleViewChange}
              aria-label="Editor view"
              options={[
                { value: 'edit', label: 'Edit', icon: 'edit' },
                { value: 'preview', label: 'Preview', icon: 'visibility' },
                { value: 'json', label: 'Code snippet', icon: 'data_object' },
              ]}
            />
            {versions.length > 1 && (
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
            {isDirty && (
              <MessageBadge status="info" size="sm" subtle icon={null}>
                Unsaved changes
              </MessageBadge>
            )}
          </Stack>
          <Stack direction="row" align="center" gap="xs">
            <IconButton
              icon="undo"
              label="Undo"
              disabled={!history.canUndo}
              onClick={history.undo}
            />
            <IconButton
              icon="redo"
              label="Redo"
              disabled={!history.canRedo}
              onClick={history.redo}
            />
            <IconButton
              icon="keyboard"
              label="Keyboard shortcuts"
              onClick={() => setShortcutsOpen(true)}
            />
            <IconButton icon="open_in_new" variant="tertiary" onClick={handleExpandPreview} label='Launch Prototype'>
              
            </IconButton>
          </Stack>
        </Stack>
      </Section>

      <Section padding="none">
        {view === 'edit' && (
          parsedDefinition.ok ? (
            <>
              <RenderPageDefinition
                definition={parsedDefinition.value}
                selectedNodeId={selectedNodeId}
                onNodeSelect={onSelectNode}
                onContentChange={handleContentChange}
                onNodeDelete={handleNodeDelete}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onUngroup={handleUngroup}
                onDuplicateNode={handleDuplicateNode}
                onGroupAsStack={handleGroupAsStack}
                onConvertNode={handleConvertNode}
                getNodeProps={getNodeProps}
                getNodeInfo={getNodeInfoFn}
                onRequestAddChild={handleRequestAddChild}
                onCatalogDrop={(type, targetId, pos) => handleCatalogDrop(type, targetId, pos)}
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
            </>
          ) : parseError
        )}

        {view === 'preview' && (
          parsedDefinition.ok ? (
            <RenderPageDefinition definition={parsedDefinition.value} />
          ) : parseError
        )}

        {view === 'json' && (
          <Stack direction="column" gap="sm">
            <Paragraph size="sm" color="muted">
              Edit the JSON below — the live preview updates on every change.
              Component <Code variant="inline">type</Code> names must match A1
              React export names exactly.
            </Paragraph>
            <Code variant="block" editable wrapping copyCode onChangeValue={handleCodeChange}>
              {history.workingJson}
            </Code>
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

      <EditorShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </>
  );
}
