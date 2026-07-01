import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Icon } from '../icon/Icon.jsx';
import './tree-menu.css';

// ── Context ───────────────────────────────────────────────────────────────────

const TreeCtx = createContext({
  selectedId: null,
  rovingId: null,
  onSelect: () => {},
  expandedIds: new Set(),
  onToggle: () => {},
  onRoving: () => {},
  onHoverChange: () => {},
  onItemContextMenu: () => {},
  nodeRefs: { current: new Map() },
  items: [],
  isDraggable: false,
  dragState: null,
  forbiddenIds: new Set(),
  onDragStart: () => {},
  onDragOver: () => {},
  onDragLeave: () => {},
  onDrop: () => {},
  onDragEnd: () => {},
  editingId: null,
  onRenameStart: () => {},
  onRenameCommit: () => {},
  onRenameCancel: () => {},
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function getVisibleFlat(items, expandedIds, result = []) {
  for (const item of items) {
    result.push(item);
    if (item.children?.length && expandedIds.has(item.id)) {
      getVisibleFlat(item.children, expandedIds, result);
    }
  }
  return result;
}

function findParent(items, targetId, parent = null) {
  for (const item of items) {
    if (item.id === targetId) return parent;
    if (item.children?.length) {
      const found = findParent(item.children, targetId, item);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

function getAllBranchIds(items, result = []) {
  for (const item of items) {
    if (item.children?.length) {
      result.push(item.id);
      getAllBranchIds(item.children, result);
    }
  }
  return result;
}

function collectAllIds(items, result = []) {
  for (const item of items) {
    result.push(item.id);
    if (item.children?.length) collectAllIds(item.children, result);
  }
  return result;
}

// Returns all descendant IDs of the item with targetId (not including itself).
function getDescendantIds(items, targetId, result = []) {
  for (const item of items) {
    if (item.id === targetId) {
      collectAllIds(item.children ?? [], result);
      return result;
    }
    if (item.children?.length) {
      getDescendantIds(item.children, targetId, result);
    }
  }
  return result;
}

// ── Inline rename input ───────────────────────────────────────────────────────
// Replaces the label while an item is being renamed. Enter commits, Escape
// cancels, blur commits — mirroring the rest of the editor's inline renames.

function RenameInput({ defaultValue, onCommit, onCancel }) {
  const [value, setValue] = useState(defaultValue);
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  function commit() {
    const trimmed = value.trim();
    onCommit(trimmed || defaultValue);
  }

  function handleKeyDown(e) {
    // Don't let the tree's roving-tabindex / arrow navigation steal the keys.
    e.stopPropagation();
    if (e.key === 'Enter') { e.preventDefault(); commit(); }
    if (e.key === 'Escape') { e.preventDefault(); onCancel(); }
  }

  return (
    <input
      ref={ref}
      className="a1-tree-menu__rename-input"
      value={value}
      aria-label="Rename item"
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      onClick={(e) => e.stopPropagation()}
    />
  );
}

// ── TreeItem ──────────────────────────────────────────────────────────────────

function TreeItem({ item, depth }) {
  const {
    selectedId, rovingId, onSelect, expandedIds, onToggle, onRoving, onHoverChange, onItemContextMenu, nodeRefs,
    isDraggable, dragState, forbiddenIds,
    onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd,
    editingId, onRenameStart, onRenameCommit, onRenameCancel,
  } = useContext(TreeCtx);
  const uid = useId();
  const groupId = `${uid}-group`;
  const onToggleRef = useRef(onToggle);
  onToggleRef.current = onToggle;

  const isBranch = Array.isArray(item.children);
  const hasChildren = !!item.children?.length;
  const isExpanded = expandedIds.has(item.id);
  const isSelected = item.id === selectedId;
  const isRoving = item.id === rovingId;
  const isEditing = item.id === editingId;
  const isForbidden = forbiddenIds.has(item.id);
  const isDragging = dragState?.draggingId === item.id;
  const isOver = !isForbidden && dragState?.overId === item.id;
  const dropPosition = isOver ? dragState.position : null;

  const Component = item.href ? 'a' : 'button';
  const extraProps = item.href
    ? { href: item.disabled ? undefined : item.href, draggable: false }
    : { type: 'button', disabled: item.disabled };

  // Auto-expand collapsed branches when the user holds a drag over them for 600 ms.
  useEffect(() => {
    if (isOver && dropPosition === 'into' && hasChildren && !isExpanded) {
      const timer = setTimeout(() => onToggleRef.current(item.id), 600);
      return () => clearTimeout(timer);
    }
  }, [isOver, dropPosition, hasChildren, isExpanded, item.id]);

  function handleToggle(e) {
    e.stopPropagation();
    onToggle(item.id);
    // Return focus to the label button so roving tabindex stays coherent.
    nodeRefs.current.get(item.id)?.focus();
  }

  function handleSelect(e) {
    if (item.disabled) return;
    e.stopPropagation();
    onSelect(item.id);
    onRoving(item.id);
  }

  function handleFocus() {
    onRoving(item.id);
  }

  // Double-click on the label requests an inline rename (the consumer enters
  // edit mode by setting `editingId`). F2 offers the same from the keyboard.
  function handleDoubleClick(e) {
    if (item.disabled) return;
    e.preventDefault();
    e.stopPropagation();
    onRenameStart(item.id);
  }

  // ── Drag handlers ──────────────────────────────────────────────────────────

  function handleDragStart(e) {
    if (!isDraggable || item.disabled) return;
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
    onDragStart(item.id);
  }

  function handleDragOver(e) {
    if (!dragState || isForbidden) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientY - rect.top) / rect.height;
    let position;
    if (ratio < 0.3) {
      position = 'before';
    } else if (ratio > 0.7) {
      position = 'after';
    } else {
      // Middle zone: reparent if the target is a branch (children array present, even empty), otherwise split evenly.
      position = isBranch ? 'into' : (ratio < 0.5 ? 'before' : 'after');
    }
    onDragOver(item.id, position);
  }

  function handleDragLeave(e) {
    // Only fire when the drag actually leaves this element (not just moving to a child).
    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
      onDragLeave(item.id);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isForbidden) onDrop(item.id);
  }

  function handleDragEnd(e) {
    e.stopPropagation();
    onDragEnd();
  }

  return (
    <li
      role="treeitem"
      aria-selected={isSelected}
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-disabled={item.disabled || undefined}
    >
      <div
        className={[
          'a1-tree-menu__row',
          isSelected && 'a1-tree-menu__row--selected',
          item.disabled && 'a1-tree-menu__row--disabled',
          isDragging && 'a1-tree-menu__row--dragging',
          isOver && dropPosition === 'before' && 'a1-tree-menu__row--drop-before',
          isOver && dropPosition === 'into'   && 'a1-tree-menu__row--drop-into',
          isOver && dropPosition === 'after'  && 'a1-tree-menu__row--drop-after',
        ].filter(Boolean).join(' ')}
        style={{ '--a1-tree-depth': depth }}
        draggable={isDraggable && !item.disabled && !isEditing}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      >
        {/* Expand/collapse — mouse only. Keyboard uses Arrow Right/Left. */}
        {hasChildren ? (
          <button
            type="button"
            className="a1-tree-menu__toggle"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleToggle}
          >
            <Icon name={isExpanded ? 'indeterminate_check_box' : 'add_box'} />
          </button>
        ) : (
          <span className="a1-tree-menu__toggle-spacer" aria-hidden="true" />
        )}

        {/* Editing: an inline input replaces the select trigger so we never
            nest an input inside the label <button> (invalid + click-stealing). */}
        {isEditing ? (
          <div className="a1-tree-menu__label-btn a1-tree-menu__label-btn--editing">
            {item.icon && (
              <Icon name={item.icon} className="a1-tree-menu__icon" aria-hidden="true" />
            )}
            <RenameInput
              defaultValue={item.label}
              onCommit={(label) => onRenameCommit(item.id, label)}
              onCancel={onRenameCancel}
            />
          </div>
        ) : (
          /* Select trigger */
          <Component
            data-tree-id={item.id}
            className={[
              'a1-tree-menu__label-btn',
              item.disabled && 'a1-tree-menu__label-btn--disabled',
            ].filter(Boolean).join(' ')}
            tabIndex={isRoving ? 0 : -1}
            ref={(el) => {
              if (el) nodeRefs.current.set(item.id, el);
              else nodeRefs.current.delete(item.id);
            }}
            onClick={handleSelect}
            onDoubleClick={handleDoubleClick}
            onFocus={handleFocus}
            onMouseEnter={() => !item.disabled && onHoverChange(item.id)}
            onMouseLeave={() => onHoverChange(null)}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onItemContextMenu(item.id, e); }}
            {...extraProps}
          >
            {item.icon && (
              <Icon name={item.icon} className="a1-tree-menu__icon" aria-hidden="true" />
            )}
            <span className="a1-tree-menu__label">{item.label}</span>
          </Component>
        )}
      </div>

      {hasChildren && (
        <div
          className={[
            'a1-tree-menu__group-wrapper',
            isExpanded && 'a1-tree-menu__group-wrapper--open',
          ].filter(Boolean).join(' ')}
        >
          <div className="a1-tree-menu__group-inner">
            <ul id={groupId} role="group" className="a1-tree-menu__group">
              {item.children.map((child) => (
                <TreeItem key={child.id} item={child} depth={depth + 1} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}

// ── TreeMenu ──────────────────────────────────────────────────────────────────

export function TreeMenu({
  items = [],
  selectedId = null,
  onSelect,
  defaultExpandedIds = [],
  expandedIds: controlledExpandedIds,
  onExpandedChange,
  showExpandControls = false,
  onHoverChange,
  onItemContextMenu,
  draggable = false,
  onMove,
  editingId = null,
  onRenameStart,
  onRenameCommit,
  onRenameCancel,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  className = '',
}) {
  const isControlled = controlledExpandedIds !== undefined;

  const [uncontrolledExpandedIds, setUncontrolledExpandedIds] = useState(
    () => new Set(defaultExpandedIds)
  );
  const expandedIds = isControlled
    ? new Set(controlledExpandedIds)
    : uncontrolledExpandedIds;

  const [rovingId, setRovingId] = useState(
    () => selectedId ?? items[0]?.id ?? null
  );

  const [dragState, setDragState] = useState(null);

  const nodeRefs = useRef(new Map());

  const setExpanded = useCallback((next) => {
    if (!isControlled) setUncontrolledExpandedIds(next);
    onExpandedChange?.(Array.from(next));
  }, [isControlled, onExpandedChange]);

  const onToggle = useCallback((id) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  }, [expandedIds, setExpanded]);

  // IDs that cannot receive a drop: the dragged item itself and all its descendants.
  const forbiddenIds = useMemo(() => {
    if (!dragState?.draggingId) return new Set();
    const ids = getDescendantIds(items, dragState.draggingId);
    ids.push(dragState.draggingId);
    return new Set(ids);
  }, [items, dragState?.draggingId]);

  // ── Drag callbacks ────────────────────────────────────────────────────────

  const handleDragStart = useCallback((id) => {
    setDragState({ draggingId: id, overId: null, position: 'after' });
  }, []);

  const handleDragOver = useCallback((id, position) => {
    setDragState((prev) => {
      if (!prev) return prev;
      if (prev.overId === id && prev.position === position) return prev;
      return { ...prev, overId: id, position };
    });
  }, []);

  const handleDragLeave = useCallback((id) => {
    setDragState((prev) => {
      if (!prev || prev.overId !== id) return prev;
      return { ...prev, overId: null };
    });
  }, []);

  const handleDrop = useCallback((targetId) => {
    setDragState((prev) => {
      if (!prev) return null;
      onMove?.({ draggedId: prev.draggingId, targetId, position: prev.position ?? 'after' });
      return null;
    });
  }, [onMove]);

  const handleDragEnd = useCallback(() => {
    setDragState(null);
  }, []);

  // ── Expand controls ───────────────────────────────────────────────────────

  function handleExpandAll() {
    setExpanded(new Set(getAllBranchIds(items)));
  }

  function handleCollapseAll() {
    setExpanded(new Set());
  }

  // ── Keyboard navigation ───────────────────────────────────────────────────

  function focusNode(id) {
    setRovingId(id);
    requestAnimationFrame(() => nodeRefs.current.get(id)?.focus());
  }

  function handleKeyDown(e) {
    const visible = getVisibleFlat(items, expandedIds);
    const currentId = e.target.closest('[data-tree-id]')?.dataset?.treeId;
    const currentIndex = currentId ? visible.findIndex((v) => v.id === currentId) : -1;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const next = visible[currentIndex + 1];
        if (next) focusNode(next.id);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prev = visible[currentIndex - 1];
        if (prev) focusNode(prev.id);
        break;
      }
      case 'ArrowRight': {
        e.preventDefault();
        if (currentIndex >= 0) {
          const cur = visible[currentIndex];
          if (cur.children?.length) {
            if (!expandedIds.has(cur.id)) {
              onToggle(cur.id);
            } else {
              const first = cur.children[0];
              if (first) focusNode(first.id);
            }
          }
        }
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        if (currentIndex >= 0) {
          const cur = visible[currentIndex];
          if (cur.children?.length && expandedIds.has(cur.id)) {
            onToggle(cur.id);
          } else {
            const parent = findParent(items, cur.id);
            if (parent) focusNode(parent.id);
          }
        }
        break;
      }
      case 'Home': {
        e.preventDefault();
        const first = visible[0];
        if (first) focusNode(first.id);
        break;
      }
      case 'End': {
        e.preventDefault();
        const last = visible[visible.length - 1];
        if (last) focusNode(last.id);
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (currentIndex >= 0) {
          const cur = visible[currentIndex];
          if (!cur.disabled) onSelect?.(cur.id);
        }
        break;
      }
      case 'F2': {
        // Keyboard counterpart of double-click-to-rename.
        e.preventDefault();
        if (currentIndex >= 0) {
          const cur = visible[currentIndex];
          if (!cur.disabled) onRenameStart?.(cur.id);
        }
        break;
      }
    }
  }

  const tree = (
    <TreeCtx.Provider
      value={{
        selectedId,
        rovingId: rovingId ?? items[0]?.id ?? null,
        onSelect: onSelect ?? (() => {}),
        expandedIds,
        onToggle,
        onRoving: setRovingId,
        onHoverChange: onHoverChange ?? (() => {}),
        onItemContextMenu: onItemContextMenu ?? (() => {}),
        nodeRefs,
        items,
        isDraggable: draggable,
        dragState,
        forbiddenIds,
        onDragStart: handleDragStart,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
        onDragEnd: handleDragEnd,
        editingId,
        onRenameStart: onRenameStart ?? (() => {}),
        onRenameCommit: onRenameCommit ?? (() => {}),
        onRenameCancel: onRenameCancel ?? (() => {}),
      }}
    >
      <ul
        role="tree"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={['a1-tree-menu', className].filter(Boolean).join(' ')}
        onKeyDown={handleKeyDown}
      >
        {items.map((item) => (
          <TreeItem key={item.id} item={item} depth={0} />
        ))}
      </ul>
    </TreeCtx.Provider>
  );

  if (!showExpandControls) return tree;

  // One toggle: if anything is expanded, collapse everything; otherwise expand all.
  const anyExpanded = expandedIds.size > 0;

  return (
    <div className="a1-tree-menu-root">
      <div className="a1-tree-menu__controls">
        <button
          type="button"
          className="a1-tree-menu__control-btn"
          aria-expanded={anyExpanded}
          onClick={anyExpanded ? handleCollapseAll : handleExpandAll}
        >
          <Icon name={anyExpanded ? 'unfold_less' : 'unfold_more'} />
          {anyExpanded ? 'Collapse all' : 'Expand all'}
        </button>
      </div>
      {tree}
    </div>
  );
}
