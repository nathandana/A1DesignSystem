import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { DARK_MODE_VARIABLES, LIGHT_MODE_DECLARATIONS, resolveModeVariables } from "./color-modes.mjs";
import { readThemes } from "./theme-config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outFile = join(__dirname, "../packages/react/src/themes.css");
const modesOutFile = join(__dirname, "../packages/react/src/color-scheme-modes.css");
const colorSchemeStaticFile = join(__dirname, "../packages/react/src/color-scheme-static.css");
const colorSchemeOutFile = join(__dirname, "../packages/react/src/color-scheme.css");
const tokenFile = join(__dirname, "../build/json/tokens.json");
const tokensCssSrc = join(__dirname, "../build/css/tokens.css");
const tokensCssDest = join(__dirname, "../packages/react/src/tokens.css");
const breakpointsCssSrc = join(__dirname, "../build/css/breakpoints.css");
const breakpointsCssDest = join(__dirname, "../packages/react/src/breakpoints.css");
const nativeOutDir = join(__dirname, "../packages/react-native/src/tokens");
const nativeTsOutFile = join(nativeOutDir, "generatedThemeColors.ts");
const nativeJsOutFile = join(nativeOutDir, "generatedThemeColors.js");
const nativeTypographyTsOutFile = join(nativeOutDir, "typography.ts");
const nativeTypographyJsOutFile = join(nativeOutDir, "typography.js");
const nativeSpacingTsOutFile = join(nativeOutDir, "spacing.ts");
const nativeSpacingJsOutFile = join(nativeOutDir, "spacing.js");

const BAR = "─".repeat(60);

const themes = readThemes();

function cssBlock(entries, indent = "  ") {
  return Object.entries(entries)
    .map(([k, v]) => `${indent}${k}: ${v};`)
    .join("\n");
}

function explicitLightThemeRestoreCss() {
  const blocks = [];
  for (const theme of themes) {
    for (const { selector, declarations } of theme.selectors) {
      const trimmed = selector.trim();
      if (!/^\.a1-theme-[\w-]+$/.test(trimmed)) continue;
      const className = trimmed.slice(1);
      const entries = Object.entries(declarations).filter(
        ([prop, value]) => value !== "" && Object.prototype.hasOwnProperty.call(LIGHT_MODE_DECLARATIONS, prop)
      );
      if (!entries.length) continue;
      blocks.push(`html.a1-theme-light.${className},
html.${className}.a1-theme-light,
html.a1-theme-dark.${className} .a1-inverse,
html.${className}.a1-theme-dark .a1-inverse {
${cssBlock(Object.fromEntries(entries))}
}`);
    }
  }
  return blocks.join("\n\n");
}

function normalizeThemeSelector(selector) {
  return selector
    .split(",")
    .map((s) => {
      const t = s.trim();
      return t.startsWith(".a1-theme-") ? `html${t}` : t;
    })
    .join(", ");
}

function complexThemeRestoreCss() {
  const blocks = [];
  for (const theme of themes) {
    for (const { selector, declarations } of theme.selectors) {
      const trimmed = selector.trim();
      if (/^\.a1-theme-[\w-]+$/.test(trimmed)) continue;
      const entries = Object.entries(declarations).filter(([, value]) => value !== "");
      if (!entries.length) continue;
      blocks.push(`${normalizeThemeSelector(selector)} {
${cssBlock(Object.fromEntries(entries))}
}`);
    }
  }
  return blocks.join("\n\n");
}

let css = `/* Generated from system theme folders — do not edit directly.\n`;
css += `   To update: edit the JSON files, then run: npm run build:themes */\n`;

for (const theme of themes) {
  const name = theme.name ?? theme.id;

  css += `\n/* ${BAR}\n`;
  css += `   ${name}\n`;
  if (theme.description) css += `   ${theme.description}\n`;
  css += `   ${BAR} */\n\n`;

  for (const { selector, declarations: properties } of theme.selectors) {
    const cssSelector = normalizeThemeSelector(selector);
    css += `${cssSelector} {\n`;
    for (const [prop, value] of Object.entries(properties)) {
      if (value === "") continue;
      css += `  ${prop}: ${value};\n`;
    }
    css += `}\n\n`;
  }
}

