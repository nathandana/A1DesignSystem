import "./button.css";
import { CircularProgress } from "../circular-progress/CircularProgress.jsx";
import { Icon } from "../icon/Icon.jsx";

const variants = ["primary", "secondary", "tertiary", "destructive", "success"];
const sizes = ["sm", "md", "lg"];
const iconPositions = ["start", "end"];

export function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "start",
  fullWidth = false,
  loading = false,
  className = "",
  type,
  disabled,
  children,
  ...props
}) {
  const resolvedVariant = variants.includes(variant) ? variant : "primary";
  const resolvedSize = sizes.includes(size) ? size : "md";
  const resolvedPosition = iconPositions.includes(iconPosition) ? iconPosition : "start";
  const isButton = Component === "button";
  const isInert = disabled || loading;
  const classes = [
    "a1-button",
    `a1-button--${resolvedVariant}`,
    resolvedSize !== "md" && `a1-button--${resolvedSize}`,
    icon && "a1-button--has-icon",
    fullWidth && "a1-button--full-width",
    loading && "a1-button--loading",
    className
  ]
    .filter(Boolean)
    .join(" ");

  const iconEl = icon ? <Icon name={icon} className="a1-button__icon" /> : null;
  // While loading, CircularProgress replaces the icon and the button becomes inert.
  const spinnerEl = loading
    ? (
        <CircularProgress
          className="a1-button__spinner"
          size="xs"
          indeterminate
          role="presentation"
          aria-hidden="true"
        />
      )
    : null;

  return (
    <Component
      className={classes}
      type={isButton ? type ?? "button" : type}
      disabled={isButton ? isInert || undefined : undefined}
      aria-disabled={!isButton && isInert ? "true" : undefined}
      aria-busy={loading ? "true" : undefined}
      {...props}
    >
      {loading ? spinnerEl : resolvedPosition === "start" && iconEl}
      {children}
      {!loading && resolvedPosition === "end" && iconEl}
    </Component>
  );
}
