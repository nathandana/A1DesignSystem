import "./split-button.css";
import { useRef, useState } from "react";
import { Button } from "../button/Button.jsx";
import { Menu, MenuItem } from "../menu/Menu.jsx";
import { Icon } from "../icon/Icon.jsx";

const variants = ["primary", "secondary", "tertiary", "destructive", "success"];
const sizes = ["sm", "md", "lg"];

/**
 * SplitButton — a primary action with an attached caret target that opens a Menu
 * of related/secondary actions. The main button runs the default action; the
 * toggle (caret) on its inline-end opens the menu. Built from the A1 `Button` and
 * `Menu`, so styling, keyboard, and focus come from those components.
 *
 * `actions` is `{ id, label, icon?, disabled?, onClick? }[]`.
 */
export function SplitButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "start",
  loading = false,
  disabled = false,
  actions = [],
  menuLabel = "More actions",
  toggleLabel = "More actions",
  className = "",
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);

  const resolvedVariant = variants.includes(variant) ? variant : "primary";
  const resolvedSize = sizes.includes(size) ? size : "md";
  const isInert = disabled || loading;

  // The toggle reuses the Button class layer (variant/size design tokens) on a
  // raw <button> so it can be ref'd as the menu anchor (Button doesn't forward refs).
  const toggleClasses = [
    "a1-button",
    `a1-button--${resolvedVariant}`,
    resolvedSize !== "md" && `a1-button--${resolvedSize}`,
    "a1-split-button__toggle",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={["a1-split-button", isInert && "a1-split-button--disabled", className].filter(Boolean).join(" ")}
      {...rest}
    >
      <Button
        className="a1-split-button__main"
        variant={resolvedVariant}
        size={resolvedSize}
        icon={icon}
        iconPosition={iconPosition}
        loading={loading}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </Button>
      <button
        ref={toggleRef}
        type="button"
        className={toggleClasses}
        aria-label={toggleLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={isInert}
        onClick={() => setOpen((current) => !current)}
      >
        <Icon name="arrow_drop_down" className="a1-split-button__caret" aria-hidden="true" />
      </button>
      <Menu open={open} onClose={() => setOpen(false)} anchorRef={toggleRef} aria-label={menuLabel}>
        {actions.map((action) => (
          <MenuItem
            key={action.id}
            icon={action.icon}
            disabled={action.disabled}
            onClick={() => { action.onClick?.(); setOpen(false); }}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
