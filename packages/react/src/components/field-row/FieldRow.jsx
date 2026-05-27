import { useContext } from "react";
import { FieldsetContext } from "../fieldset/FieldsetContext.js";
import "./field-row.css";

export function FieldRow({ children, className = "", ...props }) {
  const ctx = useContext(FieldsetContext);

  // Side-label fields already use an internal two-column grid;
  // stacking the row prevents layout conflicts.
  const stacked = ctx?.labelPosition === "side";

  const classes = [
    "a1-field-row",
    stacked && "a1-field-row--stacked",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
