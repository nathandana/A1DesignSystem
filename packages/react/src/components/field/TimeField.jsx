import { TextField } from "./TextField.jsx";

export function TimeField({ className = "", ...props }) {
  return (
    <TextField
      type="time"
      className={`a1-field--fit ${className}`.trim()}
      {...props}
    />
  );
}
