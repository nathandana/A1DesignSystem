import React from 'react';
import { Platform, Text, type StyleProp, type TextStyle } from 'react-native';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { typographyTokens } from '../../tokens/typography';

export type HeadingType = 'heading' | 'display';
export type HeadingSize = keyof typeof typographyTokens.heading.sizes | keyof typeof typographyTokens.display.sizes;
export type HeadingColor = 'default' | 'muted' | 'accent';

export interface HeadingProps {
  children: React.ReactNode;
  type?: HeadingType;
  size?: HeadingSize;
  color?: HeadingColor;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

export function Heading({
  children,
  type = 'heading',
  size,
  color = 'default',
  style,
  numberOfLines,
}: HeadingProps) {
  const { fontScale, colors, theme } = useDesignSystem();
  const config = typographyTokens[type];
  const sizes = config.sizes as Record<string, number>;

  const defaultSize = type === 'heading' ? 'xl' : 'md';
  const resolvedSize = (size && size in sizes) ? size : defaultSize;
  const baseFontSize = sizes[resolvedSize];
  const fontSize = Math.round(baseFontSize * fontScale);
  const lineHeight = Math.round(fontSize * config.lineHeightMultiplier);

  const baseColor = color === 'accent' ? colors.textAccent
    : color === 'muted'               ? colors.textMuted
    : colors.textDefault;

  const { fonts } = theme;
  const fontFamily = type === 'display'
    ? (fonts.display ?? Platform.select({ ios: undefined, default: 'sans-serif' }))
    : (fonts.heading ?? Platform.select({ ios: undefined, default: 'sans-serif' }));
  const fontWeight = type === 'display'
    ? ((fonts.displayWeight ?? config.fontWeight) as TextStyle['fontWeight'])
    : ((fonts.headingWeight ?? config.fontWeight) as TextStyle['fontWeight']);

  const textStyle: TextStyle = {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    color: baseColor,
    letterSpacing: type === 'display' ? -0.5 : -0.2,
  };

  return (
    <Text
      accessibilityRole="header"
      numberOfLines={numberOfLines}
      style={[textStyle, style]}
    >
      {children}
    </Text>
  );
}
