import { createContext, useContext } from "react";
import "./list.css";
import { Icon } from "../icon/Icon.jsx";

const sizes = ["xs", "sm", "md", "lg", "xl"];
const colors = ["default", "muted"];

const ListContext = createContext({ icon: null, as: "ul" });

export function List({
  as: Component = "ul",
  size = "md",
  color = "default",
  icon = null,
  className = "",
  ...props
}) {
  const resolvedSize  = sizes.includes(size)   ? size   : "md";
  const resolvedColor = colors.includes(color) ? color  : "default";
  const isOrdered     = Component === "ol";
  const variant       = isOrdered ? "ordered" : icon != null ? "icon" : "unordered";

  const classes = [
    "a1-list",
    `a1-list--${resolvedSize}`,
    `a1-list--${variant}`,
    resolvedColor !== "default" && `a1-list--${resolvedColor}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ListContext.Provider value={{ icon, as: Component }}>
      <Component className={classes} {...props} />
    </ListContext.Provider>
  );
}

export function ListItem({ icon: itemIcon, className = "", children, ...props }) {
  const { icon: listIcon } = useContext(ListContext);
  // undefined means "not passed" — fall back to list icon. null means explicit "no icon".
  const resolvedIcon = itemIcon !== undefined ? itemIcon : listIcon;

  return (
    <li className={["a1-list-item", className].filter(Boolean).join(" ")} {...props}>
      {resolvedIcon != null ? (
        <Icon name={resolvedIcon} className="a1-list-item__marker" />
      ) : (
        <span className="a1-list-item__marker" aria-hidden="true" />
      )}
      <span className="a1-list-item__content">{children}</span>
    </li>
  );
}
