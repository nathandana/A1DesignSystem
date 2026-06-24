/**
 * Canonical color-mode aliases shared by build targets.
 *
 * Theme files override base ramps and intentional exceptions. These maps define
 * how semantic and component color roles resolve in each environmental mode.
 * Keep selector behavior in package CSS separate from these value relationships.
 */

export const LIGHT_MODE_VARIABLES = [
  "--semantic-color-surface-page",
  "--semantic-color-surface-card",
  "--semantic-color-surface-field",
  "--semantic-color-surface-panel",
  "--semantic-color-surface-raised",
  "--semantic-color-text-default",
  "--semantic-color-text-muted",
  "--semantic-color-text-inverse",
  "--semantic-color-text-accent",
  "--semantic-color-border-subtle",
  "--semantic-color-border-default",
  "--semantic-color-border-strong",
  "--semantic-color-action-background",
  "--semantic-color-action-background-hover",
  "--semantic-color-action-background-pressed",
  "--semantic-color-action-foreground",
  "--semantic-color-action-foreground-pressed",
  "--semantic-color-action-surface",
  "--semantic-color-action-border",
  "--semantic-color-status-info-background",
  "--semantic-color-status-info-surface",
  "--semantic-color-status-info-border",
  "--semantic-color-status-info-foreground",
  "--semantic-color-status-error-background",
  "--semantic-color-status-error-surface",
  "--semantic-color-status-error-border",
  "--semantic-color-status-error-foreground",
  "--semantic-color-status-warn-background",
  "--semantic-color-status-warn-surface",
  "--semantic-color-status-warn-border",
  "--semantic-color-status-warn-foreground",
  "--semantic-color-status-success-background",
  "--semantic-color-status-success-surface",
  "--semantic-color-status-success-border",
  "--semantic-color-status-success-foreground",
  "--component-button-primary-background",
  "--component-button-primary-background-hover",
  "--component-button-primary-background-pressed",
  "--component-button-primary-foreground",
  "--component-button-primary-foreground-hover",
  "--component-button-primary-foreground-pressed",
  "--component-button-primary-border",
  "--component-button-secondary-background",
  "--component-button-secondary-background-hover",
  "--component-button-secondary-background-pressed",
  "--component-button-secondary-foreground",
  "--component-button-secondary-foreground-hover",
  "--component-button-secondary-foreground-pressed",
  "--component-button-secondary-border",
  "--component-button-secondary-border-hover",
  "--component-button-secondary-border-pressed",
  "--component-button-tertiary-background",
  "--component-button-tertiary-background-hover",
  "--component-button-tertiary-background-pressed",
  "--component-button-tertiary-foreground",
  "--component-button-tertiary-foreground-hover",
  "--component-button-tertiary-foreground-pressed",
  "--component-button-tertiary-border",
  "--component-button-tertiary-border-hover",
  "--component-button-tertiary-border-pressed",
];

