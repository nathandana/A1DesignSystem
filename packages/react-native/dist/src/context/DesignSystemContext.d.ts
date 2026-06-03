import React from 'react';
export type ColorMode = 'light' | 'dark' | 'system';
export type A1ThemeKey = 'base' | 'accessible' | 'heritage';
export type TypeScaleKey = 'sm' | 'md' | 'lg' | 'xl';
export declare const FONT_SCALES: Record<TypeScaleKey, number>;
export interface ThemeColorSet {
    pageBg: string;
    surfaceBg: string;
    panelBg: string;
    borderSubtle: string;
    textDefault: string;
    textMuted: string;
    textAccent: string;
    /** Tinted surface for selected/active states — semantic-color-action-surface */
    accentSurface: string;
    /** Pressed/hover overlay for interactive rows — subtle tint */
    pressedBg: string;
    buttonPrimaryBg: string;
    buttonPrimaryFg: string;
    buttonPrimaryBgPressed: string;
    buttonSecondaryBg: string;
    buttonSecondaryFg: string;
    buttonSecondaryBgPressed: string;
    buttonSecondaryBorder: string;
}
export interface A1ThemeFonts {
    /** Body text — undefined means use System (SF Pro on iOS) */
    body: string | undefined;
    /** Body semibold/medium weight */
    bodyBold: string | undefined;
    /** Heading (h1–h6 scale) */
    heading: string | undefined;
    /** Display / hero text */
    display: string | undefined;
    /** Heading weight override — undefined means use token default (700) */
    headingWeight: string | undefined;
    /** Display weight override — undefined means use token default (900) */
    displayWeight: string | undefined;
}
export interface A1Theme {
    name: string;
    description: string;
    /** Unresolved accent for elements not affected by dark mode */
    accent: string;
    accentSurface: string;
    buttonRadius: number;
    cardRadius: number;
    navItemRadius: number;
    fontScaleBonus: number;
    fonts: A1ThemeFonts;
    light: ThemeColorSet;
    dark: ThemeColorSet;
}
export declare const A1_THEMES: Record<A1ThemeKey, A1Theme>;
export interface DesignSystemContextValue {
    fontScale: number;
    isDark: boolean;
    theme: A1Theme;
    /** Resolved colors for the current mode */
    colors: ThemeColorSet;
}
export declare const DesignSystemContext: React.Context<DesignSystemContextValue>;
export declare function useDesignSystem(): DesignSystemContextValue;
export declare function DesignSystemProvider({ children, value, }: {
    children: React.ReactNode;
    value?: Partial<DesignSystemContextValue>;
}): React.JSX.Element;
export declare const THEME_ACCENTS: Record<A1ThemeKey, {
    accent: string;
    accentSurface: string;
}>;
