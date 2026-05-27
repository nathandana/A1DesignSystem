import { useEffect, useRef } from "react";
import "./dialog.css";
import { IconButton } from "../icon-button/IconButton.jsx";
import { ButtonContainer } from "../button-container/ButtonContainer.jsx";

const FOCUSABLE_SELECTORS = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export function Dialog({ open = false, onClose, title, footer, children, ...props }) {
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
    const handleCancel = (e) => {
      e.preventDefault();
      onClose?.();
    };
    el.addEventListener("cancel", handleCancel);
    return () => el.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  useEffect(() => {
    const el = ref.current;
    if (!open || !el) return;
    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;
      const focusable = [...el.querySelectorAll(FOCUSABLE_SELECTORS)];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <dialog ref={ref} className="a1-dialog" {...props}>
      <div className="a1-dialog__header">
        {title && <p className="a1-dialog__title">{title}</p>}
        <IconButton
          icon="close"
          label="Close dialog"
          onClick={onClose}
          className="a1-dialog__close"
        />
      </div>
      <div className="a1-dialog__body">{children}</div>
      {footer && (
        <div className="a1-dialog__footer">
          <ButtonContainer align="end">{footer}</ButtonContainer>
        </div>
      )}
    </dialog>
  );
}
