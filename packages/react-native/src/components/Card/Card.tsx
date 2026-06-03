import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { cardTokens } from '../../tokens/card';
import { renderMaterialIcon, type IconSource } from '../../utils/materialIcon';

export type CardHeroColor = 'action' | 'neutral' | 'info' | 'success' | 'warn' | 'error';

export interface CardProps {
  children: React.ReactNode;
  /** Remove all visual chrome and padding — just structural containment */
  bare?: boolean;
  /** Small 40×40 icon badge rendered above children */
  icon?: IconSource;
  /** Full-bleed colored header with a large icon */
  heroIcon?: IconSource;
  /** Background color key for the hero area */
  heroColor?: CardHeroColor | string;
  /** Makes the entire card pressable with a spring press animation */
  onPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
}

export function Card({
  children,
  bare = false,
  icon,
  heroIcon,
  heroColor = 'action',
  onPress,
  style,
}: CardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const { theme, colors } = useDesignSystem();

  const handlePressIn = useCallback(() => {
    if (!onPress) return;
    Animated.spring(scale, {
      toValue: 0.98,
      speed: 50,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  }, [scale, onPress]);

  const handlePressOut = useCallback(() => {
    if (!onPress) return;
    Animated.spring(scale, {
      toValue: 1,
      speed: 25,
      bounciness: 8,
      useNativeDriver: true,
    }).start();
  }, [scale, onPress]);

  const heroColors: Record<CardHeroColor, string> = {
    action: colors.textAccent,
    neutral: colors.textDefault,
    info: colors.badge.info.bg,
    success: colors.badge.success.bg,
    warn: colors.badge.warn.bg,
    error: colors.badge.error.bg,
  };
  const heroBg = heroColors[heroColor as CardHeroColor] ?? heroColor;
  const radius = theme.cardRadius;
  const styledIcon = renderMaterialIcon(icon, 18, colors.textAccent);
  const styledHeroIcon = renderMaterialIcon(heroIcon, 44, colors.surfaceBg);

  const cardStyle: StyleProp<ViewStyle> = bare
    ? null
    : [styles.card, {
        borderRadius: radius,
        backgroundColor: colors.surfaceBg,
        borderColor: colors.borderSubtle,
        shadowColor: colors.textDefault,
      }, style];

  const inner = (
    <View style={bare ? [styles.bare, style] : cardStyle}>
      {/* Full-bleed hero header */}
      {heroIcon && (
        <View style={[styles.hero, { backgroundColor: heroBg }]}>
          {styledHeroIcon}
        </View>
      )}

      {/* Small icon badge */}
      {icon && (
        <View style={[styles.iconBadge, { backgroundColor: colors.accentSurface }]}>
          {styledIcon}
        </View>
      )}

      {children}
    </View>
  );

  if (!onPress) return inner;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        accessibilityRole="button"
        style={bare ? [styles.bare, style] : cardStyle}
      >
        {heroIcon && (
          <View style={[styles.hero, { backgroundColor: heroBg }]}>
            {styledHeroIcon}
          </View>
        )}
        {icon && (
          <View style={[styles.iconBadge, { backgroundColor: colors.accentSurface }]}>
            {styledIcon}
          </View>
        )}
        {children}
      </Pressable>
    </Animated.View>
  );
}

const { padding, borderWidth, shadow } = cardTokens;

const styles = StyleSheet.create({
  card: {
    // borderRadius, backgroundColor, borderColor injected at runtime from theme
    borderWidth,
    padding,
    overflow: 'hidden',
    ...shadow,
  },
  bare: {
    // No chrome — just clips overflow for hero consistency
  },
  hero: {
    marginTop: -padding,
    marginHorizontal: -padding,
    marginBottom: padding,
    paddingVertical: cardTokens.hero.paddingVertical,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadge: {
    width: cardTokens.icon.containerSize,
    height: cardTokens.icon.containerSize,
    borderRadius: cardTokens.icon.containerBorderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: cardTokens.icon.marginBottom,
  },
});
