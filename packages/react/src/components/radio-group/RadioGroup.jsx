import { useId, useState, useContext } from "react";
import { useLabel } from "../labels/Labels.jsx";
import { MessageBadge } from "../message/Message.jsx";
import { FieldsetContext } from "../fieldset/FieldsetContext.js";
import "./radio-group.css";

const SIZES = ["comfortable", "default", "compact"];

export function RadioGroup({
  label,
  hint,
  error,
  size,
  required     = false,
  disabled     = false,
  inline       = false,
  name,
  options      = [],
  value,
  defaultValue = null,
  onChange,
  id: providedId,
  className    = "",
  ...props
}) {
  const ctx    = useContext(FieldsetContext);
  const autoId = useId();
  const id     = providedId ?? autoId;
  const hintId  = `${id}-hint`;
  const errorId = `${id}-error`;

  const resolvedSize = SIZES.includes(size) ? size : (ctx?.size ?? "default");

  const [internalValue, setInternalValue] = useState(defaultValue);
  // value === undefined → uncontrolled; null → controlled with nothing selected
  const currentValue = value !== undefined ? value : internalValue;

  function handleChange(optionValue) {
    if (value === undefined) setInternalValue(optionValue);
    onChange?.(optionValue);
  }

  const classes = [
    "a1-radio-group",
    `a1-radio-group--${resolvedSize}`,
    inline   && "a1-radio-group--inline",
    error    && "a1-radio-group--error",
    required && "a1-radio-group--required",
    disabled && "a1-radio-group--disabled",
    className,
  ].filter(Boolean).join(" ");

  const describedBy = [error ? errorId : hint ? hintId : null]
    .filter(Boolean).join(" ") || undefined;

  const requiredText = useLabel("field.required", "Required");

  // Fall back to the group id so all radios share a name and behave as a group
  const groupName = name ?? id;

  return (
    <fieldset className={classes} aria-describedby={describedBy} {...props}>
      {label && (
        <legend className="a1-radio-group__legend">
          <span className="a1-radio-group__legend-inner">
            {label}
            {required && resolvedSize === "comfortable" ? (
              <MessageBadge status="info" subtle>{requiredText}</MessageBadge>
            ) : required ? (
              <span className="a1-field__asterisk" aria-hidden="true"> *</span>
            ) : null}
          </span>
        </legend>
      )}
      {hint && !error && (
        <p className="a1-radio-group__message a1-radio-group__message--hint" id={hintId}>
          {hint}
        </p>
      )}
      <div className="a1-radio-group__items">
        {options.map((option) => {
          const isChecked  = currentValue === option.value;
          const isDisabled = disabled || option.disabled;
          const itemId     = `${id}-${option.value}`;

          return (
            <label
              key={option.value}
              className={[
                "a1-radio-item",
                isDisabled && "a1-radio-item--disabled",
              ].filter(Boolean).join(" ")}
            >
              <input
                type="radio"
                id={itemId}
                className="a1-radio-item__input"
                name={groupName}
                value={option.value}
                checked={isChecked}
                disabled={isDisabled}
                onChange={() => handleChange(option.value)}
              />
              <span className="a1-radio-item__content">
                <span className="a1-radio-item__label">{option.label}</span>
                {option.hint && (
                  <span className="a1-radio-item__hint">{option.hint}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p className="a1-radio-group__message a1-radio-group__message--error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
