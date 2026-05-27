import { useId, useState, useContext } from "react";
import { FieldsetContext } from "../fieldset/FieldsetContext.js";
import "./switch.css";

const SIZES           = ["comfortable", "default", "compact"];
const LABEL_POSITIONS = ["end", "start"];

export function Switch({
  label,
  hint,
  error,
  size,
  labelPosition,
  disabled        = false,
  checked,
  defaultChecked  = false,
  onChange,
  id: providedId,
  className       = "",
  name,
  value,
  ...props
}) {
  const ctx    = useContext(FieldsetContext);
  const autoId = useId();
  const id     = providedId ?? autoId;
  const hintId  = `${id}-hint`;
  const errorId = `${id}-error`;

  const resolvedSize     = SIZES.includes(size)           ? size          : (ctx?.size ?? "default");
  const resolvedPosition = LABEL_POSITIONS.includes(labelPosition) ? labelPosition : "end";

  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = checked !== undefined ? checked : internalChecked;

  function handleChange(e) {
    if (checked === undefined) setInternalChecked(e.target.checked);
    onChange?.(e.target.checked, e);
  }

  const classes = [
    "a1-switch",
    `a1-switch--${resolvedSize}`,
    label    && `a1-switch--label-${resolvedPosition}`,
    error    && "a1-switch--error",
    disabled && "a1-switch--disabled",
    className,
  ].filter(Boolean).join(" ");

  const describedBy = [
    error ? errorId : hint ? hintId : null,
  ].filter(Boolean).join(" ") || undefined;

  /* The input is sr-only — the <span className="a1-switch__track"> provides
     all visual affordance. CSS uses input + track (adjacent sibling) to
     respond to :checked, :focus-visible, :disabled, etc. on a real element
     where ::before transitions are fully supported. */
  const input = (
    <input
      type="checkbox"
      role="switch"
      id={id}
      className="a1-switch__input"
      checked={isChecked}
      disabled={disabled}
      onChange={handleChange}
      aria-describedby={describedBy}
      aria-invalid={error ? "true" : undefined}
      name={name}
      value={value}
      {...props}
    />
  );

  const track = (
    <span
      className={`a1-switch__track${isChecked ? " a1-switch__track--on" : ""}`}
      aria-hidden="true"
    />
  );

  return (
    <div className={classes}>
      {label ? (
        <label className="a1-switch__row">
          {input}
          {track}
          <div className="a1-switch__content">
            <span className="a1-switch__label">{label}</span>
            {hint && !error && (
              <p className="a1-switch__message a1-switch__message--hint" id={hintId}>{hint}</p>
            )}
            {error && (
              <p className="a1-switch__message a1-switch__message--error" id={errorId} role="alert">{error}</p>
            )}
          </div>
        </label>
      ) : (
        <>
          <label className="a1-switch__row">
            {input}
            {track}
          </label>
          {hint && !error && (
            <p className="a1-switch__message a1-switch__message--hint" id={hintId}>{hint}</p>
          )}
          {error && (
            <p className="a1-switch__message a1-switch__message--error" id={errorId} role="alert">{error}</p>
          )}
        </>
      )}
    </div>
  );
}
