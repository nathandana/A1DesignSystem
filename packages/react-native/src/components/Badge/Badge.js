import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { spacingTokens } from '../../tokens/spacing';
import { typographyTokens } from '../../tokens/typography';
import { renderMaterialIcon } from '../../utils/materialIcon';

const STATUSES = ['neutral', 'info', 'success', 'warn', 'error'];

const SIZE_STYLES = spacingTokens.component.badge.sizes;

function resolveStatus(status, tone) {
  const candidate = status ?? (tone === 'accent' ? 'info' : tone);

  return candidate && STATUSES.includes(candidate) ? candidate : 'neutral';
}

export function Badge({ children, status, tone, subtle = false, size = 'md', icon, style }) {
  const { colors, fontScale, theme } = useDesignSystem();
  const resolvedStatus = resolveStatus(status, tone);
  const resolvedSize = SIZE_STYLES[size] ? size : 'md';
  const sizeStyles = SIZE_STYLES[resolvedSize];
  const typeSize = typographyTokens.component.badge.sizes[resolvedSize];
  const fontSize = Math.round(typeSize.fontSize * fontScale);
  const iconSize = Math.round(typeSize.iconSize * fontScale);
  const palette = colors.badge[resolvedStatus];
  const bg = subtle ? palette.subtleBg : palette.bg;
  const fg = subtle ? palette.subtleFg : palette.fg;
  const border = subtle ? palette.subtleBorder : 'transparent';
  const styledIcon = renderMaterialIcon(icon, iconSize, fg);

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: subtle ? spacingTokens.component.badge.borderWidth : 0,
          borderRadius: theme.navItemRadius,
          minHeight: sizeStyles.minHeight,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
        },
        style,
      ]}
    >
      {styledIcon}
      <Text
        numberOfLines={1}
        style={[
          styles.text,
          {
            color: fg,
            fontFamily: theme.fonts.body ?? Platform.select({ ios: undefined, default: 'sans-serif-medium' }),
            fontSize,
            lineHeight: fontSize,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingTokens.component.badge.gap,
  },
  text: {
    fontWeight: '500',
  },
});
