import "./grid.css";

const SPACING_KEYS = [1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 64, 96, 128];
const gapSizes = {
  sm: "var(--base-spacing-8)",
  md: "var(--base-spacing-16)",
  lg: "var(--base-spacing-24)",
};
const layouts = ["default", "bento"];
const breakpoints = ["xs", "sm", "md", "lg", "xl"];

function resolveGap(key) {
  if (key == null) return undefined;
  if (gapSizes[key]) return gapSizes[key];

  const n = Number(key);
  return SPACING_KEYS.includes(n) ? `var(--base-spacing-${n})` : undefined;
}

export function Grid({
  columns,
  gap,
  rowGap,
  columnGap,
  layout = "default",
  autoRows,
  className = "",
  children,
  ...props
}) {
  const classes = ["a1-grid"];
  const resolvedLayout = layouts.includes(layout) ? layout : "default";

  if (resolvedLayout !== "default") {
    classes.push(`a1-grid--${resolvedLayout}`);
  }

  let inlineCols;
  if (typeof columns === "number") {
    inlineCols = columns;
  } else if (columns && typeof columns === "object") {
    for (const [bp, count] of Object.entries(columns)) {
      classes.push(`a1-grid--${bp}-${count}`);
    }
  }

  if (className) classes.push(className);

  const gapVal    = resolveGap(gap);
  const rowGapVal = resolveGap(rowGap) ?? gapVal;
  const colGapVal = resolveGap(columnGap) ?? gapVal;

  const style = {
    ...(inlineCols != null ? { "--a1-grid-cols": inlineCols } : {}),
    ...(autoRows ? { "--a1-grid-auto-rows": autoRows } : {}),
    ...(rowGapVal  ? { rowGap: rowGapVal }    : {}),
    ...(colGapVal  ? { columnGap: colGapVal } : {}),
    ...props.style,
  };

  return (
    <div className={classes.join(" ")} style={style} {...props}>
      {children}
    </div>
  );
}

export function GridItem({
  span,
  rowSpan,
  className = "",
  children,
  ...props
}) {
  const classes = ["a1-grid-item"];

  if (span && typeof span === "object") {
    for (const [bp, value] of Object.entries(span)) {
      if (!breakpoints.includes(bp)) continue;
      if (value === "full") {
        classes.push(`a1-grid-item--${bp}-span-full`);
      } else if (typeof value === "number") {
        classes.push(`a1-grid-item--${bp}-span-${value}`);
      }
    }
  } else if (span === "full") {
    classes.push("a1-grid-item--span-full");
  } else if (typeof span === "number") {
    classes.push(`a1-grid-item--span-${span}`);
  }

  if (rowSpan && typeof rowSpan === "object") {
    for (const [bp, value] of Object.entries(rowSpan)) {
      if (breakpoints.includes(bp) && typeof value === "number") {
        classes.push(`a1-grid-item--${bp}-row-span-${value}`);
      }
    }
  } else if (typeof rowSpan === "number") {
    classes.push(`a1-grid-item--row-span-${rowSpan}`);
  }

  if (className) classes.push(className);

  return (
    <div className={classes.join(" ")} {...props}>
      {children}
    </div>
  );
}
