import "./snackbar.css";
import { Children, cloneElement, isValidElement, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../button/Button.jsx";
import { IconButton } from "../icon-button/IconButton.jsx";

const positions = ["bottom", "bottom-left", "bottom-right", "top", "top-left", "top-right"];

function shouldSkipMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    || document.documentElement.classList.contains("a1-reduce-motion");
}

export function Snackbar({
  open = false,
  children,
  actionLabel,
  onAction,
  onClose,
  autoHideDuration,
  dismissible = true,
  variant: ignoredVariant,
  position = "bottom",
  inverse: ignoredInverse,
  stacked = false,
  role,
  className = "",
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}) {
  const [rendered, setRendered] = useState(open);
  const [closing, setClosing] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const pendingCloseRef = useRef(false);
  const paused = hoverPaused || focusPaused;

  const finishClose = useCallback(() => {
    if (!closing) return;
    const shouldNotify = pendingCloseRef.current;
    pendingCloseRef.current = false;
    setRendered(false);
    setClosing(false);
    setHoverPaused(false);
    setFocusPaused(false);
    if (shouldNotify) onClose?.();
  }, [closing, onClose]);

  const requestClose = useCallback(() => {
    if (!onClose || closing) return;
    pendingCloseRef.current = true;
    setClosing(true);
  }, [closing, onClose]);

  useEffect(() => {
    if (open) {
      pendingCloseRef.current = false;
      setRendered(true);
      setClosing(false);
      return;
    }
    if (rendered) setClosing(true);
  }, [open, rendered]);

  useEffect(() => {
    if (!open || !onClose || closing || paused || !(Number(autoHideDuration) > 0)) return undefined;
    const timeout = window.setTimeout(requestClose, Number(autoHideDuration));
    return () => window.clearTimeout(timeout);
  }, [autoHideDuration, closing, onClose, open, paused, requestClose]);

  useEffect(() => {
    if (!closing || !shouldSkipMotion()) return undefined;
    const timeout = window.setTimeout(finishClose, 0);
    return () => window.clearTimeout(timeout);
  }, [closing, finishClose]);

  if (!rendered) return null;

  // Kept out of the DOM for older call sites; Snackbar now has one visual style.
  void ignoredVariant;
  // Kept out of the DOM for older call sites; inverse is now internal.
  void ignoredInverse;

  const resolvedPosition = positions.includes(position) ? position : "bottom";
  const classes = [
    "a1-snackbar",
    "a1-inverse",
    "a1-snackbar--default",
    `a1-snackbar--${resolvedPosition}`,
    stacked && "a1-snackbar--stacked",
    closing && "a1-snackbar--closing",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      role={role ?? "status"}
      aria-live="polite"
      onMouseEnter={(event) => {
        setHoverPaused(true);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setHoverPaused(false);
        onMouseLeave?.(event);
      }}
      onFocus={(event) => {
        setFocusPaused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(false);
        onBlur?.(event);
      }}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && closing) finishClose();
      }}
      {...props}
    >
      <div className="a1-snackbar__content">{children}</div>
      {(actionLabel && onAction) && (
        <Button size="sm" variant="tertiary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {onClose && dismissible && (
        <IconButton
          icon="close"
          label="Dismiss"
          variant="tertiary"
          onClick={requestClose}
        />
      )}
    </div>
  );
}

export function SnackbarStack({
  items,
  children,
  position = "bottom",
  className = "",
  ...props
}) {
  const resolvedPosition = positions.includes(position) ? position : "bottom";
  const classes = [
    "a1-snackbar-stack",
    `a1-snackbar-stack--${resolvedPosition}`,
    className,
  ].filter(Boolean).join(" ");
  const hasItems = Array.isArray(items) && items.length > 0;
  const hasChildren = Children.count(children) > 0;

  if (!hasItems && !hasChildren) return null;

  return (
    <div className={classes} {...props}>
      {hasItems
        ? items.map((item, index) => {
          if (item?.open === false) return null;
          return (
            <Snackbar
              key={item?.id ?? index}
              open
              stacked
              position={resolvedPosition}
              actionLabel={item?.actionLabel}
              onAction={item?.onAction}
              onClose={item?.onClose}
              autoHideDuration={item?.autoHideDuration}
              dismissible={item?.dismissible}
              role={item?.role}
              className={item?.className ?? ""}
            >
              {item?.children ?? item?.message}
            </Snackbar>
          );
        })
        : Children.map(children, (child) => (
          isValidElement(child)
            ? cloneElement(child, { stacked: true, position: resolvedPosition })
            : child
        ))}
    </div>
  );
}
