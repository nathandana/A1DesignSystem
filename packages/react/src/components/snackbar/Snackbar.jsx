import "./snackbar.css";
import { Button } from "../button/Button.jsx";
import { IconButton } from "../icon-button/IconButton.jsx";

const variants = ["default", "success", "info", "warn", "error"];
const positions = ["bottom", "bottom-left", "bottom-right", "top", "top-left", "top-right"];

export function Snackbar({
  open = false,
  children,
  actionLabel,
  onAction,
  onClose,
  variant = "default",
  position = "bottom",
  inverse = true,
  role,
  className = "",
  ...props
}) {
  if (!open) return null;

  const resolvedVariant = variants.includes(variant) ? variant : "default";
  const resolvedPosition = positions.includes(position) ? position : "bottom";
  const classes = [
    "a1-snackbar",
    inverse && "a1-inverse",
    `a1-snackbar--${resolvedVariant}`,
    `a1-snackbar--${resolvedPosition}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      role={role ?? (resolvedVariant === "error" ? "alert" : "status")}
      aria-live={resolvedVariant === "error" ? "assertive" : "polite"}
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
