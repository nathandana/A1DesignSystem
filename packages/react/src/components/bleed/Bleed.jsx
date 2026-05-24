import "./bleed.css";
import { resolveSpacing } from "../structure-utils.js";

export function Bleed({
  as: Component = "div",
  space = 16,
  block = "none",
  inline,
  className = "",
  children,
  ...props
}) {
  const blockValue = resolveSpacing(block) ?? resolveSpacing(space);
  const inlineValue = resolveSpacing(inline) ?? resolveSpacing(space);

  const style = {
    "--a1-bleed-block": blockValue,
    "--a1-bleed-inline": inlineValue,
    ...props.style,
  };

  return (
    <Component className={["a1-bleed", className].filter(Boolean).join(" ")} style={style} {...props}>
      {children}
    </Component>
  );
}
