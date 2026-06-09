import "./circular-progress.css";

const SIZES = ["xs", "sm", "md", "lg"];

// SVG uses a 100×100 viewBox with a 10-unit stroke so the ring scales
// proportionally when the container size changes via CSS.
const VIEWBOX = 100;
const STROKE  = 10;
const R       = (VIEWBOX - STROKE) / 2;       // 45
const CIRC    = 2 * Math.PI * R;              // ≈ 282.74
const ARC     = CIRC * 0.25;                  // 25% arc for indeterminate

export function CircularProgress({
  value         = 0,
  max           = 100,
  size          = "md",
  indeterminate = false,
  children,
  className     = "",
  ...props
}) {
  const resolvedSize = SIZES.includes(size) ? size : "md";
  const hasInner     = resolvedSize !== "xs";

  const pct        = Math.min(1, Math.max(0, max > 0 ? value / max : 0));
  const dashArray  = indeterminate ? `${ARC} ${CIRC - ARC}` : CIRC;
  const dashOffset = indeterminate ? 0 : CIRC * (1 - pct);

  const classes = [
    "a1-circular-progress",
    resolvedSize !== "md" && `a1-circular-progress--${resolvedSize}`,
    indeterminate && "a1-circular-progress--indeterminate",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={max}
      {...props}
    >
      <div className="a1-circular-progress__ring">
        <svg
          className="a1-circular-progress__svg"
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          aria-hidden="true"
        >
          <circle
            className="a1-circular-progress__track"
            cx={VIEWBOX / 2}
            cy={VIEWBOX / 2}
            r={R}
            fill="none"
            strokeWidth={STROKE}
          />
          <circle
            className="a1-circular-progress__fill"
            cx={VIEWBOX / 2}
            cy={VIEWBOX / 2}
            r={R}
            fill="none"
            strokeWidth={STROKE}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${VIEWBOX / 2} ${VIEWBOX / 2})`}
          />
        </svg>
        {hasInner && children && (
          <div className="a1-circular-progress__inner" aria-hidden="true">
            {children}
          </div>
        )}
      </div>
      {!hasInner && children && (
        <div className="a1-circular-progress__after">
          {children}
        </div>
      )}
    </div>
  );
}
