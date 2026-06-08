import { createContext, useContext } from "react";
import "./list.css";
import { Icon } from "../icon/Icon.jsx";

const sizes = ["xs", "sm", "md", "lg", "xl"];
const colors = ["default", "muted"];
const variants = ["unordered", "ordered", "icon", "divider"];
const spacings = ["sm", "md", "lg"];
const breakpoints = ["xs", "sm", "md", "lg", "xl"];

function isResponsiveSize(size) {
  return size && typeof size === "object" && !Array.isArray(size);
}

function resolveBaseSize(size) {
  if (!isResponsiveSize(size)) return sizes.includes(size) ? size : "md";
  return sizes.includes(size.xs) ? size.xs : "md";
}

function getResponsiveSizeStyle(size) {
  if (!isResponsiveSize(size)) return {};
  return breakpoints.slice(1).reduce((style, bp) => {
    if (sizes.includes(size[bp])) {
      style[`--a1-list-size-${bp}`] = `var(--semantic-font-size-body-${size[bp]})`;
    }
    return style;
  }, {});
}

const ListContext = createContext({ icon: null, as: "ul", variant: "unordered" });

export function List({
  as: Component = "ul",
  size = "md",
  color = "default",
  icon = null,
  variant: variantProp,
  marginBottom,
  className = "",
  style,
  ...props
}) {
  const resolvedSize  = resolveBaseSize(size);
  const resolvedColor = colors.includes(color) ? color  : "default";
  const isOrdered     = Component === "ol";

  const variant = variants.includes(variantProp)
    ? variantProp
    : isOrdered ? "ordered" : icon != null ? "icon" : "unordered";

  const responsiveStyle = getResponsiveSizeStyle(size);
  const resolvedStyle = Object.keys(responsiveStyle).length
    ? { ...responsiveStyle, ...style }
    : style;

  const classes = [
    "a1-list",
    `a1-list--${resolvedSize}`,
    `a1-list--${variant}`,
    resolvedColor !== "default" && `a1-list--${resolvedColor}`,
    spacings.includes(marginBottom) && `a1-list--mb-${marginBottom}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ListContext.Provider value={{ icon, as: Component, variant }}>
      <Component className={classes} style={resolvedStyle} {...props} />
    </ListContext.Provider>
  );
}

export function ListItem({ icon: itemIcon, className = "", children, ...props }) {
  const { icon: listIcon, variant } = useContext(ListContext);
  // undefined means "not passed" — fall back to list icon. null means explicit "no icon".
  const resolvedIcon = itemIcon !== undefined ? itemIcon : listIcon;
  const isDivider = variant === "divider";

  return (
    <li className={["a1-list-item", className].filter(Boolean).join(" ")} {...props}>
      {!isDivider && (
        resolvedIcon != null ? (
          <Icon name={resolvedIcon} className="a1-list-item__marker" />
        ) : (
          <span className="a1-list-item__marker" aria-hidden="true" />
        )
      )}
      <span className="a1-list-item__content">{children}</span>
    </li>
  );
}