export const DARK_MODE_VARIABLES = {
  "--semantic-color-surface-page": "var(--base-color-neutral-900)",
  "--semantic-color-surface-card": "var(--base-color-neutral-800)",
  "--semantic-color-surface-field": "var(--base-color-neutral-700)",
  "--semantic-color-surface-panel": "var(--base-color-neutral-800)",
  "--semantic-color-surface-raised": "var(--base-color-neutral-700)",
  "--semantic-color-surface-inverse": "var(--base-color-neutral-0)",
  "--semantic-color-text-default": "var(--base-color-neutral-50)",
  "--semantic-color-text-muted": "var(--base-color-neutral-300)",
  "--semantic-color-text-inverse": "var(--base-color-neutral-900)",
  "--semantic-color-text-accent": "var(--base-color-accent-300)",
  "--semantic-color-border-subtle": "var(--base-color-neutral-700)",
  "--semantic-color-border-default": "var(--base-color-neutral-600)",
  "--semantic-color-border-strong": "var(--base-color-neutral-400)",
  "--semantic-color-action-background": "var(--base-color-accent-400)",
  "--semantic-color-action-background-hover": "var(--base-color-accent-300)",
  "--semantic-color-action-background-pressed": "var(--base-color-accent-500)",
  "--semantic-color-action-foreground": "var(--base-color-accent-1000)",
  "--semantic-color-action-foreground-pressed": "var(--base-color-accent-1000)",
  "--semantic-color-action-surface": "var(--base-color-accent-900)",
  "--semantic-color-action-border": "var(--base-color-accent-500)",
  "--semantic-color-status-info-background": "var(--base-color-info-400)",
  "--semantic-color-status-info-surface": "var(--base-color-info-900)",
  "--semantic-color-status-info-border": "var(--base-color-info-500)",
  "--semantic-color-status-info-foreground": "var(--base-color-info-1000)",
  "--semantic-color-status-error-background": "var(--base-color-error-400)",
  "--semantic-color-status-error-surface": "var(--base-color-error-900)",
  "--semantic-color-status-error-border": "var(--base-color-error-500)",
  "--semantic-color-status-error-foreground": "var(--base-color-neutral-900)",
  "--semantic-color-status-error-text": "var(--base-color-error-300)",
  "--semantic-color-status-warn-background": "var(--base-color-warn-400)",
  "--semantic-color-status-warn-surface": "var(--base-color-warn-900)",
  "--semantic-color-status-warn-border": "var(--base-color-warn-500)",
  "--semantic-color-status-warn-foreground": "var(--base-color-neutral-900)",
  "--semantic-color-status-warn-text": "var(--base-color-warn-300)",
  "--semantic-color-status-success-background": "var(--base-color-success-400)",
  "--semantic-color-status-success-surface": "var(--base-color-success-900)",
  "--semantic-color-status-success-border": "var(--base-color-success-500)",
  "--semantic-color-status-success-foreground": "var(--base-color-neutral-900)",
  "--component-button-primary-background": "var(--base-color-accent-200)",
  "--component-button-primary-background-hover": "var(--base-color-accent-100)",
  "--component-button-primary-background-pressed": "var(--base-color-accent-50)",
  "--component-button-primary-foreground": "var(--base-color-accent-900)",
  "--component-button-primary-foreground-hover": "var(--base-color-accent-800)",
  "--component-button-primary-foreground-pressed": "var(--base-color-accent-700)",
  "--component-button-primary-border": "var(--base-color-accent-200)",
  "--component-button-secondary-background": "var(--base-color-accent-900)",
  "--component-button-secondary-background-hover": "var(--base-color-accent-800)",
  "--component-button-secondary-background-pressed": "var(--base-color-accent-700)",
  "--component-button-secondary-foreground": "var(--base-color-accent-200)",
  "--component-button-secondary-foreground-hover": "var(--base-color-accent-100)",
  "--component-button-secondary-foreground-pressed": "var(--base-color-accent-50)",
  "--component-button-secondary-border": "var(--base-color-accent-200)",
  "--component-button-secondary-border-hover": "var(--base-color-accent-100)",
  "--component-button-secondary-border-pressed": "var(--base-color-accent-50)",
  "--component-button-tertiary-background": "var(--base-color-accent-900)",
  "--component-button-tertiary-background-hover": "var(--base-color-accent-800)",
  "--component-button-tertiary-background-pressed": "var(--base-color-accent-700)",
  "--component-button-tertiary-foreground": "var(--base-color-accent-200)",
  "--component-button-tertiary-foreground-hover": "var(--base-color-accent-100)",
  "--component-button-tertiary-foreground-pressed": "var(--base-color-accent-50)",
  "--component-button-tertiary-border": "var(--base-color-accent-900)",
  "--component-button-tertiary-border-hover": "var(--base-color-accent-800)",
  "--component-button-tertiary-border-pressed": "var(--base-color-accent-700)",
  "--component-bottom-sheet-background": "var(--semantic-color-surface-card)",
  "--component-scrim-color": "var(--component-scrim-color-dark)",
  "--a1-field-hover-background": "var(--base-color-neutral-800)",
  "--a1-field-hover-border-color": "var(--base-color-neutral-300)",
  "--a1-field-active-background": "var(--base-color-neutral-700)",
  "--a1-field-active-border-color": "var(--base-color-neutral-200)",
  "--a1-field-read-only-background": "var(--base-color-info-800)",
  "--a1-field-read-only-border-color": "var(--base-color-info-600)",
  "--a1-field-read-only-text": "var(--base-color-info-50)",
};

const VAR_REFERENCE = /^var\((--[^,\s)]+)(?:,\s*([^)]+))?\)$/;

export function resolveModeVariables(modeVariables, themeVariables, fallbackVariables = {}) {
  const resolved = {};

  function resolve(value, stack = []) {
    if (typeof value !== "string") return value;
    const match = value.match(VAR_REFERENCE);
    if (!match) return value;

    const [, name, fallback] = match;
    if (stack.includes(name)) {
      throw new Error(`Circular color-mode reference: ${[...stack, name].join(" -> ")}`);
    }

    const next = modeVariables[name] ?? themeVariables[name] ?? fallbackVariables[name] ?? fallback;
    if (next === undefined) {
      throw new Error(`Unable to resolve color-mode reference ${value}`);
    }
    return resolve(next, [...stack, name]);
  }

  for (const [name, value] of Object.entries(modeVariables)) {
    resolved[name] = resolve(value, [name]);
  }

  return resolved;
}
