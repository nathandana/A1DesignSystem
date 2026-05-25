import { useId, useState, useContext } from "react";
import { useLabel } from "../labels/Labels.jsx";
import { MessageBadge } from "../message/Message.jsx";
import { FieldsetContext } from "../fieldset/FieldsetContext.js";
import "./checkbox-group.css";

const SIZES = ["comfortable", "default", "compact"];

export function CheckboxGroup({
  label,
  hint,
  error,
  size,
  required     = false,
  disabled     = false,
  name,
  options      = [],
  value,
  defaultValue,
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

  const [internalValue, setInternalValue] = useState(defaultValue ?? []);
  const currentValue = value ?? internalValue;

  function handleChange(optionValue, checked) {
    const next = checked
      ? [...currentValue, optionValue]
      : currentValue.filter(v => v !== optionValue);
    if (value == null) setInternalValue(next);
    onChange?.(next);
  }

  const classes = [
    "a1-checkbox-group",
    `a1-checkbox-group--${resolvedSize}`,
    error    && "a1-checkbox-group--error",
    required && "a1-checkbox-group--required",
    disabled && "a1-checkbox-group--disabled",
    className,
  ].filter(Boolean).join(" ");

  const describedBy = [error ? errorId : hint ? hintId : null]
    .filter(Boolean).join(" ") || undefined;

  const requiredText = useLabel("field.required", "Required");

  return (
    <fieldset className={classes} aria-describedby={describedBy} {...props}>
      {label && (
        <legend className="a1-checkbox-group__legend">
          <span className="a1-checkbox-group__legend-inner">
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
        <p className="a1-checkbox-group__message a1-checkbox-group__message--hint" id={hintId}>
          {hint}
        </p>
      )}
      <div className="a1-checkbox-group__items">
        {options.map((option) => {
          const isChecked  = currentValue.includes(option.value);
          const isDisabled = disabled || option.disabled;
          const itemId     = `${id}-${option.value}`;

          return (
            <label
              key={option.value}
              className={[
                "a1-checkbox-item",
                isDisabled && "a1-checkbox-item--disabled",
              ].filter(Boolean).join(" ")}
            >
              <input
                type="checkbox"
                id={itemId}
                className="a1-checkbox-item__input"
                name={name}
                value={option.value}
                checked={isChecked}
                disabled={isDisabled}
                onChange={(e) => handleChange(option.value, e.target.checked)}
              />
              <span className="a1-checkbox-item__content">
                <span className="a1-checkbox-item__label">{option.label}</span>
                {option.hint && (
                  <span className="a1-checkbox-item__hint">{option.hint}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p className="a1-checkbox-group__message a1-checkbox-group__message--error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
