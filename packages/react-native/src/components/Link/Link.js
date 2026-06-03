import React from 'react';
import { Linking, Pressable, Text, Platform, } from 'react-native';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { spacingTokens } from '../../tokens/spacing';
import { typographyTokens } from '../../tokens/typography';
import { renderMaterialIcon } from '../../utils/materialIcon';
const WEIGHTS = {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
};
export function Link({ children, href, size = 'md', weight = 'normal', icon, iconPosition = 'start', onPress, style, }) {
    const { colors, theme } = useDesignSystem();
    const { fontScale } = useDesignSystem();
    const fontSize = Math.round((typographyTokens.body.sizes[size] ?? typographyTokens.body.sizes.md) * fontScale);
    const fontFamily = theme.fonts.body ?? Platform.select({ ios: undefined, default: 'sans-serif' });
    const styledIcon = renderMaterialIcon(icon, Math.round(fontSize * 1.1), colors.textAccent);
    const textStyle = {
        fontFamily,
        fontSize,
        fontWeight: WEIGHTS[weight] ?? '400',
        color: colors.textAccent,
        textDecorationLine: 'underline',
        textDecorationColor: colors.textAccent,
    };
    function handlePress() {
        if (onPress) {
            onPress();
            return;
        }
        if (href) {
            Linking.openURL(href).catch(() => { });
        }
    }
    if (icon) {
        return (<Pressable onPress={handlePress} accessibilityRole="link" style={{ flexDirection: 'row', alignItems: 'center', gap: spacingTokens.component.link.gap }}>
        {iconPosition === 'start' && styledIcon}
        <Text style={[textStyle, style]}>{children}</Text>
        {iconPosition === 'end' && styledIcon}
      </Pressable>);
    }
    return (<Text onPress={handlePress} accessibilityRole="link" style={[textStyle, style]}>
      {children}
    </Text>);
}
