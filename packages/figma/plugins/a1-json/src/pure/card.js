export const CARD_ICON_DISPLAYS = ['none', 'default', 'hero'];
export const CARD_HERO_COLORS = ['action', 'neutral', 'info', 'success', 'warn', 'error'];

function normalizeCardOption(value, options, fallback) {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return options.includes(normalized) ? normalized : fallback;
}

export function normalizeCardIconDisplay(value) {
  return normalizeCardOption(value, CARD_ICON_DISPLAYS, 'default');
}

export function normalizeCardHeroColor(value) {
  return normalizeCardOption(value, CARD_HERO_COLORS, 'action');
}
