import React, { useCallback, useRef } from 'react';
import { ActivityIndicator, Animated, Platform, Pressable, StyleSheet, Text, View, } from 'react-native';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { buttonTokens } from '../../tokens/button';
import { spacingTokens } from '../../tokens/spacing';
import { typographyTokens } from '../../tokens/typography';
import { renderMaterialIcon } from '../../utils/materialIcon';
function triggerHaptic() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Haptics = require('expo-haptics');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
    }
    catch {
        // expo-haptics not installed — no haptic feedback
    }
}
export function Button({ variant = 'primary', size = 'md', children, icon, iconPosition = 'start', fullWidth = false, pill = false, loading = false, disabled = false, style, onPress, onPressIn, onPressOut, ...props }) {
    const scale = useRef(new Animated.Value(1)).current;
    const { colors, fontScale, theme } = useDesignSystem();
    // Variant colors come from the active A1 theme (respects dark mode + theme switcher)
    const variantTokens = variant === 'primary'
        ? { background: colors.buttonPrimaryBg, backgroundPressed: colors.buttonPrimaryBgPressed, foreground: colors.buttonPrimaryFg, borderWidth: spacingTokens.component.button.borderWidth, borderColor: 'transparent' }
        : variant === 'secondary'
            ? { background: colors.buttonSecondaryBg, backgroundPressed: colors.buttonSecondaryBgPressed, foreground: colors.buttonSecondaryFg, borderWidth: spacingTokens.component.button.secondaryBorderWidth, borderColor: colors.buttonSecondaryBorder }
            : variant === 'tertiary'
                ? { background: 'transparent', backgroundPressed: colors.buttonSecondaryBgPressed, foreground: colors.textAccent, borderWidth: spacingTokens.component.button.borderWidth, borderColor: 'transparent' }
                : variant === 'destructive'
                    ? { background: colors.badge.error.bg, backgroundPressed: colors.badge.error.subtleFg, foreground: colors.badge.error.fg, borderWidth: spacingTokens.component.button.borderWidth, borderColor: 'transparent' }
                    : { background: colors.badge.success.bg, backgroundPressed: colors.badge.success.subtleFg, foreground: colors.badge.success.fg, borderWidth: spacingTokens.component.button.borderWidth, borderColor: 'transparent' };
    const sizeTokens = buttonTokens.sizes[size] ?? buttonTokens.sizes.md;
    const typeTokens = typographyTokens.component.button.sizes[size] ?? typographyTokens.component.button.sizes.md;
    const borderRadius = pill
        ? buttonTokens.pillBorderRadius
        : theme.buttonRadius + (sizeTokens.borderRadius - buttonTokens.sizes.md.borderRadius);
    const isDisabled = disabled || loading;
    const styledIcon = icon ? renderMaterialIcon(icon, sizeTokens.iconSize, variantTokens.foreground) : null;
    const handlePressIn = useCallback((e) => {
        Animated.spring(scale, {
            toValue: 0.96,
            speed: 50,
            bounciness: 0,
            useNativeDriver: true,
        }).start();
        onPressIn?.(e);
    }, [scale, onPressIn]);
    const handlePressOut = useCallback((e) => {
        Animated.spring(scale, {
            toValue: 1,
            speed: 25,
            bounciness: 10,
            useNativeDriver: true,
        }).start();
        onPressOut?.(e);
    }, [scale, onPressOut]);
    const handlePress = useCallback((e) => {
        triggerHaptic();
        onPress?.(e);
    }, [onPress]);
    return (<Animated.View style={[
            fullWidth && styles.fullWidth,
            { transform: [{ scale }] },
            isDisabled && { opacity: buttonTokens.disabledOpacity },
        ]}>
      <Pressable accessibilityRole="button" accessibilityState={{ disabled: isDisabled, busy: loading }} disabled={isDisabled} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress} style={({ pressed }) => [
            styles.base,
            {
                height: sizeTokens.height,
                borderRadius,
                paddingHorizontal: sizeTokens.paddingHorizontal,
                backgroundColor: pressed
                    ? variantTokens.backgroundPressed
                    : variantTokens.background,
                borderWidth: variantTokens.borderWidth,
                borderColor: variantTokens.borderColor,
            },
            fullWidth && styles.fullWidth,
            style,
        ]} {...props}>
        {/* Icon — start */}
        {icon && iconPosition === 'start' && !loading && (<View style={{ marginEnd: buttonTokens.gap }}>{styledIcon}</View>)}

        <Text numberOfLines={1} style={[
            styles.label,
            {
                color: loading ? 'transparent' : variantTokens.foreground,
                fontSize: Math.round(typeTokens.fontSize * fontScale),
                fontWeight: typeTokens.fontWeight,
                fontFamily: Platform.select({ ios: 'System', default: 'sans-serif-medium' }),
            },
        ]}>
          {children}
        </Text>

        {/* Icon — end */}
        {icon && iconPosition === 'end' && !loading && (<View style={{ marginStart: buttonTokens.gap }}>{styledIcon}</View>)}

        {/* Loading spinner — absolutely positioned so the button doesn't resize */}
        {loading && (<View style={StyleSheet.absoluteFill} pointerEvents="none">
            <ActivityIndicator color={variantTokens.foreground} size={size === 'lg' ? 'large' : 'small'} style={styles.spinnerCenter}/>
          </View>)}
      </Pressable>
    </Animated.View>);
}
const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    fullWidth: {
        alignSelf: 'stretch',
    },
    label: {
        includeFontPadding: false,
        textAlignVertical: 'center',
        letterSpacing: -0.2,
    },
    spinnerCenter: {
        flex: 1,
        alignSelf: 'center',
    },
});
