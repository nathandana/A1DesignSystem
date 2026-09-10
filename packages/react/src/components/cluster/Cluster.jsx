"use client";

import "./cluster.css";
import { resolveSpacing } from "../structure-utils.js";

// Deprecated (2026-07-03): use <Stack direction="row" wrap> instead. Removal
// is planned for the next major version.
let warnedDeprecated = false;
function warnDeprecated() {
  if (typeof process !== "undefined" && process.env && process.env.NODE_ENV === "production") return;
  if (warnedDeprecated) return;
  warnedDeprecated = true;
  console.warn('[a1] Cluster is deprecated — use <Stack direction="row" wrap> instead. It will be removed in the next major version.');
}

const alignments = ["start", "center", "end", "stretch", "baseline"];
const justifications = ["start", "center", "end", "between", "around", "evenly"];
const semanticGaps = ["xs", "sm", "md", "lg", "xl"];

function resolveGap(gap) {
  if (semanticGaps.includes(gap)) return `var(--semantic-spacing-gap-${gap})`;
  return resolveSpacing(gap);
}

const alignMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
  baseline: "baseline",
};

const justifyMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};

export function Cluster({
  as: Component = "div",
  gap = 8,
  rowGap,
  columnGap,
  align = "center",
  justify = "start",
  className = "",
  children,
  ...props
}) {
  warnDeprecated();
  const resolvedAlign = alignments.includes(align) ? align : "center";
  const resolvedJustify = justifications.includes(justify) ? justify : "start";
  const gapValue = resolveGap(gap);

  const style = {
    "--a1-cluster-row-gap": resolveGap(rowGap) ?? gapValue,
    "--a1-cluster-column-gap": resolveGap(columnGap) ?? gapValue,
    "--a1-cluster-align": alignMap[resolvedAlign],
    "--a1-cluster-justify": justifyMap[resolvedJustify],
    ...props.style,
  };

  return (
    <Component className={["a1-cluster", className].filter(Boolean).join(" ")} style={style} {...props}>
      {children}
    </Component>
  );
}
