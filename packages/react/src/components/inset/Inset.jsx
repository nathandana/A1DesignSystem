import "./inset.css";
import { resolveSpacing } from "../structure-utils.js";

export function Inset({
  as: Component = "div",
  space = 16,
  block,
  inline,
  className = "",
  children,
  ...props
}) {
  const blockValue = resolveSpacing(block) ?? resolveSpacing(space);
  const inlineValue = resolveSpacing(inline) ?? resolveSpacing(space);

  const style = {
    "--a1-inset-block": blockValue,
    "--a1-inset-inline": inlineValue,
    ...props.style,
  };

  return (
    <Component className={["a1-inset", className].filter(Boolean).join(" ")} style={style} {...props}>
      {children}
    </Component>
  );
}