const themeLightRestoreCss = explicitLightThemeRestoreCss();
if (themeLightRestoreCss) {
  css += `\n/* ${BAR}\n`;
  css += `   Explicit light restores\n`;
  css += `   Reapply selected theme declarations that the generic light-mode selector can overwrite.\n`;
  css += `   ${BAR} */\n\n`;
  css += `${themeLightRestoreCss}\n\n`;
}

writeFileSync(outFile, css);
console.log(`✔︎ themes.css  (${themes.length} theme file${themes.length !== 1 ? "s" : ""})`);

// ─── color-scheme-modes.css ───────────────────────────────────────────────────
// Generated from DARK_MODE_VARIABLES and LIGHT_MODE_DECLARATIONS in color-modes.mjs.
// Produces the full set of light/dark/inverse/system selector blocks consumed by React.

const DARK = cssBlock(DARK_MODE_VARIABLES);
const LIGHT = cssBlock(LIGHT_MODE_DECLARATIONS);
const DARK4 = cssBlock(DARK_MODE_VARIABLES, "    ");
const LIGHT4 = cssBlock(LIGHT_MODE_DECLARATIONS, "    ");

let modesCss = `/* Generated from system/color-modes.mjs — do not edit directly.
   To update: edit DARK_MODE_VARIABLES / LIGHT_MODE_DECLARATIONS, then run: npm run build:themes */

/* ─── System light mode baseline ───────────────────────────────────────────
   Applies the same light-mode contract used by explicit light when the OS is
   light. Theme selectors have higher specificity, and the system dark media
   query below overrides this when the OS prefers dark. */

:root {
  color-scheme: light;
${LIGHT}
}

/* ─── .a1-inverse: dark island on a light page ─────────────────────────────
   On a light page: .a1-inverse = dark.
   On a dark page (.a1-theme-dark or prefers-dark): overridden by the rules below.
   Specificity (0,1,0) — intentionally lower than the dark class overrides. */

.a1-inverse {
  color-scheme: dark;
${DARK}
}

/* ─── System dark mode (OS-level preference) ────────────────────────────────
   Activates when the OS prefers dark and no explicit class overrides it.
   .a1-inverse restore comes after the standalone .a1-inverse rule above,
   so same-specificity later-source-order wins and correctly flips it to light. */

@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
${DARK4}
  }

  /* .a1-inverse inside a system-dark page inverts back to light */
  .a1-inverse {
    color-scheme: light;
${LIGHT4}
  }
}

/* ─── Explicit dark (.a1-theme-dark on <html>) ──────────────────────────────
   Placed after the media query so the explicit class always wins. */

html.a1-theme-dark {
  color-scheme: dark;
${DARK}
}

/* ─── Light restore inside a dark context ───────────────────────────────────
   .a1-inverse or .a1-theme-light nested under .a1-theme-dark.
   Specificity (0,2,1) beats standalone .a1-inverse (0,1,0) and
   the system dark @media .a1-inverse block (0,1,0 within the query). */

html.a1-theme-dark .a1-inverse,
html.a1-theme-dark .a1-theme-light {
  color-scheme: light;
${LIGHT}
}

/* ─── Explicit light (.a1-theme-light on <html>) ────────────────────────────
   Forces light mode regardless of OS preference.
   Specificity (0,1,1) beats @media dark :root (0,1,0 within the query). */

html.a1-theme-light {
  color-scheme: light;
${LIGHT}
}

/* ─── Dark island inside explicit light (.a1-theme-light .a1-inverse) ───────
   When .a1-theme-light is on <html> and OS prefers dark, the system @media
   block (0,1,0) would flip .a1-inverse to light. This rule (0,2,1) overrides
   that and keeps .a1-inverse sections dark under an explicit light page. */

html.a1-theme-light .a1-inverse {
  color-scheme: dark;
${DARK}
}
`;

