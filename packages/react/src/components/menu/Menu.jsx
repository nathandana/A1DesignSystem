import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import "./menu.css";
import { Divider } from "../divider/Divider.jsx";
import { Icon } from "../icon/Icon.jsx";
import { IconButton } from "../icon-button/IconButton.jsx";

const variants = ["default", "destructive"];
const xsQuery = "(max-width: 480px)";
const viewportMargin = 8;
const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusableElements(container) {
  return [...container.querySelectorAll(focusableSelector)].filter((element) => {
    if (element.getAttribute("aria-disabled") === "true") return false;
    return element.getClientRects().length > 0;
  });
}

/* ── Menu ────────────────────────────────────────────────────────────────── */

export function Menu({ open, onClose, anchorRef, "aria-label": ariaLabel, children }) {
  const ref = useRef(null);
  const fallbackAnchorRef = useRef(null);
  const modalRef = useRef(false);

  const updatePosition = useCallback(() => {
    const el = ref.current;
    if (!el?.open) return;

    if (window.matchMedia(xsQuery).matches) {
      el.style.removeProperty("--a1-menu-top");
      el.style.removeProperty("--a1-menu-left");
      el.style.removeProperty("--a1-menu-max-height");
      return;
    }

    const anchor = anchorRef?.current ?? fallbackAnchorRef.current;
    const anchorRect = anchor?.getBoundingClientRect?.();
    const menuRect = el.getBoundingClientRect();
    const width = menuRect.width || 260;
    const height = menuRect.height || 0;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const preferredLeft = anchorRect
      ? anchorRect.left
      : viewportWidth - width - viewportMargin;
    const left = Math.min(
      Math.max(viewportMargin, preferredLeft),
      Math.max(viewportMargin, viewportWidth - width - viewportMargin),
    );

    const belowTop = anchorRect ? anchorRect.bottom + viewportMargin : viewportMargin;
    const aboveTop = anchorRect ? anchorRect.top - height - viewportMargin : viewportMargin;
    const belowSpace = viewportHeight - belowTop - viewportMargin;
    const aboveSpace = anchorRect ? anchorRect.top - viewportMargin * 2 : 0;
    const shouldPlaceAbove = height > belowSpace && aboveSpace > belowSpace;
    const unclampedTop = shouldPlaceAbove ? aboveTop : belowTop;
    const top = Math.min(
      Math.max(viewportMargin, unclampedTop),
      Math.max(viewportMargin, viewportHeight - height - viewportMargin),
    );
    const maxHeight = shouldPlaceAbove
      ? Math.max(120, anchorRect.top - viewportMargin * 2)
      : Math.max(120, viewportHeight - top - viewportMargin);

    el.style.setProperty("--a1-menu-top", `${Math.round(top)}px`);
    el.style.setProperty("--a1-menu-left", `${Math.round(left)}px`);
    el.style.setProperty("--a1-menu-max-height", `${Math.floor(maxHeight)}px`);
  }, [anchorRef]);

  const openDialog = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const shouldModal = window.matchMedia(xsQuery).matches;
    if (el.open && modalRef.current === shouldModal) {
      updatePosition();
      return;
    }

    if (el.open) el.close();
    if (shouldModal) {
      el.showModal();
    } else {
      el.show();
    }
    modalRef.current = shouldModal;
    updatePosition();
    requestAnimationFrame(() => {
      getFocusableElements(el)[0]?.focus();
    });
  }, [updatePosition]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (open) {
      fallbackAnchorRef.current = anchorRef?.current ?? document.activeElement;
      openDialog();
    } else if (el.open) {
      el.close();
      modalRef.current = false;
      el.style.removeProperty("--a1-menu-top");
      el.style.removeProperty("--a1-menu-left");
      el.style.removeProperty("--a1-menu-max-height");
    }
  }, [anchorRef, open, openDialog]);

  useEffect(() => {
    if (!open) return undefined;

    const onViewportChange = () => openDialog();
    const onScroll = () => updatePosition();
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, openDialog, updatePosition]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onCancel = (e) => { e.preventDefault(); onClose?.(); };
    const onClick  = (e) => { if (e.target === el) onClose?.(); };
    el.addEventListener("cancel", onCancel);
    el.addEventListener("click",  onClick);
    return () => {
      el.removeEventListener("cancel", onCancel);
      el.removeEventListener("click",  onClick);
    };
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      const el = ref.current;
      if (!el?.open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
        return;
      }

      if (e.key !== "Tab") return;

      const focusableElements = getFocusableElements(el);
      if (focusableElements.length === 0) {
        e.preventDefault();
        el.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!el.contains(document.activeElement)) {
        e.preventDefault();
        (e.shiftKey ? lastElement : firstElement).focus();
      } else if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (e) => {
      const el = ref.current;
      const anchor = anchorRef?.current ?? fallbackAnchorRef.current;
      if (!el || modalRef.current) return;
      if (el.contains(e.target) || anchor?.contains?.(e.target)) return;
      onClose?.();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [anchorRef, onClose, open]);

  return (
    <dialog ref={ref} className="a1-menu" aria-label={ariaLabel} tabIndex={-1}>
      <IconButton
        icon="close"
        label="Close menu"
        className="a1-menu__close"
        onClick={onClose}
      />
      {children}
    </dialog>
  );
}

/* ── MenuSection ─────────────────────────────────────────────────────────── */

export function MenuSection({ label, children }) {
  return (
    <div className="a1-menu__section">
      <Divider className="a1-menu__section-divider" space="xs" />
      {label && <p className="a1-menu__section-label">{label}</p>}
      {children}
    </div>
  );
}

/* ── MenuItem ────────────────────────────────────────────────────────────── */

export function MenuItem({
  children,
  icon,
  shortcut,
  variant = "default",
  disabled = false,
  href,
  onClick,
  className = "",
  ...props
}) {
  const Component = href ? "a" : "button";
  const resolvedVariant = variants.includes(variant) ? variant : "default";

  const classes = [
    "a1-menu-item",
    resolvedVariant !== "default" && `a1-menu-item--${resolvedVariant}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <Component
      className={classes}
      href={disabled ? undefined : href}
      type={!href ? "button" : undefined}
      disabled={!href ? disabled : undefined}
      aria-disabled={href && disabled ? true : undefined}
      tabIndex={href && disabled ? -1 : undefined}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {icon && <Icon name={icon} className="a1-menu-item__icon" />}
      <span className="a1-menu-item__label">{children}</span>
      {shortcut && <kbd className="a1-menu-item__shortcut" aria-hidden="true">{shortcut}</kbd>}
    </Component>
  );
}
