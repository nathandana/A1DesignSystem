// Canvas geometry for linked A1 project imports. These values use the existing
// A1 base spacing scale: 64 between screens and 128 between page sections.
export const PROJECT_SCREEN_GAP = 64;
export const PROJECT_SECTION_PADDING = 64;
export const PROJECT_SECTION_GAP = 128;

function positiveDimension(value) {
  return Number.isFinite(value) && value > 0 ? Math.ceil(value) : 1;
}

export function horizontalProjectSectionLayout(sizes, options = {}) {
  const gap = positiveDimension(options.gap || PROJECT_SCREEN_GAP);
  const padding = positiveDimension(options.padding || PROJECT_SECTION_PADDING);
  const normalized = (Array.isArray(sizes) ? sizes : []).map((size) => ({
    width: positiveDimension(size && size.width),
    height: positiveDimension(size && size.height),
  }));
  let nextX = padding;
  let maxHeight = 1;
  const items = normalized.map((size) => {
    const item = { x: nextX, y: padding, ...size };
    nextX += size.width + gap;
    maxHeight = Math.max(maxHeight, size.height);
    return item;
  });
  return {
    items,
    width: items.length ? nextX - gap + padding : padding * 2,
    height: maxHeight + (padding * 2),
  };
}

export function nextProjectSectionY(y, sectionHeight, gap = PROJECT_SECTION_GAP) {
  return Math.round(y) + positiveDimension(sectionHeight) + positiveDimension(gap);
}
