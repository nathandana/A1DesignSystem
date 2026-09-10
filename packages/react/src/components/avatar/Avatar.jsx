import { useState } from "react";
import "./avatar.css";

const SIZES = ["xs", "sm", "md", "lg", "xl"];

function avatarInitials(name) {
  const words = String(name ?? "").trim().split(/\s+/u).filter(Boolean);
  if (!words.length) return "";
  const first = Array.from(words[0])[0] ?? "";
  const last = words.length > 1 ? (Array.from(words[words.length - 1])[0] ?? "") : "";
  return `${first}${last}`;
}

export function Avatar({
  name,
  src,
  alt,
  initials,
  size = "md",
  className = "",
  "aria-label": ariaLabel,
  ...props
}) {
  const [failedSrc, setFailedSrc] = useState(null);
  const resolvedSize = SIZES.includes(size) ? size : "md";
  const showImage = !!src && failedSrc !== src;
  const label = ariaLabel ?? (alt === undefined ? name : alt);
  const imageAlt = ariaLabel != null ? "" : (alt ?? name ?? "");
  const fallback = initials == null ? avatarInitials(name) : initials;
  const classes = ["a1-avatar", `a1-avatar--${resolvedSize}`, className].filter(Boolean).join(" ");
  const rootA11yProps = ariaLabel != null
    ? (ariaLabel ? { role: "img", "aria-label": ariaLabel } : { "aria-hidden": "true" })
    : !showImage
      ? (label ? { role: "img", "aria-label": label } : { "aria-hidden": "true" })
      : {};

  return (
    <span
      className={classes}
      {...rootA11yProps}
      {...props}
    >
      {showImage ? (
        <img
          className="a1-avatar__image"
          src={src}
          alt={imageAlt}
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <span className="a1-avatar__initials" aria-hidden="true">{fallback}</span>
      )}
    </span>
  );
}
