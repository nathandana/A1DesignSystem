import "./card.css";
import { Icon } from "../icon/Icon.jsx";
import { MessageBadge } from "../message/Message.jsx";

const HERO_COLORS = {
  action:  "var(--semantic-color-action-background)",
  neutral: "var(--semantic-color-surface-inverse)",
  info:    "var(--semantic-color-status-info-background)",
  success: "var(--semantic-color-status-success-background)",
  warn:    "var(--semantic-color-status-warn-background)",
  error:   "var(--semantic-color-status-error-background)",
};

const VALID_ICON_DISPLAY = ["none", "default", "hero"];

// 3×3 placement of a hero badge: "{block}-{inline}" where block ∈ top|middle|bottom
// and inline ∈ start|center|end.
const VALID_HERO_BADGE_POSITIONS = [
  "top-start", "top-center", "top-end",
  "middle-start", "middle-center", "middle-end",
  "bottom-start", "bottom-center", "bottom-end",
];

export function Card({
  as,
  bare = false,
  variant = "default",
  href,
  icon,
  iconDisplay = "default",
  heroColor = "action",
  heroBadge,
  heroBadgeStatus = "neutral",
  heroBadgePosition = "top-end",
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

  const badgePos = VALID_HERO_BADGE_POSITIONS.includes(heroBadgePosition)
    ? heroBadgePosition
    : "top-end";
  const [badgeBlock, badgeInline] = badgePos.split("-");

  return (
    <Component className={classes} href={href} {...interactiveProps} {...props}>
      <div className="a1-card__layout">
        {resolvedDisplay === "hero" && (
          <div className="a1-card__hero" style={{ "--a1-card-hero-bg": heroBg }}>
            <Icon name={icon} aria-hidden="true" />
            {heroBadge && (
              <span className={`a1-card__hero-badge a1-card__hero-badge--${badgeBlock} a1-card__hero-badge--${badgeInline}`}>
                <MessageBadge status={heroBadgeStatus} size="sm">{heroBadge}</MessageBadge>
              </span>
            )}
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
