import "./grid.css";

const SPACING_KEYS = [1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 64, 96, 128];

function resolveGap(key) {
  if (key == null) return undefined;
  const n = Number(key);
  return SPACING_KEYS.includes(n) ? `var(--base-spacing-${n})` : undefined;
}

export function Grid({
  columns,
  gap,
  rowGap,
  columnGap,
  className = "",
  children,
  ...props
}) {
  const classes = ["a1-grid"];

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

  if (span === "full") {
    classes.push("a1-grid-item--span-full");
  } else if (typeof span === "number") {
    classes.push(`a1-grid-item--span-${span}`);
  }

  if (typeof rowSpan === "number") {
    classes.push(`a1-grid-item--row-span-${rowSpan}`);
  }

  if (className) classes.push(className);

  return (
    <div className={classes.join(" ")} {...props}>
      {children}
    </div>
  );
}
