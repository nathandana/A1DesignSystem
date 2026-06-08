import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { DesignSystemProvider, useDesignSystem } from '../../context/DesignSystemContext';
import { spacingTokens } from '../../tokens/spacing';

export type SectionPadding = 'lg' | 'md' | 'sm' | 'xs' | 'none';
export type SectionSurface = 'page' | 'panel' | 'raised';
export type SectionGap     = 'xs' | 'sm' | 'md' | 'lg';

const PADDING: Record<SectionPadding, number> = {
  lg: spacingTokens.base[40],
  md: spacingTokens.semantic.gap.lg,
  sm: spacingTokens.semantic.gap.md,
  xs: spacingTokens.semantic.gap.sm,
  none: 0,
};
const GAP: Record<SectionGap, number> = spacingTokens.semantic.gap;

export interface SectionProps {
  children: React.ReactNode;
  padding?: SectionPadding;
  surface?: SectionSurface;
  gap?: SectionGap;
  /**
   * Flip the colour scheme — dark island on a light page, matching .a1-inverse.
   * Wraps children in a DesignSystemProvider override so all nested components
   * (Heading, Paragraph, Button, etc.) automatically use the dark token set.
   */
  inverse?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Section({ children, padding = 'md', surface, gap, inverse = false, style }: SectionProps) {
  const { colors, theme, fontScale } = useDesignSystem();

  const bg = inverse            ? theme.dark.pageBg    // neutral-900 for the theme
    : surface === 'panel'       ? colors.panelBg
    : surface === 'raised'      ? colors.raisedBg
    : surface === 'page'        ? colors.pageBg
    : undefined;

  const paddingValue = PADDING[padding] ?? PADDING.md;
  const gapValue     = gap ? GAP[gap] : undefined;

  const box = (
    <View
      style={[
        { padding: paddingValue, backgroundColor: bg },
        gapValue !== undefined && { gap: gapValue },
        style,
      ]}
    >
      {children}
    </View>
  );

  // When inverse, override context so all child components use the dark token set
  if (inverse) {
    return (
      <DesignSystemProvider value={{ fontScale, isDark: true, theme, colors: theme.dark }}>
        {box}
      </DesignSystemProvider>
    );
  }

  return box;
}
