import { Children, isValidElement, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../button/Button.jsx";
import { useLabel } from "../labels/Labels.jsx";
import "./code.css";

const variants = ["inline", "block"];

function textFromChildren(children) {
  if (children == null || typeof children === "boolean") return "";
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(textFromChildren).join("");
  if (isValidElement(children)) return textFromChildren(children.props.children);
  return "";
}

function writeClipboard(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).catch(() => writeClipboardFallback(text));
  }

  return writeClipboardFallback(text);
}

function writeClipboardFallback(text) {
  if (typeof document === "undefined") return Promise.reject(new Error("Clipboard unavailable"));

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.insetBlockStart = "0";
  textarea.style.insetInlineStart = "0";
  textarea.style.inlineSize = "1px";
  textarea.style.blockSize = "1px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    textarea.setSelectionRange(0, textarea.value.length);
    const copied = document.execCommand("copy");
    if (!copied) throw new Error("Copy command failed");
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  } finally {
    document.body.removeChild(textarea);
  }
}

export function Code({
  variant = "inline",
  wrapping = false,
  copyCode = false,
  copyText,
  editable = false,
  onChangeValue,
  collapsible = false,
  collapsedLines = 14,
  className = "",
  children,
  ...props
}) {
  const resolvedVariant = variants.includes(variant) ? variant : "inline";
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const preRef = useRef(null);
  const [editableValue, setEditableValue] = useState(() =>
    textFromChildren(Children.toArray(children))
  );
  const resetTimer = useRef(null);

  // Keep the textarea in sync when children change from outside (e.g. undo/redo).
  // React's Object.is bail-out means this is a no-op while the user is typing
  // (children and editableValue are already equal after each keystroke).
  useEffect(() => {
    if (!editable) return;
    setEditableValue(textFromChildren(Children.toArray(children)));
  }, [children, editable]); // eslint-disable-line react-hooks/exhaustive-deps

  const copyLabel = useLabel("code.copyCode", "Copy code");
  const copiedLabel = useLabel("code.copied", "Copied");
  const editLabel = useLabel("code.editCode", "Edit code");
  const showMoreLabel = useLabel("code.showMore", "Show more");
  const showLessLabel = useLabel("code.showLess", "Show less");
  const textToCopy = useMemo(
    () => copyText || (editable ? editableValue : textFromChildren(Children.toArray(children))),
    [children, copyText, editable, editableValue],
  );
  const shouldRenderBlock = resolvedVariant === "block" || copyCode || editable;
  // Collapsible only applies to a read-only block (not the editable textarea).
  const collapses = collapsible && !editable && shouldRenderBlock;

  useEffect(() => {
    return () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    };
  }, []);

  // Detect whether the (collapsed) content actually overflows the cap, so the
  // toggle only appears when it's needed. scrollHeight reports the full content
  // height even while clipped, so this is accurate in either state.
  useEffect(() => {
    if (!collapses) { setOverflows(false); return; }
    if (expanded) return; // measured while collapsed; keep so "Show less" stays
    const el = preRef.current;
    if (el) setOverflows(el.scrollHeight - el.clientHeight > 4);
  }, [collapses, expanded, children, collapsedLines]);

  function handleTextareaChange(e) {
    setEditableValue(e.target.value);
    onChangeValue?.(e.target.value);
  }

  async function handleCopy() {
    await writeClipboard(textToCopy);
    setCopied(true);

    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      setCopied(false);
      resetTimer.current = null;
    }, 2000);
  }

  const codeClasses = [
    "a1-code",
    `a1-code--${resolvedVariant}`,
    wrapping && "a1-code--wrapping",
    !shouldRenderBlock && className,
  ]
    .filter(Boolean)
    .join(" ");
  const editableProps = {
    ...props,
    ...(!props["aria-label"] && !props["aria-labelledby"] ? { "aria-label": editLabel } : null),
  };

  if (!shouldRenderBlock) {
    return (
      <code className={codeClasses} {...props}>
        {children}
      </code>
    );
  }

  // Cap the height whenever collapsible + not expanded (so the overflow check has
  // a clamped height to measure against); `clipped` adds the fade only when the
  // content actually overflows the cap.
  const collapsed = collapses && !expanded;
  const clipped = collapsed && overflows;

  return (
    <div
      className={[
        "a1-code-block",
        copyCode && "a1-code-block--copyable",
        editable && "a1-code-block--editable",
        collapsed && "a1-code-block--collapsed",
        clipped && "a1-code-block--clipped",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {editable ? (
        <textarea
          className={[
            "a1-code-block__textarea",
            wrapping && "a1-code-block__textarea--wrapping",
          ]
            .filter(Boolean)
            .join(" ")}
          rows={10}
          value={editableValue}
          onChange={handleTextareaChange}
          spellCheck={false}
          {...editableProps}
        />
      ) : (
        <pre
          ref={preRef}
          className="a1-code-block__pre"
          style={collapses ? { "--a1-code-collapsed-max": `${collapsedLines * 1.6}em` } : undefined}
        >
          <code className={codeClasses} {...props}>
            {children}
          </code>
        </pre>
      )}
      {(copyCode || (collapses && overflows)) && (
        <div className="a1-code-block__actions">
          {copyCode && (
            <Button
              className="a1-code-block__copy"
              icon="content_copy"
              size="sm"
              variant="tertiary"
              onClick={handleCopy}
              type="button"
            >
              {copied ? copiedLabel : copyLabel}
            </Button>
          )}
          {collapses && overflows && (
            <Button
              className="a1-code-block__toggle"
              icon={expanded ? "expand_less" : "expand_more"}
              size="sm"
              variant="tertiary"
              onClick={() => setExpanded((v) => !v)}
              type="button"
            >
              {expanded ? showLessLabel : showMoreLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
