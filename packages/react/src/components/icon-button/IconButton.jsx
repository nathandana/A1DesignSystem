import "./icon-button.css";
import { Icon } from "../icon/Icon.jsx";

const variants = ["tertiary", "secondary", "destructive", "success"];
const sizes = ["md", "lg"];

export function IconButton({
  icon,
  label,
  variant = "tertiary",
  size,
  disabled = false,
  onClick,
  className = "",
  ...props
}) {
  const resolvedVariant = variants.includes(variant) ? variant : "tertiary";
  const resolvedSize = sizes.includes(size) ? size : null;
  const classes = [
    "a1-icon-button",
    `a1-icon-button--${resolvedVariant}`,
    resolvedSize === "lg" && "a1-icon-button--large",
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
