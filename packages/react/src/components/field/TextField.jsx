import { useId, useLayoutEffect, useRef, useCallback, forwardRef, useContext } from "react";
import { useLabel } from "../labels/Labels.jsx";
import { MessageBadge } from "../message/Message.jsx";
import { FieldsetContext } from "../fieldset/FieldsetContext.js";
import { warnPlaceholderIgnored } from "./placeholderWarning.js";
import "./field.css";

const SIZES           = ["comfortable", "default", "compact"];
const LABEL_POSITIONS = ["above", "before"];

export const TextField = forwardRef(function TextField({
  label,
  hint,
  error,
  size,
  labelPosition,
  required = false,
  disabled = false,
  readOnly = false,
  id: providedId,
  className = "",
  placeholder: _removed,
  inputOverlay,
  autoComplete,
  value,
  defaultValue,
  onBeforeInput,
  onInput,
  onChange,
  ...props
}, ref) {
  const ctx     = useContext(FieldsetContext);
  const autoId  = useId();
  const id      = providedId ?? autoId;
  const hintId  = `${id}-hint`;
  const errorId = `${id}-error`;

  if (_removed !== undefined) warnPlaceholderIgnored("TextField");

  const resolvedSize     = SIZES.includes(size)           ? size          : (ctx?.size          ?? "default");
  const resolvedPosition = LABEL_POSITIONS.includes(labelPosition) ? labelPosition : (ctx?.labelPosition ?? "above");

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
  const inputRef = useRef(null);
  const readOnlyValueRef = useRef("");

  const mergedRef = useCallback((el) => {
    inputRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  }, [ref]);

  useLayoutEffect(() => {
    if (readOnly && inputRef.current) readOnlyValueRef.current = inputRef.current.value;
  }, [readOnly, value, defaultValue]);

  function restoreReadOnlyValue(e) {
    if (!readOnly) return false;
    const input = e.currentTarget;
    if (input.value !== readOnlyValueRef.current) input.value = readOnlyValueRef.current;
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
    onChange?.(e);
  }

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
        <input
          ref={mergedRef}
          id={id}
          className="a1-field__input"
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
