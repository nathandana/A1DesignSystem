import{a as e,i as t,t as n}from"./lit-Uu-RERKf.js";var r=[`bottom`,`bottom-left`,`bottom-right`,`top`,`top-left`,`top-right`],i=class extends n{static properties={open:{type:Boolean,reflect:!0},position:{type:String,reflect:!0},actionLabel:{type:String,attribute:`action-label`},dismissible:{type:Boolean,reflect:!0},autoHideDuration:{type:Number,attribute:`auto-hide-duration`},_rendered:{state:!0},_closing:{state:!0}};constructor(){super(),this.open=!1,this.position=`bottom`,this.actionLabel=``,this.dismissible=!0,this.autoHideDuration=0,this._rendered=!1,this._closing=!1,this._autoHideTimer=null,this._hoverPaused=!1,this._focusPaused=!1,this._pendingCloseEvent=!1}static styles=e`
    /* ── Entry animation ──────────────────────────────────────────────────── */
    @keyframes a1-snackbar-in {
      from { opacity: 0; translate: 0 var(--component-snackbar-gap); }
      to   { opacity: 1; translate: 0 0; }
    }

    @keyframes a1-snackbar-out-bottom {
      from { opacity: 1; translate: 0 0; }
      to { opacity: 0; translate: 0 calc(100% + var(--component-snackbar-viewport-offset)); }
    }

    @keyframes a1-snackbar-out-top {
      from { opacity: 1; translate: 0 0; }
      to { opacity: 0; translate: 0 calc(-100% - var(--component-snackbar-viewport-offset)); }
    }

    /* ── Inverse-of-document surface ─────────────────────────────────────────
       The snackbar surface is the opposite of the document colour scheme, so it
       stays clearly visible: a dark toast on a light page and a light toast on a
       dark page. CSS custom properties pierce shadow DOM, so these read the
       host document's neutral ramp. Defaults are the light-page (dark) toast;
       the dark-document rules below flip them to a light surface. This mirrors
       the React Snackbar, which achieves the same via its .a1-inverse scope. */
    :host {
      --a1-snackbar-surface: var(--component-snackbar-default-background);
      --a1-snackbar-border: var(--component-snackbar-default-border);
      --a1-snackbar-foreground: var(--component-snackbar-default-foreground);
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --a1-snackbar-surface: var(--base-color-neutral-0);
        --a1-snackbar-border: var(--base-color-neutral-0);
        --a1-snackbar-foreground: var(--base-color-neutral-900);
      }
    }

    /* Explicit light document restores the dark toast even under OS dark. */
    :host-context(html.a1-theme-light) {
      --a1-snackbar-surface: var(--component-snackbar-default-background);
      --a1-snackbar-border: var(--component-snackbar-default-border);
      --a1-snackbar-foreground: var(--component-snackbar-default-foreground);
    }

    /* Explicit dark document flips to a light toast regardless of OS setting. */
    :host-context(html.a1-theme-dark) {
      --a1-snackbar-surface: var(--base-color-neutral-0);
      --a1-snackbar-border: var(--base-color-neutral-0);
      --a1-snackbar-foreground: var(--base-color-neutral-900);
    }

    /* ── Container ───────────────────────────────────────────────────────── */
    .a1-snackbar {
      position: fixed;
      z-index: var(--component-snackbar-z-index);
      box-sizing: border-box;
      width: min(var(--component-snackbar-max-width), calc(100vw - (var(--component-snackbar-viewport-offset) * 2)));
      min-height: var(--component-snackbar-min-height);
      padding-block: var(--component-snackbar-padding-block);
      padding-inline: var(--component-snackbar-padding-inline);
      border: var(--component-snackbar-border-width) solid var(--a1-snackbar-border);
      border-radius: var(--component-card-border-radius);
      background: var(--a1-snackbar-surface);
      color: var(--a1-snackbar-foreground);
      box-shadow: var(--semantic-shadow-lg);
      display: flex;
      align-items: center;
      gap: var(--component-snackbar-gap);
      animation: a1-snackbar-in var(--semantic-motion-duration-normal) var(--semantic-motion-easing-standard) both;
    }

    @media (prefers-reduced-motion: reduce) {
      .a1-snackbar { animation: none; }
    }

    /* ── Position variants ───────────────────────────────────────────────── */
    .a1-snackbar--bottom,
    .a1-snackbar--top {
      left: 50%;
      transform: translateX(-50%);
    }

    .a1-snackbar--bottom,
    .a1-snackbar--bottom-left,
    .a1-snackbar--bottom-right {
      bottom: var(--component-snackbar-viewport-offset);
    }

    .a1-snackbar--top,
    .a1-snackbar--top-left,
    .a1-snackbar--top-right {
      top: var(--component-snackbar-viewport-offset);
    }

    .a1-snackbar--bottom-left,
    .a1-snackbar--top-left {
      left: var(--component-snackbar-viewport-offset);
    }

    .a1-snackbar--bottom-right,
    .a1-snackbar--top-right {
      right: var(--component-snackbar-viewport-offset);
    }

    .a1-snackbar--closing {
      pointer-events: none;
      animation-name: a1-snackbar-out-bottom;
    }

    .a1-snackbar--top.a1-snackbar--closing,
    .a1-snackbar--top-left.a1-snackbar--closing,
    .a1-snackbar--top-right.a1-snackbar--closing {
      animation-name: a1-snackbar-out-top;
    }

    /* ── Mobile: fill the width ──────────────────────────────────────────── */
    @media (max-width: 720px) {
      .a1-snackbar {
        inset-inline: var(--component-snackbar-viewport-offset-mobile);
        width: auto;
        transform: none;
      }
      .a1-snackbar--bottom,
      .a1-snackbar--bottom-left,
      .a1-snackbar--bottom-right {
        bottom: var(--component-snackbar-viewport-offset-mobile);
      }
      .a1-snackbar--top,
      .a1-snackbar--top-left,
      .a1-snackbar--top-right {
        top: var(--component-snackbar-viewport-offset-mobile);
      }
    }

    /* ── Content area ────────────────────────────────────────────────────── */
    .a1-snackbar__content {
      min-width: 0;
      flex: 1;
      font-family: var(--component-button-font-family);
      font-size: var(--semantic-font-size-body-md);
      line-height: var(--semantic-font-line-height-body);
    }

    /* ── Action button — tertiary ghost style on dark surface ────────────── */
    .a1-snackbar__action {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      padding-block: var(--base-spacing-4);
      padding-inline: var(--base-spacing-8);
      min-height: var(--component-button-small-height);
      border: 0;
      border-radius: var(--component-button-small-border-radius);
      background: transparent;
      color: var(--a1-snackbar-foreground);
      font-family: var(--component-button-font-family);
      font-size: var(--semantic-font-size-body-sm);
      font-weight: var(--base-font-weight-medium);
      line-height: 1.2;
      cursor: pointer;
      white-space: nowrap;
      transition: background var(--semantic-motion-duration-normal) var(--semantic-motion-easing-standard);
    }

    .a1-snackbar__action:hover {
      background: color-mix(in srgb, var(--a1-snackbar-foreground) 12%, transparent);
    }

    .a1-snackbar__action:active {
      background: color-mix(in srgb, var(--a1-snackbar-foreground) 20%, transparent);
    }

    .a1-snackbar__action:focus-visible {
      outline: var(--component-button-focus-ring-width) solid var(--a1-snackbar-foreground);
      outline-offset: var(--component-button-focus-ring-offset);
    }

    /* ── Close (dismiss) button ──────────────────────────────────────────── */
    .a1-snackbar__close {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: var(--component-button-min-height);
      block-size: var(--component-button-min-height);
      border: 0;
      border-radius: var(--component-button-border-radius);
      background: transparent;
      color: var(--a1-snackbar-foreground);
      cursor: pointer;
      transition: background var(--semantic-motion-duration-normal) var(--semantic-motion-easing-standard);
    }

    .a1-snackbar__close:hover {
      background: color-mix(in srgb, var(--a1-snackbar-foreground) 12%, transparent);
    }

    .a1-snackbar__close:active {
      background: color-mix(in srgb, var(--a1-snackbar-foreground) 20%, transparent);
    }

    .a1-snackbar__close:focus-visible {
      outline: var(--component-button-focus-ring-width) solid var(--a1-snackbar-foreground);
      outline-offset: var(--component-button-focus-ring-offset);
    }

    /* ── Close icon ──────────────────────────────────────────────────────── */
    .a1-snackbar__close-icon {
      font-family: 'Material Symbols Outlined', sans-serif;
      font-size: var(--component-button-small-icon-size);
      font-style: normal;
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      white-space: nowrap;
      direction: ltr;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      font-feature-settings: 'liga';
      user-select: none;
    }
  `;_onAction(){this.dispatchEvent(new CustomEvent(`a1-action`,{bubbles:!0,composed:!0}))}_onClose(){this.dispatchEvent(new CustomEvent(`a1-close`,{bubbles:!0,composed:!0}))}_requestClose(){this._closing||(this._pendingCloseEvent=!0,this.open=!1)}render(){return this._rendered?t`
      <div
        class="a1-snackbar a1-snackbar--${r.includes(this.position)?this.position:`bottom`}${this._closing?` a1-snackbar--closing`:``}"
        role="status"
        aria-live="polite"
        @mouseenter=${this._pauseHoverAutoHide}
        @mouseleave=${this._resumeHoverAutoHide}
        @focusin=${this._pauseFocusAutoHide}
        @focusout=${this._resumeFocusAutoHide}
        @animationend=${this._finishClose}
      >
        <div class="a1-snackbar__content">
          <slot></slot>
        </div>

        ${this.actionLabel?t`
          <button type="button" class="a1-snackbar__action" @click=${this._onAction}>
            ${this.actionLabel}
          </button>
        `:null}

        ${this.dismissible?t`
          <button type="button" class="a1-snackbar__close" aria-label="Dismiss" @click=${this._requestClose}>
            <span class="a1-snackbar__close-icon" aria-hidden="true">close</span>
          </button>
        `:null}
      </div>
    `:t``}willUpdate(e){if(e.has(`open`)){if(this.open){this._pendingCloseEvent=!1,this._rendered=!0,this._closing=!1;return}this._rendered&&(this._closing=!0)}}updated(e){(e.has(`open`)||e.has(`autoHideDuration`)||e.has(`dismissible`))&&this._scheduleAutoHide(),this._closing&&this._shouldSkipMotion()&&window.setTimeout(()=>this._finishClose(),0)}disconnectedCallback(){super.disconnectedCallback(),this._clearAutoHide()}_clearAutoHide(){this._autoHideTimer&&=(window.clearTimeout(this._autoHideTimer),null)}_scheduleAutoHide(){this._clearAutoHide(),!(!this.open||this._closing||this._autoHidePaused||!(Number(this.autoHideDuration)>0))&&(this._autoHideTimer=window.setTimeout(()=>this._requestClose(),Number(this.autoHideDuration)))}get _autoHidePaused(){return this._hoverPaused||this._focusPaused}_pauseHoverAutoHide(){this._hoverPaused=!0,this._clearAutoHide()}_resumeHoverAutoHide(){this._hoverPaused=!1,this._scheduleAutoHide()}_pauseFocusAutoHide(){this._focusPaused=!0,this._clearAutoHide()}_resumeFocusAutoHide(e){e.currentTarget.contains(e.relatedTarget)||(this._focusPaused=!1,this._scheduleAutoHide())}_shouldSkipMotion(){return window.matchMedia(`(prefers-reduced-motion: reduce)`).matches||document.documentElement.classList.contains(`a1-reduce-motion`)}_finishClose(e){if(e&&e.target!==e.currentTarget||!this._closing)return;let t=this._pendingCloseEvent;this._pendingCloseEvent=!1,this._rendered=!1,this._closing=!1,this._hoverPaused=!1,this._focusPaused=!1,this._clearAutoHide(),t&&this._onClose()}};customElements.define(`a1-snackbar`,i);