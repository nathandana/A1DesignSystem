import opentype from 'opentype.js';
import svgpath from 'svgpath';
import iconRegistry from '../../../../system/icons/material-symbols.json';
import type { CustomIconRecord } from './customIconStore';

export interface ValidatedCustomIcon {
  name: string;
  svg: string;
  paths: string[];
}

export interface CustomIconFontBuild {
  buffer: ArrayBuffer;
  mappings: Record<string, string>;
  fontFamily: string;
}

const FONT_FAMILY = 'A1 Custom Icons';
const MATERIAL_NAMES = new Set(iconRegistry.icons.map((icon) => icon.name));
const NAME_PATTERN = /^[a-z][a-z0-9_]*$/;
const SAFE_FILL_VALUES = new Set(['', 'none', 'currentcolor', 'black', '#000', '#000000']);
const ALLOWED_ELEMENTS = new Set(['svg', 'title', 'path']);
const FORBIDDEN_ATTRIBUTES = new Set([
  'class', 'clip-path', 'filter', 'href', 'id', 'mask', 'style', 'transform',
  'xlink:href',
]);
const MAX_SVG_BYTES = 64 * 1024;
const LIGATURE_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789_'.split('');

function cleanName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '_');
}

function normalizePathData(path: string): string {
  return path.trim().replace(/\s+/g, ' ');
}

export function validateCustomIconSvg(svgText: string, requestedName: string): ValidatedCustomIcon {
  const name = cleanName(requestedName);
  if (!NAME_PATTERN.test(name)) {
    throw new Error('Use a snake_case name beginning with a letter.');
  }
  if (MATERIAL_NAMES.has(name)) {
    throw new Error(`"${name}" is already a Material Symbols icon name.`);
  }
  if (!svgText.trim()) throw new Error('Choose an SVG file.');
  if (new Blob([svgText]).size > MAX_SVG_BYTES) {
    throw new Error('The SVG must be 64 KB or smaller.');
  }

  const document = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  if (document.querySelector('parsererror')) throw new Error('The file is not valid SVG.');
  const root = document.documentElement;
  if (root.localName !== 'svg') throw new Error('The file must have an <svg> root element.');

  const viewBox = (root.getAttribute('viewBox') ?? '').trim().split(/[\s,]+/).map(Number);
  if (viewBox.length !== 4 || viewBox.some(Number.isNaN) || viewBox.join(' ') !== '0 0 24 24') {
    throw new Error('The SVG viewBox must be exactly "0 0 24 24".');
  }

  for (const element of [root, ...Array.from(root.querySelectorAll('*'))]) {
    if (!ALLOWED_ELEMENTS.has(element.localName)) {
      throw new Error(`The <${element.localName}> element is not supported. Use filled paths only.`);
    }
    for (const attribute of Array.from(element.attributes)) {
      const key = attribute.name.toLowerCase();
      if (key.startsWith('on') || FORBIDDEN_ATTRIBUTES.has(key)) {
        throw new Error(`The "${attribute.name}" attribute is not supported.`);
      }
    }
  }

  const paths = Array.from(root.querySelectorAll('path')).map((path) => {
    const stroke = (path.getAttribute('stroke') ?? '').trim().toLowerCase();
    if (stroke && stroke !== 'none') throw new Error('Stroked paths are not supported. Convert strokes to outlines.');
    const fill = (path.getAttribute('fill') ?? '').trim().toLowerCase();
    if (!SAFE_FILL_VALUES.has(fill) || fill === 'none') {
      throw new Error('Paths must use a single currentColor or black fill.');
    }
    const data = normalizePathData(path.getAttribute('d') ?? '');
    if (!data) throw new Error('Every path must contain path data.');
    try {
      svgpath(data).abs().unshort().unarc().toString();
    } catch {
      throw new Error('One or more paths contain invalid path data.');
    }
    return data;
  });
  if (!paths.length) throw new Error('The SVG must contain at least one filled path.');

  const title = root.querySelector('title')?.textContent?.trim() || name;
  const escapedTitle = title.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const serializedPaths = paths.map((path) => `<path d="${path.replaceAll('"', '&quot;')}"/>`).join('');
  return {
    name,
    paths,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><title>${escapedTitle}</title>${serializedPaths}</svg>`,
  };
}

function buildGlyphPath(paths: string[]): opentype.Path {
  const output = new opentype.Path();
  const scale = 1000 / 24;
  const transformed = paths
    .map((path) => {
      const data = svgpath(path).abs().unshort().unarc().scale(scale, -scale).translate(0, 850).toString();
      return svgpath(data).segments;
    })
    .flat();

  let x = 0;
  let y = 0;
  for (const segment of transformed) {
    const [command, ...values] = segment;
    switch (command) {
      case 'M':
        [x, y] = values;
        output.moveTo(x, y);
        break;
      case 'L':
        [x, y] = values;
        output.lineTo(x, y);
        break;
      case 'H':
        [x] = values;
        output.lineTo(x, y);
        break;
      case 'V':
        [y] = values;
        output.lineTo(x, y);
        break;
      case 'C':
        output.curveTo(values[0], values[1], values[2], values[3], values[4], values[5]);
        x = values[4];
        y = values[5];
        break;
      case 'Q':
        output.quadTo(values[0], values[1], values[2], values[3]);
        x = values[2];
        y = values[3];
        break;
      case 'Z':
        output.close();
        break;
      default:
        throw new Error(`Unsupported SVG path command: ${command}`);
    }
  }
  return output;
}

export function buildCustomIconFont(icons: CustomIconRecord[]): CustomIconFontBuild {
  const characterGlyphs = LIGATURE_CHARS.map((character) => new opentype.Glyph({
    name: character === '_' ? 'underscore' : character,
    unicode: character.codePointAt(0),
    advanceWidth: 0,
    path: new opentype.Path(),
  }));
  const characterGlyphIndex = new Map(characterGlyphs.map((glyph, index) => [LIGATURE_CHARS[index], index + 1]));
  const iconGlyphs = icons.map((icon) => new opentype.Glyph({
    name: icon.name,
    unicode: icon.codepoint,
    advanceWidth: 1000,
    path: buildGlyphPath(icon.paths),
  }));
  const glyphs = [
    new opentype.Glyph({
      name: '.notdef',
      unicode: 0,
      advanceWidth: 1000,
      path: new opentype.Path(),
    }),
    ...characterGlyphs,
    ...iconGlyphs,
  ];
  const font = new opentype.Font({
    familyName: FONT_FAMILY,
    styleName: 'Regular',
    unitsPerEm: 1000,
    ascender: 850,
    descender: -150,
    glyphs,
  });
  icons.forEach((icon, iconIndex) => {
    const sub = [...icon.name].map((character) => characterGlyphIndex.get(character)).filter((index): index is number => typeof index === 'number');
    if (sub.length === icon.name.length) {
      font.substitution.addLigature('liga', {
        sub,
        by: 1 + characterGlyphs.length + iconIndex,
      });
    }
  });
  const buffer = font.toArrayBuffer();
  opentype.parse(buffer);
  return {
    buffer,
    fontFamily: FONT_FAMILY,
    mappings: Object.fromEntries(icons.map((icon) => [`custom:${icon.name}`, icon.name])),
  };
}
