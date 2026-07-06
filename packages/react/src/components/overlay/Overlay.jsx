import { useEffect, useId, useRef, useState } from "react";
import "./overlay.css";
import { Icon } from "../icon/Icon.jsx";
import { useLabel } from "../labels/Labels.jsx";

const STATUSES = ["neutral", "info", "success", "warn", "error"];

const STATUS_ICONS = {
  neutral: "info",
  info: "info",
  success: "check_circle",
  warn: "warning",
  error: "error",
};

const FOCUSABLE_SELECTORS = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function resolveStatus(status) {
  return STATUSES.includes(status) ? status : "info";
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}

function cssMsVar(name) {
  if (typeof window === "undefined") return 0;
  if (prefersReducedMotion()) return 0;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return 0;
  return value.endsWith("s") && !value.endsWith("ms") ? parsed * 1000 : parsed;
}

export function Overlay({
  open = false,
  onClose,
  status = "info",
  icon,
  title,
  body,
  actions,
  dismissLabel,
  className = "",
  children,
  ...props
}) {
  const ref = useRef(null);
  const triggerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const frameRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const titleId = useId();
  const bodyId = useId();
  const fallbackDismissLabel = useLabel("overlay.dismiss", "Dismiss overlay");
  const resolvedStatus = resolveStatus(status);
  const resolvedIcon = icon === null ? null : (icon ?? STATUS_ICONS[resolvedStatus]);
  const hasBody = body !== undefined && body !== null && body !== "";
  const hasTitle = title !== undefined && title !== null && title !== "";
  const classes = [
    "a1-overlay",
    "a1-inverse",
    `a1-overlay--${resolvedStatus}`,
    visible ? "a1-overlay--open" : "a1-overlay--closing",
    className,
  ].filter(Boolean).join(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    window.clearTimeout(closeTimerRef.current);
    window.cancelAnimationFrame(frameRef.current);
    if (open) {
      triggerRef.current = document.activeElement;
      if (!el.open) el.showModal();
      if (prefersReducedMotion()) {
        setVisible(true);
      } else {
        setVisible(false);
        frameRef.current = window.requestAnimationFrame(() => setVisible(true));
      }
    } else if (el.open) {
      setVisible(false);
      const duration = cssMsVar("--component-overlay-motion-duration");
      closeTimerRef.current = window.setTimeout(() => {
        if (el.open) el.close();
        triggerRef.current?.focus();
        triggerRef.current = null;
      }, duration);
    }
  }, [open]);

  useEffect(() => () => {
    window.clearTimeout(closeTimerRef.current);
    window.cancelAnimationFrame(frameRef.current);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const handleCancel = (event) => {
      event.preventDefault();
      onClose?.();
    };
    el.addEventListener("cancel", handleCancel);
    return () => el.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  useEffect(() => {
    const el = ref.current;
    if (!open || !el) return undefined;
    const handleKeyDown = (event) => {
      if (event.key !== "Tab") return;
      const focusable = [...el.querySelectorAll(FOCUSABLE_SELECTORS)];
      if (focusable.length === 0) {
        event.preventDefault();
        el.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
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
      className={classes}
      tabIndex={-1}
      data-a1-color-scope="inverse"
      aria-labelledby={hasTitle && !props["aria-label"] && !props["aria-labelledby"] ? titleId : props["aria-labelledby"]}
      aria-describedby={hasBody && !props["aria-describedby"] ? bodyId : props["aria-describedby"]}
      {...props}
    >
      {onClose && (
        <button
          type="button"
          className="a1-overlay__close"
          aria-label={dismissLabel || fallbackDismissLabel}
          onClick={onClose}
        >
          <Icon name="close" aria-hidden="true" />
        </button>
      )}
      <div className="a1-overlay__content" tabIndex={-1}>
        {resolvedIcon && (
          <span className="a1-overlay__icon" aria-hidden="true">
            <Icon name={resolvedIcon} />
          </span>
        )}
        <div className="a1-overlay__copy">
          {hasTitle && <h2 id={titleId} className="a1-overlay__title">{title}</h2>}
          {hasBody && <div id={bodyId} className="a1-overlay__body">{body}</div>}
          {children && <div className="a1-overlay__extra">{children}</div>}
        </div>
        {actions && <div className="a1-overlay__actions">{actions}</div>}
      </div>
    </dialog>
  );
}
