import "../../themes.css";
import "../../color-scheme.css";
import "./section.css";

const VALID_PADDING = ["lg", "md", "sm", "none"];
const VALID_SURFACES = ["page", "panel", "raised"];
const VALID_GAPS = ["xs", "sm", "md", "lg"];
const VALID_GRADIENTS = ["accent", "highlight", "info", "success", "warn"];
const VALID_GRADIENT_POSITIONS = [
  "top",
  "top-right",
  "right",
  "bottom-right",
  "bottom",
  "bottom-left",
  "left",
  "top-left",
  "center",
];

export function Section({
  as: Component = "section",
  padding = "md",
  surface,
  gap,
  gradient,
  gradientPosition = "center",
  inverse = false,
  className = "",
  children,
  ...props
}) {
  const classes = ["a1-section"];

  if (typeof padding === "string") {
    if (VALID_PADDING.includes(padding)) {
      classes.push(`a1-section--padding-${padding}`);
    }
  } else if (padding && typeof padding === "object") {
    for (const [bp, size] of Object.entries(padding)) {
      if (VALID_PADDING.includes(size)) {
        classes.push(`a1-section--${bp}-padding-${size}`);
      }
    }
  }

  if (surface && VALID_SURFACES.includes(surface)) {
    classes.push(`a1-section--surface-${surface}`);
  }

  if (gap && VALID_GAPS.includes(gap)) {
    classes.push(`a1-section--gap-${gap}`);
  }

  if (gradient && VALID_GRADIENTS.includes(gradient)) {
    classes.push(`a1-section--gradient-${gradient}`);
  }

  if (gradient && VALID_GRADIENT_POSITIONS.includes(gradientPosition)) {
    classes.push(`a1-section--gradient-${gradientPosition}`);
  }

  if (inverse) {
    classes.push("a1-inverse");
  }

  if (className) classes.push(className);

  return (
    <Component className={classes.join(" ")} {...props}>
      {children}
    </Component>
  );
}
