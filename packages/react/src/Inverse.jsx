import "./themes.css";

export function Inverse({
  as: Component = "div",
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={["a1-inverse", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </Component>
  );
}
