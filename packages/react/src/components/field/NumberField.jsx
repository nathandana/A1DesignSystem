import { useRef, useCallback, useState, forwardRef } from "react";
import { TextField } from "./TextField.jsx";

export const NumberField = forwardRef(function NumberField(
  { unit, prefix, className = "", onChange, value, defaultValue, style, ...props },
  forwardedRef,
) {
  const localRef = useRef(null);

  const mergedRef = useCallback((el) => {
    localRef.current = el;
    if (typeof forwardedRef === "function") forwardedRef(el);
    else if (forwardedRef) forwardedRef.current = el;
  }, [forwardedRef]);

  const [uncontrolledLength, setUncontrolledLength] = useState(
    () => Math.max(String(defaultValue ?? "").length, 1),
  );

  const inputLength = value !== undefined
    ? Math.max(String(value).length || 1, 1)
    : uncontrolledLength;

  function handleChange(e) {
    if (value === undefined) {
      setUncontrolledLength(Math.max(e.target.value.length || 1, 1));
    }
    onChange?.(e);
  }

  const overlay = (prefix || unit) ? (
    <>
      {prefix && <span className="a1-field__prefix" aria-hidden="true">{prefix}</span>}
      {unit && (
        <span
          className="a1-field__unit"
          aria-hidden="true"
          onClick={() => localRef.current?.focus()}
        >
          {unit}
        </span>
      )}
    </>
  ) : null;

  return (
    <TextField
      ref={mergedRef}
      type="number"
      className={[
        className,
        prefix && "a1-field--has-prefix",
        unit   && "a1-field--has-unit",
      ].filter(Boolean).join(" ")}
      inputOverlay={overlay}
      onChange={unit ? handleChange : onChange}
      value={value}
      defaultValue={defaultValue}
      style={unit ? { "--a1-field-number-width": `${inputLength}ch`, ...style } : style}
      {...props}
    />
  );
});
