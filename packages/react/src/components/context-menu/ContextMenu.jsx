import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';
import { Icon } from '../icon/Icon.jsx';
import './context-menu.css';

const FOCUSABLE = 'button:not([disabled]):not([aria-disabled="true"])';

// ── ContextMenu ───────────────────────────────────────────────────────────────

/**
 * Controlled context menu portaled to document.body.
 *
 * Usage:
 *   const [menu, setMenu] = useState(null);
 *   <div onContextMenu={e => { e.preventDefault(); setMenu({ x: e.clientX, y: e.clientY }); }}>
 *     <ContextMenu open={!!menu} x={menu?.x ?? 0} y={menu?.y ?? 0}
 *       items={[...]} onClose={() => setMenu(null)} />
 *   </div>
 */
export function ContextMenu({
  open = false,
  x = 0,
  y = 0,
  items = [],
  onClose,
  'aria-label': ariaLabel = 'Context menu',
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;

    // Focus the first item when the menu opens
    requestAnimationFrame(() => {
      ref.current?.querySelector(FOCUSABLE)?.focus();
    });

    function handleMouseDown(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose?.();
    }

    function handleKeyDown(e) {
      if (!ref.current) return;
      const focusable = Array.from(ref.current.querySelectorAll(FOCUSABLE));
      const current = focusable.indexOf(document.activeElement);

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose?.();
          break;
        case 'ArrowDown': {
          e.preventDefault();
          const next = current < focusable.length - 1 ? current + 1 : 0;
          focusable[next]?.focus();
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prev = current > 0 ? current - 1 : focusable.length - 1;
          focusable[prev]?.focus();
          break;
        }
        case 'Home':
          e.preventDefault();
          focusable[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          focusable[focusable.length - 1]?.focus();
          break;
      }
    }

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  // Clamp to viewport edges (16px safe margin)
  const margin = 16;
  const menuWidth = 240;
  const menuHeight = items.length * 36 + 32;
  const adjustedX = Math.min(x, window.innerWidth - menuWidth - margin);
  const adjustedY = Math.min(y + 4, window.innerHeight - menuHeight - margin);

  return createPortal(
    <div
      ref={ref}
      className="a1-context-menu"
      style={{ left: Math.max(margin, adjustedX), top: Math.max(margin, adjustedY) }}
      role="menu"
      aria-label={ariaLabel}
    >
      {items.map((entry) => {
        if (entry.type === 'divider') {
          return <hr key={entry.id} className="a1-context-menu__divider" aria-hidden="true" />;
        }

        if (entry.type === 'group') {
          return (
            <span key={entry.id} className="a1-context-menu__heading" role="presentation">
              {entry.label}
            </span>
          );
        }

        // Default: 'item'
        const isDestructive = entry.variant === 'destructive';
        const isActive = !!entry.active;

        return (
          <button
            key={entry.id}
            type="button"
            role="menuitem"
            className={[
              'a1-context-menu__item',
              isDestructive && 'a1-context-menu__item--destructive',
              isActive && 'a1-context-menu__item--active',
            ].filter(Boolean).join(' ')}
            disabled={entry.disabled}
            onClick={() => {
              entry.onClick?.();
              onClose?.();
            }}
          >
            {entry.icon && (
              <Icon name={entry.icon} className="a1-context-menu__icon" aria-hidden="true" />
            )}
            <span className="a1-context-menu__item-label">{entry.label}</span>
            {entry.shortcut && (
              <kbd className="a1-context-menu__kbd">{entry.shortcut}</kbd>
            )}
          </button>
        );
      })}
    </div>,
    document.body,
  );
}
