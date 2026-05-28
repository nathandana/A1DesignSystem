import "./blockquote.css";

const VARIANTS = ["border", "filled", "feature", "minimal"];

export function Blockquote({
  variant = "border",
  cite,
  citeUrl,
  className = "",
  children,
  ...props
}) {
  const resolvedVariant = VARIANTS.includes(variant) ? variant : "border";

  return (
    <figure
      className={[
        "a1-blockquote",
        `a1-blockquote--${resolvedVariant}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <blockquote className="a1-blockquote__quote">{children}</blockquote>
      {cite && (
        <figcaption className="a1-blockquote__cite">
          {citeUrl ? (
            <a href={citeUrl} className="a1-blockquote__cite-link">
              {cite}
            </a>
          ) : (
            cite
          )}
        </figcaption>
      )}
    </figure>
  );
}
