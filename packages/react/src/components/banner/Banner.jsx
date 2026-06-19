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
const VARIANTS = ["inline", "system", "calendar"];

// Derive the month/day for the calendar callout. `date` may be a Date, an
// ISO-ish string, or an object `{ month, day }`. Month uses the locale's short
// name (sentence case — never uppercased).
function dateParts(date) {
  if (!date) return null;
  if (typeof date === "object" && !(date instanceof Date)) {
    return { month: String(date.month ?? ""), day: String(date.day ?? "") };
  }
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return { month: "", day: String(date) };
  return { month: d.toLocaleDateString(undefined, { month: "short" }), day: String(d.getDate()) };
}

export function Banner({
  variant = "inline",
  status = "neutral",
  title,
  eyebrow,
  date,
  icon,
  action,
  onDismiss,
  className = "",
  children,
  ...rest
}) {
  const resolvedVariant = VARIANTS.includes(variant) ? variant : "inline";
  const resolvedStatus  = STATUSES.includes(status)  ? status  : "neutral";
  const isCalendar      = resolvedVariant === "calendar";
  const resolvedIcon    = icon ?? (resolvedVariant === "system" ? SYSTEM_ICONS : INLINE_ICONS)[resolvedStatus];
  const dp              = isCalendar ? dateParts(date) : null;

  return (
    <div
      className={`a1-banner a1-banner--${resolvedVariant} a1-banner--${resolvedStatus}${className ? ` ${className}` : ""}`}
      // A calendar/event callout isn't an alert — keep it a quiet region.
      role={isCalendar ? "group" : "alert"}
      {...(isCalendar ? {} : { "aria-live": "polite" })}
      {...rest}
    >
      <div className="a1-banner__inner">
        {isCalendar && dp ? (
          <span className="a1-banner__date" aria-hidden="true">
            {dp.month && <span className="a1-banner__date-month">{dp.month}</span>}
            {dp.day && <span className="a1-banner__date-day">{dp.day}</span>}
          </span>
        ) : (
          <span className="a1-banner__icon" aria-hidden="true">
            <Icon name={resolvedIcon} />
          </span>
        )}

        <div className="a1-banner__content">
          {isCalendar && eyebrow && <span className="a1-banner__eyebrow">{eyebrow}</span>}
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
