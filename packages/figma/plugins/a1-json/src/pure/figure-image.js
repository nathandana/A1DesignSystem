const A1_IMAGE_REF_PATTERN = /^a1img:\/\/([A-Za-z0-9_-]{1,120})$/;

export function a1ImageIdFromRef(src) {
  if (typeof src !== 'string') return '';
  return src.match(A1_IMAGE_REF_PATTERN)?.[1] || '';
}

export function publicA1ImageUrl(src, publicBaseUrl) {
  const id = a1ImageIdFromRef(src);
  const base = typeof publicBaseUrl === 'string' ? publicBaseUrl.replace(/\/+$/, '') : '';
  return id && base ? `${base}/${encodeURIComponent(id)}` : '';
}
