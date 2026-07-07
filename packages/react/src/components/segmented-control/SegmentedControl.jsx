import "./segmented.css";
import { Icon } from "../icon/Icon.jsx";

function normalize(opt) {
  return typeof opt === "string" ? { value: opt, label: opt } : opt;
}

export function SegmentedControl({
  options = [],
  value,
  onChange,
  fullWidth = false,
  size,
  labelMode = "all",
  ...props
}) {
  const items = options.map(normalize);
  const resolvedSize = size === "default" ? "md" : size;

  const handleKeyDown = (e) => {
    const els = Array.from(e.currentTarget.querySelectorAll('[role="radio"]'));
    const idx = els.indexOf(document.activeElement);
    if (idx === -1) return;

    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      next = (idx + 1) % els.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      next = (idx - 1 + els.length) % els.length;
    } else if (e.key === "Home") {
      next = 0;
    } else if (e.key === "End") {
      next = els.length - 1;
    }

    if (next !== -1) {
      e.preventDefault();
      els[next].focus();
      onChange?.(items[next].value);
    }
  };

  return (
    <div
      role="radiogroup"
      className={[
        "a1-segmented",
        resolvedSize && `a1-segmented--${resolvedSize}`,
        fullWidth && "a1-segmented--full-width",
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
      onKeyDown={handleKeyDown}
    >
      {items.map((opt) => {
        const isSelected = value === opt.value;
        // labelMode controls which segments show their text label:
        //   "all" (default) — every segment.
        //   "selected"      — only the selected segment.
        //   "none"          — none of them (fully icon-only).
        // An option with no icon always shows its label so it never goes blank.
        const wantsLabel =
          Boolean(opt.label) &&
          (labelMode === "none"
            ? !opt.icon
            : labelMode === "selected"
              ? (isSelected || !opt.icon)
              : true);
        const iconOnly = Boolean(opt.icon) && !wantsLabel;

        return (
          <button
            key={opt.value}
            role="radio"
            type="button"
            aria-checked={isSelected}
            aria-label={iconOnly ? (opt.ariaLabel ?? opt.label ?? opt.value) : undefined}
            tabIndex={isSelected ? 0 : -1}
            className={[
              "a1-segment",
              iconOnly && "a1-segment--icon-only",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onChange?.(opt.value)}
          >
            {opt.icon && <Icon name={opt.icon} className="a1-segment__icon" />}
            {wantsLabel ? opt.label : null}
          </button>
        );
      })}
    </div>
  );
}
