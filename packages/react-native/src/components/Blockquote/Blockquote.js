import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { spacingTokens } from '../../tokens/spacing';
import { typographyTokens } from '../../tokens/typography';

export function Blockquote({ children, cite, style }) {
  const { colors, fontScale, theme } = useDesignSystem();
  const fontSize = Math.round(typographyTokens.body.sizes.lg * fontScale);
  const lineHeight = Math.round(fontSize * typographyTokens.body.lineHeightMultiplier);

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: colors.panelBg,
          borderLeftColor: colors.textAccent,
          borderRadius: theme.cardRadius,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.quote,
          {
            color: colors.textDefault,
            fontFamily: theme.fonts.heading ?? theme.fonts.body ?? Platform.select({ ios: undefined, default: 'sans-serif' }),
            fontSize,
            lineHeight,
          },
        ]}
      >
        {children}
      </Text>
      {cite && (
        <Text
          style={[
            styles.cite,
            {
              color: colors.textMuted,
              fontFamily: theme.fonts.body ?? Platform.select({ ios: undefined, default: 'sans-serif' }),
              fontSize: Math.round(typographyTokens.component.blockquote.citeFontSize * fontScale),
            },
          ]}
        >
          {cite}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderLeftWidth: spacingTokens.component.blockquote.borderWidth,
    paddingHorizontal: spacingTokens.component.blockquote.paddingHorizontal,
    paddingVertical: spacingTokens.component.blockquote.paddingVertical,
    gap: spacingTokens.component.blockquote.gap,
  },
  quote: {
    fontWeight: '700',
    letterSpacing: 0,
  },
  cite: {
    fontWeight: '600',
  },
});
