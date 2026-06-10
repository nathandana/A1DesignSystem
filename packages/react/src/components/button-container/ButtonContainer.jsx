import "./button-container.css";
import { Children, cloneElement, isValidElement } from "react";
import { Button } from "../button/Button.jsx";

const alignments = ["start", "center", "end"];
const sizes = ["sm", "md", "lg"];

function applyButtonSize(children, size) {
  if (!size) return children;

  return Children.map(children, (child) => {
    if (!isValidElement(child) || child.type !== Button || child.props.size) {
      return child;
    }

    return cloneElement(child, { size });
  });
}

export function ButtonContainer({
  align = "start",
  size,
  fillButtons = false,
  className = "",
  children,
  ...props
}) {
  const resolvedAlign = alignments.includes(align) ? align : "start";
  const resolvedSize = sizes.includes(size) ? size : null;
  const classes = [
    "a1-button-container",
    `a1-button-container--${resolvedAlign}`,
    resolvedSize && `a1-button-container--${resolvedSize}`,
    fillButtons && "a1-button-container--fill-buttons",
    className
  ]
    .filter(Boolean)
    .join(" ");
  const resolvedChildren = applyButtonSize(children, resolvedSize);

  return (
    <div className={classes} {...props}>
      <div className="a1-button-container__inner">
        {resolvedChildren}
      </div>
    </div>
  );
}
