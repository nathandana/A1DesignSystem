import "./stack.css";
import { resolveSpacing } from "../structure-utils.js";

const directions = ["column", "column-reverse", "row", "row-reverse"];
const alignments = ["stretch", "start", "center", "end", "baseline"];
const justifications = ["start", "center", "end", "between", "around", "evenly"];
const semanticGaps = ["xs", "sm", "md", "lg", "xl"];
const breakpoints = ["xs", "sm", "md", "lg", "xl"];

function resolveGap(gap) {
  if (semanticGaps.includes(gap)) return `var(--semantic-spacing-gap-${gap})`;
  return resolveSpacing(gap);
}

function isResponsive(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function resolveBaseDirection(direction) {
  if (!isResponsive(direction)) return directions.includes(direction) ? direction : "column";
  return directions.includes(direction.xs) ? direction.xs : "column";
}

function getResponsiveDirectionStyle(direction) {
  const base = resolveBaseDirection(direction);
  let lastKnown = base;
  return breakpoints.slice(1).reduce((style, bp) => {
    if (isResponsive(direction) && directions.includes(direction[bp])) {
      lastKnown = direction[bp];
    }
    style[`--a1-stack-direction-${bp}`] = lastKnown;
    return style;
  }, {});
}

function resolveBaseJustify(justify) {
  if (!isResponsive(justify)) return justifications.includes(justify) ? justify : "start";
  return justifications.includes(justify.xs) ? justify.xs : "start";
}

function getResponsiveJustifyStyle(justify) {
  if (!isResponsive(justify)) return {};
  const base = resolveBaseJustify(justify);
  let lastKnown = base;
  return breakpoints.slice(1).reduce((style, bp) => {
    if (justifications.includes(justify[bp])) lastKnown = justify[bp];
    style[`--a1-stack-justify-${bp}`] = justifyMap[lastKnown];
    return style;
  }, {});
}

const justifyMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};

const alignMap = {
  stretch: "stretch",
  start: "flex-start",
  center: "center",
  end: "flex-end",
  baseline: "baseline",
};

export function Stack({
  as: Component = "div",
  direction = "column",
  gap = 16,
  align = "stretch",
  justify = "start",
  wrap = false,
  className = "",
  children,
  ...props
}) {
  const resolvedDirection = resolveBaseDirection(direction);
  const resolvedAlign = alignments.includes(align) ? align : "stretch";
  const resolvedJustify = resolveBaseJustify(justify);

  const style = {
    "--a1-stack-direction": resolvedDirection,
    "--a1-stack-gap": resolveGap(gap),
    "--a1-stack-align": alignMap[resolvedAlign],
    "--a1-stack-justify": justifyMap[resolvedJustify],
    "--a1-stack-wrap": wrap ? "wrap" : "nowrap",
    ...getResponsiveDirectionStyle(direction),
    ...getResponsiveJustifyStyle(justify),
    ...props.style,
  };

  return (
    <Component className={["a1-stack", className].filter(Boolean).join(" ")} style={style} {...props}>
      {children}
    </Component>
  );
}
