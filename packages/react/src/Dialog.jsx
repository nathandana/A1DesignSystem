import { useEffect, useRef } from "react";
import "./dialog.css";
import { IconButton } from "./IconButton.jsx";

export function Dialog({ open = false, onClose, title, footer, children, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
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
      {footer && <div className="a1-dialog__footer">{footer}</div>}
    </dialog>
  );
}
