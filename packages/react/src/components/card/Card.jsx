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
const VALID_SURFACES = ["default", "accent"];
const VALID_HERO_SEPARATOR_SHAPES = ["wave", "swell", "curve", "slope", "peak", "valley", "ribbon"];

const HERO_SEPARATOR_PATHS = {
  wave: {
    block: "M0,56 C9,44 20,58 31,48 C43,36 54,38 66,50 C78,62 88,56 100,42 L100,100 L0,100 Z",
    inline: "M56,0 C44,9 58,20 48,31 C36,43 38,54 50,66 C62,78 56,88 42,100 L100,100 L100,0 Z",
  },
  swell: {
    block: "M0,82 C16,78 24,28 49,24 C72,20 78,76 100,48 L100,100 L0,100 Z",
    inline: "M82,0 C78,16 28,24 24,49 C20,72 76,78 48,100 L100,100 L100,0 Z",
  },
  curve: {
    block: "M0,72 C26,40 58,34 100,60 L100,100 L0,100 Z",
    inline: "M72,0 C40,26 34,58 60,100 L100,100 L100,0 Z",
  },
  slope: {
    block: "M0,82 C30,70 66,38 100,22 L100,100 L0,100 Z",
    inline: "M82,0 C70,30 38,66 22,100 L100,100 L100,0 Z",
  },
  peak: {
    block: "M0,78 C14,70 28,58 42,24 C55,-6 70,66 100,30 L100,100 L0,100 Z",
    inline: "M78,0 C70,14 58,28 24,42 C-6,55 66,70 30,100 L100,100 L100,0 Z",
  },
  valley: {
    block: "M0,28 C17,18 32,54 49,84 C66,116 82,44 100,60 L100,100 L0,100 Z",
    inline: "M28,0 C18,17 54,32 84,49 C116,66 44,82 60,100 L100,100 L100,0 Z",
  },
  ribbon: {
    block: "M0,52 C10,28 20,78 33,50 C45,22 56,84 70,54 C82,28 91,64 100,38 L100,100 L0,100 Z",
    inline: "M52,0 C28,10 78,20 50,33 C22,45 84,56 54,70 C28,82 64,91 38,100 L100,100 L100,0 Z",
  },
};

// Status side-stripe colours (mirrors MessageBadge status tones).
const VALID_STATUS = ["neutral", "info", "success", "warn", "error"];

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
  surface = "default",
  href,
  icon,
  iconDisplay = "default",
  heroColor = "action",
  heroSeparator = false,
  heroSeparatorShape = "wave",
  heroBadge,
  heroBadgeStatus = "neutral",
  heroBadgePosition = "top-end",
  status,
  statusLabel,
  statusPulse = false,
  className = "",
  children,
  ...props
}) {
  const isNavigation = variant === "navigation";
  const Component = as ?? (isNavigation ? (href ? "a" : "button") : "div");
  const resolvedSurface = VALID_SURFACES.includes(surface) ? surface : "default";

  const resolvedDisplay = icon && VALID_ICON_DISPLAY.includes(iconDisplay)
    ? iconDisplay
    : "none";

  const resolvedStatus = resolvedSurface === "default" && VALID_STATUS.includes(status) ? status : null;
  const hasStatusBadge = resolvedStatus && statusLabel != null && statusLabel !== "";

  const classes = [
    "a1-card",
    bare && "a1-card--bare",
    !bare && resolvedSurface !== "default" && `a1-card--surface-${resolvedSurface}`,
    isNavigation && "a1-card--navigation",
    resolvedDisplay === "hero" && "a1-card--has-hero",
    resolvedDisplay === "default" && "a1-card--has-icon",
    resolvedStatus && "a1-card--has-status",
    resolvedStatus && `a1-card--status-${resolvedStatus}`,
    resolvedStatus && statusPulse && "a1-card--status-pulse",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const heroBg = HERO_COLORS[heroColor] ?? heroColor;
  const resolvedHeroSeparatorShape = VALID_HERO_SEPARATOR_SHAPES.includes(heroSeparatorShape)
    ? heroSeparatorShape
    : "wave";
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
            {heroSeparator && (
              <svg
                className={`a1-card__hero-separator a1-card__hero-separator--${resolvedHeroSeparatorShape}`}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                focusable="false"
                aria-hidden="true"
              >
                <path className="a1-card__hero-separator-path a1-card__hero-separator-path--block" d={HERO_SEPARATOR_PATHS[resolvedHeroSeparatorShape].block} />
                <path className="a1-card__hero-separator-path a1-card__hero-separator-path--inline" d={HERO_SEPARATOR_PATHS[resolvedHeroSeparatorShape].inline} />
              </svg>
            )}
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
        <div className="a1-card__content">
          {hasStatusBadge && (
            <span className="a1-card__status-badge">
              <MessageBadge status={resolvedStatus} size="sm">{statusLabel}</MessageBadge>
            </span>
          )}
          {children}
        </div>
      </div>
    </Component>
  );
}
