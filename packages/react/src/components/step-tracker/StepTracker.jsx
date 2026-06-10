import "./step-tracker.css";

const ALIGNS = ["left", "center", "right", "full"];

export function StepTracker({
  steps,
  currentStep = 1,
  align = "left",
  className = "",
  ...props
}) {
  const resolvedAlign = ALIGNS.includes(align) ? align : "left";
  const total = Math.max(1, steps);
  const current = Math.min(total, Math.max(1, currentStep));

  const classes = [
    "a1-step-tracker",
    resolvedAlign !== "left" && `a1-step-tracker--${resolvedAlign}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      role="img"
      aria-label={`Step ${current} of ${total}`}
      {...props}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={[
            "a1-step-tracker__step",
            i + 1 === current && "a1-step-tracker__step--current",
          ].filter(Boolean).join(" ")}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
