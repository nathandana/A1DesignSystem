import "./figure.css";
import { Bleed } from "../bleed/Bleed.jsx";

const rounded = ["none", "sm", "md", "lg"];
const captionPositions = ["start", "center"];
const spacings = ["sm", "md", "lg"];
const sizes = ["xs", "sm", "md", "lg"];
const alignments = ["start", "center", "end"];

export function Figure({
  src,
  alt = "",
  caption,
  captionSrOnly = false,
  captionPosition = "start",
  radius,
  size,
  align,
  marginTop,
  marginBottom,
  bleed,
  className = "",
  imgClassName = "",
  style,
  imgStyle,
  ...props
}) {
  const classes = [
    "a1-figure",
    radius != null && rounded.includes(radius) && `a1-figure--rounded-${radius}`,
    captionPositions.includes(captionPosition) && captionPosition !== "start" && `a1-figure--caption-${captionPosition}`,
    sizes.includes(size) && `a1-figure--${size}`,
    alignments.includes(align) && align !== "start" && `a1-figure--align-${align}`,
    spacings.includes(marginTop) && `a1-figure--mt-${marginTop}`,
    spacings.includes(marginBottom) && `a1-figure--mb-${marginBottom}`,
    className,
  ].filter(Boolean).join(" ");

  const captionClasses = [
    captionSrOnly ? "a1-sr-only" : "a1-figure__caption",
  ].join(" ");

  const figure = (
    <figure className={classes} style={style} {...props}>
      <img
        src={src}
        alt={alt}
        className={["a1-figure__img", imgClassName].filter(Boolean).join(" ")}
        style={imgStyle}
      />
      {caption && (
        <figcaption className={captionClasses}>{caption}</figcaption>
      )}
    </figure>
  );

  if (bleed) {
    const inlineValue = bleed === true ? undefined : bleed;
    return <Bleed inline={inlineValue}>{figure}</Bleed>;
  }

  return figure;
}
