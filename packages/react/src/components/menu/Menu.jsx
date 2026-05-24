import { useEffect, useRef } from "react";
import "./menu.css";

export function Menu({ open, onClose, "aria-label": ariaLabel, children }) {
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
    const onCancel = (e) => { e.preventDefault(); onClose?.(); };
    // Backdrop clicks hit the dialog element directly
    const onClick = (e) => { if (e.target === el) onClose?.(); };
    el.addEventListener("cancel", onCancel);
    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("cancel", onCancel);
      el.removeEventListener("click", onClick);
    };
  }, [onClose]);

  return (
    <dialog ref={ref} className="a1-menu" aria-label={ariaLabel}>
      {children}
    </dialog>
  );
}

export function MenuSection({ label, children }) {
  return (
    <div className="a1-menu__section">
      {label && <p className="a1-menu__section-label">{label}</p>}
      {children}
    </div>
  );
}
