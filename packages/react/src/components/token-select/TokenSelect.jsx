import { useId, useRef, useState } from "react";
import { Menu, MenuSection } from "../menu/Menu.jsx";
import { Icon } from "../icon/Icon.jsx";
import "./token-select.css";

// Parse "var(--base-color-accent-500)" → { ramp: "accent", stop: 500 }
function parseRef(value) {
  const m = value?.match(/^var\(--base-color-([a-z]+)-(\d+)\)$/);
  return m ? { ramp: m[1], stop: parseInt(m[2]) } : null;
}

// Identify which ramp token a raw hex value corresponds to
function identifyToken(hex, rampColors) {
  const n = hex?.toLowerCase();
  if (!n?.startsWith("#")) return null;
  for (const [ramp, stops] of Object.entries(rampColors)) {
    for (const [stop, color] of Object.entries(stops)) {
      if (color?.toLowerCase() === n) return { ramp, stop: parseInt(stop) };
    }
  }
  return null;
}

function TokenItem({ ramp, stop, hex, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`a1-token-item${selected ? " a1-token-item--selected" : ""}`}
      onClick={() => onSelect(ramp, stop)}
    >
      <span className="a1-token-item__swatch" style={{ background: hex }} aria-hidden="true" />
      <span className="a1-token-item__name">{ramp}-{stop}</span>
      <span className="a1-token-item__hex">{hex}</span>
      {selected && <Icon name="check" className="a1-token-item__check" />}
    </button>
  );
}

const SIZES = ["comfortable", "default", "compact"];

export function TokenSelect({
  label,
  value,
  onChange,
  rampColors = {},
  rampLabels = {},
  suggestedRamp,
  size = "compact",
  disabled = false,
  id: providedId,
  className = "",
}) {
  const autoId = useId();
  const id = providedId ?? autoId;
  const triggerRef = useRef(null);
  const [open, setOpen] = useState(false);

  const rampNames = Object.keys(rampColors);
  const primary = (suggestedRamp && rampColors[suggestedRamp]) ? suggestedRamp : (rampNames[0] ?? "");
  const others = rampNames.filter((r) => r !== primary);

  const stops = Object.keys(rampColors[primary] ?? rampColors[rampNames[0]] ?? {})
    .map(Number)
    .filter((n) => !isNaN(n))
    .sort((a, b) => a - b);

  const ref = parseRef(value);
  const identified = ref ?? identifyToken(value, rampColors);
  const resolvedHex = ref
    ? (rampColors[ref.ramp]?.[ref.stop] ?? null)
    : (/^#[0-9a-f]{3,8}$/i.test(value) ? value : null);

  const varName = !identified && value?.match(/^var\(\s*(--[^,)\s]+)/)?.[1];
  const displayLabel = identified
    ? `${identified.ramp}-${identified.stop}`
    : varName ?? "Choose…";

  const resolvedSize = SIZES.includes(size) ? size : "compact";

  function handleSelect(ramp, stop) {
    onChange?.(`var(--base-color-${ramp}-${stop})`);
    setOpen(false);
  }

  const classes = [
    "a1-field",
    `a1-field--${resolvedSize}`,
    "a1-token-select",
    disabled && "a1-field--disabled",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {label && (
        <label className="a1-field__label" htmlFor={id}>{label}</label>
      )}
      <div className="a1-field__control">
        <button
          ref={triggerRef}
          id={id}
          type="button"
          className="a1-field__select a1-token-select__trigger"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          {resolvedHex && (
            <span
              className="a1-token-select__swatch"
              style={{ background: resolvedHex }}
              aria-hidden="true"
            />
          )}
          <span className="a1-token-select__value">{displayLabel}</span>
        </button>
        <span className="a1-field__chevron" aria-hidden="true">
          <Icon name="expand_more" />
        </span>
      </div>

      <Menu
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={triggerRef}
        aria-label={label ?? "Select a token"}
      >
        <MenuSection label={rampLabels[primary] ?? primary}>
          {stops.map((stop) => (
            <TokenItem
              key={stop}
              ramp={primary}
              stop={stop}
              hex={rampColors[primary]?.[stop] ?? "#ccc"}
              selected={identified?.ramp === primary && identified?.stop === stop}
              onSelect={handleSelect}
            />
          ))}
        </MenuSection>

        {others.map((ramp) => (
          <MenuSection key={ramp} label={rampLabels[ramp] ?? ramp}>
            {stops.map((stop) => (
              <TokenItem
                key={stop}
                ramp={ramp}
                stop={stop}
                hex={rampColors[ramp]?.[stop] ?? "#ccc"}
                selected={identified?.ramp === ramp && identified?.stop === stop}
                onSelect={handleSelect}
              />
            ))}
          </MenuSection>
        ))}
      </Menu>
    </div>
  );
}
