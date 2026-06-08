import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const themesDir = join(__dirname, "themes");
const outFile = join(__dirname, "../packages/react/src/themes.css");
const tokenFile = join(__dirname, "../build/json/tokens.json");
const nativeOutDir = join(__dirname, "../packages/react-native/src/tokens");
const nativeTsOutFile = join(nativeOutDir, "generatedThemeColors.ts");
const nativeJsOutFile = join(nativeOutDir, "generatedThemeColors.js");
const nativeTypographyTsOutFile = join(nativeOutDir, "typography.ts");
const nativeTypographyJsOutFile = join(nativeOutDir, "typography.js");
const nativeSpacingTsOutFile = join(nativeOutDir, "spacing.ts");
const nativeSpacingJsOutFile = join(nativeOutDir, "spacing.js");

const BAR = "─".repeat(60);

const files = readdirSync(themesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => ({
    id: entry.name,
    file: join(themesDir, entry.name, "theme.json"),
  }))
  .filter(({ file }) => existsSync(file))
  .sort((a, b) => {
    if (a.id === "base") return -1;
    if (b.id === "base") return 1;
    return a.id.localeCompare(b.id);
  });

let css = `/* Generated from system theme folders — do not edit directly.\n`;
css += `   To update: edit the JSON files, then run: npm run build:themes */\n`;

for (const { id, file } of files) {
  const theme = JSON.parse(readFileSync(file, "utf8"));
  const name = theme.name ?? id;

  css += `\n/* ${BAR}\n`;
  css += `   ${name}\n`;
  if (theme.description) css += `   ${theme.description}\n`;
  css += `   ${BAR} */\n\n`;

  for (const [selector, properties] of Object.entries(theme.selectors ?? {})) {
    const cssSelector = selector
      .split(",")
      .map((s) => {
        const t = s.trim();
        return t.startsWith(".a1-theme-") ? `html${t}` : t;
      })
      .join(", ");
    css += `${cssSelector} {\n`;
    for (const [prop, value] of Object.entries(properties)) {
      if (value === "") continue;
      css += `  ${prop}: ${value};\n`;
    }
    css += `}\n\n`;
  }
}

writeFileSync(outFile, css);
console.log(`✔︎ themes.css  (${files.length} theme file${files.length !== 1 ? "s" : ""})`);

if (!existsSync(tokenFile)) {
  console.warn("⚠︎ build/json/tokens.json not found; skipping React Native theme color generation.");
  process.exit(0);
}

const tokens = JSON.parse(readFileSync(tokenFile, "utf8"));
const baseTokens = tokens.base.color;
const baseSemantic = tokens.semantic.color;
const baseTheme = tokens.theme.a1Light;
const component = tokens.component;
const themeFilesById = Object.fromEntries(files.map(({ id, file }) => [id, file]));

function readThemeVars(id) {
  const file = themeFilesById[id];
  if (!file) return {};
  const theme = JSON.parse(readFileSync(file, "utf8"));
  const selector = Object.values(theme.selectors ?? {})[0] ?? {};
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

const baseVars = {
  ...flattenTokenObject({ base: { color: baseTokens } }),
  ...flattenTokenObject({ semantic: { color: baseSemantic } }),
  ...flattenTokenObject({ component }),
  ...flattenTokenObject({ theme: { a1: { light: baseTheme } } }),
};

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
  const neutral = (step) => lightVars[`--base-color-neutral-${step}`] ?? baseVars[`--base-color-neutral-${step}`];
  const accent = (step) => lightVars[`--base-color-accent-${step}`] ?? baseVars[`--base-color-accent-${step}`];
  const status = (name, step) => lightVars[`--base-color-${name}-${step}`] ?? baseVars[`--base-color-${name}-${step}`];

  return makeVars({
    ...lightVars,
    "--semantic-color-surface-page": neutral(900),
    "--semantic-color-surface-panel": neutral(800),
    "--semantic-color-surface-raised": neutral(700),
    "--semantic-color-text-default": neutral(50),
    "--semantic-color-text-muted": neutral(300),
    "--semantic-color-text-inverse": neutral(900),
    "--semantic-color-text-accent": accent(300),
    "--semantic-color-border-subtle": neutral(700),
    "--semantic-color-border-default": neutral(600),
    "--semantic-color-border-strong": neutral(400),
    "--semantic-color-action-background": accent(400),
    "--semantic-color-action-background-hover": accent(300),
    "--semantic-color-action-background-pressed": accent(500),
    "--semantic-color-action-foreground": accent(1000),
    "--semantic-color-action-foreground-pressed": accent(1000),
    "--semantic-color-action-surface": accent(900),
    "--semantic-color-action-border": accent(500),
    "--semantic-color-status-info-background": status("info", 400),
    "--semantic-color-status-info-surface": status("info", 900),
    "--semantic-color-status-info-border": status("info", 500),
    "--semantic-color-status-info-foreground": status("info", 1000),
    "--semantic-color-status-error-background": status("error", 400),
    "--semantic-color-status-error-surface": status("error", 900),
    "--semantic-color-status-error-border": status("error", 500),
    "--semantic-color-status-error-foreground": neutral(900),
    "--semantic-color-status-warn-background": status("warn", 400),
    "--semantic-color-status-warn-surface": status("warn", 900),
    "--semantic-color-status-warn-border": status("warn", 500),
    "--semantic-color-status-warn-foreground": neutral(900),
    "--semantic-color-status-success-background": status("success", 400),
    "--semantic-color-status-success-surface": status("success", 900),
    "--semantic-color-status-success-border": status("success", 500),
    "--semantic-color-status-success-foreground": neutral(900),
    "--component-button-primary-background": accent(200),
    "--component-button-primary-background-pressed": accent(50),
    "--component-button-primary-foreground": accent(900),
    "--component-button-secondary-background": accent(900),
    "--component-button-secondary-background-pressed": accent(700),
    "--component-button-secondary-foreground": accent(200),
    "--component-button-secondary-border": accent(200),
    "--component-scrim-color": component.scrim.colorDark,
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
const themeFont = tokens.theme;
const baseBodyMd = pxToNumber(themeFont.a1Light.font.size.body.md);
const fontScaleBonus = (themeId) => {
  const theme = themeFont[themeId];
  if (!theme?.font?.size?.body?.md) return 0;
  return Number((pxToNumber(theme.font.size.body.md) / baseBodyMd - 1).toFixed(6));
};

const nativeTypographyTokens = {
  userScales: {
    sm: pxToNumber(baseFont.size.user.small) / 16,
    md: pxToNumber(baseFont.size.user.medium) / 16,
    lg: pxToNumber(baseFont.size.user.large) / 16,
    xl: pxToNumber(baseFont.size.user.xl) / 16,
  },
  themeScaleBonus: {
    base: fontScaleBonus("a1Light"),
    accessible: fontScaleBonus("a1Accessible"),
    heritage: fontScaleBonus("a1Heritage"),
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
