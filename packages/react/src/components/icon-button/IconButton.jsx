import "./icon-button.css";
import { Icon } from "../icon/Icon.jsx";

const variants = ["tertiary", "secondary", "destructive", "success"];

export function IconButton({
  icon,
  label,
  variant = "tertiary",
  disabled = false,
  onClick,
  className = "",
  ...props
}) {
  const resolvedVariant = variants.includes(variant) ? variant : "tertiary";
  const classes = [
    "a1-icon-button",
    `a1-icon-button--${resolvedVariant}`,
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
