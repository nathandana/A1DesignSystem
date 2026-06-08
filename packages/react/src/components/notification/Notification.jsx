import "./notification.css";

const statuses = ["neutral", "error", "success", "warn", "info"];
const positions = ["top-right", "top-left", "bottom-right", "bottom-left"];

function formatCount(n, max) {
  if (n >= 1_000_000) return +(n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return +(n / 1_000).toFixed(1) + "k";
  if (n > max)        return `${max}+`;
  return String(n);
}

export function Notification({
  children,
  count,
  label,
  dot = false,
  status = "neutral",
  position = "top-right",
  max = 99,
}) {
  const resolvedStatus = statuses.includes(status) ? status : "neutral";
  const resolvedPosition = positions.includes(position) ? position : "top-right";

  const isDot = dot || (count === undefined && label === undefined);

  let content = null;
  if (!isDot) {
    if (count !== undefined) {
      content = formatCount(count, max);
    } else {
      content = label;
    }
  }

  const classes = [
    "a1-notification",
    `a1-notification--${resolvedStatus}`,
    `a1-notification--${resolvedPosition}`,
    isDot && "a1-notification--dot",
  ]
    .filter(Boolean)
    .join(" ");

  const ariaLabel = count !== undefined ? `${count} notifications` : undefined;

  return (
    <span className="a1-notification-root">
      {children}
      <span className={classes} role={ariaLabel ? "img" : undefined} aria-label={ariaLabel}>
        {content}
      </span>
    </span>
  );
}
