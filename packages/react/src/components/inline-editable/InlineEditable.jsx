import { useEffect, useRef, useState } from "react";
import "./inline-editable.css";

export function InlineEditable({
  value,
  onChange,
  multiline = false,
  disabled = false,
  placeholder,
  className = "",
  inputClassName = "",
  children,
  ...props
}) {
  const [editing, setEditing] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      ref.current.select?.();
    }
  }, [editing]);

  function activate() {
    if (!disabled) setEditing(true);
  }

  function deactivate() {
    setEditing(false);
  }

  const inputClasses = ["a1-inline-editable__input", inputClassName].filter(Boolean).join(" ");

  if (editing) {
    return multiline ? (
      <textarea
        ref={ref}
        className={inputClasses}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={deactivate}
        onKeyDown={(e) => { if (e.key === "Escape") deactivate(); }}
      />
    ) : (
      <input
        ref={ref}
        type="text"
        className={inputClasses}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={deactivate}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") deactivate(); }}
      />
    );
  }

  const wrapperClasses = [
    "a1-inline-editable",
    disabled && "a1-inline-editable--disabled",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      className={wrapperClasses}
      onClick={activate}
      onKeyDown={(e) => { if (e.key === "Enter") activate(); }}
      tabIndex={disabled ? undefined : 0}
      role={disabled ? undefined : "button"}
      aria-label={props["aria-label"] ?? "Click to edit"}
      {...props}
    >
      {children ?? (placeholder && <span className="a1-inline-editable__placeholder">{placeholder}</span>)}
    </div>
  );
}
