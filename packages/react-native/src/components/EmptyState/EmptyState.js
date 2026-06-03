import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { spacingTokens } from '../../tokens/spacing';
import { renderMaterialIcon } from '../../utils/materialIcon';
import { Heading } from '../Heading/Heading';
import { Paragraph } from '../Paragraph/Paragraph';

export function EmptyState({
  title, description, icon, actions, compact = false, style,
}) {
  const { colors, theme } = useDesignSystem();
  const styledIcon = renderMaterialIcon(
    icon,
    compact ? spacingTokens.component.emptyState.compactIconGlyphSize : spacingTokens.component.emptyState.iconGlyphSize,
    colors.textAccent,
  );

  return (
    <View
      style={[
        styles.base,
        compact ? styles.compact : styles.comfortable,
        {
          backgroundColor: colors.surfaceBg,
          borderColor: colors.borderSubtle,
          borderRadius: theme.cardRadius,
        },
        style,
      ]}
    >
      {icon && (
        <View style={[styles.iconWrap, { backgroundColor: colors.accentSurface, borderRadius: theme.cardRadius }]}>
          {styledIcon}
        </View>
      )}
      <View style={styles.copy}>
        <Heading size={compact ? 'sm' : 'md'}>{title}</Heading>
        {description && (
          <Paragraph color="muted" size={compact ? 'sm' : 'md'} style={styles.description}>
            {description}
          </Paragraph>
        )}
      </View>
      {actions && <View style={styles.actions}>{actions}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderWidth: spacingTokens.component.emptyState.borderWidth,
  },
  comfortable: {
    paddingHorizontal: spacingTokens.component.emptyState.pagePaddingHorizontal,
    paddingVertical: spacingTokens.component.emptyState.pagePaddingVertical,
    gap: spacingTokens.component.emptyState.pageGap,
  },
  compact: {
    paddingHorizontal: spacingTokens.component.emptyState.compactPaddingHorizontal,
    paddingVertical: spacingTokens.component.emptyState.compactPaddingVertical,
    gap: spacingTokens.component.emptyState.compactGap,
  },
  iconWrap: {
    width: spacingTokens.component.emptyState.iconSize,
    height: spacingTokens.component.emptyState.iconSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    alignItems: 'center',
    gap: spacingTokens.component.emptyState.copyGap,
  },
  description: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacingTokens.component.emptyState.actionGap,
  },
});
