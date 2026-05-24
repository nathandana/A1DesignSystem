import "./stack.css";
import { resolveSpacing } from "../structure-utils.js";

const directions = ["column", "column-reverse", "row", "row-reverse"];
const alignments = ["stretch", "start", "center", "end", "baseline"];
const justifications = ["start", "center", "end", "between", "around", "evenly"];

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
  const resolvedDirection = directions.includes(direction) ? direction : "column";
  const resolvedAlign = alignments.includes(align) ? align : "stretch";
  const resolvedJustify = justifications.includes(justify) ? justify : "start";

  const style = {
    "--a1-stack-direction": resolvedDirection,
    "--a1-stack-gap": resolveSpacing(gap),
    "--a1-stack-align": alignMap[resolvedAlign],
    "--a1-stack-justify": justifyMap[resolvedJustify],
    "--a1-stack-wrap": wrap ? "wrap" : "nowrap",
    ...props.style,
  };

  return (
    <Component className={["a1-stack", className].filter(Boolean).join(" ")} style={style} {...props}>
      {children}
    </Component>
  );
}