const themeModeRestoreCss = [themeLightRestoreCss, complexThemeRestoreCss()].filter(Boolean).join("\n\n");
if (themeModeRestoreCss) {
  modesCss += `

/* ─── Theme restores after mode selectors ──────────────────────────────────
   Reapply selected theme declarations that the generic color-mode selectors
   can overwrite. This block belongs in color-scheme.css because a1-web imports
   that file after themes.css. */

${themeModeRestoreCss}
`;
}

writeFileSync(modesOutFile, modesCss);
console.log("✔︎ color-scheme-modes.css");

if (!existsSync(colorSchemeStaticFile)) {
  throw new Error("packages/react/src/color-scheme-static.css not found.");
}

const staticCss = readFileSync(colorSchemeStaticFile, "utf8").trimEnd();
const bundledColorSchemeCss = `/* Generated color-scheme entry point — do not edit directly.
   Sources:
   - color-scheme-static.css: hand-authored resets and exceptional rules
   - color-scheme-modes.css: generated light/dark/inverse/system selectors
   To update: edit the appropriate source, then run: npm run build:themes */

${staticCss}

${modesCss.trimEnd()}
`;

writeFileSync(colorSchemeOutFile, bundledColorSchemeCss);
console.log("✔︎ color-scheme.css  (self-contained bundle)");

if (existsSync(tokensCssSrc)) {
  copyFileSync(tokensCssSrc, tokensCssDest);
  console.log("✔︎ tokens.css  → packages/react/src/tokens.css");
} else {
  console.warn("⚠︎ build/css/tokens.css not found; skipping tokens.css copy.");
}

if (existsSync(breakpointsCssSrc)) {
  copyFileSync(breakpointsCssSrc, breakpointsCssDest);
  console.log("✔︎ breakpoints.css  → packages/react/src/breakpoints.css");
} else {
  console.warn("⚠︎ build/css/breakpoints.css not found; skipping breakpoints.css copy.");
}

if (!existsSync(tokenFile)) {
  console.warn("⚠︎ build/json/tokens.json not found; skipping React Native theme color generation.");
  process.exit(0);
}

const tokens = JSON.parse(readFileSync(tokenFile, "utf8"));
const baseTokens = tokens.base.color;
const baseSemantic = tokens.semantic.color;
const component = tokens.component;
const themesById = Object.fromEntries(themes.map((theme) => [theme.id, theme]));

function readThemeVars(id) {
  const theme = themesById[id];
  const selector = theme?.selectors[0]?.declarations ?? {};
  return Object.fromEntries(
    Object.entries(selector)
      .filter(([key]) => key.startsWith("--"))
      .map(([key, value]) => [key, value])
  );
}

function toKebab(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function flattenTokenObject(object, prefix = [], out = {}) {
  for (const [key, value] of Object.entries(object ?? {})) {
    const tokenKey = toKebab(key);
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenTokenObject(value, [...prefix, tokenKey], out);
    } else {
      out[`--${prefix.join("-")}-${tokenKey}`] = value;
    }
  }
  return out;
}

const baseVars = flattenTokenObject(tokens);

function resolveValue(value, vars) {
  if (typeof value !== "string") return value;
  const match = value.match(/^var\((--[^,\s)]+)(?:,\s*([^)]+))?\)$/);
  if (!match) return value;
  const [, name, fallback] = match;
  const resolved = vars[name] ?? baseVars[name] ?? fallback;
  if (resolved === undefined) {
    throw new Error(`Unable to resolve ${value}`);
  }
  return resolveValue(resolved, vars);
}

function pxToNumber(value) {
  if (typeof value === "number") return value;
  const text = String(value).trim();
  if (text.endsWith("rem")) return Number(text.replace("rem", "")) * 16;
  if (text.endsWith("em")) return Number(text.replace("em", ""));
  if (text === "normal") return text;
  return Number(text.replace("px", ""));
}

function makeVars(overrides = {}) {
  return { ...baseVars, ...overrides };
}

