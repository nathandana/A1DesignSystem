import { useState } from "react";
import { TextField } from "./TextField.jsx";

export function DateField({ className = "", value, defaultValue, onChange, ...props }) {
  const isControlled = value != null;
  const [internal, setInternal] = useState(defaultValue ?? "");
  const current = isControlled ? value : internal;
  // Mute the native mm/dd/yyyy format placeholder while the field is empty.
  const emptyClass = current ? "" : "a1-field--mask-empty";

  function handleChange(event) {
    if (!isControlled) setInternal(event.target.value);
    onChange?.(event);
  }

  return (
    <TextField
      type="date"
      className={`a1-field--fit ${emptyClass} ${className}`.replace(/\s+/g, " ").trim()}
      value={isControlled ? value : undefined}
      defaultValue={isControlled ? undefined : defaultValue}
      onChange={handleChange}
      {...props}
    />
  );
}
