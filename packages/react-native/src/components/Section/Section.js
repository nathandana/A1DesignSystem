import React from 'react';
import { View } from 'react-native';
import { DesignSystemProvider, useDesignSystem } from '../../context/DesignSystemContext';
import { spacingTokens } from '../../tokens/spacing';
const PADDING = {
    lg: spacingTokens.base[40],
    md: spacingTokens.semantic.gap.lg,
    sm: spacingTokens.semantic.gap.md,
    none: 0,
};
const GAP = spacingTokens.semantic.gap;
export function Section({ children, padding = 'md', surface, gap, inverse = false, style }) {
    const { colors, theme, fontScale } = useDesignSystem();
    const bg = inverse ? theme.dark.pageBg // neutral-900 for the theme
        : surface === 'panel' ? colors.panelBg
            : surface === 'raised' ? colors.raisedBg
                : surface === 'page' ? colors.pageBg
                    : undefined;
    const paddingValue = PADDING[padding] ?? PADDING.md;
    const gapValue = gap ? GAP[gap] : undefined;
    const box = (<View style={[
            { padding: paddingValue, backgroundColor: bg },
            gapValue !== undefined && { gap: gapValue },
            style,
        ]}>
      {children}
    </View>);
    // When inverse, override context so all child components use the dark token set
    if (inverse) {
        return (<DesignSystemProvider value={{ fontScale, isDark: true, theme, colors: theme.dark }}>
        {box}
      </DesignSystemProvider>);
    }
    return box;
}
