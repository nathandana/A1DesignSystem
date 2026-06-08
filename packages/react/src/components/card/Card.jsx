import "./card.css";
import { Icon } from "../icon/Icon.jsx";

const HERO_COLORS = {
  action:  "var(--semantic-color-action-background)",
  neutral: "var(--semantic-color-surface-inverse)",
  info:    "var(--semantic-color-status-info-background)",
  success: "var(--semantic-color-status-success-background)",
  warn:    "var(--semantic-color-status-warn-background)",
  error:   "var(--semantic-color-status-error-background)",
};

const VALID_ICON_DISPLAY = ["none", "default", "hero"];

export function Card({
  as,
  bare = false,
  variant = "default",
  href,
  icon,
  iconDisplay = "default",
  heroColor = "action",
  className = "",
  children,
  ...props
}) {
  const isNavigation = variant === "navigation";
  const Component = as ?? (isNavigation ? (href ? "a" : "button") : "div");

  const resolvedDisplay = icon && VALID_ICON_DISPLAY.includes(iconDisplay)
    ? iconDisplay
    : "none";

  const classes = [
    "a1-card",
    bare && "a1-card--bare",
    isNavigation && "a1-card--navigation",
    resolvedDisplay === "hero" && "a1-card--has-hero",
    resolvedDisplay === "default" && "a1-card--has-icon",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const heroBg = HERO_COLORS[heroColor] ?? heroColor;
  const interactiveProps = isNavigation && Component === "button" && !props.type
    ? { type: "button" }
    : {};

  return (
    <Component className={classes} href={href} {...interactiveProps} {...props}>
      <div className="a1-card__layout">
        {resolvedDisplay === "hero" && (
          <div className="a1-card__hero" style={{ "--a1-card-hero-bg": heroBg }}>
            <Icon name={icon} aria-hidden="true" />
          </div>
        )}
        {resolvedDisplay === "default" && (
          <span className="a1-card__icon" aria-hidden="true">
            <Icon name={icon} />
          </span>
        )}
        <div className="a1-card__content">{children}</div>
      </div>
    </Component>
  );
}
