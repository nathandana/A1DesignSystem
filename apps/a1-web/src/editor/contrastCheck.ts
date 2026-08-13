// WCAG 2.x contrast-ratio math, shared with the token-based contrast rows on
// the Accessibility foundation page (see ComponentDetailPage.jsx). Kept
// dependency-free so it can run against any parsed RGB triplet, whether it
// came from a design token or a live getComputedStyle() read.

export type Rgb = [number, number, number];

export function parseCssColor(value: string): Rgb {
  const clean = String(value || '').trim();
  if (!clean) throw new Error('Missing color value');
  if (clean.startsWith('#')) {
    const hex = clean.slice(1);
    if (/^[0-9a-f]{3}$/i.test(hex)) {
      return hex.split('').map((part) => parseInt(`${part}${part}`, 16)) as Rgb;
    }
    if (/^[0-9a-f]{6}$/i.test(hex)) {
      return [0, 2, 4].map((index) => parseInt(hex.slice(index, index + 2), 16)) as Rgb;
    }
  }

  const rgbMatch = clean.match(/^rgba?\((.+)\)$/i);
  if (rgbMatch) {
    const parts = rgbMatch[1]
      .replaceAll(',', ' ')
      .replace(/\s*\/\s*/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
    return parts.slice(0, 3).map((part) => {
      if (part.endsWith('%')) return Math.round((Number(part.slice(0, -1)) / 100) * 255);
      return Number(part);
    }) as Rgb;
  }

  throw new Error(`Unsupported color value: ${clean}`);
}

/** Alpha channel of an rgb()/rgba()/hex color string, or 1 if fully opaque/unspecified. */
export function parseCssAlpha(value: string): number {
  const clean = String(value || '').trim();
  const rgbaMatch = clean.match(/^rgba?\((.+)\)$/i);
  if (!rgbaMatch) return 1;
  const parts = rgbaMatch[1]
    .replaceAll(',', ' ')
    .replace(/\s*\/\s*/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length < 4) return 1;
  const raw = parts[3];
  return raw.endsWith('%') ? Number(raw.slice(0, -1)) / 100 : Number(raw);
}

export function rgbToHex(rgb: Rgb): string {
  return `#${rgb.map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')}`;
}

export function blendRgb(foreground: Rgb, background: Rgb, alpha: number): Rgb {
  return foreground.map((value, index) => value * alpha + background[index] * (1 - alpha)) as Rgb;
}

function channelToLinear(value: number): number {
  const normalized = value / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function colorLuminance(rgb: Rgb): number {
  const [r, g, b] = rgb.map(channelToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: Rgb, background: Rgb): number {
  const fg = colorLuminance(foreground);
  const bg = colorLuminance(background);
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

export function ratioLabel(value: number): string {
  return `${value.toFixed(2)}:1`;
}

export type ContrastStatus = 'pass' | 'review';

/** WCAG 1.4.3: large text is >=24px, or >=18.66px (14pt) and bold (weight >= 700). */
export function isLargeText(fontSizePx: number, fontWeight: number): boolean {
  if (fontSizePx >= 24) return true;
  return fontSizePx >= 18.66 && fontWeight >= 700;
}

/** AA minimum for the given text size: 3:1 for large text, 4.5:1 otherwise. */
export function textContrastMinimum(large: boolean): number {
  return large ? 3 : 4.5;
}

export function textContrastStatus(ratio: number, large: boolean): ContrastStatus {
  return ratio >= textContrastMinimum(large) ? 'pass' : 'review';
}

/** WCAG 1.4.11 non-text minimum (borders, focus rings, icon-only controls). */
export function nonTextContrastStatus(ratio: number): ContrastStatus {
  return ratio >= 3 ? 'pass' : 'review';
}

// ─── Live DOM scan ──────────────────────────────────────────────────────────
// Everything below reads real rendered styles from the editor canvas (which
// tags every node's root element with data-editor-node, see
// EditorSelectionBoundary.tsx) rather than inferring color from JSON props,
// so it reflects the current theme, color mode, and any overrides exactly as
// painted.

export interface ContrastReportItem {
  id: string;
  type: string;
  text: string;
  large: boolean;
  ratio: number;
  ratioLabel: string;
  minimum: number;
  status: ContrastStatus;
  foreground: string;
  background: string;
  note: string;
}

export interface ContrastReport {
  scopeLabel: string;
  itemCount: number;
  passCount: number;
  reviewCount: number;
  items: ContrastReportItem[];
}

function isElementVisible(el: Element): boolean {
  const style = getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden') return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function isDecorative(el: Element): boolean {
  return el.closest('[aria-hidden="true"]') != null;
}

/** Direct text of `el`, excluding text that belongs to a nested data-editor-node
 * (that descendant gets checked as its own item, so text isn't double-counted). */
function ownText(el: Element): string {
  let text = '';
  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      text += child.textContent ?? '';
    } else if (child.nodeType === Node.ELEMENT_NODE && !(child as Element).hasAttribute('data-editor-node')) {
      text += ownText(child as Element);
    }
  }
  return text;
}

/** Effective background color behind `el`: composite every ancestor's
 * background-color up to the scan root, since a transparent element shows
 * whatever is painted behind it. Stops early at the first opaque layer. */
function effectiveBackground(el: Element, root: Element): Rgb {
  const surfaces: Array<{ rgb: Rgb; alpha: number }> = [];
  let node: Element | null = el;
  while (node) {
    const bg = getComputedStyle(node).backgroundColor;
    const alpha = parseCssAlpha(bg);
    if (alpha > 0) {
      try {
        surfaces.push({ rgb: parseCssColor(bg), alpha });
        if (alpha >= 1) break;
      } catch {
        // Unsupported color function (e.g. a gradient-only background) — skip this layer.
      }
    }
    if (node === root) break;
    node = node.parentElement;
  }

  // Composite from the outermost (last found) layer down to the nearest one.
  let result: Rgb = [255, 255, 255];
  for (let i = surfaces.length - 1; i >= 0; i -= 1) {
    result = blendRgb(surfaces[i].rgb, result, surfaces[i].alpha);
  }
  return result;
}

function noteFor(status: ContrastStatus, ratio: number, minimum: number, large: boolean): string {
  if (status === 'pass') {
    return `${ratioLabel(ratio)} meets the ${minimum}:1 AA minimum for ${large ? 'large' : 'normal'} text.`;
  }
  return `${ratioLabel(ratio)} is below the ${minimum}:1 AA minimum for ${large ? 'large' : 'normal'} text. Darken the text color, lighten the background, or increase the font size/weight to qualify as large text.`;
}

/**
 * Scans every data-editor-node element under `root` (or, when `scopeNodeId`
 * is set, under the element with that id) for text-contrast issues, reading
 * live computed styles rather than JSON props/tokens.
 */
export function createContrastReport(
  root: Element,
  scopeNodeId: string | null,
  scopeLabel: string,
): ContrastReport {
  const scanRoot = scopeNodeId
    ? root.querySelector(`[data-editor-node="${CSS.escape(scopeNodeId)}"]`) ?? root
    : root;

  const candidates = Array.from(scanRoot.querySelectorAll('[data-editor-node]'));
  if (scanRoot.hasAttribute('data-editor-node')) candidates.unshift(scanRoot);

  const items: ContrastReportItem[] = [];
  const seen = new Set<Element>();

  for (const el of candidates) {
    if (seen.has(el)) continue;
    seen.add(el);
    if (!isElementVisible(el) || isDecorative(el)) continue;

    const text = ownText(el).trim();
    if (!text) continue;

    const style = getComputedStyle(el);
    let foreground: Rgb;
    try {
      foreground = parseCssColor(style.color);
    } catch {
      continue;
    }
    const background = effectiveBackground(el, scanRoot);

    const fontSize = Number.parseFloat(style.fontSize) || 16;
    const fontWeight = Number.parseInt(style.fontWeight, 10) || 400;
    const large = isLargeText(fontSize, fontWeight);
    const ratio = contrastRatio(foreground, background);
    const minimum = textContrastMinimum(large);
    const status = textContrastStatus(ratio, large);

    items.push({
      id: el.getAttribute('data-editor-node') ?? `item-${items.length}`,
      type: el.getAttribute('data-editor-type') ?? 'Element',
      text: text.length > 80 ? `${text.slice(0, 80)}…` : text,
      large,
      ratio,
      ratioLabel: ratioLabel(ratio),
      minimum,
      status,
      foreground: rgbToHex(foreground),
      background: rgbToHex(background),
      note: noteFor(status, ratio, minimum, large),
    });
  }

  return {
    scopeLabel,
    itemCount: items.length,
    passCount: items.filter((item) => item.status === 'pass').length,
    reviewCount: items.filter((item) => item.status === 'review').length,
    items,
  };
}
