import "./icon.css";

export function Icon({
  name,
  weight,
  grade,
  opticalSize,
  fill,
  className = "",
  style,
  ...props
}) {
  const vars = {
    ...(weight != null && { "--a1-icon-weight": weight }),
    ...(grade != null && { "--a1-icon-grade": grade }),
    ...(opticalSize != null && { "--a1-icon-opsz": opticalSize }),
    ...(fill != null && { "--a1-icon-fill": fill ? 1 : 0 }),
  };

  return (
    <span
      className={["a1-icon", "material-symbols-outlined", className]
        .filter(Boolean)
        .join(" ")}
      style={{ ...vars, ...style }}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
}
