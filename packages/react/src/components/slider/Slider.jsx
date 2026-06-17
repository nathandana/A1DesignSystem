import "./slider.css";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "../icon/Icon.jsx";

// Density sizes mirror the field family so a Slider sits naturally beside fields.
const VALID_SLIDER_SIZES = ["compact", "default", "comfortable"];

/** Normalize the `detents` prop to `{ value, label, icon }[]` (or null when absent). */
function normalizeDetents(detents) {
  if (!Array.isArray(detents) || detents.length === 0) return null;
  return detents.map((d) =>
    typeof d === "number"
      ? { value: d, label: undefined, icon: undefined }
      : { value: d.value, label: d.label, icon: d.icon },
  );
}

/** Index of the detent closest to `value`. */
function nearestDetentIndex(detents, value) {
  let best = 0;
  let bestDist = Infinity;
  detents.forEach((d, i) => {
    const dist = Math.abs(d.value - value);
    if (dist < bestDist) { bestDist = dist; best = i; }
  });
  return best;
}

/** Position (and the matching CSS for ticks/labels) of a thumb at fraction `p`
 *  (0–1), accounting for the thumb's width so it tracks the real thumb centre. */
function thumbLeft(p) {
  return `calc(var(--a1-slider-thumb-size) / 2 + ${p} * (100% - var(--a1-slider-thumb-size)))`;
}

/**
 * Slider — a range input with an optional set of **detents** (labeled stops the
 * thumb snaps to, e.g. None / XS / SM / LG) and a value bubble that follows the
 * thumb while you drag or focus it, flipping above/below to stay in the viewport.
 *
 * Built on a native `<input type="range">`, so keyboard support (arrows, Home/End,
 * Page Up/Down), focus, touch, and form semantics come for free. The accessible
 * value is announced via `aria-valuetext` (the detent label when present).
 */
