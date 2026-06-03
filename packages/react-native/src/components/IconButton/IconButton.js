import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, } from 'react-native';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { buttonTokens } from '../../tokens/button';
import { spacingTokens } from '../../tokens/spacing';
import { renderIconRenderer } from '../../utils/materialIcon';
export function IconButton({ icon, label, variant = 'tertiary', size = 'md', disabled = false, onPress, onPressIn, onPressOut, ...props }) {
    const { colors, theme } = useDesignSystem();
    const scale = useRef(new Animated.Value(1)).current;
    const sizeTokens = spacingTokens.component.iconButton.sizes[size];
    const dim = sizeTokens.size;
    const radius = theme.buttonRadius;
    const handlePressIn = useCallback((e) => {
        Animated.spring(scale, { toValue: 0.92, speed: 50, bounciness: 0, useNativeDriver: true }).start();
        onPressIn?.(e);
    }, [scale, onPressIn]);
    const handlePressOut = useCallback((e) => {
        Animated.spring(scale, { toValue: 1, speed: 25, bounciness: 10, useNativeDriver: true }).start();
        onPressOut?.(e);
    }, [scale, onPressOut]);
    const statusPalette = variant === 'destructive' ? colors.badge.error
        : variant === 'success' ? colors.badge.success
            : null;
    const bg = statusPalette ? statusPalette.subtleBg
        : variant === 'secondary' ? colors.buttonSecondaryBg
            : 'transparent';
    const fgColor = statusPalette ? statusPalette.subtleFg
        : colors.textAccent;
    const borderColor = statusPalette ? statusPalette.subtleBorder
        : variant === 'secondary' ? colors.buttonSecondaryBorder
            : 'transparent';
    const bgPressed = statusPalette ? statusPalette.subtleBorder
        : colors.buttonSecondaryBgPressed;
    return (<Animated.View style={{ transform: [{ scale }], opacity: disabled ? buttonTokens.disabledOpacity : 1 }}>
      <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: disabled ?? false }} disabled={disabled} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress} style={({ pressed }) => [
            styles.base,
            {
                width: dim, height: dim, borderRadius: radius,
                backgroundColor: pressed ? bgPressed : bg,
                borderColor,
            },
        ]} {...props}>
        {renderIconRenderer(icon, sizeTokens.iconSize, fgColor)}
      </Pressable>
    </Animated.View>);
}
const styles = StyleSheet.create({
    base: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: spacingTokens.component.iconButton.borderWidth,
        overflow: 'hidden',
        flexShrink: 0,
    },
});
