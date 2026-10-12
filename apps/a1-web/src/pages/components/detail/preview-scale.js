// Device dimensions stay unchanged inside the iframe. Only its outer presentation scales.
export function previewScale({ width, height, availableWidth, availableHeight, bezelWidth = 0, bezelHeight = 0 }) {
  return Math.max(0, Math.min(1,
    Math.max(0, availableWidth - bezelWidth) / width,
    Math.max(0, availableHeight - bezelHeight) / height,
  ))
}
