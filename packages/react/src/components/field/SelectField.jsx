import { useId, forwardRef, useContext } from "react";
import { useLabel } from "../labels/Labels.jsx";
import { MessageBadge } from "../message/Message.jsx";
import { Icon } from "../icon/Icon.jsx";
import { FieldsetContext } from "../fieldset/FieldsetContext.js";
import "./field.css";

const SIZES           = ["comfortable", "default", "compact"];
const LABEL_POSITIONS = ["above", "side"];

export const SelectField = forwardRef(function SelectField({
  label,
  hint,
  error,
  size,
  labelPosition,
  required = false,
  disabled = false,
  id: providedId,
  className = "",
  inputOverlay,
  children,
  ...props
}, ref) {
  const ctx     = useContext(FieldsetContext);
  const autoId  = useId();
  const id      = providedId ?? autoId;
  const hintId  = `${id}-hint`;
  const errorId = `${id}-error`;

  const resolvedSize     = SIZES.includes(size)                   ? size          : (ctx?.size          ?? "default");
  const resolvedPosition = LABEL_POSITIONS.includes(labelPosition) ? labelPosition : (ctx?.labelPosition ?? "above");

  const classes = [
    "a1-field",
    `a1-field--${resolvedSize}`,
    `a1-field--label-${resolvedPosition}`,
    error    && "a1-field--error",
    required && "a1-field--required",
    disabled && "a1-field--disabled",
    className,
  ].filter(Boolean).join(" ");

  const describedBy = [error ? errorId : hint ? hintId : null]
    .filter(Boolean).join(" ") || undefined;

  const requiredText = useLabel("field.required", "Required");

  return (
    <div className={classes}>
      {label && (
        <label className="a1-field__label" htmlFor={id}>
          {label}
          {required && resolvedSize === "comfortable" ? (
            <MessageBadge status="info" subtle>{requiredText}</MessageBadge>
          ) : required ? (
            <span className="a1-field__asterisk" aria-hidden="true"> *</span>
          ) : null}
        </label>
      )}
      <div className="a1-field__control">
        <select
          ref={ref}
          id={id}
          className="a1-field__select"
          required={required}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
          {...props}
        >
          {children}
        </select>
        <span className="a1-field__chevron" aria-hidden="true">
          <Icon name="expand_more" />
        </span>
        {inputOverlay}
      </div>
      {error ? (
        <p className="a1-field__message a1-field__message--error" id={errorId} role="alert">{error}</p>
      ) : hint ? (
        <p className="a1-field__message a1-field__message--hint" id={hintId}>{hint}</p>
      ) : null}
    </div>
  );
});
