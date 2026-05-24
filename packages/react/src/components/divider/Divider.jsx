import "./divider.css";

const orientations = ["horizontal", "vertical"];
const variants = ["subtle", "strong", "accent", "dashed", "dotted"];
const sizes = ["xs", "sm", "md", "lg"];
const spacing = ["none", "xs", "sm", "md", "lg"];

export function Divider({
  orientation = "horizontal",
  variant = "subtle",
  size = "xs",
  space = "sm",
  decorative = true,
  className = "",
  ...props
}) {
  const resolvedOrientation = orientations.includes(orientation) ? orientation : "horizontal";
  const resolvedVariant = variants.includes(variant) ? variant : "subtle";
  const resolvedSize = sizes.includes(size) ? size : "xs";
  const resolvedSpace = spacing.includes(space) ? space : "sm";

  const classes = [
    "a1-divider",
    `a1-divider--${resolvedOrientation}`,
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
