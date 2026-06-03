import React, { createContext, useContext } from 'react';
import { NATIVE_THEME_ACCENTS, NATIVE_THEME_COLORS } from '../tokens/generatedThemeColors';
import { typographyTokens } from '../tokens/typography';

export const FONT_SCALES = typographyTokens.userScales;

const SYSTEM_FONTS = {
    body: undefined,
    bodyBold: undefined,
    heading: undefined,
    display: undefined,
    headingWeight: undefined,
    displayWeight: undefined,
};

export const A1_THEMES = {
    base: {
        name: 'Base',
        description: 'Default A1 theme — purple, rounded',
        accent: NATIVE_THEME_COLORS.base.accent,
        accentSurface: NATIVE_THEME_COLORS.base.accentSurface,
        buttonRadius: NATIVE_THEME_COLORS.base.buttonRadius,
        cardRadius: NATIVE_THEME_COLORS.base.cardRadius,
        navItemRadius: NATIVE_THEME_COLORS.base.navItemRadius,
        fontScaleBonus: typographyTokens.themeScaleBonus.base,
        fonts: SYSTEM_FONTS,
        light: NATIVE_THEME_COLORS.base.light,
        dark: NATIVE_THEME_COLORS.base.dark,
    },
    accessible: {
        name: 'Accessible',
        description: 'Larger type, rounder corners, Atkinson Hyperlegible',
        accent: NATIVE_THEME_COLORS.accessible.accent,
        accentSurface: NATIVE_THEME_COLORS.accessible.accentSurface,
        buttonRadius: 10,
        cardRadius: 14,
        navItemRadius: 10,
        fontScaleBonus: typographyTokens.themeScaleBonus.accessible,
        fonts: {
            body: 'AtkinsonHyperlegible_400Regular',
            bodyBold: 'AtkinsonHyperlegible_700Bold',
            heading: 'AtkinsonHyperlegible_700Bold',
            display: 'AtkinsonHyperlegible_700Bold',
            headingWeight: undefined,
            displayWeight: undefined,
        },
        light: NATIVE_THEME_COLORS.accessible.light,
        dark: NATIVE_THEME_COLORS.accessible.dark,
    },
    heritage: {
        name: 'Heritage',
        description: 'Warm neutrals, deep teal, Nunito + Libre Baskerville',
        accent: NATIVE_THEME_COLORS.heritage.accent,
        accentSurface: NATIVE_THEME_COLORS.heritage.accentSurface,
        buttonRadius: NATIVE_THEME_COLORS.heritage.buttonRadius,
        cardRadius: NATIVE_THEME_COLORS.heritage.cardRadius,
        navItemRadius: NATIVE_THEME_COLORS.heritage.navItemRadius,
        fontScaleBonus: typographyTokens.themeScaleBonus.heritage,
        fonts: {
            body: 'Nunito_400Regular',
            bodyBold: 'Nunito_700Bold',
            heading: 'LibreBaskerville_400Regular',
            display: 'RobotoSlab_300Light',
            headingWeight: '400',
            displayWeight: '300',
        },
        light: NATIVE_THEME_COLORS.heritage.light,
        dark: NATIVE_THEME_COLORS.heritage.dark,
    },
};

const defaults = {
    fontScale: 1,
    isDark: false,
    theme: A1_THEMES.base,
    colors: NATIVE_THEME_COLORS.base.light,
};

export const DesignSystemContext = createContext(defaults);

export function useDesignSystem() {
    return useContext(DesignSystemContext);
}

export function DesignSystemProvider({ children, value, }) {
    const merged = { ...defaults, ...value };
    if (!value?.colors) {
        merged.colors = merged.isDark ? merged.theme.dark : merged.theme.light;
    }
    return (<DesignSystemContext.Provider value={merged}>
      {children}
    </DesignSystemContext.Provider>);
}

// Keep THEME_ACCENTS export for SettingsScreen swatch previews.
export const THEME_ACCENTS = NATIVE_THEME_ACCENTS;
