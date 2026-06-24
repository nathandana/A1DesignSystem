import{a as e,i as t,t as n}from"./lit-CHgHXhaW.js";var r=[`bottom`,`bottom-left`,`bottom-right`,`top`,`top-left`,`top-right`],i=class extends n{static properties={open:{type:Boolean,reflect:!0},position:{type:String,reflect:!0},actionLabel:{type:String,attribute:`action-label`},dismissible:{type:Boolean,reflect:!0}};constructor(){super(),this.open=!1,this.position=`bottom`,this.actionLabel=``,this.dismissible=!0}static styles=e`
    /* ── Entry animation ──────────────────────────────────────────────────── */
    @keyframes a1-snackbar-in {
      from { opacity: 0; translate: 0 8px; }
      to   { opacity: 1; translate: 0 0; }
    }

    /* ── Container ───────────────────────────────────────────────────────── */
    .a1-snackbar {
      position: fixed;
      z-index: var(--component-snackbar-z-index, 1100);
      box-sizing: border-box;
      width: min(420px, calc(100vw - var(--base-spacing-32, 2rem)));
      min-height: 56px;
      padding-block: var(--base-spacing-12);
      padding-inline: var(--base-spacing-24);
      border: 1px solid var(--base-color-neutral-900);
      border-radius: var(--component-card-border-radius);
      background: var(--base-color-neutral-900);
      color: var(--base-color-neutral-0);
      box-shadow: var(--semantic-shadow-lg);
      display: flex;
      align-items: center;
      gap: var(--base-spacing-8);
      animation: a1-snackbar-in var(--semantic-motion-duration-normal, 200ms) ease-out both;
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
      bottom: var(--base-spacing-24);
    }

    .a1-snackbar--top,
    .a1-snackbar--top-left,
    .a1-snackbar--top-right {
      top: var(--base-spacing-24);
    }

    .a1-snackbar--bottom-left,
    .a1-snackbar--top-left {
      left: var(--base-spacing-24);
    }

    .a1-snackbar--bottom-right,
    .a1-snackbar--top-right {
      right: var(--base-spacing-24);
    }

    /* ── Mobile: fill the width ──────────────────────────────────────────── */
    @media (max-width: 720px) {
      .a1-snackbar {
        inset-inline: var(--base-spacing-16);
        width: auto;
        transform: none;
      }
      .a1-snackbar--bottom,
      .a1-snackbar--bottom-left,
      .a1-snackbar--bottom-right {
        bottom: var(--base-spacing-16);
      }
      .a1-snackbar--top,
      .a1-snackbar--top-left,
      .a1-snackbar--top-right {
        top: var(--base-spacing-16);
      }
    }

    /* ── Content area ────────────────────────────────────────────────────── */
    .a1-snackbar__content {
      min-width: 0;
      flex: 1;
      font-family: var(--component-button-font-family, inherit);
      font-size: var(--semantic-font-size-body-md, 1rem);
      line-height: var(--semantic-line-height-body, 1.5);
    }

    /* ── Action button — tertiary ghost style on dark surface ────────────── */
    .a1-snackbar__action {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      padding-block: var(--base-spacing-4);
      padding-inline: var(--base-spacing-8);
      min-height: var(--component-button-small-height, 1.75rem);
      border: 0;
      border-radius: var(--component-button-small-border-radius, 0.25rem);
      background: transparent;
      color: var(--base-color-neutral-0);
      font-family: var(--component-button-font-family, inherit);
      font-size: var(--semantic-font-size-body-sm, 0.875rem);
      font-weight: var(--base-font-weight-medium, 500);
      line-height: 1.2;
      cursor: pointer;
      white-space: nowrap;
      transition: background var(--semantic-motion-duration-normal, 200ms) ease;
    }

    .a1-snackbar__action:hover {
      background: rgb(255 255 255 / 0.12);
    }

    .a1-snackbar__action:active {
      background: rgb(255 255 255 / 0.2);
    }

    .a1-snackbar__action:focus-visible {
      outline: var(--component-button-focus-ring-width, 3px) solid var(--base-color-neutral-0);
      outline-offset: var(--component-button-focus-ring-offset, 2px);
    }

    /* ── Close (dismiss) button ──────────────────────────────────────────── */
    .a1-snackbar__close {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 2.5rem;
      block-size: 2.5rem;
      border: 0;
      border-radius: var(--component-button-border-radius, 0.375rem);
      background: transparent;
      color: var(--base-color-neutral-0);
      cursor: pointer;
      transition: background var(--semantic-motion-duration-normal, 200ms) ease;
    }

    .a1-snackbar__close:hover {
      background: rgb(255 255 255 / 0.12);
    }

    .a1-snackbar__close:active {
      background: rgb(255 255 255 / 0.2);
    }

    .a1-snackbar__close:focus-visible {
      outline: var(--component-button-focus-ring-width, 3px) solid var(--base-color-neutral-0);
      outline-offset: var(--component-button-focus-ring-offset, 2px);
    }

    /* ── Close icon ──────────────────────────────────────────────────────── */
    .a1-snackbar__close-icon {
      font-family: 'Material Symbols Outlined', sans-serif;
      font-size: 1.25rem;
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
  `;_onAction(){this.dispatchEvent(new CustomEvent(`a1-action`,{bubbles:!0,composed:!0}))}_onClose(){this.dispatchEvent(new CustomEvent(`a1-close`,{bubbles:!0,composed:!0}))}render(){return this.open?t`
      <div
        class="a1-snackbar a1-snackbar--${r.includes(this.position)?this.position:`bottom`}"
        role="status"
        aria-live="polite"
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
          <button type="button" class="a1-snackbar__close" aria-label="Dismiss" @click=${this._onClose}>
            <span class="a1-snackbar__close-icon" aria-hidden="true">close</span>
          </button>
        `:null}
      </div>
    `:t``}};customElements.define(`a1-snackbar`,i);