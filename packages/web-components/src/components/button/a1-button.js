/**
 * <a1-button> — A1 Design System Web Component (Lit)
 *
 * Consumes the same CSS custom properties as the React Button so it renders
 * identically when the host page loads the A1 token CSS
 * (build/css/tokens.css + a theme file such as packages/pure/dist/a1-light.css).
 *
 * CSS custom properties DO pierce shadow DOM, so all --component-button-* and
 * --semantic-* tokens resolve from the host document. @font-face rules defined
 * in the host document are also accessible inside shadow roots per the CSS Fonts
 * spec, so Material Symbols Outlined renders correctly if the host loads it.
 *
 * Usage:
 *   import '@gtivr4/a1-design-system-web/button'
 *   <a1-button variant="secondary" size="lg" icon="add">Create item</a1-button>
 *   <a1-button href="/sign-in">Sign in</a1-button>
 *   <a1-button loading disabled>Saving…</a1-button>
 *   <a1-button full-width>Submit</a1-button>
 */
import { LitElement, html, css } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { ifDefined } from 'lit/directives/if-defined.js'

export class A1Button extends LitElement {
  static properties = {
    variant:      { type: String, reflect: true },
    size:         { type: String, reflect: true },
    icon:         { type: String },
    iconPosition: { type: String, attribute: 'icon-position' },
    loading:      { type: Boolean, reflect: true },
    disabled:     { type: Boolean, reflect: true },
    fullWidth:    { type: Boolean, attribute: 'full-width', reflect: true },
    href:         { type: String },
  }

  constructor() {
    super()
    this.variant      = 'primary'
    this.size         = 'md'
    this.iconPosition = 'start'
    this.loading      = false
    this.disabled     = false
    this.fullWidth    = false
    this.href         = ''
  }

