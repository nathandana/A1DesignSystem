import "./heading.css";

const headingSizes = ["xl", "lg", "md", "sm", "xs"];
const displaySizes = ["sm", "md", "lg", "xl", "xxl", "jumbo", "xJumbo"];
const colors = ["default", "muted", "accent"];
const levels = ["h1", "h2", "h3", "h4", "h5", "h6"];
const breakpoints = ["xs", "sm", "md", "lg", "xl"];

const levelDefaults = { h1: "xl", h2: "lg", h3: "md", h4: "sm", h5: "xs", h6: "xs" };

function isResponsiveSize(size) {
  return size && typeof size === "object" && !Array.isArray(size);
}

function resolveSize(size, validSizes, defaultSize) {
  if (!isResponsiveSize(size)) {
    return validSizes.includes(size) ? size : defaultSize;
  }

  return validSizes.includes(size.xs) ? size.xs : defaultSize;
}

function getResponsiveSizeStyle(size, type, validSizes) {
  if (!isResponsiveSize(size)) return {};

  return breakpoints.slice(1).reduce((style, breakpoint) => {
    const breakpointSize = size[breakpoint];

    if (validSizes.includes(breakpointSize)) {
      style[`--a1-heading-size-${breakpoint}`] =
        `var(--semantic-font-size-${type}-${breakpointSize === "xJumbo" ? "x-jumbo" : breakpointSize})`;
    }

    return style;
  }, {});
}

export function Heading({
  as: Component = "h2",
  type = "heading",
  size,
  color = "default",
  className = "",
  style,
  ...props
}) {
  const resolvedAs = levels.includes(Component) ? Component : "h2";
  const isDisplay = type === "display";
  const validSizes = isDisplay ? displaySizes : headingSizes;
  const defaultSize = isDisplay ? "md" : (levelDefaults[resolvedAs] ?? "md");
  const resolvedSize = resolveSize(size, validSizes, defaultSize);
  const resolvedColor = colors.includes(color) ? color : "default";
  const responsiveSizeStyle = getResponsiveSizeStyle(size, type, validSizes);
  const resolvedStyle = Object.keys(responsiveSizeStyle).length
    ? { ...responsiveSizeStyle, ...style }
    : style;

  const classes = [
    "a1-heading",
    `a1-heading--${type}`,
    `a1-heading--${type}-${resolvedSize}`,
    resolvedColor !== "default" && `a1-heading--${resolvedColor}`,
    className
  ]
    .filter(Boolean)
    .join(" ");

  return <Component className={classes} style={resolvedStyle} {...props} />;
}

export function HeadingMark({
  children,
  variant = "highlight",
  underlineStyle = "swoop",
  className = "",
  ...props
}) {
  const resolvedVariant = variant === "underline" ? "underline" : "highlight";
  const resolvedUnderlineStyle = ["swoop", "wave", "sketch"].includes(underlineStyle)
    ? underlineStyle
    : "swoop";

  const classes = [
    "a1-heading-mark",
    `a1-heading-mark--${resolvedVariant}`,
    resolvedVariant === "underline" && `a1-heading-mark--underline-${resolvedUnderlineStyle}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
