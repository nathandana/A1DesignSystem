import "./button-container.css";

const alignments = ["start", "center", "end"];

export function ButtonContainer({
  align = "start",
  className = "",
  children,
  ...props
}) {
  const resolvedAlign = alignments.includes(align) ? align : "start";
  const classes = [
    "a1-button-container",
    `a1-button-container--${resolvedAlign}`,
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
