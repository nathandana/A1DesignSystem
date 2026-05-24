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
}) {
  const items = options.map(normalize);

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
        fullWidth && "a1-segmented--full-width",
      ]
        .filter(Boolean)
        .join(" ")}
      onKeyDown={handleKeyDown}
    >
      {items.map((opt) => {
        const iconOnly = Boolean(opt.icon) && !opt.label;
        const isSelected = value === opt.value;

        return (
          <button
            key={opt.value}
            role="radio"
            type="button"
            aria-checked={isSelected}
            aria-label={iconOnly ? (opt.ariaLabel ?? opt.value) : undefined}
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
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
