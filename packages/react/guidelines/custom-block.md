# Custom block

`CustomBlock` is a React component and a leaf node in page-definition JSON.
Use it only for a small region that registered A1 components and props cannot
express, such as an unusual positioned annotation or a specialized local
interaction. Explain the model gap in the handoff. Prefer improving a reusable
A1 component when the need is common. Do not rebuild ordinary sections, grids,
headings, buttons, forms or navigation with custom markup.

```json
{
  "id": "positioned-annotation",
  "type": "CustomBlock",
  "props": {
    "title": "Positioned annotation",
    "height": "sm",
    "markup": "<p class=\"a1-annotation\">Annotation within this block</p>",
    "css": ".a1-annotation { position: absolute; inset-inline-end: var(--semantic-spacing-gap-md); inset-block-end: var(--semantic-spacing-gap-md); color: var(--semantic-color-text-accent); }",
    "js": ""
  }
}
```

The five props are `title`, `markup`, `css`, `js` and `height`. Source strings
start empty and stay literal: `markup`, `css` and `js` do not interpolate
`{{ dataset.column }}` bindings. A missing or blank title uses the localized Custom block label;
provide a meaningful title for finished content. Height is `sm`, `md` (default)
or `lg`, backed by `component.customBlock.height.*` tokens (192, 384 and 576 px).
The frame fills its container's width, and overflow scrolls inside the frame.
Media queries use the block viewport, not the outer page viewport. Custom
blocks do not accept A1 child nodes or `content`; text belongs in the authored
markup and authors own its localization.

CSS is confined to a sandboxed iframe. Absolute and fixed positioning stay
inside that frame. The block copies computed A1 base, semantic and component
token variables from its actual parent scope, including project themes and
inverse scopes. It also copies body text defaults, direction and language.
It does not copy component stylesheets or host web fonts. Reference token
variables in custom CSS and use semantic HTML; a class such as `a1-button`
does not instantiate the A1 Button. Custom source is the explicit exception
to the JSON model's prohibition on arbitrary markup and CSS, only inside
these source props. There is no host-page style or script injection.

JavaScript runs after markup in an opaque-origin `sandbox="allow-scripts"`
frame. It can manipulate its own document. Parent DOM access, host storage,
fetch, external scripts/styles/fonts, popups and form submission are blocked.
Images and embedded fonts may use data URLs. Scripts in the markup fragment
are inert; put code in `js` and bind native events there. This is a browser
sandbox, not a CPU/time limit or a guarantee that author code is accessible.
Browser consoles report script errors. The host Content Security Policy must
permit the inline script/style bootstrap; a stricter inherited policy can block
the frame. A frame can navigate itself; it cannot
navigate the parent. No host message bridge is installed.

Changing source, text defaults or theme tokens reloads the document and resets
local script state. Every block has a separate document. In editor mode the
frame is inert so pointer and keyboard actions select the block; use the
component preview or launched page to interact with its contents.

Author semantic controls, accessible names, focus indicators, keyboard behavior,
contrast, responsive overflow and reduced-motion handling inside the frame.
Isolation does not repair inaccessible HTML. Avoid scripts for static content.
Review each authored block across themes, breakpoints and assistive technology.

The component is currently React-only. Pure CSS cannot reproduce its document
and script lifecycle; Native would need an explicit WebView contract. Neither
package claims support. Figma translation is also outside this contract.
