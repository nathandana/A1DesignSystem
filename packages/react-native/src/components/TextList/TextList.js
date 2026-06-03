import React, { createContext, useContext } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { spacingTokens } from '../../tokens/spacing';
import { typographyTokens } from '../../tokens/typography';
import { renderMaterialIcon } from '../../utils/materialIcon';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const GAPS = {
  xs: spacingTokens.base[4],
  sm: spacingTokens.base[4],
  md: spacingTokens.semantic.gap.xs,
  lg: spacingTokens.semantic.gap.sm,
  xl: spacingTokens.semantic.gap.md,
};
const MARGIN_BOTTOM = {
  sm: spacingTokens.semantic.gap.xs,
  md: spacingTokens.semantic.gap.md,
  lg: spacingTokens.semantic.gap.lg,
};
const TextListContext = createContext(null);

function isResponsiveSize(size) {
  return Boolean(size && typeof size === 'object' && !Array.isArray(size));
}

function resolveBaseSize(size) {
  if (!isResponsiveSize(size)) return size && SIZES.includes(size) ? size : 'md';
  return size.xs && SIZES.includes(size.xs) ? size.xs : 'md';
}

function renderIcon(icon, color, fontSize, lineHeight) {
  if (typeof icon === 'string' || React.isValidElement(icon)) return renderMaterialIcon(icon, fontSize, color);

  return (
    <Text style={{ color, fontSize, lineHeight, fontWeight: '700' }}>
      {icon}
    </Text>
  );
}

export function TextList({
  as = 'ul',
  size = 'md',
  color = 'default',
  icon = null,
  variant: variantProp,
  marginBottom,
  children,
  style,
}) {
  const { colors, fontScale, theme } = useDesignSystem();
  const resolvedSize = resolveBaseSize(size);
  const fontSize = Math.round(typographyTokens.body.sizes[resolvedSize] * fontScale);
  const lineHeight = Math.round(fontSize * typographyTokens.body.lineHeightMultiplier);
  const isOrdered = as === 'ol';
  const variant = variantProp === 'unordered' || variantProp === 'ordered' || variantProp === 'icon' || variantProp === 'divider'
    ? variantProp
    : isOrdered ? 'ordered' : icon != null ? 'icon' : 'unordered';

  const context = {
    as,
    color: color === 'muted' ? colors.textMuted : colors.textDefault,
    dividerColor: colors.borderSubtle,
    fontFamily: theme.fonts.body ?? Platform.select({ ios: undefined, default: 'sans-serif' }),
    fontSize,
    gap: GAPS[resolvedSize],
    icon,
    lineHeight,
    markerColor: variant === 'icon' ? colors.textAccent : colors.textMuted,
    variant,
  };

  return (
    <TextListContext.Provider value={context}>
      <View
        style={[
          styles.list,
          { gap: variant === 'divider' ? 0 : context.gap },
          marginBottom && { marginBottom: MARGIN_BOTTOM[marginBottom] },
          style,
        ]}
      >
        {React.Children.toArray(children).map((child, index) => (
          <TextListContext.Provider key={child.key ?? index} value={{ ...context, as }}>
            {React.isValidElement(child) ? React.cloneElement(child, { index }) : child}
          </TextListContext.Provider>
        ))}
      </View>
    </TextListContext.Provider>
  );
}

export function TextListItem({ icon: itemIcon, children, style, textStyle, index = 0 }) {
  const context = useContext(TextListContext);
  if (!context) {
    throw new Error('TextListItem must be rendered inside TextList.');
  }

  const resolvedIcon = itemIcon !== undefined ? itemIcon : context.icon;
  const isDivider = context.variant === 'divider';
  const markerWidth = context.variant === 'ordered' ? context.fontSize * 1.5 : context.fontSize;
  const markerTop = context.variant === 'icon' ? Math.round(context.fontSize * 0.25) : Math.round(context.fontSize * 0.48);

  return (
    <View
      style={[
        styles.item,
        isDivider && {
          borderBottomColor: context.dividerColor,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderTopColor: context.dividerColor,
          borderTopWidth: index === 0 ? StyleSheet.hairlineWidth : 0,
          paddingVertical: context.gap || spacingTokens.semantic.gap.xs,
        },
        style,
      ]}
    >
      {!isDivider && (
        <View style={[styles.marker, { width: markerWidth, marginTop: markerTop }]}>
          {context.variant === 'ordered' ? (
            <Text
              style={[
                styles.orderedMarker,
                {
                  color: context.markerColor,
                  fontFamily: context.fontFamily,
                  fontSize: context.fontSize,
                  lineHeight: context.lineHeight,
                },
              ]}
            >
              {index + 1}.
            </Text>
          ) : resolvedIcon != null ? (
            renderIcon(resolvedIcon, context.markerColor, context.fontSize, context.lineHeight)
          ) : (
            <View
              style={[
                styles.bullet,
                {
                  backgroundColor: context.color,
                  height: context.fontSize * 0.45,
                  opacity: 0.65,
                  width: context.fontSize * 0.45,
                },
              ]}
            />
          )}
        </View>
      )}
      <Text
        style={[
          {
            color: context.color,
            flex: 1,
            fontFamily: context.fontFamily,
            fontSize: context.fontSize,
            fontWeight: typographyTokens.body.fontWeight,
            lineHeight: context.lineHeight,
          },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    alignSelf: 'stretch',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacingTokens.component.textList.gap,
  },
  marker: {
    flexShrink: 0,
    alignItems: 'flex-end',
  },
  bullet: {
    borderRadius: spacingTokens.component.textList.pillRadius,
  },
  orderedMarker: {
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
  },
});