function makeLightVars(themeId) {
  return makeVars(readThemeVars(themeId));
}

function makeDarkVars(themeId) {
  const lightVars = makeLightVars(themeId);
  return makeVars({
    ...lightVars,
    ...resolveModeVariables(DARK_MODE_VARIABLES, lightVars, baseVars),
  });
}

function tokenValue(vars, name) {
  return resolveValue(vars[name], vars);
}

function badgePalette(vars, status) {
  if (status === "neutral") {
    return {
      bg: tokenValue(vars, "--semantic-color-text-muted"),
      fg: tokenValue(vars, "--semantic-color-text-inverse"),
      subtleBg: tokenValue(vars, "--semantic-color-surface-raised"),
      subtleFg: tokenValue(vars, "--semantic-color-text-muted"),
      subtleBorder: tokenValue(vars, "--semantic-color-border-default"),
    };
  }

  return {
    bg: tokenValue(vars, `--semantic-color-status-${status}-background`),
    fg: tokenValue(vars, `--semantic-color-status-${status}-foreground`),
    subtleBg: tokenValue(vars, `--semantic-color-status-${status}-surface`),
    subtleFg: tokenValue(vars, `--semantic-color-status-${status}-background`),
    subtleBorder: tokenValue(vars, `--semantic-color-status-${status}-border`),
  };
}

function colorSet(vars) {
  return {
    pageBg: tokenValue(vars, "--semantic-color-surface-page"),
    surfaceBg: tokenValue(vars, "--semantic-color-surface-page"),
    panelBg: tokenValue(vars, "--semantic-color-surface-panel"),
    raisedBg: tokenValue(vars, "--semantic-color-surface-raised"),
    borderSubtle: tokenValue(vars, "--semantic-color-border-subtle"),
    textDefault: tokenValue(vars, "--semantic-color-text-default"),
    textMuted: tokenValue(vars, "--semantic-color-text-muted"),
    textAccent: tokenValue(vars, "--semantic-color-text-accent"),
    accentSurface: tokenValue(vars, "--semantic-color-action-surface"),
    pressedBg: tokenValue(vars, "--semantic-color-surface-panel"),
    buttonPrimaryBg: tokenValue(vars, "--component-button-primary-background"),
    buttonPrimaryFg: tokenValue(vars, "--component-button-primary-foreground"),
    buttonPrimaryBgPressed: tokenValue(vars, "--component-button-primary-background-pressed"),
    buttonSecondaryBg: tokenValue(vars, "--component-button-secondary-background"),
    buttonSecondaryFg: tokenValue(vars, "--component-button-secondary-foreground"),
    buttonSecondaryBgPressed: tokenValue(vars, "--component-button-secondary-background-pressed"),
    buttonSecondaryBorder: tokenValue(vars, "--component-button-secondary-border"),
    scrimBg: tokenValue(vars, "--component-scrim-color"),
    badge: {
      neutral: badgePalette(vars, "neutral"),
      info: badgePalette(vars, "info"),
      success: badgePalette(vars, "success"),
      warn: badgePalette(vars, "warn"),
      error: badgePalette(vars, "error"),
    },
  };
}

function themeColorConfig(themeId) {
  const lightVars = themeId === "base" ? makeVars() : makeLightVars(themeId);
  const darkVars = makeDarkVars(themeId);
  return {
    accent: tokenValue(lightVars, "--semantic-color-action-background"),
    accentSurface: tokenValue(lightVars, "--semantic-color-action-surface"),
    buttonRadius: pxToNumber(resolveValue(lightVars["--component-button-border-radius"] ?? component.button.borderRadius, lightVars)),
    cardRadius: pxToNumber(resolveValue(lightVars["--component-card-border-radius"] ?? component.card.borderRadius, lightVars)),
    navItemRadius: pxToNumber(resolveValue(lightVars["--component-side-nav-item-border-radius"] ?? component.sideNav.item.borderRadius, lightVars)),
    light: colorSet(lightVars),
    dark: colorSet(darkVars),
  };
}

