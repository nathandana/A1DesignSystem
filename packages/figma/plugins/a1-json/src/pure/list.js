export const LIST_VARIANTS = ['unordered', 'ordered', 'icon', 'divider'];
export const LIST_MAX_ITEMS = 3;

export function listVariantFromProps(props = {}) {
  if (LIST_VARIANTS.includes(props.variant)) return props.variant;
  if (props.as === 'ol') return 'ordered';
  if (typeof props.icon === 'string' && props.icon.trim()) return 'icon';
  return 'unordered';
}

export function listPropsFromVariant(variant) {
  if (variant === 'ordered') return { as: 'ol' };
  if (variant === 'icon') return { icon: 'check_circle' };
  if (variant === 'divider') return { variant: 'divider' };
  return {};
}

export function listItemTexts(node = {}) {
  return (Array.isArray(node.children) ? node.children : [])
    .filter((child) => child && child.type === 'ListItem')
    .map((child) => typeof child.content?.fallback === 'string' ? child.content.fallback.trim() : '')
    .filter(Boolean);
}
