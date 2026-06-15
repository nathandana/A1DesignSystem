import { useEffect, useRef, useState } from "react";
import "./inline-editable.css";

export function InlineEditable({ seamless = false, ...props }) {
  // Seamless edits the text in place (contentEditable) so the surrounding
  // component defines all typography; the boxed variant swaps to a field.
  return seamless ? <SeamlessEditable {...props} /> : <BoxEditable {...props} />;
}

/* ── Seamless — edits in place, inheriting all surrounding text styling ────── */

function SeamlessEditable({
  value,
  onChange,
  multiline = false,
  disabled = false,
  placeholder,
  className = "",
  inputClassName: _inputClassName,
  children: _children,
  ...props
}) {
  const ref = useRef(null);

  // Push the value into the DOM, but never while the user is actively typing
  // here — overwriting the text node would reset the caret.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const text = value ?? "";
    if (document.activeElement !== el && el.innerText !== text) {
      el.innerText = text;
    }
  }, [value]);

  function handleInput(event) {
    onChange?.(event.currentTarget.innerText);
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      event.currentTarget.blur();
      return;
    }
    if (!multiline && event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
    }
  }

  const classes = [
    "a1-inline-editable",
    "a1-inline-editable--seamless",
    multiline && "a1-inline-editable--multiline",
    disabled && "a1-inline-editable--disabled",
    className,
  ].filter(Boolean).join(" ");

  return (
    <span
      {...props}
      ref={ref}
      className={classes}
      contentEditable={!disabled}
      suppressContentEditableWarning
      role="textbox"
      aria-multiline={multiline || undefined}
      aria-label={props["aria-label"] ?? placeholder}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? undefined : 0}
      data-placeholder={placeholder}
      onInput={disabled ? undefined : handleInput}
      onKeyDown={disabled ? undefined : handleKeyDown}
    />
  );
}

/* ── Boxed — click to reveal a field, commit on blur/Enter ─────────────────── */

function BoxEditable({
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