const nativeThemeColors = {
  base: themeColorConfig("base"),
  accessible: themeColorConfig("base"),
  heritage: themeColorConfig("heritage"),
};

const banner = `// Generated from Style Dictionary tokens and system/theme JSON. Do not edit directly.
// To update: run npm run build:tokens
`;

const ts = `${banner}
export const NATIVE_THEME_COLORS = ${JSON.stringify(nativeThemeColors, null, 2)} as const;

export const NATIVE_THEME_ACCENTS = Object.fromEntries(
  Object.entries(NATIVE_THEME_COLORS).map(([key, value]) => [
    key,
    { accent: value.accent, accentSurface: value.accentSurface },
  ]),
) as Record<keyof typeof NATIVE_THEME_COLORS, { accent: string; accentSurface: string }>;
`;

const js = `${banner}
export const NATIVE_THEME_COLORS = ${JSON.stringify(nativeThemeColors, null, 2)};

export const NATIVE_THEME_ACCENTS = Object.fromEntries(
  Object.entries(NATIVE_THEME_COLORS).map(([key, value]) => [
    key,
    { accent: value.accent, accentSurface: value.accentSurface },
  ]),
);
`;

function fontWeight(value) {
  return String(value);
}

function fontSizes(group) {
  return Object.fromEntries(
    Object.entries(group).map(([key, value]) => [key, pxToNumber(value)])
  );
}

function lineHeightMultiplier(value) {
  return pxToNumber(value);
}

const semanticFont = tokens.semantic.font;
const baseFont = tokens.base.font;
const baseBodyMd = pxToNumber(semanticFont.size.body.md);
const fontScaleBonus = (themeId) => {
  if (themeId === "base") return 0;
  const vars = makeLightVars(themeId);
  const value = vars["--semantic-font-size-body-md"];
  if (!value) return 0;
  return Number((pxToNumber(resolveValue(value, vars)) / baseBodyMd - 1).toFixed(6));
};

const nativeTypographyTokens = {
  userScales: {
    sm: pxToNumber(baseFont.size.user.small) / 16,
    md: pxToNumber(baseFont.size.user.medium) / 16,
    lg: pxToNumber(baseFont.size.user.large) / 16,
    xl: pxToNumber(baseFont.size.user.xl) / 16,
  },
  themeScaleBonus: {
    base: fontScaleBonus("base"),
    accessible: fontScaleBonus("accessible"),
    heritage: fontScaleBonus("heritage"),
  },
  heading: {
    fontWeight: fontWeight(semanticFont.weight.heading),
    lineHeightMultiplier: lineHeightMultiplier(semanticFont.lineHeight.heading),
    sizes: fontSizes(semanticFont.size.heading),
  },
  display: {
    fontWeight: fontWeight(semanticFont.weight.display),
    lineHeightMultiplier: lineHeightMultiplier(semanticFont.lineHeight.display),
    sizes: fontSizes(semanticFont.size.display),
  },
  body: {
    fontWeight: fontWeight(semanticFont.weight.body),
    lineHeightMultiplier: lineHeightMultiplier(semanticFont.lineHeight.body),
    sizes: fontSizes(semanticFont.size.body),
  },
  component: {
    badge: {
      sizes: {
        sm: { fontSize: pxToNumber(semanticFont.size.body.xs), iconSize: pxToNumber(semanticFont.size.body.xs) },
        md: { fontSize: pxToNumber(semanticFont.size.body.sm), iconSize: pxToNumber(semanticFont.size.body.sm) },
        lg: { fontSize: pxToNumber(semanticFont.size.body.md), iconSize: pxToNumber(semanticFont.size.body.md) },
      },
    },
    banner: {
      fontSize: pxToNumber(semanticFont.size.body.sm),
      iconSize: pxToNumber(component.message.banner.iconSize),
    },
    blockquote: {
      citeFontSize: pxToNumber(semanticFont.size.body.xs),
    },
    button: {
      sizes: {
        sm: { fontSize: pxToNumber(semanticFont.size.body.sm), fontWeight: fontWeight(component.button.font.weight) },
        md: { fontSize: pxToNumber(component.button.font.size), fontWeight: fontWeight(component.button.font.weight) },
        lg: { fontSize: pxToNumber(semanticFont.size.body.lg), fontWeight: fontWeight(semanticFont.weight.heading) },
      },
    },
    dialog: {
      titleFontSize: pxToNumber(semanticFont.size.heading.xs),
      closeIconFontSize: pxToNumber(semanticFont.size.body.sm),
    },
    list: {
      controlFontSize: pxToNumber(semanticFont.size.body.sm),
    },
    pagination: {
      sizes: {
        sm: { fontSize: pxToNumber(semanticFont.size.body.xs) },
        md: { fontSize: pxToNumber(semanticFont.size.body.sm) },
      },
    },
    sideNav: {
      itemFontSize: pxToNumber(semanticFont.size.body.sm),
      itemLineHeight: Math.round(pxToNumber(semanticFont.size.body.sm) * lineHeightMultiplier(component.sideNav.item.fontLineHeight)),
      closeIconFontSize: pxToNumber(component.sideNav.item.chevronSize),
      badgeFontSize: pxToNumber(semanticFont.size.body.xs),
    },
    snackbar: {
      fontSize: pxToNumber(semanticFont.size.body.sm),
    },
  },
};

