import "./message.css";
import { Icon } from "../icon/Icon.jsx";
import { IconButton } from "../icon-button/IconButton.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";

const STATUS_ICONS = {
  neutral: "info",
  info:    "info",
  success: "check_circle",
  warn:    "warning",
  error:   "error",
};

const STATUSES   = ["neutral", "info", "success", "warn", "error"];
const ES_SCALES  = ["page", "section", "card"];

const ES_SCALE_CONFIG = {
  page:    { headingAs: "h1", headingSize: "sm", paragraphSize: "lg" },
  section: { headingAs: "h2", headingSize: "xs", paragraphSize: "md" },
  card:    { headingAs: "h3", headingSize: "xs", paragraphSize: "sm" },
};

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

export function MessageBadge({ status = "neutral", subtle = false, icon, children }) {
  const resolvedStatus = STATUSES.includes(status) ? status : "neutral";
  const resolvedIcon = icon ?? STATUS_ICONS[resolvedStatus];

  return (
    <span className={[
      "a1-message-badge",
      `a1-message-badge--${resolvedStatus}`,
      subtle && "a1-message-badge--subtle",
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
  const { headingAs, headingSize, paragraphSize } = ES_SCALE_CONFIG[resolvedScale];

  return (
    <div className={`a1-message-empty a1-message-empty--${resolvedScale}`}>
      <div className="a1-message-empty__icon-wrap" aria-hidden="true">
        <Icon name={icon} />
      </div>
      {title       && (
        <Heading as={headingAs} size={headingSize} className="a1-message-empty__title">
          {title}
        </Heading>
      )}
      {description && (
        <Paragraph size={paragraphSize} color="muted" className="a1-message-empty__description">
          {description}
        </Paragraph>
      )}
      {action      && <div className="a1-message-empty__action">{action}</div>}
    </div>
  );
}
