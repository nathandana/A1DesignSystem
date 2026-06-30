import { useId, useState, useLayoutEffect, useRef, useCallback, forwardRef, useContext } from "react";
import { useLabel } from "../labels/Labels.jsx";
import { MessageBadge } from "../message/Message.jsx";
import { FieldsetContext } from "../fieldset/FieldsetContext.js";
import "./field.css";
import "./textarea-field.css";

const SIZES           = ["comfortable", "default", "compact"];
const LABEL_POSITIONS = ["above", "before"];
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
  autoComplete,
  onBeforeInput,
  onInput,
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

  const textareaRef = useRef(null);
  const readOnlyValueRef = useRef("");

  const mergedRef = useCallback((el) => {
    textareaRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  }, [ref]);

  useLayoutEffect(() => {
    if (readOnly && textareaRef.current) readOnlyValueRef.current = textareaRef.current.value;
  }, [readOnly, value, defaultValue]);

  function restoreReadOnlyValue(e) {
    if (!readOnly) return false;
    const textarea = e.currentTarget;
    if (textarea.value !== readOnlyValueRef.current) textarea.value = readOnlyValueRef.current;
    return true;
  }

  function handleBeforeInput(e) {
    if (readOnly) {
      e.preventDefault();
      return;
    }
    onBeforeInput?.(e);
  }

  function handleInput(e) {
    if (restoreReadOnlyValue(e)) return;
    onInput?.(e);
  }

  function handleChange(e) {
    if (restoreReadOnlyValue(e)) return;
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
            <MessageBadge status="info" subtle size="sm" icon={null}>{requiredText}</MessageBadge>
          ) : required ? (
            <span className="a1-field__asterisk" aria-hidden="true"> *</span>
          ) : null}
        </label>
      )}
      <div className="a1-field__control">
        <textarea
          ref={mergedRef}
          id={id}
          className="a1-field__textarea"
          rows={resolvedRows}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
          {...props}
          value={value}
          defaultValue={defaultValue}
          readOnly={readOnly}
          autoComplete={readOnly ? "off" : autoComplete}
          data-1p-ignore={readOnly ? "true" : props["data-1p-ignore"]}
          data-bwignore={readOnly ? "true" : props["data-bwignore"]}
          data-lpignore={readOnly ? "true" : props["data-lpignore"]}
          data-form-type={readOnly ? "other" : props["data-form-type"]}
          onBeforeInput={handleBeforeInput}
          onInput={handleInput}
          onChange={handleChange}
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
