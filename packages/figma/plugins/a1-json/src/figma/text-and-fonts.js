/** Shared text, font, color-token, and text suggestion helpers. */

export function looseNameMatch(candidateName, requestedName) {
  const candidate = String(candidateName || '');
  const requested = String(requestedName || '');
  if (!candidate || !requested) return false;
  const candidateCanonical = canonicalKey(candidate);
  const requestedCanonical = canonicalKey(requested);
  if (candidateCanonical === requestedCanonical || candidateCanonical.endsWith(requestedCanonical)) return true;
  const candidateCompact = compactKey(candidate);
  const requestedCompact = compactKey(requested);
  return candidateCompact === requestedCompact || candidateCompact.endsWith(requestedCompact);
}

// ── Free Figma text → Heading / Paragraph ──────────────────────────────────
// Figma deliberately models ordinary editorial copy as text layers with local
// styles instead of component instances. These helpers make that convention
// serializable without treating text inside an A1 component as a separate node.
export const HEADING_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
export const DISPLAY_SIZES = ['sm', 'md', 'lg', 'xl', 'xxl', 'jumbo', 'xjumbo'];
export const PARAGRAPH_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
export const HEADING_FONT_SIZES = { xs: 18, sm: 20, md: 24, lg: 28, xl: 32, xxl: 40 };
export const DISPLAY_FONT_SIZES = { sm: 24, md: 28, lg: 32, xl: 40, xxl: 56, jumbo: 72, xjumbo: 96 };
export const PARAGRAPH_FONT_SIZES = { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 };

export function nearestTextSize(scale, fontSize, fallback) {
  if (typeof fontSize !== 'number') return fallback;
  return Object.keys(scale).reduce((nearest, size) =>
    Math.abs(scale[size] - fontSize) < Math.abs(scale[nearest] - fontSize) ? size : nearest, fallback);
}

export function nearestTextSizeDistance(scale, fontSize, fallback) {
  const size = nearestTextSize(scale, fontSize, fallback);
  return typeof fontSize === 'number' ? Math.abs(scale[size] - fontSize) : Infinity;
}

export function inferredTextFamily(fontSize, likelyHeading) {
  if (!likelyHeading) return 'body';
  // Figma Display and Heading are separate A1 families. When there is no
  // local A1 style to tell us which one it is, choose Display only when its
  // scale is genuinely closer; ties retain Heading's semantic default.
  const headingDistance = nearestTextSizeDistance(HEADING_FONT_SIZES, fontSize, 'md');
  const displayDistance = nearestTextSizeDistance(DISPLAY_FONT_SIZES, fontSize, 'md');
  return displayDistance < headingDistance ? 'display' : 'heading';
}

export function textFontStyleName(text) {
  try {
    if (!text || text.fontName === figma.mixed) return '';
    return String(text.fontName && text.fontName.style || '');
  } catch {
    return '';
  }
}

export function textLayerPlainContent(text) {
  try {
    return typeof text.characters === 'string' ? text.characters.trim() : '';
  } catch {
    return '';
  }
}

export function textLooksLikeShortTitle(text) {
  const content = textLayerPlainContent(text);
  if (!content) return false;
  const lines = content.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length > 2 || content.length > 90) return false;
  return !/[.!?]\s*$/.test(content);
}

export function textLayerNameSuggestsHeading(text) {
  try {
    return /\b(heading|headline|title|display|hero|h[1-6])\b/i.test(String(text && text.name || ''));
  } catch {
    return false;
  }
}

export function textLooksLikeHeading(text, fontSize) {
  if (typeof fontSize !== 'number') return textLayerNameSuggestsHeading(text);
  if (textLayerNameSuggestsHeading(text)) return true;
  if (fontSize >= 24) return true;
  const shortTitle = textLooksLikeShortTitle(text);
  if (fontSize >= 20 && shortTitle) return true;
  if (fontSize >= 18 && shortTitle && /medium|semi|demi|bold|black/i.test(textFontStyleName(text))) return true;
  return false;
}

export function textStyleName(text) {
  if (!text.textStyleId || text.textStyleId === figma.mixed) return '';
  const style = figma.getStyleById(text.textStyleId);
  return style && style.type === 'TEXT' ? style.name : '';
}

export function textAlignment(text) {
  const alignment = text.textAlignHorizontal;
  if (alignment === 'CENTER') return 'center';
  if (alignment === 'RIGHT') return 'right';
  return 'left';
}

