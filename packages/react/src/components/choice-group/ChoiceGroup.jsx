import { Fragment, useId, useState } from "react";
import { useLabel } from "../labels/Labels.jsx";
import { MessageBadge } from "../message/Message.jsx";
import { Icon } from "../icon/Icon.jsx";
import "./choice-group.css";

const SIZES = ["compact", "default", "comfortable"];

const BP_MIN = { xs: 0, sm: 481, md: 641, lg: 1025, xl: 1441 };

export function ChoiceGroup({
  label,
  hint,
  error,
  success,
  size        = "default",
  columns,
  multiple    = false,
  required    = false,
  name,
  options     = [],
  sections,
  value,
  defaultValue,
  onChange,
  id: providedId,
  className   = "",
  ...props
}) {
  const autoId = useId();
  const id     = providedId ?? autoId;
  const hintId    = `${id}-hint`;
  const errorId   = `${id}-error`;
  const successId = `${id}-success`;

  const resolvedSize = SIZES.includes(size) ? size : "default";

  const defaultVal = defaultValue ?? (multiple ? [] : null);
  const [internalValue, setInternalValue] = useState(defaultVal);
  const currentValue = value !== undefined ? value : internalValue;

  function handleChange(optionValue, checked) {
    if (multiple) {
      const next = checked
        ? [...(currentValue ?? []), optionValue]
        : (currentValue ?? []).filter(v => v !== optionValue);
      if (value === undefined) setInternalValue(next);
      onChange?.(next);
    } else {
      if (value === undefined) setInternalValue(optionValue);
      onChange?.(optionValue);
    }
  }

  const isFixedNumber   = typeof columns === "number" && columns > 0;
  const isResponsiveObj = columns !== null && typeof columns === "object";
  const isFixedColumns  = isFixedNumber || isResponsiveObj;

  const responsiveClass = isResponsiveObj
    ? `a1-cg-${autoId.replace(/[^a-zA-Z0-9_-]/g, "")}`
    : null;

  const responsiveStyle = isResponsiveObj
    ? Object.entries(columns)
        .filter(([bp, n]) => bp in BP_MIN && typeof n === "number" && n > 0)
        .sort(([a], [b]) => BP_MIN[a] - BP_MIN[b])
        .map(([bp, n]) => {
          const min = BP_MIN[bp];
          const rule = `.${responsiveClass} { --a1-cg-columns: ${n}; }`;
          return min === 0 ? rule : `@media (min-width: ${min}px) { .${responsiveClass} { --a1-cg-columns: ${n}; } }`;
        })
        .join("\n")
    : null;

  const classes = [
    "a1-choice-group",
    resolvedSize !== "default" && `a1-choice-group--${resolvedSize}`,
    multiple ? "a1-choice-group--multiple" : "a1-choice-group--single",
    isFixedColumns && "a1-choice-group--fixed-columns",
    responsiveClass,
    error   && "a1-choice-group--error",
    success && "a1-choice-group--success",
    required && "a1-choice-group--required",
    className,
  ].filter(Boolean).join(" ");

  const messageId   = error ? errorId : success ? successId : hint ? hintId : null;
  const describedBy = messageId || undefined;
  const requiredText = useLabel("field.required", "Required");
  const groupName    = name ?? id;

  const inlineStyle = isFixedNumber ? { "--a1-cg-columns": columns } : undefined;

  function renderOption(option) {
    const isDisabled = option.disabled ?? false;
    const isChecked  = multiple
      ? (currentValue ?? []).includes(option.value)
      : currentValue === option.value;
    const itemId = `${id}-${option.value}`;
    return (
      <label
        key={option.value}
        htmlFor={itemId}
        className={[
          "a1-choice-item",
          isDisabled && "a1-choice-item--disabled",
        ].filter(Boolean).join(" ")}
      >
        <input
          type={multiple ? "checkbox" : "radio"}
          id={itemId}
          className="a1-choice-item__input"
          name={multiple ? (name ?? id) : groupName}
          value={option.value}
          checked={isChecked}
          disabled={isDisabled}
          onChange={(e) => handleChange(option.value, e.target.checked)}
        />
        {option.icon && (
          <span className="a1-choice-item__icon" aria-hidden="true">
            <Icon name={option.icon} />
          </span>
        )}
        <span className="a1-choice-item__content">
          <span className="a1-choice-item__label">{option.label}</span>
          {option.subtext && (
            <span className="a1-choice-item__subtext">{option.subtext}</span>
          )}
        </span>
        <span className="a1-choice-item__indicator" aria-hidden="true" />
      </label>
    );
  }

  function renderItems(opts, ariaLabelledBy) {
    return (
      <div
        className="a1-choice-group__items"
        role="group"
        aria-labelledby={ariaLabelledBy}
      >
        {opts.map(renderOption)}
      </div>
    );
  }

  return (
    <>
      {responsiveStyle && <style>{responsiveStyle}</style>}
      <fieldset
        className={classes}
        aria-describedby={describedBy}
        style={inlineStyle}
        {...props}
      >
        {label && (
          <legend className="a1-choice-group__legend">
            <span className="a1-choice-group__legend-inner">
              {label}
              {required && resolvedSize === "comfortable" ? (
                <MessageBadge status="info" subtle>{requiredText}</MessageBadge>
              ) : required ? (
                <span className="a1-field__asterisk" aria-hidden="true"> *</span>
              ) : null}
            </span>
          </legend>
        )}
        {!error && !success && hint && (
          <p className="a1-choice-group__message a1-choice-group__message--hint" id={hintId}>
            {hint}
          </p>
        )}
        {sections
          ? sections.map((section, i) => (
              <Fragment key={section.label ?? i}>
                {i > 0 && <hr className="a1-choice-group__section-divider" aria-hidden="true" />}
                <div className="a1-choice-group__section">
                  {section.label && (
                    <p
                      className="a1-choice-group__section-label"
                      id={`${id}-section-${i}`}
                    >
                      {section.label}
                    </p>
                  )}
                  {renderItems(section.options, section.label ? `${id}-section-${i}` : undefined)}
                </div>
              </Fragment>
            ))
          : renderItems(options, undefined)
        }
        {error && (
          <p className="a1-choice-group__message a1-choice-group__message--error" id={errorId} role="alert">
            {error}
          </p>
        )}
        {!error && success && (
          <p className="a1-choice-group__message a1-choice-group__message--success" id={successId}>
            {success}
          </p>
        )}
      </fieldset>
    </>
  );
}