  static styles = css`
    /* ── Host sizing ────────────────────────────────────────────────────────── */
    :host {
      display: inline-flex;
      vertical-align: middle;
    }
    :host([full-width]) {
      display: flex;
      width: 100%;
    }

    /* ── Base button ─────────────────────────────────────────────────────────
       Mirrors packages/react/src/components/button/button.css exactly.
       CSS custom properties pierce the shadow DOM, so all --component-button-*
       and --semantic-* tokens resolve from the host document. */
    .a1-button {
      box-sizing: border-box;
      min-height: var(--a1-button-height, var(--component-button-min-height));
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--a1-button-gap, var(--component-button-gap));
      border-width: var(--a1-button-border-width, var(--component-button-border-width));
      border-style: solid;
      border-radius: var(--a1-button-border-radius, var(--component-button-border-radius));
      padding-block: var(--component-button-padding-block);
      padding-inline: var(--a1-button-padding-inline, var(--component-button-padding-inline));
      font-family: var(--component-button-font-family);
      font-size: var(--a1-button-font-size, var(--component-button-font-size));
      font-weight: var(--a1-button-font-weight, var(--component-button-font-weight));
      --a1-icon-weight: 700;
      line-height: var(--component-button-font-line-height);
      text-decoration: none;
      white-space: normal;
      text-align: center;
      overflow-wrap: anywhere;
      overflow: clip;
      cursor: pointer;
      background: var(--a1-button-background);
      border-color: var(--a1-button-border);
      color: var(--a1-button-foreground);
      box-shadow: var(--component-button-box-shadow, none);
      transform: var(--component-button-hover-transform, none);
      transition:
        background var(--semantic-motion-duration-normal) var(--semantic-motion-easing-standard),
        border-color var(--semantic-motion-duration-normal) var(--semantic-motion-easing-standard),
        color var(--semantic-motion-duration-normal) var(--semantic-motion-easing-standard),
        box-shadow var(--semantic-motion-duration-quick, 100ms) var(--semantic-motion-easing-standard),
        transform var(--semantic-motion-duration-quick, 100ms) var(--semantic-motion-easing-standard);
    }

    .a1-button:not(:disabled):not([aria-disabled='true']):hover {
      background: var(--a1-button-background-hover);
      border-color: var(--a1-button-border-hover, var(--a1-button-border));
      color: var(--a1-button-foreground-hover, var(--a1-button-foreground));
      box-shadow: var(--component-button-box-shadow-hover, var(--component-button-box-shadow, none));
      transform: var(--component-button-hover-transform, none);
    }

    .a1-button:not(:disabled):not([aria-disabled='true']):active {
      background: var(--a1-button-background-pressed);
      border-color: var(--a1-button-border-pressed, var(--a1-button-border));
      color: var(--a1-button-foreground-pressed, var(--a1-button-foreground));
      box-shadow: var(--component-button-box-shadow-active, var(--component-button-box-shadow, none));
      transform: var(--component-button-press-transform, none);
    }

    .a1-button:not(:disabled):not([aria-disabled='true']):focus-visible {
      outline: var(--component-button-focus-ring-width) solid var(--component-button-focus-ring);
      outline-offset: var(--component-button-focus-ring-offset);
    }

    .a1-button:disabled,
    .a1-button[aria-disabled='true'] {
      cursor: not-allowed;
      opacity: var(--component-button-disabled-opacity);
      pointer-events: none;
    }

    .a1-button--full-width {
      display: flex;
      flex: 1;
    }

    .a1-button--loading {
      cursor: progress;
    }

    .a1-button--loading:disabled,
    .a1-button--loading[aria-disabled='true'] {
      opacity: 1;
      pointer-events: none;
    }

    /* ── Spinner ─────────────────────────────────────────────────────────── */
    .a1-button__spinner {
      inline-size: var(--component-button-icon-size);
      block-size: var(--component-button-icon-size);
      flex-shrink: 0;
      border: var(--base-spacing-2) solid currentColor;
      border-top-color: transparent;
      border-radius: var(--base-radius-pill);
      animation: a1-btn-spin var(--semantic-motion-duration-slowest) linear infinite;
    }

    @keyframes a1-btn-spin { to { transform: rotate(360deg); } }

    @media (prefers-reduced-motion: reduce) {
      .a1-button__spinner {
        animation-duration: calc(var(--semantic-motion-duration-slowest) * 3);
      }
    }

    /* ── Icon ────────────────────────────────────────────────────────────── */
    .a1-button__icon {
      font-family: 'Material Symbols Outlined', sans-serif;
      font-size: var(--a1-button-icon-size, var(--component-button-icon-size));
      font-style: normal;
      font-variation-settings:
        'FILL' 0,
        'wght' var(--a1-icon-weight, 700),
        'GRAD' 0,
        'opsz' var(--a1-button-icon-opsz, var(--component-button-icon-optical-size));
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      white-space: nowrap;
      direction: ltr;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      font-feature-settings: 'liga';
      flex-shrink: 0;
      user-select: none;
    }

    /* ── Variants ────────────────────────────────────────────────────────── */
    .a1-button--primary {
      --a1-button-background: var(--component-button-primary-background);
      --a1-button-background-hover: var(--component-button-primary-background-hover);
      --a1-button-background-pressed: var(--component-button-primary-background-pressed);
      --a1-button-foreground: var(--component-button-primary-foreground);
      --a1-button-foreground-hover: var(--component-button-primary-foreground-hover);
      --a1-button-foreground-pressed: var(--component-button-primary-foreground-pressed);
      --a1-button-border: var(--component-button-primary-border);
      --a1-button-border-hover: var(--component-button-primary-border);
      --a1-button-border-pressed: var(--component-button-primary-border);
      --a1-button-border-width: var(--component-button-primary-border-width);
    }

    .a1-button--secondary {
      --a1-button-background: var(--component-button-secondary-background);
      --a1-button-background-hover: var(--component-button-secondary-background-hover);
      --a1-button-background-pressed: var(--component-button-secondary-background-pressed);
      --a1-button-foreground: var(--component-button-secondary-foreground);
      --a1-button-foreground-hover: var(--component-button-secondary-foreground-hover);
      --a1-button-foreground-pressed: var(--component-button-secondary-foreground-pressed);
      --a1-button-border: var(--component-button-secondary-border);
      --a1-button-border-hover: var(--component-button-secondary-border-hover);
      --a1-button-border-pressed: var(--component-button-secondary-border-pressed);
      --a1-button-border-width: var(--component-button-secondary-border-width);
    }

    .a1-button--tertiary {
      --a1-button-background: var(--component-button-tertiary-background);
      --a1-button-background-hover: var(--component-button-tertiary-background-hover);
      --a1-button-background-pressed: var(--component-button-tertiary-background-pressed);
      --a1-button-foreground: var(--component-button-tertiary-foreground);
      --a1-button-foreground-hover: var(--component-button-tertiary-foreground-hover);
      --a1-button-foreground-pressed: var(--component-button-tertiary-foreground-pressed);
      --a1-button-border: var(--component-button-tertiary-border);
      --a1-button-border-hover: var(--component-button-tertiary-border-hover);
      --a1-button-border-pressed: var(--component-button-tertiary-border-pressed);
      --a1-button-border-width: var(--component-button-tertiary-border-width);
      --component-button-box-shadow: none;
      --component-button-box-shadow-hover: none;
      --component-button-box-shadow-active: none;
    }

    .a1-button--destructive {
      --a1-button-background: var(--semantic-color-status-error-background);
      --a1-button-background-hover: color-mix(in srgb, var(--semantic-color-status-error-background), black 16%);
      --a1-button-background-pressed: color-mix(in srgb, var(--semantic-color-status-error-background), black 32%);
      --a1-button-foreground: var(--semantic-color-status-error-foreground);
      --a1-button-foreground-hover: var(--semantic-color-status-error-foreground);
      --a1-button-foreground-pressed: var(--semantic-color-status-error-foreground);
      --a1-button-border: var(--semantic-color-status-error-background);
      --a1-button-border-hover: var(--semantic-color-status-error-background);
      --a1-button-border-pressed: var(--semantic-color-status-error-background);
      --a1-button-border-width: var(--component-button-primary-border-width);
    }

    .a1-button--success {
      --a1-button-background: var(--semantic-color-status-success-background);
      --a1-button-background-hover: color-mix(in srgb, var(--semantic-color-status-success-background), black 16%);
      --a1-button-background-pressed: color-mix(in srgb, var(--semantic-color-status-success-background), black 32%);
      --a1-button-foreground: var(--semantic-color-status-success-foreground);
      --a1-button-foreground-hover: var(--semantic-color-status-success-foreground);
      --a1-button-foreground-pressed: var(--semantic-color-status-success-foreground);
      --a1-button-border: var(--semantic-color-status-success-background);
      --a1-button-border-hover: var(--semantic-color-status-success-background);
      --a1-button-border-pressed: var(--semantic-color-status-success-background);
      --a1-button-border-width: var(--component-button-primary-border-width);
    }

    /* ── Sizes ───────────────────────────────────────────────────────────── */
    .a1-button--sm {
      --a1-button-height: var(--component-button-small-height);
      padding-block: var(--component-button-small-padding-block);
      --a1-button-font-size: var(--semantic-font-size-body-sm);
      --a1-button-font-weight: var(--base-font-weight-medium);
      --a1-button-border-radius: var(--component-button-small-border-radius);
      --a1-button-padding-inline: var(--base-spacing-8);
      --a1-button-gap: var(--base-spacing-6);
      --a1-button-icon-size: var(--component-button-small-icon-size);
      --a1-button-icon-opsz: var(--component-button-small-icon-optical-size);
    }

    .a1-button--md {
      --a1-button-font-weight: var(--base-font-weight-semibold);
      --a1-button-icon-size: var(--component-button-medium-icon-size);
      --a1-button-icon-opsz: var(--component-button-medium-icon-optical-size);
    }

    .a1-button--lg {
      --a1-icon-weight: 700;
      --a1-button-height: var(--component-button-large-height);
      --a1-button-font-size: var(--semantic-font-size-body-lg);
      --a1-button-font-weight: var(--base-font-weight-bold);
      --a1-button-border-radius: var(--component-button-large-border-radius, var(--base-radius-lg));
      --a1-button-padding-inline: var(--base-spacing-20);
      --a1-button-icon-size: var(--component-button-icon-size);
      --a1-button-icon-opsz: var(--component-button-icon-optical-size);
    }

    .a1-button--lg.a1-button--secondary {
      --a1-button-border-width: var(--component-button-large-secondary-border-width);
    }
  `

