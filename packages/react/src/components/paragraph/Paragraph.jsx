import "./paragraph.css";

const sizes = ["xs", "sm", "md", "lg", "xl"];
const colors = ["default", "muted"];
const breakpoints = ["xs", "sm", "md", "lg", "xl"];

function isResponsiveSize(size) {
  return size && typeof size === "object" && !Array.isArray(size);
}

function resolveBaseSize(size) {
  if (!isResponsiveSize(size)) return sizes.includes(size) ? size : "md";
  return sizes.includes(size.xs) ? size.xs : "md";
}

function getResponsiveSizeStyle(size) {
  if (!isResponsiveSize(size)) return {};
  return breakpoints.slice(1).reduce((style, bp) => {
    if (sizes.includes(size[bp])) {
      style[`--a1-paragraph-size-${bp}`] = `var(--semantic-font-size-body-${size[bp]})`;
    }
    return style;
  }, {});
}

export function Paragraph({
  as: Component = "p",
  size = "md",
  color = "default",
  className = "",
  style,
  ...props
}) {
  const resolvedSize = resolveBaseSize(size);
  const resolvedColor = colors.includes(color) ? color : "default";
  const responsiveStyle = getResponsiveSizeStyle(size);
  const resolvedStyle = Object.keys(responsiveStyle).length
    ? { ...responsiveStyle, ...style }
    : style;

  const classes = [
    "a1-paragraph",
    `a1-paragraph--${resolvedSize}`,
    resolvedColor !== "default" && `a1-paragraph--${resolvedColor}`,
    className
  ]
    .filter(Boolean)
    .join(" ");

  return <Component className={classes} style={resolvedStyle} {...props} />;
}
