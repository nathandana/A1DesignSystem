import { Children, cloneElement, isValidElement } from "react";
import "./action-tile.css";
import { Icon } from "../icon/Icon.jsx";

const ICON_LAYOUTS = ["auto", "top", "side", "none"];
const LAYOUTS = ["grid", "stack"];
const BREAKPOINTS = ["xs", "sm", "md", "lg", "xl"];
const COLUMN_COUNTS = [1, 2, 3, 4, 5, 6];

function isInteractiveTile(child) {
  if (!isValidElement(child)) return false;

  const { as, href, onClick, role } = child.props ?? {};
  const component = as ?? (href ? "a" : "div");

  return Boolean(
    href
      || component === "a"
      || component === "button"
      || typeof onClick === "function"
      || role === "button"
      || role === "link"
  );
}

export function ActionTile({
  as,
  href,
  icon,
  title,
  subtitle,
  accessory,
  footer,
  iconLayout = "auto",
  className = "",
  __groupIconLayout,
  ...props
}) {
  const resolvedIconLayout = ICON_LAYOUTS.includes(__groupIconLayout)
    ? __groupIconLayout
    : ICON_LAYOUTS.includes(iconLayout)
      ? iconLayout
      : "auto";
  const Component = as ?? (href ? "a" : "div");
  const isButton = Component === "button";
  const isInteractive = Boolean(
    href
      || Component === "a"
      || isButton
      || typeof props.onClick === "function"
      || props.role === "button"
      || props.role === "link"
  );
  const resolvedAccessory = isInteractive ? undefined : accessory;
  const resolvedFooter = isInteractive ? undefined : footer;
  const showIcon = Boolean(icon) && resolvedIconLayout !== "none";

  const classes = [
    "a1-action-tile",
    `a1-action-tile--icon-${resolvedIconLayout}`,
    showIcon && "a1-action-tile--has-icon",
    resolvedAccessory && "a1-action-tile--has-accessory",
    resolvedFooter && "a1-action-tile--has-footer",
    isInteractive && "a1-action-tile--interactive",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const interactiveProps = isButton && !props.type ? { type: "button" } : {};

  return (
    <Component className={classes} href={href} {...interactiveProps} {...props}>
      <div className="a1-action-tile__layout">
        {showIcon && (
          <span className="a1-action-tile__icon" aria-hidden="true">
            <Icon name={icon} />
          </span>
        )}
        <div className="a1-action-tile__body">
          <div className="a1-action-tile__header">
            <div className="a1-action-tile__copy">
              {title != null && title !== "" && <div className="a1-action-tile__title">{title}</div>}
              {subtitle != null && subtitle !== "" && <div className="a1-action-tile__subtitle">{subtitle}</div>}
            </div>
            {resolvedAccessory && <div className="a1-action-tile__accessory">{resolvedAccessory}</div>}
          </div>
          {resolvedFooter && <div className="a1-action-tile__footer">{resolvedFooter}</div>}
        </div>
      </div>
    </Component>
  );
}

export function ActionTiles({
  layout = "grid",
  gap = true,
  iconLayout = "auto",
  columns,
  className = "",
  children,
  style,
  ...props
}) {
  const resolvedLayout = LAYOUTS.includes(layout) ? layout : "grid";
  const resolvedIconLayout = ICON_LAYOUTS.includes(iconLayout) ? iconLayout : "auto";

  const responsiveColumnClasses = [];
  let inlineColumns;

  if (typeof columns === "number" && COLUMN_COUNTS.includes(columns)) {
    inlineColumns = columns;
  } else if (columns && typeof columns === "object") {
    for (const [bp, count] of Object.entries(columns)) {
      if (BREAKPOINTS.includes(bp) && COLUMN_COUNTS.includes(count)) {
        responsiveColumnClasses.push(`a1-action-tiles--${bp}-${count}`);
      }
    }
  }

  const classes = [
    "a1-action-tiles",
    `a1-action-tiles--${resolvedLayout}`,
    inlineColumns != null && "a1-action-tiles--fixed-columns",
    !gap && "a1-action-tiles--gap-off",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const resolvedStyle = {
    ...(inlineColumns != null ? { "--a1-action-tiles-columns": inlineColumns } : {}),
    ...style,
  };
  const items = Children.toArray(children).filter(Boolean);
  const hasInteractiveItems = items.some(isInteractiveTile);

  return (
    <div
      className={[classes, hasInteractiveItems && "a1-action-tiles--interactive", ...responsiveColumnClasses].filter(Boolean).join(" ")}
      style={resolvedStyle}
      {...props}
    >
      {items.map((child, index) => (
        <div className="a1-action-tiles__item" key={isValidElement(child) && child.key != null ? child.key : index}>
          {isValidElement(child)
            ? cloneElement(child, { __groupIconLayout: resolvedIconLayout })
            : child}
        </div>
      ))}
    </div>
  );
}
