/**
 * EditorSelectionBoundary — wraps a single A1 component node in editor mode.
 *
 * Responsibilities:
 * - Injects `data-editor-node` + `data-editor-type` data attributes onto the
 *   node's root element (via cloneElement) so CSS can apply the hover/selected
 *   outline without introducing any wrapper DOM element.
 * - Left click: selects the innermost (directly-clicked) editor node.
 * - Right click: shows the A1 ContextMenu with element-selection and delete actions.
 * - Drag-over from Add panel: shows before/into/after drop indicator, calls onCatalogDrop on drop.
 *
 * Visual states (driven by CSS in styles.css):
 * - [data-editor-node]:hover           → dashed accent-color outline
 * - [data-editor-hover='true']         → dashed accent-color outline (from tree hover)
 * - [data-editor-selected='true']      → solid action-color outline
 * - [data-drop-position='before']      → 3px accent line at top (catalog drag)
 * - [data-drop-position='after']       → 3px accent line at bottom (catalog drag)
 * - [data-drop-position='into']        → 2px accent ring inset (catalog drag)
 */
import React, { useState } from 'react';
import { ContextMenu } from '@gtivr4/a1-design-system-react';
import { ALT, DEL, isMac, MOD, SHIFT } from './shortcuts.ts';
import { CONVERSION_MAP, getConvertedProps } from './conversionMap.ts';

// Mirrors ContextMenuEntry from the A1 package — inlined to avoid a type-only
// re-export that isn't available from the package's index.js entry point.
type ContextMenuEntry =
  | { type?: 'item'; id: string; label: string; icon?: string; shortcut?: string; variant?: 'default' | 'destructive'; active?: boolean; disabled?: boolean; onClick?: () => void }
  | { type: 'divider'; id: string }
  | { type: 'group'; id: string; label: string };

// ── Node info ─────────────────────────────────────────────────────────────────

interface EditorNodeInfo {
  id: string;
  type: string;
}

interface PatternInstanceRef {
  id: string;
  name: string;
  nodeId?: string;
}

const TYPE_ICONS: Record<string, string> = {
  PageLayout: 'web',
  Section:    'crop_free',
  Stack:      'view_agenda',
  Heading:    'title',
  Paragraph:  'notes',
  Button:     'smart_button',
  Card:       'article',
};

// ── Main component ────────────────────────────────────────────────────────────

interface EditorSelectionBoundaryProps {
  nodeId: string;
  nodeType: string;
  isSelected: boolean;
  isLocked?: boolean;
  patternOutline?: boolean;
  patternInstance?: PatternInstanceRef;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onUngroup: (id: string) => void;
  onDuplicateNode?: (nodeId: string) => void;
  onGroupAsStack?: (nodeId: string) => void;
  onConvertNode?: (nodeId: string, newType: string, newProps: Record<string, unknown>) => void;
  onCopyPattern?: (nodeId: string) => void;
  onPastePattern?: (nodeId: string) => void;
  onChooseTextLabel?: (nodeId: string) => void;
  getNodeProps?: (nodeId: string) => Record<string, unknown> | undefined;
  getNodeInfo: (id: string) => { isFirst: boolean; isLast: boolean; hasChildren: boolean };
  isContainer?: boolean;
  onCatalogDrop?: (catalogType: string, position: 'before' | 'into' | 'after') => void;
  onDetachPattern?: (nodeId: string) => void;
  onCreatePattern?: (nodeId: string) => void;
  children: React.ReactElement;
}

