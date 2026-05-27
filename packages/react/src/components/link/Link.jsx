import "./link.css";
import { Icon } from "../icon/Icon.jsx";

const sizes = ["xs", "sm", "md", "lg", "xl"];
const weights = ["normal", "medium", "semibold", "bold"];
const iconPositions = ["start", "end"];

export function Link({
  size,
  weight,
  icon,
  iconPosition = "start",
  className = "",
  children,
  ...props
}) {
  const resolvedSize = sizes.includes(size) ? size : null;
  const resolvedWeight = weights.includes(weight) ? weight : null;
  const resolvedPosition = iconPositions.includes(iconPosition) ? iconPosition : "start";

  const classes = [
    "a1-link",
    resolvedSize && `a1-link--${resolvedSize}`,
    resolvedWeight && `a1-link--${resolvedWeight}`,
    icon && "a1-link--has-icon",
    className
  ]
    .filter(Boolean)
    .join(" ");

  const iconEl = icon ? <Icon name={icon} className="a1-link__icon" /> : null;

  return (
    <a className={classes} {...props}>
      {resolvedPosition === "start" && iconEl}
      <span className="a1-link__text">{children}</span>
      {resolvedPosition === "end" && iconEl}
    </a>
  );
}
