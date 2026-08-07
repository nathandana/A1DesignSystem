export const ICON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', 'jumbo', 'xJumbo'];
export const ICON_SIZE_PIXELS = { xs: 16, sm: 20, md: 24, lg: 32, xl: 40, jumbo: 64, xJumbo: 96 };
export const ICON_COLORS = ['muted', 'accent', 'inverse', 'success', 'error', 'warn', 'info'];

export const ICON_COLOR_VARIABLE_NAMES = {
  default: 'color/text/default',
  muted: 'color/text/muted',
  accent: 'color/text/accent',
  inverse: 'color/text/inverse',
  success: 'color/status/success/background',
  error: 'color/status/error/background',
  warn: 'color/status/warn/background',
  info: 'color/status/info/background',
};

export function normalizeIconSize(value) {
  const normalized = String(value || '').trim();
  if (!normalized) return 'md';
  if (normalized.toLowerCase() === 'xjumbo') return 'xJumbo';
  return ICON_SIZES.includes(normalized) ? normalized : 'md';
}

export function normalizeIconColor(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return ICON_COLORS.includes(normalized) ? normalized : '';
}

export function iconNameProp(props = {}) {
  if (typeof props.name === 'string' && props.name.trim()) return props.name.trim();
  if (typeof props.icon === 'string' && props.icon.trim()) return props.icon.trim();
  return 'star';
}

export function iconColorFromVariableName(value) {
  const normalized = String(value || '').trim().toLowerCase().replaceAll(' ', '');
  if (!normalized) return '';
  return Object.entries(ICON_COLOR_VARIABLE_NAMES)
    .find(([, variableName]) => {
      const candidate = variableName.toLowerCase().replaceAll(' ', '');
      return normalized === candidate || normalized.endsWith(candidate);
    })?.[0] || '';
}
