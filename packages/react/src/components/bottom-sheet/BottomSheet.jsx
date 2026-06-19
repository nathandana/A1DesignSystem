import { useCallback, useId, useRef, useState } from "react";
import "./bottom-sheet.css";

const DEFAULT_DETENTS = [0.5, 0.92];

/**
 * BottomSheet — a fixed panel attached to the bottom of the viewport that
 * overlays content with no scrim (separation via shadow). A drag handle in the
 * header resizes it between detents: a collapsed state (header / first line of
 * the title only) and one or more expanded heights. Content scrolls internally;
 * there is no footer. Only rendered at xs and sm breakpoints. The component
 * reserves the collapsed footprint in flow (via an invisible spacer) so page
 * content can always be scrolled clear of the sheet.
 *
 * `detents` are expanded heights as fractions of the viewport height (0–1).
 * Snap indices: 0 = collapsed, then one per detent (controlled via `detent`).
 */
export function BottomSheet({
  title,
  detents = DEFAULT_DETENTS,
  detent,
  defaultDetent = 1,
  onDetentChange,
  children,
  className = "",
  "aria-label": ariaLabel,
  ...props
}) {
  const id = useId();
  const titleId = `${id}-title`;
  const contentId = `${id}-content`;
  const snapCount = detents.length + 1; // collapsed + each detent

  const isControlled = detent !== undefined;
  const [internalIndex, setInternalIndex] = useState(() =>
    Math.min(Math.max(defaultDetent, 0), snapCount - 1)
  );
  const index = isControlled ? Math.min(Math.max(detent, 0), snapCount - 1) : internalIndex;

  const [dragPx, setDragPx] = useState(null);
  const headerRef = useRef(null);
  const sheetRef = useRef(null);
  const dragRef = useRef(null);

  const commit = useCallback((next) => {
    const clamped = Math.min(Math.max(next, 0), snapCount - 1);
    if (!isControlled) setInternalIndex(clamped);
    onDetentChange?.(clamped);
  }, [isControlled, onDetentChange, snapCount]);

  function collapsedPx() { return headerRef.current?.offsetHeight ?? 56; }
  function snapPixels() {
    const vh = window.innerHeight;
    return [collapsedPx(), ...detents.map((d) => Math.round(d * vh))];
  }

  function onPointerDown(e) {
    if (e.button != null && e.button !== 0) return;
    dragRef.current = {
      startY: e.clientY,
      startHeight: sheetRef.current?.offsetHeight ?? collapsedPx(),
      moved: false,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e) {
    if (!dragRef.current) return;
    const delta = dragRef.current.startY - e.clientY; // dragging up grows the sheet
    if (Math.abs(delta) > 4) dragRef.current.moved = true;
    const max = Math.round(window.innerHeight * 0.96);
    const next = Math.min(Math.max(dragRef.current.startHeight + delta, collapsedPx()), max);
    setDragPx(next);
  }
  function onPointerUp(e) {
    const drag = dragRef.current;
    dragRef.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    const current = dragPx;
    setDragPx(null);
    if (!drag) return;
    if (!drag.moved) {
      // A tap toggles between collapsed and the largest detent.
      commit(index === 0 ? snapCount - 1 : 0);
      return;
    }
    // Snap to the nearest detent.
    const points = snapPixels();
    let nearest = 0;
    let best = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(p - (current ?? drag.startHeight));
      if (d < best) { best = d; nearest = i; }
    });
    commit(nearest);
  }

  function onHandleKeyDown(e) {
    if (e.key === "ArrowUp") { e.preventDefault(); commit(index + 1); }
    else if (e.key === "ArrowDown") { e.preventDefault(); commit(index - 1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); commit(index === 0 ? snapCount - 1 : 0); }
  }

  const heightValue = dragPx != null
    ? `${dragPx}px`
    : index === 0
      ? "var(--component-bottom-sheet-header-height, 3.5rem)"
      : `${detents[index - 1] * 100}dvh`;

  const classes = [
    "a1-bottom-sheet",
    index === 0 && "a1-bottom-sheet--collapsed",
    dragPx != null && "a1-bottom-sheet--dragging",
    className,
  ].filter(Boolean).join(" ");

  return (
    <>
      {/* Reserves the collapsed footprint in document flow so the page's last
          content can always scroll clear of the fixed sheet. */}
      <div className="a1-bottom-sheet__spacer" aria-hidden="true" />
      <section
        ref={sheetRef}
        className={classes}
        style={{ "--a1-bottom-sheet-height": heightValue }}
        role="region"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : ariaLabel}
        {...props}
      >
        <div
          ref={headerRef}
          className="a1-bottom-sheet__header"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <button
            type="button"
            className="a1-bottom-sheet__handle"
            aria-label="Resize sheet"
            aria-expanded={index > 0}
            aria-controls={contentId}
            onKeyDown={onHandleKeyDown}
          />
          {title && <span id={titleId} className="a1-bottom-sheet__title">{title}</span>}
        </div>
        <div id={contentId} className="a1-bottom-sheet__content">
          {children}
        </div>
      </section>
    </>
  );
}