export function Slider({
  value,
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  detents,
  label,
  size = "default",
  variant = "default",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  showValue = true,
  valuePosition = "above",
  formatValue,
  bubbleLabel,
  disabled = false,
  name,
  id,
  className = "",
  ...rest
}) {
  const reactId = useId();
  const sliderId = id ?? `a1-slider-${reactId}`;
  const dets = normalizeDetents(detents);

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(() =>
    defaultValue !== undefined ? defaultValue : dets ? dets[0].value : min,
  );
  const current = isControlled ? value : internal;

  // In detent mode the native input works in index space (0..n-1, step 1).
  const detentIndex = dets ? nearestDetentIndex(dets, current) : null;
  const inputMin = dets ? 0 : min;
  const inputMax = dets ? dets.length - 1 : max;
  const inputStep = dets ? 1 : step;
  const inputValue = dets ? detentIndex : current;
  const pct = inputMax === inputMin ? 0 : (inputValue - inputMin) / (inputMax - inputMin);

  const controlRef = useRef(null);
  const [interacting, setInteracting] = useState(false);
  const [placement, setPlacement] = useState(valuePosition);

  function commit(next) {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  function handleInput(e) {
    const raw = Number(e.target.value);
    commit(dets ? dets[Math.round(raw)].value : raw);
  }

  const activeDetent = dets ? dets[detentIndex] : null;
  const formatted = formatValue ? formatValue(current) : null;

  // Accessible value text — always a string (an icon detent falls back to its
  // label, then its numeric value, so screen readers still announce something).
  const ariaValueText =
    typeof formatted === "string" ? formatted
      : activeDetent?.label != null ? String(activeDetent.label)
        : activeDetent ? String(activeDetent.value)
          : String(current);

  // Optional bubble-specific label (visual only; aria-valuetext is unchanged).
  // A function receives the current value and active detent; a node is used as-is.
  const resolvedBubbleLabel =
    typeof bubbleLabel === "function" ? bubbleLabel(current, activeDetent)
      : bubbleLabel != null ? bubbleLabel
        : null;

  // Visual bubble content — the explicit bubble label wins, then a formatted
  // value, then the active detent (label, icon, or value), then the raw value.
  const bubbleContent =
    resolvedBubbleLabel != null ? resolvedBubbleLabel
      : formatted != null ? formatted
        : activeDetent
          ? (activeDetent.label != null
              ? activeDetent.label
              : activeDetent.icon
                ? <Icon name={activeDetent.icon} size="sm" color="inverse" />
                : String(activeDetent.value))
          : String(current);

  // Keep the bubble in the viewport: honor `valuePosition`, but flip if the
  // chosen side would clip the top/bottom edge.
  const updatePlacement = useCallback(() => {
    const el = controlRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const MARGIN = 56;
    if (valuePosition === "above" && rect.top < MARGIN) setPlacement("below");
    else if (valuePosition === "below" && rect.bottom > window.innerHeight - MARGIN) setPlacement("above");
    else setPlacement(valuePosition);
  }, [valuePosition]);

  useLayoutEffect(() => {
    if (interacting) updatePlacement();
  }, [interacting, current, updatePlacement]);

  useEffect(() => {
    if (!interacting) return undefined;
    const onMove = () => updatePlacement();
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [interacting, updatePlacement]);

  const showBubble = showValue && interacting && !disabled;
  const hasLabelRow = !!dets && dets.some((d) => d.label != null || d.icon != null);

  const resolvedSize = VALID_SLIDER_SIZES.includes(size) ? size : "default";

  const classes = [
    "a1-slider",
    resolvedSize !== "default" && `a1-slider--${resolvedSize}`,
    variant === "subtle" && "a1-slider--subtle",
    dets && "a1-slider--detents",
    disabled && "a1-slider--disabled",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} style={{ "--a1-slider-pct": pct }}>
      {label != null && (
        <label className="a1-slider__field-label" htmlFor={sliderId}>{label}</label>
      )}
      <div className="a1-slider__control" ref={controlRef}>
        {showBubble && (
          <span className={`a1-slider__bubble a1-slider__bubble--${placement}`} aria-hidden="true">
            {bubbleContent}
          </span>
        )}
        <input
          type="range"
          id={sliderId}
          name={name}
          className="a1-slider__input"
          min={inputMin}
          max={inputMax}
          step={inputStep}
          value={inputValue}
          disabled={disabled}
          // The visible `<label htmlFor>` names the input; only fall back to
          // aria-label when there's no visible label.
          aria-label={label != null ? ariaLabel : (ariaLabel ?? undefined)}
          aria-labelledby={ariaLabelledBy}
          aria-valuetext={ariaValueText}
          onChange={handleInput}
          onFocus={() => setInteracting(true)}
          onBlur={() => setInteracting(false)}
          onPointerDown={() => setInteracting(true)}
          onPointerUp={() => setInteracting(false)}
          onPointerCancel={() => setInteracting(false)}
          {...rest}
        />
        {dets && (
          <div className="a1-slider__ticks" aria-hidden="true">
            {dets.map((d, i) => {
              const p = dets.length === 1 ? 0 : i / (dets.length - 1);
              return (
                <span
                  key={i}
                  className="a1-slider__tick"
                  data-active={p <= pct || undefined}
                  style={{ left: thumbLeft(p) }}
                />
              );
            })}
          </div>
        )}
      </div>

      {hasLabelRow && (
        <div className="a1-slider__labels" aria-hidden="true">
          {dets.map((d, i) => {
            const p = dets.length === 1 ? 0 : i / (dets.length - 1);
            const transform =
              i === 0 ? "translateX(0)" : i === dets.length - 1 ? "translateX(-100%)" : "translateX(-50%)";
            return (
              <span
                key={i}
                className="a1-slider__label"
                data-active={i === detentIndex || undefined}
                style={{ left: thumbLeft(p), transform }}
              >
                {d.icon ? <Icon name={d.icon} size="sm" /> : (d.label ?? d.value)}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
