import "./spacer.css";

const sizes = ["xs", "sm", "md", "lg", "xl", "xxl"];
const breakpoints = ["xs", "sm", "md", "lg", "xl"];

const sizeMap = {
  xs:  "var(--base-spacing-8)",
  sm:  "var(--base-spacing-16)",
  md:  "var(--base-spacing-24)",
  lg:  "var(--base-spacing-40)",
  xl:  "var(--base-spacing-64)",
  xxl: "var(--base-spacing-96)",
};

function isResponsive(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function resolveBase(size) {
  if (!isResponsive(size)) return sizeMap[size] ?? sizeMap.md;
  return sizeMap[size.xs] ?? sizeMap.md;
}

export function Spacer({ size = "md", ...props }) {
  const style = { "--a1-spacer-size": resolveBase(size) };

  if (isResponsive(size)) {
    let lastKnown = resolveBase(size);
    breakpoints.slice(1).forEach((bp) => {
      if (sizes.includes(size[bp])) lastKnown = sizeMap[size[bp]];
      style[`--a1-spacer-size-${bp}`] = lastKnown;
    });
  }

  return <div className="a1-spacer" role="none" aria-hidden="true" style={style} {...props} />;
}
