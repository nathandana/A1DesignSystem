import { TextField } from "./TextField.jsx";

export function DateField({ className = "", ...props }) {
  return (
    <TextField
      type="date"
      className={`a1-field--fit ${className}`.trim()}
      {...props}
    />
  );
}
