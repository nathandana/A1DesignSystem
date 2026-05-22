import "./heading.css";

const headingSizes = ["xl", "lg", "md", "sm", "xs"];
const displaySizes = ["sm", "md", "lg", "xl", "xxl", "jumbo", "xJumbo"];
const colors = ["default", "muted", "inverse"];
const levels = ["h1", "h2", "h3", "h4", "h5", "h6"];

const levelDefaults = { h1: "xl", h2: "lg", h3: "md", h4: "sm", h5: "xs", h6: "xs" };

export function Heading({
  as: Component = "h2",
  type = "heading",
  size,
  color = "default",
  className = "",
  ...props
}) {
  const resolvedAs = levels.includes(Component) ? Component : "h2";
  const isDisplay = type === "display";
  const validSizes = isDisplay ? displaySizes : headingSizes;
  const defaultSize = isDisplay ? "md" : (levelDefaults[resolvedAs] ?? "md");
  const resolvedSize = validSizes.includes(size) ? size : defaultSize;
  const resolvedColor = colors.includes(color) ? color : "default";

  const classes = [
    "a1-heading",
    `a1-heading--${type}`,
    `a1-heading--${type}-${resolvedSize}`,
    resolvedColor !== "default" && `a1-heading--${resolvedColor}`,
    className
  ]
    .filter(Boolean)
    .join(" ");

  return <Component className={classes} {...props} />;
}
