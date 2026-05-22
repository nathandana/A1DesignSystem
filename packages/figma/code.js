// A1 Design System – Card Component Generator
// Generates a Card component set on the current page with all shadow variants.
// Run once via Plugins > Development > Import plugin from manifest.

(() => {
  // ─── Resolved design token values ────────────────────────────────────────────

  const TOKEN = {
    // Layout  (component-card-*)
    width: 320,
    padding: 16,          // component-card-padding  (base.spacing.md)
    borderRadius: 8,      // component-card-border-radius  (base.radius.lg)
    borderWidth: 1,       // component-card-border-width
    gap: 8,               // marginBottom on Heading within Card

    // Colors
    surface:     { r: 0.980, g: 0.988, b: 1.000 }, // semantic-color-surface-page    #fafcff
    border:      { r: 0.392, g: 0.455, b: 0.545 }, // semantic-color-border-strong   #64748b
    textDefault: { r: 0.024, g: 0.043, b: 0.078 }, // semantic-color-text-default    #060b14
    textMuted:   { r: 0.255, g: 0.306, b: 0.380 }, // semantic-color-text-muted      #414e61

    // Heading h3/sm  (component-heading-font-weight-heading: 700, semantic-font-size-heading-sm: 1.25rem)
    heading: {
      fontStyle:  "Bold",
      fontSize:   20,     // 1.25rem @ 16px base
      lineHeight: 25,     // 1.25em × 20px  (component-heading-font-line-height-heading)
    },

    // Paragraph md/muted  (component-paragraph-font-weight: 400, semantic-font-size-body-md: 1rem)
    body: {
      fontStyle:  "Regular",
      fontSize:   16,     // 1rem  (semantic-font-size-body-md)
      lineHeight: 24,     // 1.5em × 16px  (component-paragraph-font-line-height)
    },

    // Shadow scale – base.shadow.100–500 resolved to Figma DROP_SHADOW layers
    // Shadow base color: neutral-900 #060b14  →  r=6/255, g=11/255, b=20/255
    shadows: {
      none: [],
      xs: [
        { y: 1, blur: 2,  spread:  0, alpha: 0.05 },
      ],
      sm: [
        { y: 1, blur: 3,  spread:  0, alpha: 0.10 },
        { y: 1, blur: 2,  spread: -1, alpha: 0.06 },
      ],
      md: [
        { y: 4, blur: 6,  spread: -1, alpha: 0.10 },
        { y: 2, blur: 4,  spread: -2, alpha: 0.06 },
      ],
      lg: [
        { y: 10, blur: 15, spread: -3, alpha: 0.10 },
        { y: 4,  blur: 6,  spread: -4, alpha: 0.05 },
      ],
      xl: [
        { y: 20, blur: 25, spread: -5, alpha: 0.10 },
        { y: 8,  blur: 10, spread: -6, alpha: 0.04 },
      ],
    },
  };

  const SHADOW_BASE = { r: 6 / 255, g: 11 / 255, b: 20 / 255 };
  const FONT_FAMILY = "Inter";

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  function solidPaint(c) {
    return [{ type: "SOLID", color: { r: c.r, g: c.g, b: c.b } }];
  }

  function shadowEffects(defs) {
    return defs.map(d => ({
      type: "DROP_SHADOW",
      color: { r: SHADOW_BASE.r, g: SHADOW_BASE.g, b: SHADOW_BASE.b, a: d.alpha },
      offset: { x: 0, y: d.y },
      radius: d.blur,
      spread: d.spread,
      visible: true,
      blendMode: "NORMAL",
    }));
  }

  function makeText(chars, { fontStyle, fontSize, lineHeight }, color) {
    const t = figma.createText();
    t.fontName = { family: FONT_FAMILY, style: fontStyle };
    t.characters = chars;
    t.fontSize = fontSize;
    t.lineHeight = { value: lineHeight, unit: "PIXELS" };
    t.fills = solidPaint(color);
    t.textAutoResize = "WIDTH_AND_HEIGHT";
    return t;
  }

  function makeCardFrame(shadowName) {
    const frame = figma.createFrame();
    frame.name = shadowName;
    frame.resize(TOKEN.width, 100); // height adjusted by HUG after children added
    frame.layoutMode = "VERTICAL";
    frame.primaryAxisAlignItems = "MIN";
    frame.counterAxisAlignItems = "MIN";
    frame.paddingTop    = TOKEN.padding;
    frame.paddingBottom = TOKEN.padding;
    frame.paddingLeft   = TOKEN.padding;
    frame.paddingRight  = TOKEN.padding;
    frame.itemSpacing   = TOKEN.gap;
    frame.cornerRadius  = TOKEN.borderRadius;
    frame.fills         = solidPaint(TOKEN.surface);
    frame.strokes       = solidPaint(TOKEN.border);
    frame.strokeWeight  = TOKEN.borderWidth;
    frame.strokeAlign   = "INSIDE";
    frame.effects       = shadowEffects(TOKEN.shadows[shadowName]);

    const heading = makeText("Card title", TOKEN.heading, TOKEN.textDefault);
    const body    = makeText(
      "Supporting text describing the card content.",
      TOKEN.body,
      TOKEN.textMuted
    );

    frame.appendChild(heading);
    frame.appendChild(body);

    // Set auto-layout sizing after appending
    frame.layoutSizingHorizontal = "FIXED";
    frame.layoutSizingVertical   = "HUG";
    heading.layoutSizingHorizontal = "FILL";
    heading.layoutSizingVertical   = "HUG";
    body.layoutSizingHorizontal    = "FILL";
    body.layoutSizingVertical      = "HUG";

    return frame;
  }

  // ─── Main ────────────────────────────────────────────────────────────────────

  async function run() {
    await Promise.all([
      figma.loadFontAsync({ family: FONT_FAMILY, style: "Bold" }),
      figma.loadFontAsync({ family: FONT_FAMILY, style: "Regular" }),
    ]);

    const SHADOW_NAMES = ["none", "xs", "sm", "md", "lg", "xl"];
    const components = [];

    for (const name of SHADOW_NAMES) {
      const frame = makeCardFrame(name);
      const comp  = figma.createComponentFromNode(frame);
      comp.name   = `Shadow=${name}`;
      components.push(comp);
    }

    const set = figma.combineAsVariants(components, figma.currentPage);
    set.name = "Card";
    set.x = 100;
    set.y = 100;
    set.layoutMode = "HORIZONTAL";
    set.layoutWrap = "WRAP";
    set.primaryAxisAlignItems = "MIN";
    set.counterAxisAlignItems = "MIN";
    set.itemSpacing        = 48;
    set.counterAxisSpacing = 48;
    set.paddingTop    = 40;
    set.paddingBottom = 40;
    set.paddingLeft   = 40;
    set.paddingRight  = 40;
    set.fills = [{ type: "SOLID", color: { r: 0.922, g: 0.910, b: 0.996 }, opacity: 0.5 }];

    figma.currentPage.selection = [set];
    figma.viewport.scrollAndZoomIntoView([set]);
    figma.notify(`Card component set created with ${components.length} shadow variants.`);
    figma.closePlugin();
  }

  run().catch(err => {
    figma.notify("Error: " + err.message, { error: true });
    figma.closePlugin();
  });
})();
