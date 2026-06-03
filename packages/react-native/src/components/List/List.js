import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { spacingTokens } from '../../tokens/spacing';
import { typographyTokens } from '../../tokens/typography';
import { Paragraph } from '../Paragraph/Paragraph';

export function List({ children, divided = true, inset = true, style }) {
  const { colors, theme } = useDesignSystem();
  const items = React.Children.toArray(children);

  return (
    <View
      style={[
        styles.list,
        inset && {
          backgroundColor: colors.surfaceBg,
          borderColor: colors.borderSubtle,
          borderRadius: theme.cardRadius,
          borderWidth: spacingTokens.component.list.borderWidth,
          overflow: 'hidden',
        },
        !divided && { gap: spacingTokens.component.list.gap },
        style,
      ]}
    >
      {items.map((child, index) => (
        <View key={child.key ?? index}>
          {child}
          {divided && index < items.length - 1 && (
            <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />
          )}
        </View>
      ))}
    </View>
  );
}

export function ListItem({
  title, description, leading, trailing, onPress, style,
}) {
  const { colors, fontScale, theme } = useDesignSystem();
  const titleFontSize = Math.round(typographyTokens.component.list.controlFontSize * fontScale);
  const content = (
    <>
      {leading && <View style={styles.leading}>{leading}</View>}
      <View style={styles.copy}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            {
              color: colors.textDefault,
              fontFamily: theme.fonts.bodyBold ?? theme.fonts.body ?? Platform.select({ ios: undefined, default: 'sans-serif-medium' }),
              fontSize: titleFontSize,
            },
          ]}
        >
          {title}
        </Text>
        {description && <Paragraph size="sm" color="muted" numberOfLines={2}>{description}</Paragraph>}
      </View>
      {trailing && <View style={styles.trailing}>{trailing}</View>}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          styles.item,
          pressed && { backgroundColor: colors.pressedBg },
          style,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.item, style]}>{content}</View>;
}

const styles = StyleSheet.create({
  list: {},
  item: {
    minHeight: spacingTokens.component.list.itemMinHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacingTokens.component.list.itemPaddingHorizontal,
    paddingVertical: spacingTokens.component.list.itemPaddingVertical,
    gap: spacingTokens.component.list.itemGap,
  },
  leading: {
    flexShrink: 0,
  },
  copy: {
    flex: 1,
    gap: spacingTokens.component.list.copyGap,
  },
  title: {
    fontWeight: '700',
  },
  trailing: {
    flexShrink: 0,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
});
