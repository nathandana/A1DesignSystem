import "../../themes.css";
import "../../color-scheme.css";
import "./section-separator.css";

const surfaces = ["page", "panel", "raised"];
const shapes = ["wave", "swell", "curve", "slope", "peak", "valley", "ribbon"];
const sizes = ["xs", "sm", "md", "lg", "xl"];
const borderSizes = ["xs", "sm", "md", "lg"];
const borderVariants = ["subtle", "strong", "accent"];

const SHAPE_PATHS = {
  wave: {
    fill: "M0,56 C9,44 20,58 31,48 C43,36 54,38 66,50 C78,62 88,56 100,42 L100,100 L0,100 Z",
    line: "M0,56 C9,44 20,58 31,48 C43,36 54,38 66,50 C78,62 88,56 100,42",
  },
  swell: {
    fill: "M0,82 C16,78 24,28 49,24 C72,20 78,76 100,48 L100,100 L0,100 Z",
    line: "M0,82 C16,78 24,28 49,24 C72,20 78,76 100,48",
  },
  curve: {
    fill: "M0,72 C26,40 58,34 100,60 L100,100 L0,100 Z",
    line: "M0,72 C26,40 58,34 100,60",
  },
  slope: {
    fill: "M0,82 C30,70 66,38 100,22 L100,100 L0,100 Z",
    line: "M0,82 C30,70 66,38 100,22",
  },
  peak: {
    fill: "M0,78 C14,70 28,58 42,24 C55,-6 70,66 100,30 L100,100 L0,100 Z",
    line: "M0,78 C14,70 28,58 42,24 C55,-6 70,66 100,30",
  },
  valley: {
    fill: "M0,28 C17,18 32,54 49,84 C66,116 82,44 100,60 L100,100 L0,100 Z",
    line: "M0,28 C17,18 32,54 49,84 C66,116 82,44 100,60",
  },
  ribbon: {
    fill: "M0,52 C10,28 20,78 33,50 C45,22 56,84 70,54 C82,28 91,64 100,38 L100,100 L0,100 Z",
    line: "M0,52 C10,28 20,78 33,50 C45,22 56,84 70,54 C82,28 91,64 100,38",
  },
};

function surfaceClass(surface, position, inverse) {
  const resolvedSurface = surfaces.includes(surface) ? surface : position === "top" ? "page" : "panel";
  return [
    "a1-section-separator__surface",
    `a1-section-separator__surface--${position}`,
    `a1-section-separator__surface--${resolvedSurface}`,
    inverse && "a1-inverse",
  ].filter(Boolean).join(" ");
}

export function SectionSeparator({
  topSurface = "page",
  bottomSurface = "panel",
  inverse = false,
  topInverse = false,
  bottomInverse = false,
  shape = "wave",
  size = "md",
  border = false,
  borderSize = "xs",
  borderVariant = "subtle",
  decorative = true,
  className = "",
  ...props
}) {
  const resolvedShape = shapes.includes(shape) ? shape : "wave";
  const resolvedSize = sizes.includes(size) ? size : "md";
  const resolvedBorderSize = borderSizes.includes(borderSize) ? borderSize : "xs";
  const resolvedBorderVariant = borderVariants.includes(borderVariant) ? borderVariant : "subtle";
  const resolvedTopInverse = inverse || topInverse;
  const resolvedBottomInverse = inverse || bottomInverse;
  const path = SHAPE_PATHS[resolvedShape];
  const rootClasses = [
    "a1-section-separator",
    `a1-section-separator--${resolvedShape}`,
    `a1-section-separator--size-${resolvedSize}`,
    border && "a1-section-separator--border",
    border && `a1-section-separator--border-${resolvedBorderSize}`,
    border && `a1-section-separator--border-${resolvedBorderVariant}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      className={rootClasses}
      role={decorative ? "presentation" : "separator"}
      aria-hidden={decorative ? "true" : undefined}
      {...props}
    >
      <span
        className={surfaceClass(topSurface, "top", resolvedTopInverse)}
        {...(resolvedTopInverse ? { "data-a1-color-scope": "inverse" } : {})}
      />
      <span
        className={surfaceClass(bottomSurface, "bottom", resolvedBottomInverse)}
        {...(resolvedBottomInverse ? { "data-a1-color-scope": "inverse" } : {})}
      >
        <svg
          className="a1-section-separator__svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          focusable="false"
          aria-hidden="true"
        >
          <path className="a1-section-separator__fill" d={path.fill} />
        </svg>
      </span>
      {border && (
        <svg
          className="a1-section-separator__border"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          focusable="false"
          aria-hidden="true"
        >
          <path d={path.line} />
        </svg>
      )}
    </div>
  );
}
