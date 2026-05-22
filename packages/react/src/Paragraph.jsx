import "./paragraph.css";

const sizes = ["xs", "sm", "md", "lg", "xl"];
const colors = ["default", "muted"];

export function Paragraph({
  as: Component = "p",
  size = "md",
  color = "default",
  className = "",
  ...props
}) {
  const resolvedSize = sizes.includes(size) ? size : "md";
  const resolvedColor = colors.includes(color) ? color : "default";

  const classes = [
    "a1-paragraph",
    `a1-paragraph--${resolvedSize}`,
    resolvedColor !== "default" && `a1-paragraph--${resolvedColor}`,
    className
  ]
    .filter(Boolean)
    .join(" ");

  return <Component className={classes} {...props} />;
}
