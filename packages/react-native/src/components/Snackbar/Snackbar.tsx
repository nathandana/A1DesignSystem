import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { spacingTokens } from '../../tokens/spacing';
import { typographyTokens } from '../../tokens/typography';
import { Button } from '../Button/Button';

export interface SnackbarProps {
  visible: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export function Snackbar({
  visible, message, actionLabel, onAction, onDismiss, duration = 4000, style,
}: SnackbarProps) {
  const { colors, fontScale, theme } = useDesignSystem();
  const messageFontSize = Math.round(typographyTokens.component.snackbar.fontSize * fontScale);
  const messageLineHeight = Math.round(messageFontSize * typographyTokens.body.lineHeightMultiplier);
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: visible ? 1 : 0, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: visible ? 0 : 12, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY, visible]);

  useEffect(() => {
    if (!visible || !onDismiss || duration <= 0) return undefined;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss, visible]);

  if (!visible) return null;

  return (
    <View pointerEvents="box-none" style={[styles.viewport, { paddingBottom: insets.bottom + spacingTokens.component.snackbar.viewportPaddingBottom }]}>
      <Animated.View
        accessibilityRole="alert"
        pointerEvents="auto"
        style={[
          styles.base,
          {
            backgroundColor: colors.textDefault,
            borderColor: colors.textDefault,
            borderRadius: theme.cardRadius,
            shadowColor: colors.textDefault,
            opacity,
            transform: [{ translateY }],
          },
          style,
        ]}
      >
        <Text
          style={[
            styles.message,
            {
              color: colors.pageBg,
              fontFamily: theme.fonts.body ?? Platform.select({ ios: undefined, default: 'sans-serif' }),
              fontSize: messageFontSize,
              lineHeight: messageLineHeight,
            },
          ]}
        >
          {message}
        </Text>
        {actionLabel && onAction && (
          <Button size="sm" variant="tertiary" onPress={onAction}>
            {actionLabel}
          </Button>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: spacingTokens.component.snackbar.viewportPaddingHorizontal,
    zIndex: 1000,
  },
  base: {
    width: '100%',
    maxWidth: spacingTokens.component.snackbar.maxWidth,
    minHeight: spacingTokens.component.snackbar.minHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacingTokens.component.snackbar.paddingHorizontal,
    paddingVertical: spacingTokens.component.snackbar.paddingVertical,
    borderWidth: spacingTokens.component.snackbar.borderWidth,
    gap: spacingTokens.component.snackbar.gap,
    shadowOffset: spacingTokens.component.snackbar.shadowOffset,
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
  },
  message: {
    flex: 1,
  },
});
