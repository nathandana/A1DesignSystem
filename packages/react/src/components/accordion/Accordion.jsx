import { useId, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "../icon/Icon.jsx";
import "./accordion.css";

const SIZES = ["sm", "md", "lg"];

export function Accordion({
  label,
  subtext,
  children,
  open: controlledOpen,
  defaultOpen = false,
  onChange,
  size = "md",
  divider = false,
  disabled = false,
  className = "",
  ...rest
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const uid = useId();
  const triggerId = `${uid}-trigger`;
  const panelId = `${uid}-panel`;
  const bodyRef = useRef(null);

  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (open) el.removeAttribute("inert");
    else el.setAttribute("inert", "");
  }, [open]);

  const resolvedSize = SIZES.includes(size) ? size : "md";

  function handleToggle() {
    if (disabled) return;
    const next = !open;
    if (!isControlled) setUncontrolledOpen(next);
    onChange?.(next);
  }

  return (
    <div
      className={[
        "a1-accordion",
        `a1-accordion--${resolvedSize}`,
        open && "a1-accordion--open",
        divider && "a1-accordion--divider",
        disabled && "a1-accordion--disabled",
        className,
      ].filter(Boolean).join(" ")}
      {...rest}
    >
      <button
        id={triggerId}
        type="button"
        className="a1-accordion__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        disabled={disabled}
        onClick={handleToggle}
      >
        <span className="a1-accordion__chevron" aria-hidden="true">
          <Icon name="expand_more" />
        </span>
        <span className="a1-accordion__text">
          <span className="a1-accordion__label">{label}</span>
          {subtext != null && subtext !== "" && (
            <span className="a1-accordion__subtext">{subtext}</span>
          )}
        </span>
      </button>

      <div
        ref={bodyRef}
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className="a1-accordion__body"
      >
        <div className="a1-accordion__body-inner">
          {children}
        </div>
      </div>
    </div>
  );
}
