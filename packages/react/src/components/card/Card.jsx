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

export function Card({
  as: Component = "div",
  bare = false,
  icon,
  heroIcon,
  heroColor = "action",
  className = "",
  children,
  ...props
}) {
  const classes = [
    "a1-card",
    bare && "a1-card--bare",
    heroIcon && "a1-card--has-hero",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const heroBg = HERO_COLORS[heroColor] ?? heroColor;

  return (
    <Component className={classes} {...props}>
      {heroIcon && (
        <div className="a1-card__hero" style={{ "--a1-card-hero-bg": heroBg }}>
          <Icon name={heroIcon} className="a1-card__hero-icon" />
        </div>
      )}
      {icon && (
        <span className="a1-card__icon" aria-hidden="true">
          <Icon name={icon} />
        </span>
      )}
      {children}
    </Component>
  );
}
