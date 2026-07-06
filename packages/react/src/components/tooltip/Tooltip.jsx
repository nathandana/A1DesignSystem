import { createPortal } from "react-dom";
import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./tooltip.css";

const placements = new Set(["top", "right", "bottom", "left"]);
const DEFAULT_DELAY = 400;
const MIN_DELAY = 0;
const MAX_DELAY = 1500;
const EXIT_DURATION = 150;

function clampDelay(value) {
  const delay = Number(value);
  if (!Number.isFinite(delay)) return DEFAULT_DELAY;
  return Math.min(MAX_DELAY, Math.max(MIN_DELAY, delay));
}

function cssPxVar(name, fallback) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function cssMsVar(name, fallback) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return fallback;
  return value.endsWith("s") && !value.endsWith("ms") ? parsed * 1000 : parsed;
}

function measurePosition(trigger, tooltip, placement) {
  const triggerRect = trigger.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const offset = cssPxVar("--component-tooltip-offset", 8);
  const viewportOffset = cssPxVar("--component-tooltip-viewport-offset", 8);
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const centerX = triggerRect.left + triggerRect.width / 2;
  const centerY = triggerRect.top + triggerRect.height / 2;
  const candidates = {
    top: {
      top: triggerRect.top - tooltipRect.height - offset,
      left: centerX - tooltipRect.width / 2,
    },
    right: {
      top: centerY - tooltipRect.height / 2,
      left: triggerRect.right + offset,
    },
    bottom: {
      top: triggerRect.bottom + offset,
      left: centerX - tooltipRect.width / 2,
    },
    left: {
      top: centerY - tooltipRect.height / 2,
      left: triggerRect.left - tooltipRect.width - offset,
    },
  };

  const preferred = candidates[placement] ?? candidates.top;
  return {
    top: Math.min(
      Math.max(viewportOffset, preferred.top),
      Math.max(viewportOffset, viewportHeight - tooltipRect.height - viewportOffset),
    ),
    left: Math.min(
      Math.max(viewportOffset, preferred.left),
      Math.max(viewportOffset, viewportWidth - tooltipRect.width - viewportOffset),
    ),
  };
}

export function Tooltip({
  children,
  className = "",
  content,
  delay = DEFAULT_DELAY,
  disabled = false,
  placement = "top",
}) {
  const tooltipId = useId();
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timerRef = useRef(null);
  const exitTimerRef = useRef(null);
  const [rendered, setRendered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState(null);
  const safeDelay = clampDelay(delay);
  const safePlacement = placements.has(placement) ? placement : "top";
  const hasContent = content !== undefined && content !== null && content !== "";
  const isDisabled = disabled || !hasContent;

  const clearShowTimer = useCallback(() => {
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const clearExitTimer = useCallback(() => {
    window.clearTimeout(exitTimerRef.current);
    exitTimerRef.current = null;
  }, []);

  const show = useCallback(() => {
    if (isDisabled) return;
    clearShowTimer();
    clearExitTimer();
    timerRef.current = window.setTimeout(() => {
      setRendered(true);
      requestAnimationFrame(() => setVisible(true));
    }, safeDelay);
  }, [clearExitTimer, clearShowTimer, isDisabled, safeDelay]);

  const hide = useCallback(() => {
    clearShowTimer();
    clearExitTimer();
    setVisible(false);
    const exitDuration = cssMsVar("--semantic-motion-duration-fast", EXIT_DURATION);
    if (exitDuration <= 0) {
      setRendered(false);
      setPosition(null);
      return;
    }
    exitTimerRef.current = window.setTimeout(() => {
      setRendered(false);
      setPosition(null);
    }, exitDuration);
  }, [clearExitTimer, clearShowTimer]);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;
    setPosition(measurePosition(trigger, tooltip, safePlacement));
  }, [safePlacement]);

  useLayoutEffect(() => {
    if (!rendered) return;
    updatePosition();
  }, [rendered, updatePosition, content]);

  useEffect(() => {
    if (!rendered) return undefined;

    const onViewportChange = () => updatePosition();
    const onKeyDown = (event) => {
      if (event.key === "Escape") hide();
    };

    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [hide, rendered, updatePosition]);

  useEffect(() => {
    if (isDisabled) hide();
  }, [hide, isDisabled]);

  useEffect(() => () => {
    clearShowTimer();
    clearExitTimer();
  }, [clearExitTimer, clearShowTimer]);

  const describedChild = isValidElement(children)
    ? cloneElement(children, {
      "aria-describedby": visible
        ? [children.props["aria-describedby"], tooltipId].filter(Boolean).join(" ")
        : children.props["aria-describedby"],
    })
    : children;

  return (
    <span
      ref={triggerRef}
      className="a1-tooltip__trigger"
      aria-describedby={!isValidElement(children) && visible ? tooltipId : undefined}
      onBlurCapture={hide}
      onFocusCapture={show}
      onPointerEnter={show}
      onPointerLeave={hide}
    >
      {describedChild}
      {rendered && createPortal(
        <span
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className={[
            "a1-tooltip",
            `a1-tooltip--${safePlacement}`,
            visible ? "a1-tooltip--open" : "a1-tooltip--closing",
            className,
          ].filter(Boolean).join(" ")}
          style={position ? { "--a1-tooltip-top": `${Math.round(position.top)}px`, "--a1-tooltip-left": `${Math.round(position.left)}px` } : undefined}
        >
          {content}
        </span>,
        document.body,
      )}
    </span>
  );
}
