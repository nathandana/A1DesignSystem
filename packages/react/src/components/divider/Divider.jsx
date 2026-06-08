import "./divider.css";

const orientations = ["horizontal", "vertical"];
const variants = ["subtle", "strong", "accent", "dashed", "dotted"];
const sizes = ["xs", "sm", "md", "lg"];
const spacing = ["none", "xs", "sm", "md", "lg", "xl", "xxl"];
const breakpoints = ["xs", "sm", "md", "lg", "xl"];

function isResponsiveOrientation(orientation) {
  return orientation !== null && typeof orientation === "object" && !Array.isArray(orientation);
}

function resolveBaseOrientation(orientation) {
  if (!isResponsiveOrientation(orientation)) {
    return orientations.includes(orientation) ? orientation : "horizontal";
  }
  return orientations.includes(orientation.xs) ? orientation.xs : "horizontal";
}

function getOrientationClasses(orientation) {
  if (!isResponsiveOrientation(orientation)) {
    const resolved = resolveBaseOrientation(orientation);
    return [`a1-divider--${resolved}`];
  }

  let lastKnown = resolveBaseOrientation(orientation);
  return breakpoints.map((bp) => {
    if (orientations.includes(orientation[bp])) lastKnown = orientation[bp];
    return `a1-divider--${bp}-${lastKnown === "horizontal" ? "h" : "v"}`;
  });
}

export function Divider({
  orientation = "horizontal",
  variant = "subtle",
  size = "xs",
  space = "sm",
  decorative = true,
  className = "",
  ...props
}) {
  const resolvedVariant = variants.includes(variant) ? variant : "subtle";
  const resolvedSize = sizes.includes(size) ? size : "xs";
  const resolvedSpace = spacing.includes(space) ? space : "sm";
  const resolvedOrientation = resolveBaseOrientation(orientation);

  const classes = [
    "a1-divider",
    ...getOrientationClasses(orientation),
    `a1-divider--${resolvedVariant}`,
    `a1-divider--${resolvedSize}`,
    `a1-divider--space-${resolvedSpace}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <hr
      className={classes}
      aria-orientation={decorative ? undefined : resolvedOrientation}
      role={decorative ? "presentation" : "separator"}
      {...props}
    />
  );
}