export function conversionTextAlignment(text, warnings, label = 'Converted text') {
  try {
    if (text.textAlignHorizontal === 'CENTER') return 'center';
    if (text.textAlignHorizontal === 'RIGHT') return 'right';
    if (text.textAlignHorizontal === 'LEFT') return 'left';
    if (text.textAlignHorizontal === 'JUSTIFIED') {
      warnings.push(`${label} uses justified text alignment, which A1 Heading/Body does not support; left alignment was used.`);
    }
  } catch {
    // Fall through to the default alignment below.
  }
  return 'left';
}

export function textColorTokenFromVariable(variable) {
  // `canonicalKey` intentionally keeps `/` for component/style paths. Color
  // variables use that separator (`color/text/accent`), so normalize it before
  // matching semantic token suffixes.
  const name = variable && canonicalKey(variable.name).replaceAll('/', '');
  if (name && name.endsWith('textdefault')) return 'default';
  if (name && name.endsWith('textmuted')) return 'muted';
  if (name && name.endsWith('textaccent')) return 'accent';
  return null;
}

export function isLinkColorVariable(variable) {
  const name = variable && canonicalKey(variable.name);
  return Boolean(name && (name === canonicalKey('link/color') || name.endsWith(canonicalKey('link/color'))));
}

export function visibleSolidTextPaint(text) {
  return Array.isArray(text.fills)
    ? text.fills.find((entry) => entry && entry.type === 'SOLID' && entry.visible !== false)
    : null;
}

export function firstSolidTextPaint(text) {
  const direct = visibleSolidTextPaint(text);
  if (direct) return direct;
  if (!text || !text.characters || typeof text.getRangeFills !== 'function') return null;
  try {
    const fills = text.getRangeFills(0, text.characters.length);
    const rangePaint = Array.isArray(fills)
      ? fills.find((entry) => entry && entry.type === 'SOLID' && entry.visible !== false)
      : null;
    if (rangePaint) return rangePaint;
    // A mixed range can decline to expose a single fill array. Any single
    // character supplies a valid paint carrier for the full AutoFix binding.
    for (let index = 0; index < text.characters.length; index += 1) {
      const characterFills = text.getRangeFills(index, index + 1);
      const characterPaint = Array.isArray(characterFills)
        ? characterFills.find((entry) => entry && entry.type === 'SOLID' && entry.visible !== false)
        : null;
      if (characterPaint) return characterPaint;
    }
    return null;
  } catch {
    return null;
  }
}

export function textColorToken(text) {
  const paint = visibleSolidTextPaint(text);
  const variableId = paint && paint.boundVariables && paint.boundVariables.color && paint.boundVariables.color.id;
  const variable = variableId && figma.variables.getVariableById(variableId);
  // The JSON model deliberately carries the component's semantic color prop
  // (`color: "muted"`), never a rendered color. This maps to the Figma
  // `color/text/muted` variable and lets every A1 renderer resolve its own
  // theme. Figma's variable path includes the `color/` namespace, so match its
  // semantic suffix rather than assuming a shortened variable name.
  return textColorTokenFromVariable(variable);
}

export function textUsesLinkColor(text) {
  const paint = visibleSolidTextPaint(text);
  return paintUsesLinkColor(paint);
}

export function paintUsesLinkColor(paint) {
  const variableId = paint && paint.boundVariables && paint.boundVariables.color && paint.boundVariables.color.id;
  return Boolean(variableId && isLinkColorVariable(figma.variables.getVariableById(variableId)));
}

export function isBluePaint(paint) {
  const color = paint && paint.color;
  return Boolean(color && color.b > color.g && color.b > color.r);
}

export function isBlackPaint(paint) {
  const color = paint && paint.color;
  return Boolean(color && color.r === 0 && color.g === 0 && color.b === 0);
}

export function isBlueUnderlinedText(text) {
  if (!text || text.textDecoration !== 'UNDERLINE') return false;
  if (textUsesLinkColor(text)) return true;
  // A manually-authored blue or blue-violet underline is an intentional link
  // cue. The AutoFix below replaces it with the A1 Link style and token rather
  // than preserving a raw paint value in JSON.
  return isBluePaint(visibleSolidTextPaint(text));
}

export function inlineLinkRanges(text) {
  if (!text || !text.characters || typeof text.getRangeTextDecoration !== 'function' || typeof text.getRangeFills !== 'function') return [];
  const ranges = [];
  let open = null;
  const close = (end) => {
    if (!open) return;
    ranges.push({ start: open.start, end, needsFix: open.needsFix });
    open = null;
  };

  for (let index = 0; index < text.characters.length; index += 1) {
    let isLink = false;
    let needsFix = true;
    try {
      const decoration = text.getRangeTextDecoration(index, index + 1);
      const fills = text.getRangeFills(index, index + 1);
      const paint = Array.isArray(fills) ? fills.find((entry) => entry && entry.type === 'SOLID' && entry.visible !== false) : null;
      // Within a Heading or Paragraph, an underline is the explicit authored
      // inline-link cue. The surrounding component owns typography; AutoFix
      // normalizes the range itself to Link's semantic color token.
      isLink = decoration === 'UNDERLINE';
      needsFix = !paintUsesLinkColor(paint);
    } catch {
      // Range inspection is unavailable for a transient mixed-text selection.
      // The layer can still export as ordinary Heading or Paragraph text.
      isLink = false;
    }
    if (isLink && !open) open = { start: index, needsFix };
    else if (isLink && open) open.needsFix = open.needsFix || needsFix;
    else close(index);
  }
  close(text.characters.length);
  return ranges;
}

