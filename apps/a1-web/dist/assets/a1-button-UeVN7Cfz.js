import{a as e,i as t,n,r,t as i}from"./lit-CHgHXhaW.js";var a={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},o=e=>(...t)=>({_$litDirective$:e,values:t}),s=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},c=o(class extends s{constructor(e){if(super(e),e.type!==a.ATTRIBUTE||e.name!==`class`||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return` `+Object.keys(e).filter(t=>e[t]).join(` `)+` `}update(e,[t]){if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(` `).split(/\s/).filter(e=>e!==``)));for(let e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}let n=e.element.classList;for(let e of this.st)e in t||(n.remove(e),this.st.delete(e));for(let e in t){let r=!!t[e];r===this.st.has(e)||this.nt?.has(e)||(r?(n.add(e),this.st.add(e)):(n.remove(e),this.st.delete(e)))}return r}}),l=e=>e??n,u=class extends i{static properties={variant:{type:String,reflect:!0},size:{type:String,reflect:!0},icon:{type:String},iconPosition:{type:String,attribute:`icon-position`},loading:{type:Boolean,reflect:!0},disabled:{type:Boolean,reflect:!0},fullWidth:{type:Boolean,attribute:`full-width`,reflect:!0},href:{type:String}};constructor(){super(),this.variant=`primary`,this.size=`md`,this.iconPosition=`start`,this.loading=!1,this.disabled=!1,this.fullWidth=!1,this.href=``}static styles=e`
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
  `;_classes(){return{"a1-button":!0,[`a1-button--${this.variant}`]:!!this.variant,"a1-button--sm":this.size===`sm`,"a1-button--lg":this.size===`lg`,"a1-button--loading":this.loading,"a1-button--full-width":this.fullWidth}}_icon(){return this.loading?t`<span class="a1-button__spinner" aria-hidden="true"></span>`:this.icon?t`<span class="a1-button__icon" aria-hidden="true">${this.icon}</span>`:null}_content(){let e=this._icon(),n=t`<slot></slot>`;return this.iconPosition===`end`?t`${n}${e}`:t`${e}${n}`}render(){let e=c(this._classes());return this.href?t`
        <a
          class=${e}
          href=${this.href}
          aria-disabled=${l(this.disabled?`true`:void 0)}
        >${this._content()}</a>
      `:t`
      <button
        class=${e}
        type="button"
        ?disabled=${this.disabled||this.loading}
        aria-busy=${l(this.loading?`true`:void 0)}
      >${this._content()}</button>
    `}};customElements.define(`a1-button`,u);