export function EditorSelectionBoundary({
  nodeId,
  nodeType,
  isSelected,
  isLocked,
  patternOutline,
  patternInstance,
  selectedId,
  onSelect,
  onDelete,
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
  isContainer,
  onCatalogDrop,
  onDetachPattern,
  onCreatePattern,
  children,
}: EditorSelectionBoundaryProps) {
  const [contextMenu, setContextMenu] = useState<{
    nodes: EditorNodeInfo[];
    position: { x: number; y: number };
    pattern: PatternInstanceRef | null;
  } | null>(null);

  // Left click — always selects the innermost (directly-clicked) editor node.
  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();

    const path = e.nativeEvent.composedPath() as EventTarget[];

    // In edit view a click only selects — it must never trigger the component's
    // real action. Suppress navigation for any anchor in the path (e.g. a Button
    // or Link connected to another page) so editing the node stays on the canvas.
    const hasAnchor = path.some((el) => el instanceof HTMLElement && el.tagName === 'A');
    if (hasAnchor) e.preventDefault();

    const editorEls = path.filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement && typeof el.dataset.editorNode === 'string',
    );

    if (editorEls.length === 0) return;

    // If the click landed inside an editable text region (an InlineEditable's
    // contentEditable, or a field input/textarea), just select the node — never
    // toggle it off — so clicking or double-clicking text to edit doesn't drop
    // the selection out from under you.
    const inEditable = path.some(
      (el) =>
        el instanceof HTMLElement &&
        (el.isContentEditable || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'),
    );
    const targetId = editorEls[0].dataset.editorNode!;
    onSelect(inEditable ? targetId : isSelected ? null : targetId);
  }

  // Right click — shows the context menu with select + delete actions.
  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const editorEls = (e.nativeEvent.composedPath() as EventTarget[]).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement && typeof el.dataset.editorNode === 'string',
    );

    if (editorEls.length === 0) return;

    // Nearest pattern-instance ancestor in the path (so right-clicking inside an
    // instance still offers "Edit pattern").
    const patternEl = (e.nativeEvent.composedPath() as EventTarget[]).find(
      (el): el is HTMLElement => el instanceof HTMLElement && typeof el.dataset.editorPatternId === 'string',
    );
    const pattern = patternEl
      ? { id: patternEl.dataset.editorPatternId!, name: patternEl.dataset.editorPatternName ?? 'pattern', nodeId: patternEl.dataset.editorNode }
      : null;

    setContextMenu({
      nodes: editorEls.map((el) => ({
        id: el.dataset.editorNode!,
        type: el.dataset.editorType ?? 'Component',
      })),
      position: { x: e.clientX, y: e.clientY },
      pattern,
    });
  }

  // Build the ContextMenu items from the nodes in the right-click path.
  function buildMenuItems(nodes: EditorNodeInfo[], pattern: PatternInstanceRef | null): ContextMenuEntry[] {
    const target = nodes[0]; // innermost element
    const info = getNodeInfo(target.id);
    const items: ContextMenuEntry[] = [];

    if (pattern) {
      items.push({
        id: 'edit-pattern',
        label: 'Edit pattern',
        icon: 'edit',
        onClick: () => { window.location.href = `/editor?pattern=${pattern.id}`; },
      });
      if (onDetachPattern && pattern.nodeId) {
        const rootId = pattern.nodeId;
        items.push({
          id: 'detach-pattern',
          label: 'Detach pattern',
          icon: 'link_off',
          onClick: () => onDetachPattern(rootId),
        });
      }
      items.push({ type: 'divider', id: 'divider-edit-pattern' });
    }

    if (nodes.length > 1) {
      items.push({ type: 'group', id: 'group-heading', label: 'Edit element' });
      nodes.forEach((node) => {
        items.push({
          id: `select-${node.id}`,
          label: node.type,
          icon: TYPE_ICONS[node.type] ?? 'widgets',
          active: node.id === selectedId,
          onClick: () => onSelect(node.id),
        });
      });
      items.push({ type: 'divider', id: 'divider-select' });
    }

    if (onChooseTextLabel && (target.type === 'Heading' || target.type === 'Paragraph' || target.type === 'Button')) {
      items.push({
        id: 'choose-text-label',
        label: 'Choose text label',
        icon: 'manage_search',
        onClick: () => onChooseTextLabel(target.id),
      });
      items.push({ type: 'divider', id: 'divider-label' });
    }

    items.push({
      id: 'move-up',
      label: 'Move up',
      icon: 'arrow_upward',
      shortcut: `${ALT}↑`,
      disabled: info.isFirst,
      onClick: () => onMoveUp(target.id),
    });
    items.push({
      id: 'move-down',
      label: 'Move down',
      icon: 'arrow_downward',
      shortcut: `${ALT}↓`,
      disabled: info.isLast,
      onClick: () => onMoveDown(target.id),
    });

    if (info.hasChildren) {
      items.push({
        id: 'ungroup',
        label: 'Ungroup',
        icon: 'ungroup',
        shortcut: `${MOD}${SHIFT}G`,
        onClick: () => onUngroup(target.id),
      });
    }

    if (onDuplicateNode) {
      items.push({
        id: 'duplicate',
        label: 'Duplicate',
        icon: 'content_copy',
        shortcut: `${MOD}D`,
        onClick: () => onDuplicateNode(target.id),
      });
    }

    if (onGroupAsStack && target.type !== 'Stack') {
      items.push({
        id: 'group-as-stack',
        label: 'Group as Stack',
        icon: 'view_agenda',
        shortcut: `${MOD}G`,
        onClick: () => onGroupAsStack(target.id),
      });
    }

    if (onCreatePattern) {
      items.push({ type: 'divider', id: 'divider-create-pattern' });
      items.push({
        id: 'create-pattern',
        label: 'Create pattern from selection',
        icon: 'dashboard_customize',
        onClick: () => onCreatePattern(target.id),
      });
    }

    if (onCopyPattern || onPastePattern) {
      items.push({ type: 'divider', id: 'divider-pattern' });
      if (onCopyPattern) {
        items.push({
          id: 'copy-pattern',
          label: 'Copy properties',
          icon: 'colorize',
          shortcut: isMac ? '⌘⌥C' : 'Ctrl+Alt+C',
          onClick: () => onCopyPattern(target.id),
        });
      }
      if (onPastePattern) {
        items.push({
          id: 'paste-pattern',
          label: 'Paste properties',
          icon: 'format_paint',
          shortcut: isMac ? '⌘⌥V' : 'Ctrl+Alt+V',
          onClick: () => onPastePattern(target.id),
        });
      }
    }

    const conversionTargets = onConvertNode ? (CONVERSION_MAP[target.type] ?? []) : [];
    if (conversionTargets.length > 0) {
      items.push({ type: 'divider', id: 'divider-convert' });
      items.push({ type: 'group', id: 'group-convert', label: 'Convert to' });
      const nodeProps = getNodeProps?.(target.id);
      conversionTargets.forEach((toType) => {
        items.push({
          id: `convert-${toType}`,
          label: toType,
          icon: TYPE_ICONS[toType] ?? 'autorenew',
          onClick: () => {
            onConvertNode!(target.id, toType, getConvertedProps(target.type, toType, nodeProps));
          },
        });
      });
    }

    items.push({ type: 'divider', id: 'divider-delete' });
    items.push({
      id: 'delete',
      label: `Delete ${target.type}`,
      icon: 'delete',
      shortcut: isMac ? '⌫' : DEL,
      variant: 'destructive',
      onClick: () => onDelete(target.id),
    });

    return items;
  }

  // ── Catalog drag-and-drop ──────────────────────────────────────────────────

  const dragHandlers = onCatalogDrop ? {
    onDragOver: (e: React.DragEvent) => {
      if (!e.dataTransfer.types.includes('a1-catalog-type')) return;
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const pct = (e.clientY - rect.top) / rect.height;
      el.dataset.dropPosition = isContainer && pct > 0.25 && pct < 0.75 ? 'into' : pct < 0.5 ? 'before' : 'after';
    },
    onDragLeave: (e: React.DragEvent) => {
      const el = e.currentTarget as HTMLElement;
      if (!el.contains(e.relatedTarget as Node)) delete el.dataset.dropPosition;
    },
    onDrop: (e: React.DragEvent) => {
      const catalogType = e.dataTransfer.getData('a1-catalog-type');
      if (!catalogType) return;
      e.preventDefault();
      e.stopPropagation();
      const el = e.currentTarget as HTMLElement;
      const pos = (el.dataset.dropPosition as 'before' | 'into' | 'after') ?? 'after';
      delete el.dataset.dropPosition;
      onCatalogDrop(catalogType, pos);
    },
  } : {};

  // Inject selection attributes + event handlers onto the child without adding
  // any wrapper DOM element — keeps layout completely unaffected.
  const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>;
  const cloned = React.cloneElement(child, {
    onClick: handleClick,
    onContextMenu: handleContextMenu,
    'data-editor-node': nodeId,
    'data-editor-type': nodeType,
    ...(isSelected ? { 'data-editor-selected': 'true' } : {}),
    ...(isLocked ? { 'data-editor-locked': 'true' } : {}),
    ...(patternOutline ? { 'data-editor-pattern': 'true' } : {}),
    ...(patternInstance ? { 'data-editor-pattern-id': patternInstance.id, 'data-editor-pattern-name': patternInstance.name } : {}),
    ...dragHandlers,
  });

  return (
    <>
      {cloned}
      <ContextMenu
        open={!!contextMenu}
        x={contextMenu?.position.x ?? 0}
        y={contextMenu?.position.y ?? 0}
        items={contextMenu ? buildMenuItems(contextMenu.nodes, contextMenu.pattern) : []}
        onClose={() => setContextMenu(null)}
        aria-label="Element actions"
      />
    </>
  );
}