export function resolvedVariableColor(variable, modeId, seen = new Set()) {
  if (!variable || seen.has(variable.id)) return null;
  seen.add(variable.id);
  const values = variable.valuesByMode || {};
  const value = values[modeId] || values[Object.keys(values)[0]];
  if (value && typeof value.r === 'number' && typeof value.g === 'number' && typeof value.b === 'number') return value;
  if (value && value.type === 'VARIABLE_ALIAS' && value.id) {
    return resolvedVariableColor(figma.variables.getVariableById(value.id), modeId, seen);
  }
  return null;
}

export function colorDistance(first, second) {
  const opacityA = first.opacity === undefined ? 1 : first.opacity;
  const opacityB = second.a === undefined ? 1 : second.a;
  return Math.hypot(first.color.r - second.r, first.color.g - second.g, first.color.b - second.b, opacityA - opacityB);
}

export async function nearestTextColorToken(text, allowedTokens) {
  const paint = visibleSolidTextPaint(text);
  if (!paint || !paint.color) return null;
  const variables = await figma.variables.getLocalVariablesAsync('COLOR');
  let nearest = null;
  for (const variable of variables) {
    const token = textColorTokenFromVariable(variable);
    if (!token || !allowedTokens.includes(token)) continue;
    for (const modeId of Object.keys(variable.valuesByMode || {})) {
      const color = resolvedVariableColor(variable, modeId);
      if (!color) continue;
      const distance = colorDistance(paint, color);
      if (!nearest || distance < nearest.distance) nearest = { token, distance };
    }
  }
  return nearest && nearest.token;
}

export function currentTextNode(text) {
  const current = text && resolveNodeById(text.id);
  return current && current.type === 'TEXT' ? current : text;
}

export function headingElementForSize(size) {
  return ({ xs: 'h6', sm: 'h5', md: 'h4', lg: 'h3', xl: 'h2', xxl: 'h1' })[size] || 'h2';
}

export function inferredLinkWeight(text) {
  if (!text || text.fontName === figma.mixed) return 'normal';
  const style = String(text.fontName.style || '').toLowerCase();
  if (/black|bold/.test(style)) return 'bold';
  if (/semibold|demi/.test(style)) return 'semibold';
  if (/medium/.test(style)) return 'medium';
  return 'normal';
}

export function linkTextSuggestion(text) {
  const style = textStyleName(text).trim().toLowerCase();
  const styleMatch = /^link\/(xs|sm|md|lg|xl)\/(normal|medium|semibold|bold)$/.exec(style);
  const fontSize = text.fontSize === figma.mixed ? undefined : text.fontSize;
  const styleSize = styleMatch && styleMatch[1];
  const requestedSize = styleSize || nearestTextSize(PARAGRAPH_FONT_SIZES, fontSize, 'md');
  const requestedWeight = styleMatch ? styleMatch[2] : inferredLinkWeight(text);
  const hasCanonicalStyleSize = Boolean(styleMatch && typeof fontSize === 'number' && Math.abs(PARAGRAPH_FONT_SIZES[styleSize] - fontSize) < 0.01);
  const hasLinkColor = textUsesLinkColor(text);
  const issues = [];

  if (!styleMatch || !hasCanonicalStyleSize) {
    issues.push(`Blue underlined text looks like an A1 Link; Link/${requestedSize}/${requestedWeight} is the nearest match.`);
  }
  if (!hasLinkColor) issues.push('Its fill is not bound to the A1 link/color token.');
  if (!['LEFT', 'CENTER', 'RIGHT'].includes(text.textAlignHorizontal)) {
    issues.push('Its horizontal alignment is not supported by A1 Link text.');
  }

  return {
    type: 'Link',
    props: { size: requestedSize, weight: requestedWeight },
    issues,
    styleName: `link/${requestedSize}/${requestedWeight}`,
    color: 'link',
    align: textAlignment(text),
  };
}

