import "./badge.css";

const variants = ["default", "error", "success", "warn", "info"];
const positions = ["top-right", "top-left", "bottom-right", "bottom-left"];

function formatCount(n, max) {
  if (n >= 1_000_000) return +(n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return +(n / 1_000).toFixed(1) + "k";
  if (n > max)        return `${max}+`;
  return String(n);
}

export function Badge({
  children,
  count,
  label,
  dot = false,
  variant = "default",
  position = "top-right",
  max = 99,
}) {
  const resolvedVariant = variants.includes(variant) ? variant : "default";
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

  const badgeClasses = [
    "a1-badge",
    `a1-badge--${resolvedVariant}`,
    `a1-badge--${resolvedPosition}`,
    isDot && "a1-badge--dot",
  ]
    .filter(Boolean)
    .join(" ");

  const ariaLabel = count !== undefined ? `${count} notifications` : undefined;

  return (
    <span className="a1-badge-root">
      {children}
      <span className={badgeClasses} aria-label={ariaLabel}>
        {content}
      </span>
    </span>
  );
}
