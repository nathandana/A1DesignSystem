import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { spacingTokens } from '../../tokens/spacing';
import { typographyTokens } from '../../tokens/typography';
import { renderIconRenderer } from '../../utils/materialIcon';
import { IconButton } from '../IconButton/IconButton';

export function Banner({
  title, children, variant = 'inline', status, icon, action, onDismiss, style,
}) {
  const { colors, fontScale, theme } = useDesignSystem();
  const isLegacyStatus = variant !== 'inline' && variant !== 'system';
  const resolvedVariant = isLegacyStatus ? 'inline' : variant;
  const resolvedStatus = status ?? (isLegacyStatus ? variant : 'neutral');
  const isSystem = resolvedVariant === 'system';
  const statusColors = colors.badge[resolvedStatus] ?? colors.badge.neutral;
  const palette = resolvedStatus === 'neutral'
    ? {
        surface: colors.panelBg,
        accent: isSystem ? colors.textDefault : colors.textMuted,
        border: colors.borderSubtle,
        fg: colors.pageBg,
      }
    : {
        surface: statusColors.subtleBg,
        accent: statusColors.bg,
        border: statusColors.subtleBorder,
        fg: statusColors.fg,
      };
  const contentColor = isSystem ? palette.fg : colors.textDefault;
  const bodyColor = isSystem ? palette.fg : colors.textMuted;
  const bodyOpacity = isSystem ? 0.85 : 1;
  const fontFamily = theme.fonts.body ?? Platform.select({ ios: undefined, default: 'sans-serif' });
  const bodyFontSize = Math.round(typographyTokens.component.banner.fontSize * fontScale);
  const bodyLineHeight = Math.round(bodyFontSize * typographyTokens.body.lineHeightMultiplier);
  const closeIconStyle = {
    color: isSystem ? palette.fg : colors.textAccent,
    fontSize: typographyTokens.component.banner.iconSize,
    fontWeight: '700',
    lineHeight: typographyTokens.component.banner.iconSize,
  };

  return (
    <View
      accessibilityRole="alert"
      style={[
        isSystem ? styles.system : styles.inline,
        {
          backgroundColor: isSystem ? palette.accent : palette.surface,
          borderColor: palette.border,
          borderRadius: isSystem ? 0 : theme.cardRadius,
        },
        style,
      ]}
    >
      <View style={[styles.inner, isSystem && styles.systemInner]}>
        {icon && (
          <View style={styles.icon}>
            {renderIconRenderer(icon, typographyTokens.component.banner.iconSize, isSystem ? palette.fg : palette.accent)}
          </View>
        )}
        <View style={[styles.content, isSystem && styles.systemContent]}>
          {title && (
            <Text
              style={[
                styles.title,
                {
                  color: contentColor,
                  fontFamily,
                  fontSize: bodyFontSize,
                  lineHeight: Math.round(bodyFontSize * 1.25),
                },
              ]}
            >
              {title}
            </Text>
          )}
          <Text
            style={[
              styles.body,
              {
                color: bodyColor,
                fontFamily,
                fontSize: bodyFontSize,
                lineHeight: bodyLineHeight,
                opacity: bodyOpacity,
              },
            ]}
          >
            {children}
          </Text>
        </View>
        {action && <View style={[styles.action, isSystem && styles.systemAction]}>{action}</View>}
        {onDismiss && (
          <IconButton
            size="sm"
            variant="tertiary"
            label="Dismiss"
            onPress={onDismiss}
            icon={() => <Text style={closeIconStyle}>x</Text>}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inline: {
    borderWidth: spacingTokens.component.banner.borderWidth,
  },
  system: {
    alignSelf: 'stretch',
    borderWidth: 0,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacingTokens.component.banner.padding,
    gap: spacingTokens.component.banner.gap,
  },
  systemInner: {
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: spacingTokens.component.banner.systemPaddingHorizontal,
    paddingVertical: spacingTokens.component.banner.systemPaddingVertical,
    gap: spacingTokens.component.banner.gap,
  },
  icon: {
    paddingTop: spacingTokens.component.banner.iconMarginTop,
  },
  content: {
    flex: 1,
    gap: spacingTokens.component.banner.contentGap,
  },
  systemContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: spacingTokens.component.banner.systemContentGap,
  },
  title: {
    fontWeight: '600',
    letterSpacing: 0,
  },
  body: {},
  action: {
    alignSelf: 'center',
  },
  systemAction: {
    alignSelf: 'center',
  },
});
