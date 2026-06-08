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
  className = "",
  children,
  ...props
}) {
  const resolvedVariant = variants.includes(variant) ? variant : "inline";
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef(null);
  const copyLabel = useLabel("code.copyCode", "Copy code");
  const copiedLabel = useLabel("code.copied", "Copied");
  const textToCopy = useMemo(
    () => copyText || textFromChildren(Children.toArray(children)),
    [children, copyText],
  );
  const shouldRenderBlock = resolvedVariant === "block" || copyCode;

  useEffect(() => {
    return () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    };
  }, []);

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

  if (!shouldRenderBlock) {
    return (
      <code className={codeClasses} {...props}>
        {children}
      </code>
    );
  }

  return (
    <div
      className={[
        "a1-code-block",
        copyCode && "a1-code-block--copyable",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <pre className="a1-code-block__pre">
        <code className={codeClasses} {...props}>
          {children}
        </code>
      </pre>
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
    </div>
  );
}
