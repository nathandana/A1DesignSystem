import { useState } from "react";
import { TextField } from "./TextField.jsx";

export function TimeField({ className = "", value, defaultValue, onChange, ...props }) {
  const isControlled = value != null;
  const [internal, setInternal] = useState(defaultValue ?? "");
  const current = isControlled ? value : internal;
  // Mute the native --:-- format placeholder while the field is empty.
  const emptyClass = current ? "" : "a1-field--mask-empty";

  function handleChange(event) {
    if (!isControlled) setInternal(event.target.value);
    onChange?.(event);
  }

  return (
    <TextField
      type="time"
      className={`a1-field--fit ${emptyClass} ${className}`.replace(/\s+/g, " ").trim()}
      value={isControlled ? value : undefined}
      defaultValue={isControlled ? undefined : defaultValue}
      onChange={handleChange}
      {...props}
    />
  );
}