const typographyTs = `${banner}
export const typographyTokens = ${JSON.stringify(nativeTypographyTokens, null, 2)} as const;
`;

const typographyJs = `${banner}
export const typographyTokens = ${JSON.stringify(nativeTypographyTokens, null, 2)};
`;

function spacingScale(values) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key.replace("neg-", "neg"), pxToNumber(value)])
  );
}

function shadowOffset(shadow) {
  const item = Array.isArray(shadow) ? shadow[0] : null;
  return {
    width: pxToNumber(item?.offsetX ?? 0),
    height: pxToNumber(item?.offsetY ?? 0),
  };
}

const spacing = tokens.base.spacing;
const nativeSpacingTokens = {
  base: spacingScale(spacing),
  semantic: {
    gap: spacingScale(tokens.semantic.spacing.gap),
  },
  component: {
    badge: {
      borderWidth: pxToNumber(component.message.badge.borderWidth),
      gap: pxToNumber(spacing[4]),
      sizes: {
        sm: {
          minHeight: pxToNumber(spacing[20]),
          paddingHorizontal: pxToNumber(component.message.badge.smPaddingInline),
          paddingVertical: pxToNumber(component.message.badge.smPaddingBlock),
        },
        md: {
          minHeight: pxToNumber(spacing[24]),
          paddingHorizontal: pxToNumber(component.message.badge.paddingInline),
          paddingVertical: pxToNumber(component.message.badge.paddingBlock),
        },
        lg: {
          minHeight: pxToNumber(spacing[32]),
          paddingHorizontal: pxToNumber(component.message.badge.lgPaddingInline),
          paddingVertical: pxToNumber(component.message.badge.lgPaddingBlock),
        },
      },
    },
    banner: {
      borderWidth: pxToNumber(component.message.banner.borderWidth),
      iconMarginTop: pxToNumber(component.message.banner.iconMarginTop),
      padding: pxToNumber(component.message.banner.padding),
      systemPaddingHorizontal: pxToNumber(spacing[24]),
      systemPaddingVertical: pxToNumber(component.message.banner.padding),
      gap: pxToNumber(component.message.banner.padding),
      contentGap: pxToNumber(spacing[4]),
      systemContentGap: pxToNumber(spacing[8]),
    },
    blockquote: {
      borderWidth: pxToNumber(component.blockquote.borderWidth),
      paddingHorizontal: pxToNumber(component.blockquote.paddingInline),
      paddingVertical: pxToNumber(component.blockquote.paddingBlock),
      gap: pxToNumber(spacing[12]),
    },
    button: {
      gap: pxToNumber(component.button.gap),
      disabledOpacity: component.button.disabledOpacity,
      borderWidth: pxToNumber(component.button.borderWidth),
      secondaryBorderWidth: pxToNumber(component.button.secondary.borderWidth),
      pillBorderRadius: pxToNumber(component.button.pillBorderRadius),
      sizes: {
        sm: {
          height: pxToNumber(component.button.small.height),
          paddingHorizontal: pxToNumber(spacing[14] ?? spacing[12]),
          borderRadius: pxToNumber(component.button.small.borderRadius),
          iconSize: pxToNumber(component.button.small.iconSize),
        },
        md: {
          height: pxToNumber(component.button.minHeight),
          paddingHorizontal: pxToNumber(component.button.paddingInline),
          borderRadius: pxToNumber(component.button.borderRadius),
          iconSize: pxToNumber(component.button.medium.iconSize),
        },
        lg: {
          height: pxToNumber(component.button.large.height),
          paddingHorizontal: pxToNumber(spacing[24]),
          borderRadius: pxToNumber(spacing[12]),
          iconSize: pxToNumber(component.button.large.iconSize),
        },
      },
    },
    card: {
      padding: pxToNumber(component.card.padding),
      borderRadius: pxToNumber(component.card.borderRadius),
      borderWidth: pxToNumber(component.card.borderWidth),
      shadowOffset: shadowOffset(component.card.shadow),
      icon: {
        containerSize: pxToNumber(spacing[40]),
        containerBorderRadius: pxToNumber(component.button.borderRadius),
        marginBottom: pxToNumber(spacing[12]),
      },
      hero: {
        paddingVertical: pxToNumber(spacing[32]),
        iconSize: pxToNumber(spacing[64]),
      },
    },
    dialog: {
      centerPaddingHorizontal: pxToNumber(component.dialog.padding),
      maxWidth: pxToNumber(component.dialog.width),
      shadowOffset: shadowOffset(component.dialog.shadow),
      headerPaddingHorizontal: pxToNumber(spacing[20]),
      headerPaddingTop: pxToNumber(spacing[20]),
      headerPaddingBottom: pxToNumber(spacing[12]),
      gap: pxToNumber(spacing[8]),
      closeButtonSize: pxToNumber(spacing[32]),
      bodyPaddingHorizontal: pxToNumber(spacing[20]),
      bodyPaddingBottom: pxToNumber(spacing[20]),
      footerPaddingHorizontal: pxToNumber(spacing[20]),
      footerPaddingVertical: pxToNumber(spacing[16]),
      footerBorderWidth: pxToNumber(component.dialog.footerBorderWidth),
    },
    emptyState: {
      pagePaddingHorizontal: pxToNumber(spacing[24]),
      pagePaddingVertical: pxToNumber(spacing[32]),
      pageGap: pxToNumber(spacing[16]),
      compactPaddingHorizontal: pxToNumber(spacing[20]),
      compactPaddingVertical: pxToNumber(spacing[20]),
      compactGap: pxToNumber(spacing[12]),
      iconSize: pxToNumber(component.message.emptyState.wrapSizeSection),
      iconGlyphSize: pxToNumber(component.message.emptyState.iconSizeSection),
      compactIconGlyphSize: pxToNumber(component.message.emptyState.iconSizeCard),
      copyGap: pxToNumber(spacing[4]),
      actionGap: pxToNumber(spacing[8]),
      borderWidth: pxToNumber(spacing[1]),
    },
    iconButton: {
      sizes: {
        sm: {
          size: pxToNumber(component.sideNav.item.height),
          iconSize: pxToNumber(component.button.iconSize),
        },
        md: {
          size: pxToNumber(component.iconButton.size),
          iconSize: pxToNumber(component.iconButton.iconSize),
        },
      },
      borderWidth: pxToNumber(spacing[1]),
    },
    link: {
      gap: pxToNumber(spacing[4]),
    },
    list: {
      borderWidth: pxToNumber(spacing[1]),
      gap: pxToNumber(spacing[8]),
      itemMinHeight: pxToNumber(spacing[64]) - pxToNumber(spacing[8]),
      itemPaddingHorizontal: pxToNumber(spacing[16]),
      itemPaddingVertical: pxToNumber(spacing[12]),
      itemGap: pxToNumber(spacing[12]),
      copyGap: pxToNumber(spacing[2]),
    },
    pagination: {
      itemSize: pxToNumber(component.pagination.itemSize),
      itemSizeSm: pxToNumber(component.pagination.itemSizeSm),
      iconSize: pxToNumber(component.button.medium.iconSize),
      iconSizeSm: pxToNumber(spacing[16]),
      gap: pxToNumber(component.pagination.gap),
      borderWidth: pxToNumber(component.pagination.borderWidth),
      paddingHorizontal: pxToNumber(spacing[4]),
      ellipsisPaddingBottom: pxToNumber(component.pagination.ellipsisPaddingBottom),
    },
    sideNav: {
      width: pxToNumber(component.sideNav.width),
      borderWidth: pxToNumber(component.sideNav.borderWidth),
      headerMinHeight: pxToNumber(component.sideNav.headerMinHeight),
      paddingBlock: pxToNumber(component.sideNav.paddingBlock),
      paddingInline: pxToNumber(component.sideNav.paddingInline),
      shadowOffset: { width: pxToNumber(spacing[8]), height: 0 },
      item: {
        height: pxToNumber(component.sideNav.item.height),
        paddingInline: pxToNumber(component.sideNav.item.paddingInline),
        paddingVertical: pxToNumber(spacing[4]),
        gap: pxToNumber(component.sideNav.item.gap),
        borderRadius: pxToNumber(component.sideNav.item.borderRadius),
        iconSize: pxToNumber(component.sideNav.item.iconSize),
        indent: pxToNumber(component.sideNav.item.indent),
        chevronSize: pxToNumber(component.sideNav.item.chevronSize),
        groupGap: pxToNumber(spacing[2]),
        badgeBorderRadius: pxToNumber(spacing[12]) - pxToNumber(spacing[2]),
        badgePaddingHorizontal: pxToNumber(spacing[6]),
        badgePaddingVertical: pxToNumber(spacing[1]),
      },
      panelHeader: {
        paddingLeft: pxToNumber(spacing[20]),
        paddingRight: pxToNumber(spacing[12]),
        paddingBottom: pxToNumber(spacing[12]),
        gap: pxToNumber(spacing[8]),
      },
      closeButtonSize: pxToNumber(component.sideNav.item.height),
    },
    snackbar: {
      viewportPaddingHorizontal: pxToNumber(spacing[16]),
      viewportPaddingBottom: pxToNumber(spacing[16]),
      maxWidth: pxToNumber(spacing[128]) * 3 + pxToNumber(spacing[32]) + pxToNumber(spacing[4]),
      minHeight: pxToNumber(component.button.large.height),
      paddingHorizontal: pxToNumber(spacing[24]),
      paddingVertical: pxToNumber(spacing[12]),
      borderWidth: pxToNumber(spacing[1]),
      gap: pxToNumber(spacing[8]),
      shadowOffset: { width: 0, height: pxToNumber(spacing[8]) },
    },
    textList: {
      gap: pxToNumber(spacing[4]),
      pillRadius: 999,
    },
  },
};

const spacingTs = `${banner}
export const spacingTokens = ${JSON.stringify(nativeSpacingTokens, null, 2)} as const;
`;

const spacingJs = `${banner}
export const spacingTokens = ${JSON.stringify(nativeSpacingTokens, null, 2)};
`;

mkdirSync(nativeOutDir, { recursive: true });
writeFileSync(nativeTsOutFile, ts);
writeFileSync(nativeJsOutFile, js);
writeFileSync(nativeTypographyTsOutFile, typographyTs);
writeFileSync(nativeTypographyJsOutFile, typographyJs);
writeFileSync(nativeSpacingTsOutFile, spacingTs);
writeFileSync(nativeSpacingJsOutFile, spacingJs);
console.log("✔︎ React Native theme colors");
console.log("✔︎ React Native typography tokens");
console.log("✔︎ React Native spacing tokens");
