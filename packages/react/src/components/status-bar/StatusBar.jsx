import { useId, useState, useEffect } from "react";
import { Button } from "../button/Button.jsx";
import { useLabel } from "../labels/Labels.jsx";
import "./status-bar.css";

const SIZES     = ["sm", "md", "lg"];
const POSITIONS = ["above", "below", "before", "after"];

export function StatusBar({
  value         = 0,
  max           = 100,
  label,
  labelPosition = "above",
  size          = "md",
  indeterminate = false,
  className     = "",
  ...props
}) {
  const labelId = useId();

  const pauseLabel = useLabel("statusBar.pause", "Pause");
  const playLabel  = useLabel("statusBar.play",  "Play");

  const [paused,    setPaused]    = useState(false);
  const [showPause, setShowPause] = useState(false);

  useEffect(() => {
    if (!indeterminate) {
      setShowPause(false);
      setPaused(false);
      return;
    }
    const t = setTimeout(() => setShowPause(true), 3000);
    return () => clearTimeout(t);
  }, [indeterminate]);

  const resolvedSize     = SIZES.includes(size) ? size : "md";
  const resolvedPosition = POSITIONS.includes(labelPosition) ? labelPosition : "above";

  const pct = Math.min(100, Math.max(0, max > 0 ? (value / max) * 100 : 0));
  const isLabelFirst = resolvedPosition === "above" || resolvedPosition === "before";

  const classes = [
    "a1-status-bar",
    resolvedSize !== "md" && `a1-status-bar--${resolvedSize}`,
    `a1-status-bar--${resolvedPosition}`,
    indeterminate && "a1-status-bar--indeterminate",
    indeterminate && paused && "a1-status-bar--paused",
    className,
  ].filter(Boolean).join(" ");

  const labelEl = label ? (
    <span id={labelId} className="a1-status-bar__label">{label}</span>
  ) : null;

  return (
    <div className={classes}>
      {isLabelFirst && labelEl}
      <div className="a1-status-bar__bar-row">
        <div
          className="a1-status-bar__track"
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-labelledby={label ? labelId : undefined}
          {...props}
        >
          <div
            className={[
              "a1-status-bar__fill",
              indeterminate && "a1-status-bar__fill--indeterminate",
            ].filter(Boolean).join(" ")}
            style={indeterminate ? undefined : { inlineSize: `${pct}%` }}
          />
        </div>
        {showPause && (
          <Button
            size="sm"
            variant="secondary"
            icon={paused ? "play_arrow" : "pause"}
            className="a1-status-bar__pause"
            onClick={() => setPaused(p => !p)}
          >
            {paused ? playLabel : pauseLabel}
          </Button>
        )}
      </div>
      {!isLabelFirst && labelEl}
    </div>
  );
}