  _classes() {
    return {
      'a1-button': true,
      [`a1-button--${this.variant}`]: Boolean(this.variant),
      // md is the default — no modifier class, matching the React Button behaviour
      'a1-button--sm': this.size === 'sm',
      'a1-button--lg': this.size === 'lg',
      'a1-button--loading': this.loading,
      'a1-button--full-width': this.fullWidth,
    }
  }

  _icon() {
    if (this.loading) {
      return html`<span class="a1-button__spinner" aria-hidden="true"></span>`
    }
    if (this.icon) {
      return html`<span class="a1-button__icon" aria-hidden="true">${this.icon}</span>`
    }
    return null
  }

  _content() {
    const iconEl = this._icon()
    const slot = html`<slot></slot>`
    return this.iconPosition === 'end'
      ? html`${slot}${iconEl}`
      : html`${iconEl}${slot}`
  }

  render() {
    const classes = classMap(this._classes())

    if (this.href) {
      return html`
        <a
          class=${classes}
          href=${this.href}
          aria-disabled=${ifDefined(this.disabled ? 'true' : undefined)}
        >${this._content()}</a>
      `
    }

    return html`
      <button
        class=${classes}
        type="button"
        ?disabled=${this.disabled || this.loading}
        aria-busy=${ifDefined(this.loading ? 'true' : undefined)}
      >${this._content()}</button>
    `
  }
}

customElements.define('a1-button', A1Button)
