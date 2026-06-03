import React from 'react';
import { Platform, Text } from 'react-native';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { typographyTokens } from '../../tokens/typography';
export function Paragraph({ children, size = 'md', color = 'default', style, numberOfLines, }) {
    const { fontScale, colors, theme } = useDesignSystem();
    const sizes = typographyTokens.body.sizes;
    const baseFontSize = sizes[size] ?? sizes.md;
    const fontSize = Math.round(baseFontSize * fontScale);
    const lineHeight = Math.round(fontSize * typographyTokens.body.lineHeightMultiplier);
    const textColor = color === 'muted' ? colors.textMuted : colors.textDefault;
    const fontFamily = theme.fonts.body ?? Platform.select({ ios: undefined, default: 'sans-serif' });
    const textStyle = {
        fontFamily,
        fontSize,
        fontWeight: typographyTokens.body.fontWeight,
        lineHeight,
        color: textColor,
    };
    return (<Text numberOfLines={numberOfLines} style={[textStyle, style]}>
      {children}
    </Text>);
}
