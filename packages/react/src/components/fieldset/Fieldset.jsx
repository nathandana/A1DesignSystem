import { FieldsetContext } from "./FieldsetContext.js";
import "./fieldset.css";

const SIZES           = ["comfortable", "default", "compact"];
const LABEL_POSITIONS = ["above", "side"];

export function Fieldset({
  legend,
  size,
  labelPosition,
  markRequired = false,
  surface = false,
  children,
  className = "",
  ...props
}) {
  const resolvedSize     = SIZES.includes(size)           ? size          : undefined;
  const resolvedPosition = LABEL_POSITIONS.includes(labelPosition) ? labelPosition : undefined;

  // Note appears for compact/default; comfortable fields already show a "Required" badge.
  const showRequiredNote = markRequired && resolvedSize !== "comfortable";

  const classes = [
    "a1-fieldset",
    surface && "a1-fieldset--surface",
    className,
  ].filter(Boolean).join(" ");

  return (
    <FieldsetContext.Provider value={{ size: resolvedSize, labelPosition: resolvedPosition }}>
      <fieldset className={classes} {...props}>
        {legend && (
          <legend className={`a1-fieldset__legend${showRequiredNote ? " a1-fieldset__legend--has-note" : ""}`}>
            {legend}
          </legend>
        )}
        {showRequiredNote && (
          <p className="a1-fieldset__required-note">
            <span className="a1-fieldset__required-note__asterisk">*</span>
            {" "}Required field
          </p>
        )}
        <div className="a1-fieldset__body">
          {children}
        </div>
      </fieldset>
    </FieldsetContext.Provider>
  );
}
