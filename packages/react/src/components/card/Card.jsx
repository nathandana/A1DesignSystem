import "./card.css";
import { Icon } from "../icon/Icon.jsx";

const shadows = ["none", "xs", "sm", "md", "lg", "xl"];

export function Card({
  as: Component = "div",
  shadow = "sm",
  icon,
  className = "",
  children,
  ...props
}) {
  const resolvedShadow = shadows.includes(shadow) ? shadow : "sm";
  const classes = ["a1-card", `a1-card--shadow-${resolvedShadow}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...props}>
      {icon && (
        <span className="a1-card__icon" aria-hidden="true">
          <Icon name={icon} />
        </span>
      )}
      {children}
    </Component>
  );
}
