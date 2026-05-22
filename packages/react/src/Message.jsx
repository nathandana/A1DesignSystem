import "./message.css";
import { Icon } from "./Icon.jsx";
import { IconButton } from "./IconButton.jsx";

const STATUS_ICONS = {
  neutral: "info",
  info:    "info",
  success: "check_circle",
  warn:    "warning",
  error:   "error",
};

const STATUSES   = ["neutral", "info", "success", "warn", "error"];
const ES_SCALES  = ["page", "section", "card"];

/* ═══════════════════════════════════════════════════════════════════════════
   MessageBanner
   ═══════════════════════════════════════════════════════════════════════════ */

export function MessageBanner({
  status = "neutral",
  title,
  icon,
  onDismiss,
  children,
}) {
  const resolvedStatus = STATUSES.includes(status) ? status : "neutral";
  const resolvedIcon = icon ?? STATUS_ICONS[resolvedStatus];

  return (
    <div
      className={`a1-message-banner a1-message-banner--${resolvedStatus}`}
      role="alert"
      aria-live="polite"
    >
      <span className="a1-message-banner__icon" aria-hidden="true">
        <Icon name={resolvedIcon} />
      </span>

      <div className="a1-message-banner__content">
        {title   && <p className="a1-message-banner__title">{title}</p>}
        {children && <p className="a1-message-banner__body">{children}</p>}
      </div>

      {onDismiss && (
        <IconButton
          icon="close"
          label="Dismiss"
          onClick={onDismiss}
          className="a1-message-banner__dismiss"
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MessageBadge  (inline filled status chip)
   ═══════════════════════════════════════════════════════════════════════════ */

const VARIANTS = ["bold", "subtle"];

export function MessageBadge({ status = "neutral", variant = "bold", icon, children }) {
  const resolvedStatus = STATUSES.includes(status) ? status : "neutral";
  const resolvedVariant = VARIANTS.includes(variant) ? variant : "bold";
  const resolvedIcon = icon ?? STATUS_ICONS[resolvedStatus];

  return (
    <span className={[
      "a1-message-badge",
      `a1-message-badge--${resolvedStatus}`,
      resolvedVariant === "subtle" && "a1-message-badge--subtle",
    ].filter(Boolean).join(" ")}>
      <Icon name={resolvedIcon} />
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MessageEmptyState
   ═══════════════════════════════════════════════════════════════════════════ */

export function MessageEmptyState({
  scale = "section",
  icon = "inbox",
  title,
  description,
  action,
}) {
  const resolvedScale = ES_SCALES.includes(scale) ? scale : "section";

  return (
    <div className={`a1-message-empty a1-message-empty--${resolvedScale}`}>
      <div className="a1-message-empty__icon-wrap" aria-hidden="true">
        <Icon name={icon} />
      </div>
      {title       && <p className="a1-message-empty__title">{title}</p>}
      {description && <p className="a1-message-empty__description">{description}</p>}
      {action      && <div className="a1-message-empty__action">{action}</div>}
    </div>
  );
}
