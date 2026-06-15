import "../../themes.css";
import "../../color-scheme.css";
import "./section.css";

const VALID_PADDING = ["lg", "md", "sm", "xs", "none"];
const VALID_SURFACES = ["page", "panel", "raised"];
const VALID_GAPS = ["xs", "sm", "md", "lg", "xl"];
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
const VALID_CONTENT_WIDTHS = ["xs", "sm", "md", "lg", "xl", "2xl"];
const VALID_HEIGHTS = ["screen", "hero"];
const VALID_ALIGNMENTS = ["left", "center", "right"];
const VALID_BORDER_SIZES = ["xs", "sm", "md", "lg"];
const VALID_BORDER_STYLES = ["solid", "dashed", "dotted"];
const VALID_BORDER_VARIANTS = ["subtle", "strong", "accent"];
const VALID_RADII = ["none", "sm", "md", "lg", "xl"];

export function Section({
  as: Component = "section",
  padding = "md",
  surface,
  gap,
  gradient,
  gradientPosition = "center",
  inverse = false,
  contentWidth,
  height,
  align,
  borderSize,
  borderStyle = "solid",
  borderVariant = "subtle",
  radius,
  className = "",
  children,
  ...props
}) {
  const classes = ["a1-section"];
  const resolvedContentWidth = VALID_CONTENT_WIDTHS.includes(contentWidth) ? contentWidth : null;

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

  // When contentWidth is set, gap moves to the inner wrapper — keep section flat.
  if (gap && VALID_GAPS.includes(gap) && !resolvedContentWidth) {
    classes.push(`a1-section--gap-${gap}`);
  }

  if (gradient && VALID_GRADIENTS.includes(gradient)) {
    classes.push(`a1-section--gradient-${gradient}`);
  }

  if (gradient && VALID_GRADIENT_POSITIONS.includes(gradientPosition)) {
    classes.push(`a1-section--gradient-${gradientPosition}`);
  }

  if (height && VALID_HEIGHTS.includes(height)) {
    classes.push(`a1-section--height-${height}`);
  }

  if (typeof align === "string") {
    if (VALID_ALIGNMENTS.includes(align)) {
      classes.push(`a1-section--align-${align}`);
    }
  } else if (align && typeof align === "object") {
    for (const [bp, alignVal] of Object.entries(align)) {
      if (VALID_ALIGNMENTS.includes(alignVal)) {
        classes.push(`a1-section--${bp}-align-${alignVal}`);
      }
    }
  }

  if (inverse) {
    classes.push("a1-inverse");
  }

  if (borderSize && VALID_BORDER_SIZES.includes(borderSize)) {
    classes.push(`a1-section--border-${borderSize}`);
  }

  if (borderStyle && VALID_BORDER_STYLES.includes(borderStyle)) {
    classes.push(`a1-section--border-${borderStyle}`);
  }

  if (borderVariant && VALID_BORDER_VARIANTS.includes(borderVariant)) {
    classes.push(`a1-section--border-${borderVariant}`);
  }

  if (radius && VALID_RADII.includes(radius)) {
    classes.push(`a1-section--radius-${radius}`);
  }

  if (className) classes.push(className);

  const innerClasses = [
    "a1-section__inner",
    resolvedContentWidth && `a1-section__inner--${resolvedContentWidth}`,
    gap && VALID_GAPS.includes(gap) && `a1-section--gap-${gap}`,
  ].filter(Boolean).join(" ");

  return (
    <Component className={classes.join(" ")} {...props}>
      {resolvedContentWidth ? (
        <div className={innerClasses}>
          {children}
        </div>
      ) : children}
    </Component>
  );
}
