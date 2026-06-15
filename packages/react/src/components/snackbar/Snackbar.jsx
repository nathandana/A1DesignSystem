import "./snackbar.css";
import { Button } from "../button/Button.jsx";
import { IconButton } from "../icon-button/IconButton.jsx";

const positions = ["bottom", "bottom-left", "bottom-right", "top", "top-left", "top-right"];

export function Snackbar({
  open = false,
  children,
  actionLabel,
  onAction,
  onClose,
  variant: ignoredVariant,
  position = "bottom",
  inverse: ignoredInverse,
  role,
  className = "",
  ...props
}) {
  if (!open) return null;

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
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      role={role ?? "status"}
      aria-live="polite"
      {...props}
    >
      <div className="a1-snackbar__content">{children}</div>
      {(actionLabel && onAction) && (
        <Button size="sm" variant="tertiary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {onClose && (
        <IconButton
          icon="close"
          label="Dismiss"
          variant="tertiary"
          onClick={onClose}
        />
      )}
    </div>
  );
}
