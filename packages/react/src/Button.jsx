import "./button.css";
import { Icon } from "./Icon.jsx";

const variants = ["primary", "secondary", "tertiary", "destructive", "success"];
const iconPositions = ["start", "end"];

export function Button({
  as: Component = "button",
  variant = "primary",
  icon,
  iconPosition = "start",
  className = "",
  type,
  children,
  ...props
}) {
  const resolvedVariant = variants.includes(variant) ? variant : "primary";
  const resolvedPosition = iconPositions.includes(iconPosition) ? iconPosition : "start";
  const classes = [
    "a1-button",
    `a1-button--${resolvedVariant}`,
    icon && "a1-button--has-icon",
    className
  ]
    .filter(Boolean)
    .join(" ");

  const iconEl = icon ? <Icon name={icon} className="a1-button__icon" /> : null;

  return (
    <Component
      className={classes}
      type={Component === "button" ? type ?? "button" : type}
      {...props}
    >
      {resolvedPosition === "start" && iconEl}
      {children}
      {resolvedPosition === "end" && iconEl}
    </Component>
  );
}
