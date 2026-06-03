import React, { useEffect, useRef } from 'react';
import { Animated, BackHandler, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View, } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { spacingTokens } from '../../tokens/spacing';
import { typographyTokens } from '../../tokens/typography';
export function Dialog({ open, onClose, title, footer, children, style }) {
    const { colors, fontScale, theme } = useDesignSystem();
    const insets = useSafeAreaInsets();
    const scaleAnim = useRef(new Animated.Value(0.92)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const [visible, setVisible] = React.useState(open);
    useEffect(() => {
        if (open) {
            setVisible(true);
            Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1, speed: 28, bounciness: 4, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
            ]).start();
        }
        else {
            Animated.parallel([
                Animated.timing(scaleAnim, { toValue: 0.92, duration: 150, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
            ]).start(({ finished }) => { if (finished)
                setVisible(false); });
        }
    }, [open, scaleAnim, opacityAnim]);
    // Android hardware back button
    useEffect(() => {
        if (!open || Platform.OS !== 'android')
            return;
        const sub = BackHandler.addEventListener('hardwareBackPress', () => { onClose(); return true; });
        return () => sub.remove();
    }, [open, onClose]);
    if (!visible)
        return null;
    const radius = theme.cardRadius + 4; // dialogs slightly rounder than cards
    const titleFontSize = Math.round(typographyTokens.component.dialog.titleFontSize * fontScale);
    const closeIconFontSize = Math.round(typographyTokens.component.dialog.closeIconFontSize * fontScale);
    return (<Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Scrim */}
      <TouchableWithoutFeedback onPress={onClose} accessibilityLabel="Close dialog">
        <Animated.View style={[styles.scrim, { backgroundColor: colors.scrimBg, opacity: opacityAnim }]}/>
      </TouchableWithoutFeedback>

      {/* Panel */}
      <View style={[styles.centerer, { paddingBottom: insets.bottom }]} pointerEvents="box-none">
        <Animated.View style={[
            styles.panel,
            {
              backgroundColor: colors.surfaceBg,
              borderRadius: radius,
              shadowColor: colors.textDefault,
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
            style,
        ]}>
          {/* Header */}
          <View style={styles.header}>
            {title && (<Text style={[styles.title, {
                color: colors.textDefault,
                fontFamily: theme.fonts.heading ?? Platform.select({ ios: undefined, default: 'sans-serif' }),
                fontSize: titleFontSize,
            }]}>
                {title}
              </Text>)}
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close dialog" style={({ pressed }) => [
            styles.closeBtn,
            { borderRadius: theme.navItemRadius },
            pressed && { backgroundColor: colors.pressedBg },
        ]}>
              <Text style={[styles.closeBtnText, { color: colors.textMuted, fontSize: closeIconFontSize }]}>✕</Text>
            </Pressable>
          </View>

          {/* Body */}
          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>

          {/* Footer */}
          {footer && (<View style={[styles.footer, { borderTopColor: colors.borderSubtle }]}>
              {footer}
            </View>)}
        </Animated.View>
      </View>
    </Modal>);
}
const styles = StyleSheet.create({
    scrim: {
        ...StyleSheet.absoluteFill,
    },
    centerer: {
        ...StyleSheet.absoluteFill,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacingTokens.component.dialog.centerPaddingHorizontal,
        pointerEvents: 'box-none',
    },
    panel: {
        width: '100%',
        maxWidth: spacingTokens.component.dialog.maxWidth,
        maxHeight: '80%',
        overflow: 'hidden',
        shadowOffset: spacingTokens.component.dialog.shadowOffset,
        shadowOpacity: 0.18,
        shadowRadius: 24,
        elevation: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacingTokens.component.dialog.headerPaddingHorizontal,
        paddingTop: spacingTokens.component.dialog.headerPaddingTop,
        paddingBottom: spacingTokens.component.dialog.headerPaddingBottom,
        gap: spacingTokens.component.dialog.gap,
    },
    title: {
        flex: 1,
        fontWeight: '700',
        letterSpacing: -0.2,
    },
    closeBtn: {
        width: spacingTokens.component.dialog.closeButtonSize,
        height: spacingTokens.component.dialog.closeButtonSize,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    closeBtnText: {},
    body: { flexShrink: 1 },
    bodyContent: {
        paddingHorizontal: spacingTokens.component.dialog.bodyPaddingHorizontal,
        paddingBottom: spacingTokens.component.dialog.bodyPaddingBottom,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: spacingTokens.component.dialog.gap,
        paddingHorizontal: spacingTokens.component.dialog.footerPaddingHorizontal,
        paddingVertical: spacingTokens.component.dialog.footerPaddingVertical,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
});
