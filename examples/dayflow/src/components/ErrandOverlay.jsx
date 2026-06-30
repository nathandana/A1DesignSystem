import { useEffect, useRef } from "react";
import { IconButton } from "../../../../packages/react/src/index.js";
import "../../../../packages/react/src/components/dialog/dialog.css";

const FOCUSABLE_SELECTORS = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * Responsive errand form shell — bottom sheet on mobile, centered dialog on tablet+.
 * Uses a single <dialog> so form state survives viewport changes.
 */
export function ErrandOverlay({ open = false, onClose, title, children, ...props }) {
  const ref = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      triggerRef.current = document.activeElement;
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
      triggerRef.current?.focus();
      triggerRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleCancel = (event) => {
      event.preventDefault();
      onClose?.();
    };
    el.addEventListener("cancel", handleCancel);
    return () => el.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  useEffect(() => {
    const el = ref.current;
    if (!open || !el) return;
    const handleKeyDown = (event) => {
      if (event.key !== "Tab") return;
      const focusable = [...el.querySelectorAll(FOCUSABLE_SELECTORS)];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="a1-dialog dayflow-errand-overlay"
      aria-label={props["aria-label"] ?? title}
      {...props}
    >
      <div className="dayflow-errand-overlay__handle" aria-hidden="true" />
      <div className="dayflow-errand-overlay__header">
        {title ? <p className="a1-dialog__title dayflow-errand-overlay__title">{title}</p> : null}
        <IconButton
          icon="close"
          label="Close"
          onClick={onClose}
          className="a1-dialog__close"
        />
      </div>
      <div className="dayflow-errand-overlay__body">{children}</div>
    </dialog>
  );
}
