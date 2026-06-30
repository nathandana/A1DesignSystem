import "./stat.css";
import { Icon } from "../icon/Icon.jsx";
import { MessageBadge } from "../message/Message.jsx";

const BADGE_STATUSES = ["neutral", "info", "success", "warn", "error"];
const BADGE_SIZES = ["sm", "md", "lg"];
const FORMATS = ["none", "number", "percent"];
const SIZES = ["xs", "sm", "md", "lg", "xl"];
const ALIGNS = ["start", "center", "end"];

function isNumberLike(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function formatNumber(value, { locale, precision, groupSeparator, decimalSeparator }) {
  const options = {
    useGrouping: groupSeparator !== false,
  };

  if (typeof precision === "number") {
    options.minimumFractionDigits = precision;
    options.maximumFractionDigits = precision;
  }

  let formatted = new Intl.NumberFormat(locale, options).format(value);
  if (typeof groupSeparator === "string" && groupSeparator.length > 0) {
    formatted = formatted.replaceAll(",", groupSeparator);
  }
  if (typeof decimalSeparator === "string" && decimalSeparator.length > 0) {
    formatted = formatted.replace(".", decimalSeparator);
  }
  return formatted;
}

function formatValue(value, { format, ...options }) {
  if (format === "none") return value;
  if (!isNumberLike(value)) return value;
  const formatted = formatNumber(value, options);
  return format === "percent" ? `${formatted}%` : formatted;
}

export function Stat({
  as,
  title,
  value,
  prefix,
  suffix,
  description,
  icon,
  badge,
  badgeStatus = "neutral",
  badgeSubtle = true,
  badgeSize = "sm",
  badgeIcon,
  format = "number",
  size = "md",
  align = "start",
  locale,
  precision,
  groupSeparator,
  decimalSeparator,
  className = "",
  ...props
}) {
  const Component = as ?? "div";
  const resolvedBadgeStatus = BADGE_STATUSES.includes(badgeStatus) ? badgeStatus : "neutral";
  const resolvedBadgeSize = BADGE_SIZES.includes(badgeSize) ? badgeSize : "sm";
  const resolvedFormat = FORMATS.includes(format) ? format : "number";
  const resolvedSize = SIZES.includes(size) ? size : "md";
  const resolvedAlign = ALIGNS.includes(align) ? align : "start";
  const hasTitle = title != null && title !== "";
  const hasDescription = description != null && description !== "";
  const hasBadge = badge != null && badge !== "";

  const classes = [
    "a1-stat",
    `a1-stat--${resolvedSize}`,
    `a1-stat--align-${resolvedAlign}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <Component className={classes} {...props}>
      {hasTitle && (
        <div className="a1-stat__title">
          {icon && <Icon name={icon} aria-hidden="true" className="a1-stat__title-icon" />}
          <span>{title}</span>
        </div>
      )}
      <div className="a1-stat__value-row">
        {prefix != null && prefix !== "" && <span className="a1-stat__affix a1-stat__prefix">{prefix}</span>}
        <span className="a1-stat__value">
          {formatValue(value, { format: resolvedFormat, locale, precision, groupSeparator, decimalSeparator })}
        </span>
        {suffix != null && suffix !== "" && <span className="a1-stat__affix a1-stat__suffix">{suffix}</span>}
      </div>
      {(hasDescription || hasBadge) && (
        <div className="a1-stat__meta">
          {hasDescription && <span className="a1-stat__description">{description}</span>}
          {hasBadge && (
            <MessageBadge status={resolvedBadgeStatus} subtle={badgeSubtle} size={resolvedBadgeSize} icon={badgeIcon}>
              {badge}
            </MessageBadge>
          )}
        </div>
      )}
    </Component>
  );
}
