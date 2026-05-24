import "./cluster.css";
import { resolveSpacing } from "../structure-utils.js";

const alignments = ["start", "center", "end", "stretch", "baseline"];
const justifications = ["start", "center", "end", "between", "around", "evenly"];

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
  const resolvedAlign = alignments.includes(align) ? align : "center";
  const resolvedJustify = justifications.includes(justify) ? justify : "start";
  const gapValue = resolveSpacing(gap);

  const style = {
    "--a1-cluster-row-gap": resolveSpacing(rowGap) ?? gapValue,
    "--a1-cluster-column-gap": resolveSpacing(columnGap) ?? gapValue,
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
