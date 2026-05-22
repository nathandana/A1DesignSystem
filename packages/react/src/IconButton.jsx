import "./icon-button.css";
import { Icon } from "./Icon.jsx";

export function IconButton({
  icon,
  label,
  variant = "default",
  disabled = false,
  onClick,
  className = "",
  ...props
}) {
  const classes = [
    "a1-icon-button",
    variant !== "default" && `a1-icon-button--${variant}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={classes}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <Icon name={icon} />
    </button>
  );
}
