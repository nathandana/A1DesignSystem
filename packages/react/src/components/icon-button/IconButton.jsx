import "./icon-button.css";
import { Icon } from "../icon/Icon.jsx";

const variants = ["tertiary", "secondary", "destructive", "success"];
const sizes = ["md", "lg"];

export function IconButton({
  as: Component = "button",
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
  // When rendered as a link (as="a") the native `disabled` attribute does not
  // apply, so fall back to aria-disabled for assistive tech.
  const isButton = Component === "button";
  const classes = [
    "a1-icon-button",
    `a1-icon-button--${resolvedVariant}`,
    resolvedSize === "lg" && "a1-icon-button--large",
    className,
  ].filter(Boolean).join(" ");

  return (
    <Component
      type={isButton ? "button" : undefined}
      className={classes}
      aria-label={label}
      disabled={isButton ? disabled : undefined}
      aria-disabled={!isButton && disabled ? "true" : undefined}
      onClick={onClick}
      {...props}
    >
      <Icon name={icon} />
    </Component>
  );
}
