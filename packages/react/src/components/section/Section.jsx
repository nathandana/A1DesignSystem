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
const VALID_BG_FITS = ["cover", "contain", "tile"];
const VALID_BG_POSITIONS = [
  "center",
  "top",
  "bottom",
  "left",
  "right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];
const VALID_BG_OVERLAYS = ["darken", "lighten"];
const VALID_BG_OVERLAY_STRENGTHS = ["sm", "md", "lg"];
const VALID_BORDER_SIZES = ["xs", "sm", "md", "lg"];
const VALID_BORDER_STYLES = ["solid", "dashed", "dotted"];
const VALID_BORDER_VARIANTS = ["subtle", "strong", "accent"];
const VALID_BORDER_SIDES = ["top", "right", "bottom", "left"];
const VALID_RADII = ["none", "sm", "md", "lg", "xl"];

// Resolve which sides get the border. `null` means all sides (the default);
// an array means only those sides (an empty array means no border).
function resolveBorderSides(borderSides) {
  if (borderSides == null || borderSides === "all") return null;
  const arr = Array.isArray(borderSides) ? borderSides : [borderSides];
  const sides = VALID_BORDER_SIDES.filter((side) => arr.includes(side));
  if (sides.length === VALID_BORDER_SIDES.length) return null; // all four = all
  return sides;
}

export function Section({
  as: Component = "section",
  padding = "md",
  surface,
  gap,
  gradient,
  gradientPosition = "center",
  backgroundImage,
  backgroundFit = "cover",
  backgroundPosition = "center",
  backgroundOverlay,
  backgroundOverlayStrength = "md",
  inverse = false,
  contentWidth,
  height,
  align,
  borderSize,
  borderStyle = "solid",
  borderVariant = "subtle",
  borderSides,
  radius,
  className = "",
  style,
  children,
  ...props
}) {
  const classes = ["a1-section"];
  const resolvedContentWidth = VALID_CONTENT_WIDTHS.includes(contentWidth) ? contentWidth : null;
  const hasBgImage = typeof backgroundImage === "string" && backgroundImage.length > 0;

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

  // A background image and the gradient wash both own the background stack —
  // the image wins and the gradient is suppressed while one is set.
  if (!hasBgImage && gradient && VALID_GRADIENTS.includes(gradient)) {
    classes.push(`a1-section--gradient-${gradient}`);

    if (VALID_GRADIENT_POSITIONS.includes(gradientPosition)) {
      classes.push(`a1-section--gradient-${gradientPosition}`);
    }
  }

  if (hasBgImage) {
    classes.push("a1-section--has-bg-image");

    if (backgroundFit !== "cover" && VALID_BG_FITS.includes(backgroundFit)) {
      classes.push(`a1-section--bg-fit-${backgroundFit}`);
    }

    if (backgroundPosition !== "center" && VALID_BG_POSITIONS.includes(backgroundPosition)) {
      classes.push(`a1-section--bg-pos-${backgroundPosition}`);
    }

    if (backgroundOverlay && VALID_BG_OVERLAYS.includes(backgroundOverlay)) {
      classes.push(`a1-section--bg-overlay-${backgroundOverlay}`);

      if (VALID_BG_OVERLAY_STRENGTHS.includes(backgroundOverlayStrength)) {
        classes.push(`a1-section--bg-overlay-strength-${backgroundOverlayStrength}`);
      }
    }
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

    // Per-side borders. Omitted / "all" draws all four sides (default).
    const sides = resolveBorderSides(borderSides);
    if (sides) {
      classes.push("a1-section--border-sided");
      sides.forEach((side) => classes.push(`a1-section--border-side-${side}`));
    }
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

  // The image URL is data, not a style decision — it travels to the CSS via a
  // custom property (same pattern as Figure's cropRect and CircularProgress).
  const mergedStyle = hasBgImage
    ? { "--a1-section-bg-image": `url("${backgroundImage.replaceAll('"', '\\"')}")`, ...style }
    : style;

  return (
    <Component
      className={classes.join(" ")}
      style={mergedStyle}
      {...(inverse ? { "data-a1-color-scope": "inverse" } : {})}
      {...props}
    >
      {resolvedContentWidth ? (
        <div className={innerClasses}>
          {children}
        </div>
      ) : children}
    </Component>
  );
}
