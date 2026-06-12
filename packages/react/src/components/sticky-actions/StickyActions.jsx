import { useEffect, useRef, useState } from "react";
import "./sticky-actions.css";

const VALID_CONTENT_WIDTHS = ["xs", "sm", "md", "lg", "xl", "2xl"];

export function StickyActions({ contentWidth, className = "", children, ...props }) {
  const resolvedWidth = VALID_CONTENT_WIDTHS.includes(contentWidth) ? contentWidth : null;
  const barRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!barRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setOffset(entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height);
    });
    ro.observe(barRef.current);
    return () => ro.disconnect();
  }, []);

  const innerClass = [
    "a1-sticky-actions__inner",
    resolvedWidth && `a1-sticky-actions__inner--${resolvedWidth}`,
  ].filter(Boolean).join(" ");

  return (
    <>
      {/* Spacer holds the bar's height in document flow so content above is
          never hidden. Height is measured and kept in sync via ResizeObserver. */}
      <div style={{ height: offset }} aria-hidden="true" />
      <div
        ref={barRef}
        className={["a1-sticky-actions", className].filter(Boolean).join(" ")}
        {...props}
      >
        <div className={innerClass}>{children}</div>
      </div>
    </>
  );
}
