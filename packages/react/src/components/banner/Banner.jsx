import "./banner.css";
import { Icon } from "../icon/Icon.jsx";
import { IconButton } from "../icon-button/IconButton.jsx";

const INLINE_ICONS = {
  neutral: "info",
  info:    "info",
  success: "check_circle",
  warn:    "warning",
  error:   "error",
};

const SYSTEM_ICONS = {
  neutral: "campaign",
  info:    "info",
  success: "check_circle",
  warn:    "warning",
  error:   "error",
};

const STATUSES = ["neutral", "info", "success", "warn", "error"];
const VARIANTS = ["inline", "system"];

export function Banner({
  variant = "inline",
  status = "neutral",
  title,
  icon,
  action,
  onDismiss,
  children,
}) {
  const resolvedVariant = VARIANTS.includes(variant) ? variant : "inline";
  const resolvedStatus  = STATUSES.includes(status)  ? status  : "neutral";
  const resolvedIcon    = icon ?? (resolvedVariant === "system" ? SYSTEM_ICONS : INLINE_ICONS)[resolvedStatus];

  return (
    <div
      className={`a1-banner a1-banner--${resolvedVariant} a1-banner--${resolvedStatus}`}
      role="alert"
      aria-live="polite"
    >
      <div className="a1-banner__inner">
        <span className="a1-banner__icon" aria-hidden="true">
          <Icon name={resolvedIcon} />
        </span>

        <div className="a1-banner__content">
          {title    && <span className="a1-banner__title">{title}</span>}
          {children && <span className="a1-banner__body">{children}</span>}
        </div>

        {action && <div className="a1-banner__action">{action}</div>}

        {onDismiss && (
          <IconButton
            icon="close"
            label="Dismiss"
            onClick={onDismiss}
            className="a1-banner__dismiss"
          />
        )}
      </div>
    </div>
  );
}