export function textSuggestion(text) {
  if (isBlueUnderlinedText(text)) return linkTextSuggestion(text);
  const style = textStyleName(text).trim().toLowerCase();
  const styleMatch = /^(heading|display|body)\/(xs|sm|md|lg|xl|xxl|jumbo|xjumbo)$/.exec(style);
  if (!styleMatch && auditA1TextStyleName(style)) {
    return {
      type: 'Paragraph',
      props: { size: 'md' },
      issues: [],
      styleName: style,
      color: textColorToken(text) || 'default',
      align: textAlignment(text),
    };
  }
  const fontSize = text.fontSize === figma.mixed ? undefined : text.fontSize;
  const likelyHeading = styleMatch
    ? styleMatch[1] !== 'body'
    : textLooksLikeHeading(text, fontSize);
  const family = styleMatch ? styleMatch[1] : inferredTextFamily(fontSize, likelyHeading);
  const scale = family === 'body' ? PARAGRAPH_FONT_SIZES : family === 'display' ? DISPLAY_FONT_SIZES : HEADING_FONT_SIZES;
  const allowed = family === 'body' ? PARAGRAPH_SIZES : family === 'display' ? DISPLAY_SIZES : HEADING_SIZES;
  const styleSize = styleMatch && allowed.includes(styleMatch[2]) ? styleMatch[2] : null;
  // A Figma text style can stay attached while its font size is locally
  // overridden. Treat the actual numeric size as authoritative so AutoFix
  // selects the nearest A1 option instead of reapplying the stale style size.
  const hasCanonicalStyleSize = styleSize && typeof fontSize === 'number' && Math.abs(scale[styleSize] - fontSize) < 0.01;
  const requestedSize = hasCanonicalStyleSize
    ? styleSize
    : nearestTextSize(scale, fontSize, family === 'body' ? 'md' : 'md');
  const detectedColor = textColorToken(text);
  const color = family === 'body' && detectedColor === 'accent' ? 'default' : detectedColor;
  const align = textAlignment(text);
  const issues = [];
  const inlineLinks = inlineLinkRanges(text);
  if (!styleMatch || !styleSize) {
    issues.push(`No A1 ${family === 'body' ? 'body' : family} text style is applied; ${family}/${requestedSize} is the nearest match.`);
  } else if (!hasCanonicalStyleSize) {
    const actualSize = typeof fontSize === 'number' ? `${fontSize}px` : 'mixed text sizes';
    issues.push(`Its font size (${actualSize}) does not match ${family}/${styleSize}; ${family}/${requestedSize} is the nearest A1 size.`);
  }
  if (!color) issues.push('Its fill is not bound to an A1 text color token.');
  if (family === 'body' && detectedColor === 'accent') issues.push('Paragraph does not support the A1 accent text color; default text color will be used.');
  if (!['LEFT', 'CENTER', 'RIGHT'].includes(text.textAlignHorizontal)) issues.push('Its horizontal alignment is not supported by A1 text components.');
  if (inlineLinks.some((link) => link.needsFix)) {
    issues.push('Blue underlined inline text looks like an A1 Link; AutoFix will bind each Link range to the link/color token.');
  }
  const props = family === 'body'
    ? { size: requestedSize, ...(color === 'muted' ? { color } : {}), ...(align !== 'left' ? { align } : {}) }
    : { as: family === 'display' ? 'h1' : headingElementForSize(requestedSize), type: family === 'display' ? 'display' : 'heading', size: requestedSize === 'xjumbo' ? 'xJumbo' : requestedSize, ...(color ? { color } : {}), ...(align !== 'left' ? { align } : {}) };
  return {
    type: family === 'body' ? 'Paragraph' : 'Heading',
    props,
    issues,
    styleName: `${family}/${requestedSize}`,
    color: color || 'default',
    align,
    inlineLinks,
  };
}

export function exportTextNode(text) {
  // Figma can retain a selected-node handle across a fill-variable edit. Read
  // the current node again so manual color changes export the live binding.
  const current = currentTextNode(text);
  const suggestion = textSuggestion(current);
  const inlineLinks = suggestion.type === 'Link'
    ? []
    : (suggestion.inlineLinks || []).map(({ start, end }) => ({ start, end }));
  return {
    node: {
      id: componentId(suggestion.type, current),
      type: suggestion.type,
      props: suggestion.props,
      content: { fallback: current.characters, ...(inlineLinks.length ? { inlineLinks } : {}) },
    },
    warnings: suggestion.issues,
    review: suggestion.issues.length ? { issues: suggestion.issues, suggestion } : null,
  };
}

// ── Free auto-layout frames → Stack / Grid ────────────────────────────────
// Figma does not use a component instance for the general-purpose Stack. A
// normal authored auto-layout Frame is its counterpart. Component internals
// are deliberately excluded, while a frame placed in a native SLOT remains
// exportable: the slot is the component's editable content boundary.
