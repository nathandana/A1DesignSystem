import "./sticky-actions.css";

const VALID_CONTENT_WIDTHS = ["xs", "sm", "md", "lg", "xl", "2xl"];

export function StickyActions({ contentWidth, className = "", children, ...props }) {
  const resolvedWidth = VALID_CONTENT_WIDTHS.includes(contentWidth) ? contentWidth : null;

  const innerClass = [
    "a1-sticky-actions__inner",
    resolvedWidth && `a1-sticky-actions__inner--${resolvedWidth}`,
  ].filter(Boolean).join(" ");

  return (
    <div className={["a1-sticky-actions", className].filter(Boolean).join(" ")} {...props}>
      <div className={innerClass}>
        {children}
      </div>
    </div>
  );
}
