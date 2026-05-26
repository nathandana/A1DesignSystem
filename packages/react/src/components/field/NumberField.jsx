import { TextField } from "./TextField.jsx";

export function NumberField({ className = "", ...props }) {
  return (
    <TextField
      type="number"
      className={className}
      {...props}
    />
  );
}
