import { useId, useState, forwardRef, useContext } from "react";
import { useLabel } from "../labels/Labels.jsx";
import { MessageBadge } from "../message/Message.jsx";
import { FieldsetContext } from "../fieldset/FieldsetContext.js";
import "./field.css";
import "./textarea-field.css";

const SIZES           = ["comfortable", "default", "compact"];
const LABEL_POSITIONS = ["above", "side"];
const ROW_SIZES       = { sm: 2, md: 4, lg: 8, xl: 12 };

function resolveRows(rows) {
  if (typeof rows === "number") return rows;
  return ROW_SIZES[rows] ?? 4;
}

export const TextareaField = forwardRef(function TextareaField({
  label,
  hint,
  error,
  size,
  labelPosition,
  required     = false,
  disabled     = false,
  readOnly     = false,
  id: providedId,
  className    = "",
  rows         = "md",
  maxLength,
  showCount    = false,
  value,
  defaultValue,
  onChange,
  ...props
}, ref) {
  const ctx    = useContext(FieldsetContext);
  const autoId = useId();
  const id     = providedId ?? autoId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const resolvedSize     = SIZES.includes(size)           ? size          : (ctx?.size          ?? "default");
  const resolvedPosition = LABEL_POSITIONS.includes(labelPosition) ? labelPosition : (ctx?.labelPosition ?? "above");
  const resolvedRows     = resolveRows(rows);

  const [internalCount, setInternalCount] = useState(() => {
    if (value        != null) return String(value).length;
    if (defaultValue != null) return String(defaultValue).length;
    return 0;
  });

  const count         = value != null ? String(value).length : internalCount;
  const showCharCount = showCount || maxLength != null;

  function handleChange(e) {
    if (value == null) setInternalCount(e.target.value.length);
    onChange?.(e);
  }

  const countState = maxLength != null
    ? count > maxLength         ? "over"
    : count / maxLength >= 0.8 ? "warning"
    : "normal"
    : "normal";

  const classes = [
    "a1-field",
    `a1-field--${resolvedSize}`,
    `a1-field--label-${resolvedPosition}`,
    error    && "a1-field--error",
    required && "a1-field--required",
    disabled && "a1-field--disabled",
    readOnly && "a1-field--readonly",
    className,
  ].filter(Boolean).join(" ");

  const describedBy = [error ? errorId : hint ? hintId : null]
    .filter(Boolean).join(" ") || undefined;

  const requiredText = useLabel("field.required", "Required");

  const charCountEl = showCharCount ? (
    <span
      className={[
        "a1-field__char-count",
        countState === "warning" && "a1-field__char-count--warning",
        countState === "over"    && "a1-field__char-count--over",
      ].filter(Boolean).join(" ")}
      aria-live="polite"
      aria-atomic="true"
      aria-label={
        maxLength != null
          ? `${count} of ${maxLength} characters`
          : `${count} characters`
      }
    >
      {maxLength != null ? `${count} / ${maxLength}` : count}
    </span>
  ) : null;

  const hasFooter = error || hint || showCharCount;

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
        <textarea
          ref={ref}
          id={id}
          className="a1-field__textarea"
          rows={resolvedRows}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          {...props}
        />
      </div>
      {hasFooter && (
        <div className="a1-field__footer">
          <div className="a1-field__footer-message">
            {error ? (
              <p className="a1-field__message a1-field__message--error" id={errorId} role="alert">{error}</p>
            ) : hint ? (
              <p className="a1-field__message a1-field__message--hint" id={hintId}>{hint}</p>
            ) : null}
          </div>
          {charCountEl}
        </div>
      )}
    </div>
  );
});
