import React from 'react';
import { Platform, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { spacingTokens } from '../../tokens/spacing';
import { typographyTokens } from '../../tokens/typography';
import { renderMaterialIcon, type IconSource } from '../../utils/materialIcon';

export type BadgeStatus = 'neutral' | 'info' | 'success' | 'warn' | 'error';
export type BadgeTone = 'accent' | BadgeStatus;
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: React.ReactNode;
  /** Semantic status colour. Default: "neutral" */
  status?: BadgeStatus;
  /** Deprecated alias for status. "accent" maps to "info". */
  tone?: BadgeTone;
  /** Reduce background emphasis for a softer outlined appearance. Default: false */
  subtle?: boolean;
  size?: BadgeSize;
  /** Material icon name or custom icon element. Pass null to suppress an icon. */
  icon?: IconSource | null;
  style?: StyleProp<ViewStyle>;
}

const STATUSES: BadgeStatus[] = ['neutral', 'info', 'success', 'warn', 'error'];

const SIZE_STYLES = spacingTokens.component.badge.sizes;

function resolveStatus(status: BadgeStatus | undefined, tone: BadgeTone | undefined): BadgeStatus {
  const candidate = status ?? (tone === 'accent' ? 'info' : tone);

  return candidate && STATUSES.includes(candidate as BadgeStatus) ? candidate as BadgeStatus : 'neutral';
}

export function Badge({ children, status, tone, subtle = false, size = 'md', icon, style }: BadgeProps) {
  const { colors, fontScale, theme } = useDesignSystem();
  const resolvedStatus = resolveStatus(status, tone);
  const resolvedSize: BadgeSize = SIZE_STYLES[size] ? size : 'md';
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
