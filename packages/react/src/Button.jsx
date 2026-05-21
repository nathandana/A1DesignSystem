import "./button.css";

const variants = ["primary", "secondary", "tertiary"];
const states = ["default", "hover", "active"];

export function Button({
  as: Component = "button",
  variant = "primary",
  state,
  className = "",
  type,
  ...props
}) {
  const resolvedVariant = variants.includes(variant) ? variant : "primary";
  const resolvedState = states.includes(state) ? state : null;
  const classes = [
    "a1-button",
    `a1-button--${resolvedVariant}`,
    resolvedState && `a1-button--state-${resolvedState}`,
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component
      className={classes}
      type={Component === "button" ? type ?? "button" : type}
      {...props}
    />
  );
}
