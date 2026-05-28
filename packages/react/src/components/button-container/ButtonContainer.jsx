import "./button-container.css";

const alignments = ["start", "center", "end"];
const sizes = ["sm", "md", "lg"];

export function ButtonContainer({
  align = "start",
  size,
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
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      <div className="a1-button-container__inner">
        {children}
      </div>
    </div>
  );
}
