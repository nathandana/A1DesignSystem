import "./figure.css";
import { useState } from "react";
import { Bleed } from "../bleed/Bleed.jsx";

function isCropRect(rect) {
  return (
    rect != null &&
    typeof rect === "object" &&
    ["x", "y", "width", "height"].every((k) => typeof rect[k] === "number") &&
    rect.width > 0 &&
    rect.height > 0
  );
}

const rounded = ["none", "sm", "md", "lg"];
const captionPositions = ["start", "center"];
const spacings = ["sm", "md", "lg"];
const sizes = ["3xs", "2xs", "xs", "sm", "md", "lg", "xl", "xxl"];
const alignments = ["none", "start", "center", "end"];
const aspectRatios = ["16:9", "4:3", "3:2", "1:1", "2:3", "3:4", "9:16", "21:9"];
const crops = ["center", "top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"];

export function Figure({
  src,
  alt = "",
  caption,
  captionSrOnly = false,
  captionPosition = "start",
  radius,
  size,
  align,
  aspectRatio,
  crop,
  cropRect,
  marginTop,
  marginBottom,
  bleed,
  className = "",
  imgClassName = "",
  style,
  imgStyle,
  ...props
}) {
  // Freeform crop: a sub-rectangle of the image (fractions 0–1) shown
  // non-destructively. We measure the natural ratio to size the crop box.
  const cropped = isCropRect(cropRect);
  const [naturalRatio, setNaturalRatio] = useState(null);

  const classes = [
    "a1-figure",
    radius != null && rounded.includes(radius) && `a1-figure--rounded-${radius}`,
    captionPositions.includes(captionPosition) && captionPosition !== "start" && `a1-figure--caption-${captionPosition}`,
    sizes.includes(size) && `a1-figure--${size}`,
    alignments.includes(align) && align !== "none" && `a1-figure--align-${align}`,
    !cropped && aspectRatios.includes(aspectRatio) && `a1-figure--ratio-${aspectRatio.replace(":", "-")}`,
    !cropped && crops.includes(crop) && crop !== "center" && `a1-figure--crop-${crop}`,
    cropped && "a1-figure--cropped",
    spacings.includes(marginTop) && `a1-figure--mt-${marginTop}`,
    spacings.includes(marginBottom) && `a1-figure--mb-${marginBottom}`,
    className,
  ].filter(Boolean).join(" ");

  const captionClasses = [
    captionSrOnly ? "a1-sr-only" : "a1-figure__caption",
  ].join(" ");

  const img = (
    <img
      src={src}
      alt={alt}
      className={["a1-figure__img", imgClassName].filter(Boolean).join(" ")}
      style={imgStyle}
      onLoad={cropped ? (e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalWidth && naturalHeight) setNaturalRatio(naturalWidth / naturalHeight);
      } : undefined}
    />
  );

  const media = cropped ? (
    <div
      className="a1-figure__crop"
      style={{
        "--a1-figure-crop-x": cropRect.x,
        "--a1-figure-crop-y": cropRect.y,
        "--a1-figure-crop-w": cropRect.width,
        "--a1-figure-crop-h": cropRect.height,
        // Box aspect ratio = (cropW · imgW) / (cropH · imgH).
        ...(naturalRatio ? { aspectRatio: `${(cropRect.width / cropRect.height) * naturalRatio}` } : {}),
      }}
    >
      {img}
    </div>
  ) : img;

  const figure = (
    <figure className={classes} style={style} {...props}>
      {media}
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
