import React from 'react';
import { Platform, Text } from 'react-native';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { typographyTokens } from '../../tokens/typography';
export function Heading({ children, type = 'heading', size, color = 'default', style, numberOfLines, }) {
    const { fontScale, colors, theme } = useDesignSystem();
    const config = typographyTokens[type];
    const sizes = config.sizes;
    const defaultSize = type === 'heading' ? 'xl' : 'md';
    const resolvedSize = (size && size in sizes) ? size : defaultSize;
    const baseFontSize = sizes[resolvedSize];
    const fontSize = Math.round(baseFontSize * fontScale);
    const lineHeight = Math.round(fontSize * config.lineHeightMultiplier);
    const baseColor = color === 'accent' ? colors.textAccent
        : color === 'muted' ? colors.textMuted
            : colors.textDefault;
    const { fonts } = theme;
    const fontFamily = type === 'display'
        ? (fonts.display ?? Platform.select({ ios: undefined, default: 'sans-serif' }))
        : (fonts.heading ?? Platform.select({ ios: undefined, default: 'sans-serif' }));
    const fontWeight = type === 'display'
        ? (fonts.displayWeight ?? config.fontWeight)
        : (fonts.headingWeight ?? config.fontWeight);
    const textStyle = {
        fontFamily,
        fontSize,
        fontWeight,
        lineHeight,
        color: baseColor,
        letterSpacing: type === 'display' ? -0.5 : -0.2,
    };
    return (<Text accessibilityRole="header" numberOfLines={numberOfLines} style={[textStyle, style]}>
      {children}
    </Text>);
}
